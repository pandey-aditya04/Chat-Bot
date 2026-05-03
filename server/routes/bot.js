const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { supabase } = require('../config/supabase');

// Helper to map camelCase (frontend) to snake_case (DB)
const mapToSnakeCase = (data) => ({
  name: data.name,
  website: data.website,
  theme_color: data.color || data.theme_color,
  welcome_message: data.welcomeMessage || data.welcome_message,
  tone: data.tone,
  fallback_message: data.fallbackMessage || data.fallback_message,
  chat_position: data.chatPosition || data.chat_position,
  launcher_icon: data.launcherIcon || data.launcher_icon,
  max_response_length: data.maxResponseLength || data.max_response_length,
  status: data.status || 'Active',
  is_active: data.isActive !== undefined ? data.isActive : true
});

// GET /api/bots - List user's bots
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bots - Create bot
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, faqs } = req.body;
    if (!name) return res.status(400).json({ error: 'Bot name is required' });

    const dataToInsert = {
      ...mapToSnakeCase(req.body),
      user_id: req.userId
    };

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .insert([dataToInsert])
      .select()
      .single();

    if (botError) throw botError;

    // Insert FAQs if any
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const faqsToInsert = faqs.map(faq => ({
        bot_id: bot.id,
        question: faq.question,
        answer: faq.answer
      }));

      await supabase.from('faqs').insert(faqsToInsert);
    }

    // Return bot with FAQs
    const { data: finalBot } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', bot.id)
      .single();

    res.status(201).json(finalBot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bots/:id - Update bot
router.put('/:id', authenticate, async (req, res) => {
  try {
    const botId = req.params.id;
    const { faqs } = req.body;

    const dataToUpdate = mapToSnakeCase(req.body);

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .update(dataToUpdate)
      .eq('id', botId)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (botError) throw botError;

    // Update FAQs (Delete and re-insert)
    if (faqs && Array.isArray(faqs)) {
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

    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bots/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
