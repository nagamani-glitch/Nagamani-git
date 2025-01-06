import mongoose from 'mongoose';

const deductionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  employerRate: { type: String },
  employeeRate: { type: String },
  oneTimeDeduction: { type: String, default: 'No' },
  taxable: { type: String, default: 'No' },
  fixed: { type: Boolean, default: false },
  pretax: { type: String, default: 'No' },
  basedOn: { type: String },
  specificEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  excludedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
}, {
  timestamps: true
});

export default mongoose.model('Deduction', deductionSchema);
