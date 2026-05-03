const { supabase } = require('../config/supabase');

/**
 * POST /api/auth/signup
 * Called by the frontend AFTER Supabase client-side signup succeeds.
 * This creates the user profile row in our public `users` table.
 * Requires Bearer token from the Supabase session.
 */
const signup = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Auth token required' });
    }
    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { name, email } = req.body;

    // Upsert user profile (safe to call multiple times)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert([{
        id: authUser.id,
        name: name || authUser.user_metadata?.name || email?.split('@')[0],
        email: email || authUser.email,
        plan: 'free'
      }], { onConflict: 'id' })
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ user: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Kept for backward compatibility but frontend now uses Supabase directly.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Try to get or create profile
    let { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      // Profile missing — create it on first login
      const { data: newProfile } = await supabase
        .from('users')
        .upsert([{
          id: authData.user.id,
          name: authData.user.user_metadata?.name || email.split('@')[0],
          email: authData.user.email,
          plan: 'free'
        }], { onConflict: 'id' })
        .select()
        .single();
      profile = newProfile;
    }

    res.json({
      token: authData.session?.access_token,
      user: profile || authData.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
