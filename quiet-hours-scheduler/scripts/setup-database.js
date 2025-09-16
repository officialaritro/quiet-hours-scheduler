import mongoose from 'mongoose';
import User from '../models/User.js';
import StudyBlock from '../models/StudyBlock.js';

async function setupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create indexes
    await User.createIndexes();
    await StudyBlock.createIndexes();
    console.log('Database indexes created');

    // You can add any initial data setup here
    console.log('Database setup complete');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase();
