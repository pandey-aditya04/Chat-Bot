import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'chatbot_builder';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection.db;

  try {
    const conn = await mongoose.connect(`${url}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected successfully to MongoDB: ${conn.connection.host}`);
    return conn.connection.db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // In serverless, we shouldn't exit the process
    throw error;
  }
};

export const getDB = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return mongoose.connection.db;
};
