require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('./config/supabase');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const chatRoutes = require('./routes/chat');
const logRoutes = require('./routes/log');

// Startup health check — tells you exactly what env vars loaded
console.log('=== SERVER STARTING ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('HAS_SUPABASE_URL:', !!process.env.SUPABASE_URL);
console.log('HAS_SUPABASE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('HAS_GEMINI_KEY:', !!process.env.GEMINI_API_KEY);
console.log('HAS_JWT_SECRET:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://chat-bottt-dusky.vercel.app',
  credentials: true
}));

// Logging
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/public', chatRoutes);
app.use('/api/logs', logRoutes);

// ─── PUBLIC: Get bot config (no auth needed) ─────────────────
app.get('/api/bots/:botId/public', async (req, res) => {
  try {
    const { data: bot, error } = await supabase
      .from('bots')
      .select('name, theme_color, welcome_message, tone')
      .eq('id', req.params.botId)
      .single();

    if (error || !bot) return res.status(404).json({ error: 'Bot not found' });

    res.json({
      name: bot.name,
      color: bot.theme_color,
      welcomeMessage: bot.welcome_message,
      tone: bot.tone
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUBLIC: Chat with a bot ──────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { botId, messages } = req.body;

    if (!botId || !messages) {
      return res.status(400).json({ error: 'botId and messages are required' });
    }

    const { data: bot, error } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', botId)
      .single();

    if (error || !bot) return res.status(404).json({ error: 'Bot not found' });

    const faqText = bot.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || '';

    const systemPrompt = `You are ${bot.name}, a helpful assistant.
${faqText ? `Answer based on this knowledge:\n${faqText}` : ''}
Tone: ${bot.tone || 'friendly and professional'}.
If you don't know, say: "Let me connect you with our team."`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMsg);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

// Start Server
if (process.env.VERCEL) {
  logger.info('Running in Vercel environment');
} else {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
