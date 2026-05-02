import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { botAPI } from '../lib/api';

const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBots();
    } else {
      setBots([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const { data } = await botAPI.getAll();
      // Supabase returns 'id', so no mapping from '_id' is needed
      setBots(data);
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBot = async (botData) => {
    try {
      const { data } = await botAPI.create(botData);
      setBots(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding bot:', error);
      throw error;
    }
  };

  const updateBot = async (id, updates) => {
    try {
      const { data } = await botAPI.update(id, updates);
      setBots(prev => prev.map(b => b.id === id ? data : b));
      return data;
    } catch (error) {
      console.error('Error updating bot:', error);
      throw error;
    }
  };

  const deleteBot = async (id) => {
    try {
      await botAPI.delete(id);
      setBots(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting bot:', error);
      throw error;
    }
  };

  const getBot = (id) => bots.find(b => b.id === id);

  const getBotStats = () => ({
    totalBots: bots.length,
    activeBots: bots.filter(b => b.status === 'Active').length,
    totalConversations: bots.reduce((sum, b) => sum + (b.conversations_count || 0), 0),
    totalFaqs: bots.reduce((sum, b) => sum + (b.faqs?.length || 0), 0),
  });

  return (
    <BotContext.Provider value={{ 
      bots, 
      loading, 
      addBot, 
      updateBot, 
      deleteBot, 
      getBot, 
      getBotStats,
      refreshBots: fetchBots 
    }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBots = () => {
  const context = useContext(BotContext);
  if (!context) throw new Error('useBots must be used within BotProvider');
  return context;
};
