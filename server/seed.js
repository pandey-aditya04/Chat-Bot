import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bot from './models/Bot.js';
import Log from './models/Log.js';
// Initial seed data defined internally to remove dependency on mock files
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
    conversations: 124
  },
  {
    name: 'ShopBot Pro',
    description: 'E-commerce assistant for tracking orders and product info.',
    category: 'Sales',
    status: 'Active',
    faqs: [
      { question: 'How to track order?', answer: 'Check your email for the link.' }
    ],
    conversations: 85
  }
];

const mockChatLogs = []; // Optional: Add sample logs if needed

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'chatbot_builder';

const seedDB = async () => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data
    await Bot.deleteMany({});
    await Log.deleteMany({});
    console.log('Cleared existing data.');
    
    // Seed Bots
    const botsToInsert = mockBots.map(({ id, ...rest }) => ({ ...rest }));
    const insertedBots = await Bot.insertMany(botsToInsert);
    console.log(`Seeded ${insertedBots.length} bots.`);
    
    // Seed Logs (optional, mapping botId if needed)
    const logsToInsert = mockChatLogs.map(({ id, botId, ...rest }) => {
      // Find the new botId for this botName
      const bot = insertedBots.find(b => b.name === rest.botName);
      return {
        ...rest,
        botId: bot ? bot._id : null
      };
    });
    await Log.insertMany(logsToInsert);
    console.log(`Seeded ${logsToInsert.length} chat logs.`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
