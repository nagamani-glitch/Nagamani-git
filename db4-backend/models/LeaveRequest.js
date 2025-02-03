import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Leave type is required'],
    enum: ['Annual Leave', 'Sick Leave', 'Maladie']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  days: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Days must be at least 1']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected']
  },
  comment: String,
  confirmation: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected']
  }
}, { timestamps: true });

// Add pre-save middleware to validate dates
leaveRequestSchema.pre('save', function(next) {
  if (this.startDate > this.endDate) {
    next(new Error('Start date cannot be after end date'));
  }
  next();
});


export default mongoose.model('LeaveRequest', leaveRequestSchema);
