import mongoose from 'mongoose';

const monthlyPayslipSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  pfNo: { type: String, required: true },
  uanNo: { type: String, required: true },
  panNo: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  generatedDate: { type: Date, default: Date.now },
  basicPay: { type: Number, required: true },
  payableDays: { type: Number, required: true },
  lopDays: { type: Number, required: true },
  allowances: [{
    name: String,
    amount: Number,
    percentage: Number,
    category: String
  }],
  deductions: [{
    name: String,
    amount: Number,
    percentage: Number,
    category: String
  }],
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  bankDetails: {
    bankName: String,
    accountNo: String
  },
  status: { type: String, default: 'Generated' },
  pdfPath: { type: String }
}, { timestamps: true });

export default mongoose.model('MonthlyPayslip', monthlyPayslipSchema);
