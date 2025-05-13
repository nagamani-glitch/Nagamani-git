// import mongoose from 'mongoose';

// const allowanceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   percentage: { type: Number, required: true },
//   amount: { type: Number, required: true },
//   category: { type: String, default: 'Regular' },
//   status: { type: String, default: 'Active' },
//   isRecurring: { type: Boolean, default: true },
//   isBasicPay: { type: Boolean, default: false } // Added to identify Basic Pay component
// }, { _id: false });

// const deductionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   percentage: { type: Number, required: true },
//   amount: { type: Number, required: true },
//   category: { type: String, default: 'Tax' },
//   status: { type: String, default: 'Active' },
//   isRecurring: { type: Boolean, default: true },
//   isFixedAmount: { type: Boolean, default: false } // Added to identify fixed amount deductions
// }, { _id: false });

// const payslipSchema = new mongoose.Schema({
//   month: { type: Number, required: true },
//   year: { type: Number, required: true },
//   generatedDate: { type: Date, default: Date.now },
//   grossSalary: { type: Number, required: true },
//   totalDeductions: { type: Number, required: true },
//   netSalary: { type: Number, required: true },
//   status: { type: String, default: 'Generated' },
//   pdfPath: { type: String },
//   baseAfterDeductions: { type: Number }, // Added to store base after deductions
//   attendanceAdjustedBase: { type: Number }, // Added to store attendance adjusted base
//   lopImpact: { // Added to store LOP impact details
//     totalPayBeforeLOP: { type: Number },
//     lopDeduction: { type: Number },
//     lopPercentage: { type: Number }
//   }
// }, { timestamps: true });

// const unifiedPayrollSchema = new mongoose.Schema({
//   // Employee basic info
//   empId: { type: String, required: true, unique: true },
//   empName: { type: String, required: true },
//   department: { type: String, required: true },
//   designation: { type: String, required: true },
//   basicPay: { type: Number, required: true },
//   bankName: { type: String, required: true },
//   bankAccountNo: { type: String, required: true },
//   pfNo: { type: String, required: true },
//   uanNo: { type: String, required: true },
//   panNo: { type: String, required: true },
//   lop: { 
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function(v) {
//         return Number.isInteger(v * 2);
//       },
//       message: 'LOP must be in increments of 0.5 days'
//     }
//   },
//   payableDays: { type: Number, default: 30 },
//   email: { type: String },
//   status: { type: String, default: 'Active' },
//   joiningDate: { type: Date, required: true }, // Added joining date field
  
//   // Embedded collections
//   allowances: [allowanceSchema],
//   deductions: [deductionSchema],
//   payslips: [payslipSchema],
  
// }, { timestamps: true });

// export default mongoose.model('UnifiedPayroll', unifiedPayrollSchema);

import mongoose from 'mongoose';

const allowanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Regular' },
  status: { type: String, default: 'Active' },
  isRecurring: { type: Boolean, default: true },
  isBasicPay: { type: Boolean, default: false } // Added to identify Basic Pay component
}, { _id: false });

const deductionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Tax' },
  status: { type: String, default: 'Active' },
  isRecurring: { type: Boolean, default: true },
  isFixedAmount: { type: Boolean, default: false } // Added to identify fixed amount deductions
}, { _id: false });

const payslipSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  generatedDate: { type: Date, default: Date.now },
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  status: { type: String, default: 'Generated' },
  pdfPath: { type: String },
  baseAfterDeductions: { type: Number }, // Added to store base after deductions
  attendanceAdjustedBase: { type: Number }, // Added to store attendance adjusted base
  lopImpact: { // Added to store LOP impact details
    totalPayBeforeLOP: { type: Number },
    lopDeduction: { type: Number },
    lopPercentage: { type: Number }
  }
}, { timestamps: true });

const unifiedPayrollSchema = new mongoose.Schema({
  // Employee basic info
  empId: { type: String, required: true, unique: true },
  empName: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  basicPay: { type: Number, required: true },
  bankName: { type: String, required: true },
  bankAccountNo: { type: String, required: true },
  pfNo: { type: String, required: true },
  uanNo: { type: String, required: true },
  panNo: { type: String, required: true },
  lop: { 
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return Number.isInteger(v * 2);
      },
      message: 'LOP must be in increments of 0.5 days'
    }
  },
  payableDays: { type: Number, default: 30 },
  email: { type: String },
  status: { type: String, default: 'Active' },
  joiningDate: { type: Date, required: true }, // Added joining date field
  
  // Embedded collections
  allowances: [allowanceSchema],
  deductions: [deductionSchema],
  payslips: [payslipSchema],
  
}, { timestamps: true });

// Create model for UnifiedPayroll in the main database (for backward compatibility)
const UnifiedPayroll = mongoose.model('UnifiedPayroll', unifiedPayrollSchema);

// Export the schema for company-specific models
export { unifiedPayrollSchema };

// Export the main model as default
export default UnifiedPayroll;
