const express = require('express');
const { 
  getAllBots, 
  createBot, 
  getBotById, 
  updateBot, 
  deleteBot,
  getPublicBotConfig 
} = require('../controllers/botController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Private routes
router.get('/', authenticate, getAllBots);
router.post('/', authenticate, createBot);
router.get('/:id', authenticate, getBotById);
router.put('/:id', authenticate, updateBot);
router.delete('/:id', authenticate, deleteBot);

// Public routes
router.get('/public/:id', getPublicBotConfig);

module.exports = router;
