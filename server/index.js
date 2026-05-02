import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Bot from './models/Bot.js';
import Log from './models/Log.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware for JWT verification
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.MONGODB_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.MONGODB_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.MONGODB_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bots API (Multitenant)
app.get('/api/bots', authenticate, async (req, res) => {
  try {
    // Admins can see everything, others only see their own
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const bots = await Bot.find(query).sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bots', authenticate, async (req, res) => {
  try {
    const botData = { ...req.body, userId: req.user._id };
    const bot = new Bot(botData);
    const savedBot = await bot.save();
    res.status(201).json(savedBot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/bots/:id', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };
    const bot = await Bot.findOne(query);
    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    res.json(bot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/bots/:id', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };
    const updatedBot = await Bot.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedBot) return res.status(404).json({ message: 'Bot not found' });
    res.json(updatedBot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/bots/:id', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };
    const result = await Bot.findOneAndDelete(query);
    if (!result) return res.status(404).json({ message: 'Bot not found' });
    res.json({ message: 'Bot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Public API Routes (For Widget Interaction) ---

// Get public bot configuration
app.get('/api/public/bots/:id', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id).select('name primaryColor chatWindowTitle welcomeMessage fallbackMessage faqs status position launcherIcon');
    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    if (bot.status === 'Paused') return res.status(403).json({ message: 'Bot is currently inactive' });
    
    res.json(bot);
  } catch (error) {
    res.status(500).json({ message: 'Invalid Bot ID' });
  }
});

// Interact with bot
app.post('/api/public/bots/:id/interact', async (req, res) => {
  try {
    const { query, sessionId } = req.body;
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).json({ message: 'Bot not found' });

    // Simple FAQ Matching Logic (Server-side)
    const matchFAQ = (text, faqs) => {
      const lowerQuery = text.toLowerCase().trim();
      const words = lowerQuery.replace(/[?!.,]/g, '').split(/\s+/).filter(w => w.length >= 2);
      
      let bestMatch = null;
      let bestScore = 0;

      for (const faq of faqs) {
        const faqWords = faq.question.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/);
        let score = 0;
        for (const word of words) {
          if (faqWords.some(fw => fw.includes(word) || word.includes(fw))) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestMatch = faq;
        }
      }
      return bestScore >= 1 ? bestMatch : null;
    };

    const match = matchFAQ(query, bot.faqs);
    const responseText = match ? match.answer : (bot.fallbackMessage || "I'm not sure about that.");

    // Update Conversation Count on Bot
    await Bot.findByIdAndUpdate(req.params.id, { $inc: { conversations: 1 } });

    // Log the interaction
    let log = await Log.findOne({ sessionId, botId: bot._id });
    if (!log) {
      log = new Log({ 
        botId: bot._id, 
        botName: bot.name, 
        sessionId, 
        messages: [] 
      });
    }

    log.messages.push({ role: 'user', text: query, time: new Date().toLocaleTimeString() });
    log.messages.push({ role: 'bot', text: responseText, time: new Date().toLocaleTimeString(), matched: !!match });
    log.messageCount = log.messages.length;
    await log.save();

    res.json({ 
      text: responseText, 
      matched: !!match,
      time: new Date().toLocaleTimeString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logs API (Multitenant)
app.get('/api/logs', authenticate, async (req, res) => {
  try {
    // This is a simplification; ideally Logs should also have userId or be linked to Bots
    // For now, we'll just filter by bots the user owns
    const userBots = await Bot.find({ userId: req.user._id }).select('_id');
    const botIds = userBots.map(b => b._id);
    
    const query = req.user.role === 'admin' ? {} : { botId: { $in: botIds } };
    const logs = await Log.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to DB
connectDB();

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
