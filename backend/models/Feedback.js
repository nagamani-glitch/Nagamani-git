import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  employee: { type: String, required: true },
  manager: { type: String, required: true },
  subordinates: String,
  colleague: String,
  period: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  questionTemplate: { type: String, required: true },
  keyResult: { type: String, required: true },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Pending'],
    default: 'Not Started'
  },
  feedbackType: {
    type: String,
    enum: ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
