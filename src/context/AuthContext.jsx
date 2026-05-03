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

    const hasHashToken = window.location.hash.includes('access_token');
    let timeoutId;

    // Resolve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      
      if (!hasHashToken || session) {
        setLoading(false);
      } else {
        // Fallback: don't wait forever if the hash is invalid
        timeoutId = setTimeout(() => setLoading(false), 3000);
      }
    });

    // Keep listening for future changes (OAuth callback, token refresh, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      
      if (session) {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      } else if (!hasHashToken && event === 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
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
