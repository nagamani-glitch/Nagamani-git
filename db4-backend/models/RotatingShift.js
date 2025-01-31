import mongoose from 'mongoose';

const rotatingShiftSchema = new mongoose.Schema({
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
    required: true
  },
  currentShift: {
    type: String,
    required: true
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

export default mongoose.model('RotatingShift', rotatingShiftSchema);
