import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../config/supabase.js';

export const interact = async (req, res, next) => {
  try {
    const { query, sessionId } = req.body;
    const botId = req.params.id;

    // Ensure Gemini is initialized with the API key from process.env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    const faqContext = bot.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    const systemPrompt = `
      You are an AI assistant for ${bot.name}. 
      Use the following FAQ information to answer the user's questions. 
      If you don't know the answer based on the FAQ, use the fallback message: "${bot.fallback_message || "I'm not sure about that."}"
      
      FAQ Context:
      ${faqContext}
      
      User Question: ${query}
    `;

    // 3. Call AI (Using Gemini)
    let responseText = '';
    let matched = false;

    try {
      const result = await model.generateContent(systemPrompt);
      responseText = result.response.text();
      
      // Heuristic for "matched": if it doesn't contain the fallback message
      matched = !responseText.includes(bot.fallback_message || "I'm not sure about that.");
    } catch (aiError) {
      console.error('Gemini AI Error:', aiError.message);
      responseText = bot.fallback_message || "I'm not sure about that.";
    }

    // 4. Update Stats
    await supabase.from('bots').update({ conversations_count: (bot.conversations_count || 0) + 1 }).eq('id', botId);

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
    
    // Insert user and bot messages
    if (log) {
      await supabase.from('messages').insert([
        { log_id: log.id, role: 'user', text: query, time: timestamp },
        { log_id: log.id, role: 'bot', text: responseText, time: timestamp, matched }
      ]);

      // Update message count
      await supabase.from('logs').update({ message_count: (log.message_count || 0) + 2 }).eq('id', log.id);
    }

    res.json({ 
      text: responseText, 
      matched,
      time: timestamp
    });

  } catch (error) {
    next(error);
  }
};
