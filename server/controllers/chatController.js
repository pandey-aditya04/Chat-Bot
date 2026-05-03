const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/supabase');

const interact = async (req, res, next) => {
  try {
    const { query, sessionId } = req.body;
    const botId = req.params.id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is missing on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // 1. Validation
    if (!query || query.length > 1000) {
      return res.status(400).json({ message: 'Invalid query. Max 1000 characters.' });
    }

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', botId)
      .single();

    if (botError || !bot) return res.status(404).json({ message: 'Bot not found' });

    // 2. Build System Prompt from FAQs
    // NOTE: Use snake_case column names as confirmed by schema
    const faqContext = bot.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || '';
    
    const systemPrompt = `
      You are ${bot.name}, a helpful AI assistant.
      
      PERSONALITY:
      Tone: ${bot.tone || 'Friendly'}
      
      KNOWLEDGE BASE:
      ${faqContext ? `Answer based ONLY on this information if possible:\n${faqContext}` : 'No specific knowledge base provided.'}
      
      FALLBACK:
      If the user asks something outside the knowledge base, respond with: "${bot.fallback_message || "I'm not sure about that. Please contact our support team."}"
      
      CONSTRAINTS:
      - Be concise.
      - Stay in character.
      - Don't mention you are an AI model.
    `;

    // 3. Call AI
    let responseText = '';
    let matched = false;

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `User: ${query}` }
      ]);
      responseText = result.response.text();
      
      // Heuristic for "matched": if it doesn't contain a significant part of the fallback message
      const fallback = (bot.fallback_message || "I'm not sure about that.").toLowerCase();
      matched = !responseText.toLowerCase().includes(fallback.substring(0, 10));
    } catch (aiError) {
      console.error('Gemini AI Error:', aiError.message);
      responseText = bot.fallback_message || "I'm not sure about that. Please contact our support team.";
      matched = false;
    }

    // 4. Update Stats (Non-blocking)
    supabase.from('bots').update({ conversations_count: (bot.conversations_count || 0) + 1 }).eq('id', botId).then();

    // 5. Handle Logs
    let { data: log } = await supabase
      .from('logs')
      .select('*')
      .eq('session_id', sessionId)
      .eq('bot_id', botId)
      .maybeSingle();

    if (!log) {
      const { data: newLog } = await supabase
        .from('logs')
        .insert([{ 
          bot_id: botId, 
          bot_name: bot.name, 
          session_id: sessionId 
        }])
        .select()
        .single();
      log = newLog;
    }

    const timestamp = new Date().toLocaleTimeString();
    
    if (log) {
      await supabase.from('messages').insert([
        { log_id: log.id, role: 'user', text: query, time: timestamp },
        { log_id: log.id, role: 'bot', text: responseText, time: timestamp, matched }
      ]);

      await supabase.from('logs').update({ message_count: (log.message_count || 0) + 2 }).eq('id', log.id).then();
    }

    res.json({ 
      text: responseText, 
      matched,
      time: timestamp
    });

  } catch (error) {
    console.error('Interact error:', error);
    next(error);
  }
};

module.exports = { interact };
