import { MongoClient } from 'mongodb';
import { mockBots } from '../src/data/mockBots.js';
import dotenv from 'dotenv';

dotenv.config();

const url = 'mongodb://localhost:27017';
const dbName = 'chatbot_builder';

const seedDB = async () => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to MongoDB to seed data...');
    const db = client.db(dbName);
    
    // Clear existing bots
    await db.collection('bots').deleteMany({});
    
    // Remove ids from mock bots to let MongoDB generate _id
    const botsToInsert = mockBots.map(({ id, ...rest }) => ({ ...rest }));
    
    await db.collection('bots').insertMany(botsToInsert);
    console.log(`Seeded ${botsToInsert.length} bots successfully!`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
};

seedDB();
