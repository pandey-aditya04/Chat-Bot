const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/supabase');

router.post('/', async (req, res) => {
  try {
    const { botId, query, messages, sessionId } = req.body;

    if (!botId) return res.status(400).json({ error: 'botId is required' });

    // 1. Fetch bot configuration
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', botId)
      .single();

    if (botError || !bot) return res.status(404).json({ error: 'Bot not found' });

    // 2. Build system prompt
    const faqContext = bot.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || '';
    
    const systemPrompt = `
      You are ${bot.name}, a helpful AI assistant.
      
      PERSONALITY:
      Tone: ${bot.tone || 'Friendly'}
      
      KNOWLEDGE BASE:
      ${faqContext ? `Answer based ONLY on this information if possible:\n${faqContext}` : 'Answer helpfully based on general knowledge.'}
      
      FALLBACK:
      If the user asks something outside the knowledge base, respond with: "${bot.fallback_message || "I'm not sure about that. Please contact our support team."}"
      
      CONSTRAINTS:
      - Be concise.
      - Stay in character.
      - Don't mention you are an AI model.
    `;

    // 3. Check Gemini API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!');
      return res.status(500).json({ error: 'AI service not configured on server' });
    }

    // 4. Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt
    });

    // Convert messages to Gemini history format if provided
    let history = [];
    if (messages && Array.isArray(messages)) {
      history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' || m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.content || m.text }]
      }));
    }

    const chat = model.startChat({ history });
    const userQuery = query || (messages && messages[messages.length - 1]?.content) || '';
    
    if (!userQuery) return res.status(400).json({ error: 'Query is required' });

    const result = await chat.sendMessage(userQuery);
    const responseText = result.response.text();

    // 5. Update Stats & Logs (Non-blocking or background)
    const timestamp = new Date().toLocaleTimeString();
    
    // Log the interaction if sessionId is provided
    if (sessionId) {
      // Find or create log entry for session
      let { data: log } = await supabase
        .from('logs')
        .select('*')
        .eq('session_id', sessionId)
        .eq('bot_id', botId)
        .maybeSingle();

      if (!log) {
        const { data: newLog } = await supabase
          .from('logs')
          .insert([{ bot_id: botId, bot_name: bot.name, session_id: sessionId }])
          .select()
          .single();
        log = newLog;
      }

      if (log) {
        await supabase.from('messages').insert([
          { log_id: log.id, role: 'user', text: userQuery, time: timestamp },
          { log_id: log.id, role: 'bot', text: responseText, time: timestamp }
        ]);
        
        await supabase.from('logs').update({ 
          message_count: (log.message_count || 0) + 2,
          last_active: new Date()
        }).eq('id', log.id).then();
      }
    }

    // Update bot global stats
    await supabase.from('bots').update({ 
      conversations_count: (bot.conversations_count || 0) + 1 
    }).eq('id', botId).then();

    res.json({ 
      reply: responseText, // frontend expects reply
      text: responseText,  // compatibility
      time: timestamp
    });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'AI failed to respond. Please try again.' });
  }
});

module.exports = router;
