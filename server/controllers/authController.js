const { supabase } = require('../config/supabase');

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create profile in our custom users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, 
          name, 
          email,
          password_hash: password, // For simplicity since supabase handles real password in auth.users
          plan: 'free'
        }
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ 
      token: authData.session?.access_token, 
      user: profileData
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    res.json({ 
      token: authData.session?.access_token, 
      user: profileData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
