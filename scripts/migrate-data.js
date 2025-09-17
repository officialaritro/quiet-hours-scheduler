import mongoose from 'mongoose';
import StudyBlock from '../models/StudyBlock.js';

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Example migration: add new field to existing documents
    await StudyBlock.updateMany(
      { reminderScheduled: { $exists: false } },
      { $set: { reminderScheduled: false } }
    );
    
    console.log('Data migration complete');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateData();