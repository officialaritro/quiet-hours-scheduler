import mongoose from 'mongoose';

const StudyBlockSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: String,
  emailSent: { type: Boolean, default: false },
  reminderScheduled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.StudyBlock || mongoose.model('StudyBlock', StudyBlockSchema);