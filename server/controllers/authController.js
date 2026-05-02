import { supabase } from '../config/supabase.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create profile in our custom profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: authData.user.id, 
          name, 
          email,
          role: 'user',
          plan: 'Free'
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
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
