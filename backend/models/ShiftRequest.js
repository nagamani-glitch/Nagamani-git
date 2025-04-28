import mongoose from 'mongoose';

const shiftRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true 
  },// Add userId as a required field
  name: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  requestedShift: {
    type: String,
    required: true,
    enum: ['Morning Shift', 'Evening Shift', 'Night Shift']
  },
  currentShift: {
    type: String,
    default: 'Regular Shift'
  },
  requestedDate: {
    type: Date,
    required: true
  },
  requestedTill: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  description: String,
  isPermanentRequest: {
    type: Boolean,
    default: false
  },
  isAllocated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ShiftRequest', shiftRequestSchema);
