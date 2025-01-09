import mongoose  from 'mongoose';

const shiftRequestSchema = new mongoose.Schema({
  employee: {type: String, required: true },
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
  comment: { type: String, default: '' },
  isPermanentRequest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ShiftRequest = mongoose.model('ShiftRequest', shiftRequestSchema);
export default ShiftRequest;