import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'chatbot_builder';

let db = null;
let client = null;

export const connectDB = async () => {
  if (db) return db;
  
  try {
    client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};
