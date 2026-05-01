import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDB } from './config/db.js';
import { ObjectId } from 'mongodb';

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
    const db = getDB();
    const bots = await db.collection('bots').find({}).toArray();
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bots', async (req, res) => {
  try {
    const db = getDB();
    const botData = {
      ...req.body,
      created: new Date().toISOString().split('T')[0],
      faqCount: req.body.faqs?.length || 0,
      conversations: 0
    };
    const result = await db.collection('bots').insertOne(botData);
    res.status(201).json({ ...botData, _id: result.insertedId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/bots/:id', async (req, res) => {
  try {
    const db = getDB();
    const bot = await db.collection('bots').findOne({ _id: new ObjectId(req.params.id) });
    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    res.json(bot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/bots/:id', async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...updateData } = req.body;
    updateData.faqCount = updateData.faqs?.length || 0;
    const result = await db.collection('bots').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ message: 'Bot not found' });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/bots/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('bots').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Bot not found' });
    res.json({ message: 'Bot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logs API
app.get('/api/logs', async (req, res) => {
  try {
    const db = getDB();
    const logs = await db.collection('logs').find({}).sort({ timestamp: -1 }).toArray();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
