import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.js';
import botRoutes from './routes/bot.js';
import chatRoutes from './routes/chat.js';
import logRoutes from './routes/log.js';

dotenv.config();

// Safety check — log what we have
console.log('ENV CHECK:', {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  hasGemini: !!process.env.GEMINI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 5000;

// Logging
app.use(morgan('dev'));

// Security Middleware
app.use(helmet());
app.use(cors({ 
  origin: [
    'https://chat-bottt-dusky.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true 
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middleware
app.use(express.json());
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/public/bots', chatRoutes);
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

export default app;
