import mongoose from 'mongoose';
 
const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});
 
export default mongoose.model('Timesheet', timesheetSchema);
