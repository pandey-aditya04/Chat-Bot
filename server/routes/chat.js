import express from 'express';
import { interact } from '../controllers/chatController.js';

const router = express.Router();

router.post('/:id/interact', interact);

export default router;
