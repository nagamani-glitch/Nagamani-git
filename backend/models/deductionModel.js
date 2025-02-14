import mongoose from 'mongoose';

const deductionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  taxable: { type: String, enum: ['Yes', 'No'], required: true },
  fixed: { type: Boolean, default: false },
  oneTimeDeduction: { type: String, enum: ['Yes', 'No'], default: 'No' },
  specificEmployees: [{ type: String }],
  employerRate: { type: String },
  employeeRate: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Deduction', deductionSchema);
