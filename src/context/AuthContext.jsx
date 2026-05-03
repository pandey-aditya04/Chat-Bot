import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const API_BASE = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost'))
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'https://chatbotserver-4sqr.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Start true — ProtectedRoute will hold until we know auth state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Resolve initial session ONCE to prevent flicker
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false); // Only set loading false after initial check
    });

    // Keep listening for future changes (OAuth callback, token refresh, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      // Don't touch loading here — it's already resolved by getSession above
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Login — Supabase client directly
  const login = async (email, password) => {
    if (!supabase) throw new Error('Authentication not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.user;
  };

  // Email/Password Signup
  const signup = async (name, email, password) => {
    if (!supabase) throw new Error('Authentication not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw new Error(error.message);

    // Create user profile row (best-effort)
    if (data.user && data.session) {
      try {
        await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session.access_token}`
          },
          body: JSON.stringify({ name, email })
        });
      } catch (_) { /* non-fatal */ }
    }

    return data.user;
  };

  // Google OAuth
  const loginWithGoogle = async () => {
    if (!supabase) throw new Error('Authentication not configured');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) throw new Error(error.message);
    return data;
  };

  // Logout
  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
