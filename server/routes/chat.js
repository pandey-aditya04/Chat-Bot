const express = require('express');
const { interact } = require('../controllers/chatController');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

router.post('/demo-chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const systemPrompt = `You are a helpful demo assistant for ChatBot Builder SaaS.
    
    ABOUT CHATBOT BUILDER:
    - It allows users to create AI chatbots by just entering FAQs.
    - It provides a single script tag to embed the bot on any website.
    - Features include custom branding, analytics, and 24/7 support.
    - Pricing: Free plan ($0), Pro ($29/mo), and Business ($99/mo).
    
    TONE: Friendly, helpful, and concise.
    
    Answer the user's question about the product.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ text: "The demo is currently in offline mode (Gemini API key missing), but I can tell you that ChatBot Builder is awesome!", time: new Date().toLocaleTimeString() });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User: ${query}` }
    ]);
    
    const responseText = result.response.text();
    res.json({ text: responseText, time: new Date().toLocaleTimeString() });
  } catch (err) {
    console.error('Demo Chat error:', err.message);
    res.status(500).json({ error: 'Failed to generate demo response' });
  }
});

router.post('/bots/:id/interact', interact);

module.exports = router;
