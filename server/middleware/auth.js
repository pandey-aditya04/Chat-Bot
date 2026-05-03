const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Try Supabase JWT (OAuth / Native Supabase Users)
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        // Find or create profile in our users table
        let { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile) {
          const { data: newProfile } = await supabase
            .from('users')
            .upsert([{
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email,
              plan: 'free'
            }], { onConflict: 'id' })
            .select()
            .single();
          profile = newProfile;
        }

        req.userId = user.id; // user_id for DB queries
        req.user = profile || { id: user.id, email: user.email };
        return next();
      }
    } catch (e) {
      // Not a Supabase token, proceed to legacy JWT check
    }

    // 2. Fallback: Try Legacy JWT (Email/Password users using local secret)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        req.userId = decoded.userId || decoded.id;
        req.user = decoded;
        return next();
      }
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(500).json({ error: 'Authentication internal error' });
  }
};
