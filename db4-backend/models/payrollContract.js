import mongoose from 'mongoose';

const payrollContractSchema = new mongoose.Schema({
  contractStatus: String,
  employee: String,
  startDate: Date,
  endDate: Date,
  wageType: String,
  basicSalary: Number,
  department: String,
  position: String,
  role: String,
  shift: String,
  workType: String,
  noticePeriod: Number,
  deductFromBasicPay: Boolean,
  calculateDailyLeave: Boolean,
  note: String
}, { timestamps: true });

const PayrollContract = mongoose.model("PayrollContract", payrollContractSchema);
export default PayrollContract;
