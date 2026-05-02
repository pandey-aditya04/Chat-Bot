import express from 'express';
import { 
  getAllBots, 
  createBot, 
  getBotById, 
  updateBot, 
  deleteBot,
  getPublicBotConfig 
} from '../controllers/botController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Private routes
router.get('/', authenticate, getAllBots);
router.post('/', authenticate, createBot);
router.get('/:id', authenticate, getBotById);
router.put('/:id', authenticate, updateBot);
router.delete('/:id', authenticate, deleteBot);

// Public routes
router.get('/public/:id', getPublicBotConfig);

export default router;
