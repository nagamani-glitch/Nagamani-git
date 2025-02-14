import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidate: { type: String, required: true },
  interviewer: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Scheduled' },
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;