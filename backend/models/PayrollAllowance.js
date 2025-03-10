import mongoose from 'mongoose';

const payrollAllowanceSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'Active' },
  description: { type: String },
  isRecurring: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PayrollAllowance', payrollAllowanceSchema);
