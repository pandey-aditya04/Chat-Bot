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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: 'Profile not found' });
    }

    req.user = profile;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { authenticate };
