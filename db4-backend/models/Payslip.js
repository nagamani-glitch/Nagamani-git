import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
  employee: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  batch: { type: String, default: 'None' },
  grossPay: { type: Number, required: true },
  deduction: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  mailSent: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['paid', 'confirmed', 'pending'],
    default: 'pending'
  }
}, { timestamps: true });

const Payslip = mongoose.model('Payslip', payslipSchema);
export default Payslip;
