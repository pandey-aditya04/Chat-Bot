const { supabase } = require('../config/supabase');

const getLogs = async (req, res, next) => {
  try {
    // Get all bots owned by the user
    let botQuery = supabase.from('bots').select('id');
    if (req.user.role !== 'admin') {
      botQuery = botQuery.eq('user_id', req.user.id);
    }
    const { data: userBots, error: botError } = await botQuery;
    if (botError) throw botError;

    const botIds = userBots.map(b => b.id);
    
    // Get logs for those bots
    let logQuery = supabase
      .from('logs')
      .select('*, messages(*)')
      .order('created_at', { ascending: false });

    if (req.user.role !== 'admin') {
      logQuery = logQuery.in('bot_id', botIds);
    }

    const { data: logs, error: logError } = await logQuery;
    if (logError) throw logError;

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs };
