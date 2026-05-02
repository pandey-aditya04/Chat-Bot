import express from 'express';
import cors from 'cors';
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
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173', 
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
