import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'chatbot_builder';

const createUsers = async () => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    console.log('Connected to MongoDB...');

    // Delete existing admin/demo if they exist to refresh passwords
    await User.deleteMany({ role: { $in: ['admin', 'demo'] } });

    // Create Master Admin
    const admin = new User({
      name: 'Master Admin',
      email: 'admin@chatbot.com',
      password: 'admin123',
      role: 'admin',
      plan: 'Enterprise'
    });
    await admin.save();
    console.log('Master Admin created: admin@chatbot.com / admin123');

    // Create Demo User
    const demo = new User({
      name: 'Demo User',
      email: 'demo@chatbot.com',
      password: 'demo123',
      role: 'demo',
      plan: 'Basic'
    });
    await demo.save();
    console.log('Demo User created: demo@chatbot.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers();
