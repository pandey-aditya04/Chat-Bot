import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('chatbot_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('chatbot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chatbot_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const userData = {
      id: 'user_001',
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatar: null,
      plan: 'Basic',
      timezone: 'America/New_York',
      createdAt: '2024-01-15',
    };
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const userData = {
      id: 'user_' + Date.now(),
      email,
      name,
      avatar: null,
      plan: 'Free',
      timezone: 'America/New_York',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatbot_user');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
