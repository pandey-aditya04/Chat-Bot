const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { supabase } = require('../config/supabase');

// GET /api/logs — get chat logs for user's bots
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Join with bots table to ensure we only get logs for bots owned by this user
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        bots!inner (
          id,
          name,
          user_id
        )
      `)
      .eq('bots.user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Fetch logs error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Flatten the response for the frontend
    const logs = data.map(log => ({
      ...log,
      botName: log.bots?.name,
      botId: log.bots?.id
    }));

    res.json(logs || []);
  } catch (err) {
    console.error('Internal server error (logs):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
