// import mongoose from 'mongoose';

// const feedbackSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   employee: { type: String, required: true },
//   manager: { type: String, required: true },
//   subordinates: String,
//   colleague: String,
//   period: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   dueDate: { type: Date, required: true },
//   questionTemplate: { type: String, required: true },
//   keyResult: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ['Not Started', 'In Progress', 'Completed', 'Pending'],
//     default: 'Not Started'
//   },
//   feedbackType: {
//     type: String,
//     enum: ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'],
//     required: true
//   }
// }, { timestamps: true });

// export default mongoose.model('Feedback', feedbackSchema);

import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  employee: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }, // Can be string or object with employee details
  manager: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }, // Can be string or object with manager details
  subordinates: String,
  colleague: String,
  period: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  questionTemplate: { type: String, required: true },
  keyResult: { type: String, required: true },
  keyResults: [String], // Array of key results
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Pending'],
    default: 'Not Started'
  },
  feedbackType: {
    type: String,
    enum: ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: String,
  response: {
    text: String,
    rating: Number,
    submittedBy: String,
    submittedAt: Date
  },
  history: [{
    date: { type: Date, default: Date.now },
    action: String,
    user: String,
    details: String
  }],
  reminders: [{
    reminderDate: Date,
    reminderNote: String,
    recipients: [String],
    isEmailNotification: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// Add a pre-save middleware to track history
feedbackSchema.pre('save', function(next) {
  if (this.isNew) {
    this.history = [{
      date: new Date(),
      action: 'Created',
      user: 'System', // In a real app, this would be the current user
      details: 'Feedback created'
    }];
  }
  next();
});

export default mongoose.model('Feedback', feedbackSchema);
