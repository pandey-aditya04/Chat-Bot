require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { supabase } = require('./config/supabase');

const app = express();

// Startup health check
console.log('=== SERVER STARTING ===');
console.log('SUPABASE:', !!process.env.SUPABASE_URL);
console.log('GEMINI:', !!process.env.GEMINI_API_KEY);
console.log('JWT:', !!process.env.JWT_SECRET);

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'https://chat-bottt-dusky.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date(),
    gemini: !!process.env.GEMINI_API_KEY,
    supabase: !!process.env.SUPABASE_URL
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bots', require('./routes/bot'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/logs', require('./routes/log'));

// ─── PUBLIC: Get bot config (for embed widget) ─────────────────
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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
