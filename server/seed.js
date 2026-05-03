const { supabase } = require('./config/supabase');
require('dotenv').config();

const mockBots = [
  {
    name: 'Acme Support Bot',
    description: 'General customer support for Acme Corp website.',
    category: 'Support',
    status: 'Active',
    faqs: [
      { question: 'What are your hours?', answer: '9 AM to 6 PM EST.' },
      { question: 'Do you offer refunds?', answer: 'Yes, within 30 days.' }
    ],
    conversations_count: 124
  },
  {
    name: 'ShopBot Pro',
    description: 'E-commerce assistant for tracking orders and product info.',
    category: 'Sales',
    status: 'Active',
    faqs: [
      { question: 'How to track order?', answer: 'Check your email for the link.' }
    ],
    conversations_count: 85
  }
];

const seedDB = async () => {
  try {
    console.log('Starting Supabase seed...');

    // 1. Get a user to associate with
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error('No users found in profiles table. Please sign up a user first.');
      process.exit(1);
    }

    const userId = users[0].id;
    console.log(`Seeding data for User ID: ${userId}`);

    // 2. Clear existing data (Optional/Careful)
    // await supabase.from('bots').delete().eq('user_id', userId);

    // 3. Seed Bots
    for (const botData of mockBots) {
      const { faqs, ...rest } = botData;
      
      const { data: bot, error: botError } = await supabase
        .from('bots')
        .insert([{ ...rest, user_id: userId }])
        .select()
        .single();

      if (botError) throw botError;

      // Seed FAQs
      if (faqs && faqs.length > 0) {
        const faqsToInsert = faqs.map(f => ({
          bot_id: bot.id,
          question: f.question,
          answer: f.answer
        }));

        const { error: faqError } = await supabase
          .from('faqs')
          .insert(faqsToInsert);

        if (faqError) throw faqError;
      }
      
      console.log(`Seeded bot: ${bot.name}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
