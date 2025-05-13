// import express from 'express';
// import { PayrollController } from '../controllers/PayrollController.js';

// const router = express.Router();

// // Employee routes
// router.get('/employees', PayrollController.getAllEmployees);
// router.post('/employees', PayrollController.createEmployee);
// router.put('/employees/:empId', PayrollController.updateEmployee);
// router.put('/employees/:empId/lop', PayrollController.updateEmployeeLOP);
// router.delete('/employees/:empId', PayrollController.deleteEmployee);
// router.post('/employees/bulk', PayrollController.bulkCreateEmployees);

// // Allowance routes
// router.get('/allowances', PayrollController.getAllAllowances);
// router.post('/allowances', PayrollController.createAllowance);
// router.put('/allowances/:id', PayrollController.updateAllowance);
// router.delete('/allowances/:id', PayrollController.deleteAllowance);

// // Deduction routes
// router.get('/deductions', PayrollController.getAllDeductions);
// router.post('/deductions', PayrollController.createDeduction);
// router.put('/deductions/:id', PayrollController.updateDeduction);
// router.delete('/deductions/:id', PayrollController.deleteDeduction);

// // Payslip routes
// router.post('/payslips/generate', PayrollController.generatePayslip);
// router.get('/payslips/download/:id', PayrollController.downloadPayslip);
// router.get('/payslips/employee/:empId', PayrollController.getPayslipsByEmployee);
// router.get('/payslips/month', PayrollController.getPayslipsByMonth);
// router.post('/payslips/bulk-generate', PayrollController.bulkGeneratePayslips);
// router.get('/payslips', PayrollController.getAllPayslips);

// // New route for calculating base after deductions
// router.get('/calculate-base/:empId', PayrollController.calculateBaseAfterDeductions);

// export default router;

import express from 'express';
import { PayrollController } from '../controllers/PayrollController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Employee Management
router.post('/employees/bulk', PayrollController.bulkCreateEmployees);
router.post('/employees', PayrollController.createEmployee);
router.get('/employees', PayrollController.getAllEmployees);
router.put('/employees/:empId', PayrollController.updateEmployee);
router.patch('/employees/:empId/lop', PayrollController.updateEmployeeLOP);
router.delete('/employees/:empId', PayrollController.deleteEmployee);

// Allowance Management
router.post('/allowances', PayrollController.createAllowance);
router.put('/allowances', PayrollController.updateAllowance);
router.delete('/allowances/:empId/:name', PayrollController.deleteAllowance);

// Deduction Management
router.post('/deductions', PayrollController.createDeduction);
router.put('/deductions', PayrollController.updateDeduction);
router.delete('/deductions/:empId/:name', PayrollController.deleteDeduction);

// Payslip Management
router.post('/payslips', PayrollController.generatePayslip);
router.get('/payslips/:empId/:month/:year', PayrollController.getPayslip);
router.get('/payslips/:empId/:month/:year/pdf', PayrollController.getPayslipPDF);
router.get('/payslips/:empId', PayrollController.getAllPayslips);
router.post('/payslips/bulk', PayrollController.bulkGeneratePayslips);

// Dashboard and Reports
router.get('/dashboard', PayrollController.getPayrollDashboard);
router.get('/reports/monthly/:month/:year', PayrollController.getMonthlyPayrollReport);

export default router;
