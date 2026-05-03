const { supabase } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user profile — create it if it doesn't exist (e.g. first Google login)
    let { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      const { data: newProfile } = await supabase
        .from('users')
        .upsert([{
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email,
          plan: 'free'
        }], { onConflict: 'id' })
        .select()
        .single();
      profile = newProfile;
    }

    // Attach to request (fall back to authUser if profile still missing)
    req.user = profile || { id: authUser.id, email: authUser.email, role: 'user' };
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { authenticate };
