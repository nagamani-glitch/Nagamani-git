import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  contract: { type: String, required: true },
  employee: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  wageType: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  filingStatus: { type: String },
  contractStatus: { type: String },
  department: { type: String },
  position: { type: String },
  role: { type: String },
  shift: { type: String },
  workType: { type: String },
  noticePeriod: { type: Number },
  deductFromBasicPay: { type: Boolean, default: false },
  calculateDailyLeave: { type: Boolean, default: false },
  note: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('payrollContractModel', contractSchema);
