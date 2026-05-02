const generateDailyData = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const baseCount = dayOfWeek === 0 || dayOfWeek === 6 ? 15 : 35;
    const variance = Math.floor(Math.random() * 25) - 8;
    data.push({
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      messages: Math.max(5, baseCount + variance),
      conversations: Math.max(2, Math.floor((baseCount + variance) / 3.5)),
    });
  }
  return data;
};

export const messagesPerDay = generateDailyData(30);

export const conversationsPerBot = [
  { bot: 'Acme Support Bot', conversations: 342, color: '#6366f1' },
  { bot: 'ShopBot Pro', conversations: 89, color: '#8b5cf6' },
  { bot: 'SalesBot Max', conversations: 156, color: '#f59e0b' },
  { bot: 'Wellness Guide', conversations: 24, color: '#10b981' },
  { bot: 'HelpDesk AI', conversations: 0, color: '#ef4444' },
];

export const questionMatchData = [
  { name: 'Matched', value: 68, color: '#10b981' },
  { name: 'Unmatched', value: 32, color: '#ef4444' },
];

export const topQuestions = [
  { question: 'What are your business hours?', count: 87, trend: 'up' },
  { question: 'How do I reset my password?', count: 64, trend: 'up' },
  { question: 'Where is my order?', count: 52, trend: 'down' },
  { question: 'Do you offer refunds?', count: 43, trend: 'stable' },
  { question: 'How do I contact support?', count: 38, trend: 'up' },
  { question: 'What payment methods do you accept?', count: 31, trend: 'stable' },
  { question: 'Do you ship internationally?', count: 28, trend: 'down' },
  { question: 'How do I apply a discount code?', count: 24, trend: 'up' },
  { question: 'What is the return policy?', count: 22, trend: 'stable' },
  { question: 'Is there a free trial?', count: 19, trend: 'up' },
];

export const analyticsStats = {
  totalMessages: 0,
  uniqueConversations: 0,
  avgMatchRate: 0,
  mostActiveDay: 'None',
};
