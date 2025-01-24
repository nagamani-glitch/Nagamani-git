import mongoose from 'mongoose';

const workTypeRequestSchema = new mongoose.Schema({
  employee: { type: String, required: true },
  requestedShift: { 
    type: String, 
    required: true,
    enum: ['Morning Shift', 'Evening Shift', 'Night Shift']
  },
  currentShift: {  
    type: String, 
    default: 'Regular Shift'
  },
  requestedDate: { type: Date, required: true },
  requestedTill: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  description: { type: String },
  isPermanentRequest: { type: Boolean, default: false }
}, {
  timestamps: true
});

const WorkTypeRequest = mongoose.model('WorkTypeRequest', workTypeRequestSchema);
export default WorkTypeRequest;