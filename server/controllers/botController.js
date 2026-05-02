import { supabase } from '../config/supabase.js';

export const getAllBots = async (req, res, next) => {
  try {
    let query = supabase
      .from('bots')
      .select('*, faqs(*)')
      .order('created_at', { ascending: false });

    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createBot = async (req, res, next) => {
  try {
    const { faqs, ...botData } = req.body;
    const dataToInsert = { ...botData, user_id: req.user.id };

    // Insert bot
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .insert([dataToInsert])
      .select()
      .single();

    if (botError) throw botError;

    // Insert FAQs if any
    if (faqs && faqs.length > 0) {
      const faqsToInsert = faqs.map(faq => ({
        bot_id: bot.id,
        question: faq.question,
        answer: faq.answer
      }));

      const { error: faqError } = await supabase
        .from('faqs')
        .insert(faqsToInsert);

      if (faqError) throw faqError;
    }

    // Get final bot with FAQs
    const { data: finalBot } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', bot.id)
      .single();

    res.status(201).json(finalBot);
  } catch (error) {
    next(error);
  }
};

export const getBotById = async (req, res, next) => {
  try {
    let query = supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', req.params.id);

    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query.single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Bot not found' });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateBot = async (req, res, next) => {
  try {
    const { faqs, ...botData } = req.body;
    const botId = req.params.id;

    // Update bot metadata
    const { error: botError } = await supabase
      .from('bots')
      .update(botData)
      .eq('id', botId)
      .eq(req.user.role === 'admin' ? 'id' : 'user_id', botId); // Simplified security check

    if (botError) throw botError;

    // Update FAQs (Delete and re-insert is easiest for nested arrays)
    if (faqs) {
      await supabase.from('faqs').delete().eq('bot_id', botId);
      
      if (faqs.length > 0) {
        const faqsToInsert = faqs.map(faq => ({
          bot_id: botId,
          question: faq.question,
          answer: faq.answer
        }));
        await supabase.from('faqs').insert(faqsToInsert);
      }
    }

    // Get updated bot
    const { data, error } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', botId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteBot = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', req.params.id)
      .eq(req.user.role === 'admin' ? 'id' : 'user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Bot deleted' });
  } catch (error) {
    next(error);
  }
};

export const getPublicBotConfig = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('name, primary_color, chat_window_title, welcome_message, status, faqs(question, answer)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Bot not found' });
    if (data.status === 'Paused') return res.status(403).json({ message: 'Bot is currently inactive' });
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};
