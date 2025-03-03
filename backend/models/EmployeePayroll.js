import mongoose from 'mongoose';

const employeePayrollSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  empName: { type: String, required: true },
  basicPay: { type: Number, required: true },
  bankName: { type: String, required: true },
  bankAccountNo: { type: String, required: true },
  pfNo: { type: String, required: true },
  uanNo: { type: String, required: true },
  panNo: { type: String, required: true },
  payableDays: { type: Number, default: 30 },
  lop: { type: Number, default: 0 },
  department: { type: String },
  designation: { type: String },
  joiningDate: { type: Date },
  email: { type: String },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('EmployeePayroll', employeePayrollSchema);
