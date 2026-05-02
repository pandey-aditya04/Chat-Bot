import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BotContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const BotProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBots();
    } else {
      setBots([]);
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/bots`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBots(data.map(bot => ({ ...bot, id: bot._id })));
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBot = async (bot) => {
    try {
      const response = await fetch(`${API_URL}/bots`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bot),
      });
      const newBot = await response.json();
      const mappedBot = { ...newBot, id: newBot._id };
      setBots(prev => [mappedBot, ...prev]);
      return mappedBot;
    } catch (error) {
      console.error('Error adding bot:', error);
    }
  };

  const updateBot = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/bots/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      const updatedBot = await response.json();
      setBots(prev => prev.map(b => b.id === id ? { ...updatedBot, id: updatedBot._id } : b));
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  };

  const deleteBot = async (id) => {
    try {
      await fetch(`${API_URL}/bots/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBots(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  const getBot = (id) => bots.find(b => b.id === id);

  const getBotStats = () => ({
    totalBots: bots.length,
    activeBots: bots.filter(b => b.status === 'Active').length,
    totalConversations: bots.reduce((sum, b) => sum + (b.conversations || 0), 0),
    totalFaqs: bots.reduce((sum, b) => sum + (b.faqCount || b.faqs?.length || 0), 0),
  });

  return (
    <BotContext.Provider value={{ bots, loading, addBot, updateBot, deleteBot, getBot, getBotStats }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBots = () => {
  const context = useContext(BotContext);
  if (!context) throw new Error('useBots must be used within BotProvider');
  return context;
};
