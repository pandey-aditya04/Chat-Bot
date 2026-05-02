import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Bot from './models/Bot.js';
import Log from './models/Log.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Bots API
app.get('/api/bots', async (req, res) => {
  try {
    const bots = await Bot.find({}).sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bots', async (req, res) => {
  try {
    const bot = new Bot(req.body);
    const savedBot = await bot.save();
    res.status(201).json(savedBot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/bots/:id', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    res.json(bot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/bots/:id', async (req, res) => {
  try {
    const updatedBot = await Bot.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedBot) return res.status(404).json({ message: 'Bot not found' });
    res.json(updatedBot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/bots/:id', async (req, res) => {
  try {
    const result = await Bot.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bot not found' });
    res.json({ message: 'Bot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logs API
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 });
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
