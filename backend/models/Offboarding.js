import mongoose from 'mongoose';

const offboardingSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  stage: { 
    type: String, 
    enum: ['Notice Period', 'Exit Interview', 'Work Handover'],
    required: true
  },
  // Notice Period fields
  noticePeriod: String,
  startDate: Date,
  endDate: Date,
  
  // Exit Interview fields
  interviewDate: Date,
  interviewer: String,
  feedback: String,
  
  // Work Handover fields
  handoverTo: String,
  projectDocuments: String,
  pendingTasks: String,
  
  // Common fields
  taskStatus: { type: String, default: '0/0' },
  description: String,
  manager: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Offboarding', offboardingSchema);
