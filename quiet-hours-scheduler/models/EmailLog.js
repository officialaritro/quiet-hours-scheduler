import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  studyBlockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyBlock',
    required: true
  },
  emailType: {
    type: String,
    enum: ['reminder', 'confirmation', 'cancellation'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'sent'
  },
  errorMessage: String
});

export default mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema);