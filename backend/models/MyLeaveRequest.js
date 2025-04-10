import mongoose from 'mongoose';

const myLeaveRequestSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['annual', 'sick', 'personal', 'maternity', 'paternity', 'casual', 'earned']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  comment: String,
  halfDay: {
    type: Boolean,
    default: false
  },
  halfDayType: {
    type: String,
    enum: ['morning', 'afternoon'],
    default: 'morning'
  },
  numberOfDays: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('MyLeaveRequest', myLeaveRequestSchema);
