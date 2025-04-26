import express from 'express';
import { PayrollController } from '../controllers/PayrollController.js';

const router = express.Router();

// Employee routes
router.get('/employees', PayrollController.getAllEmployees);
router.post('/employees', PayrollController.createEmployee);
router.put('/employees/:empId', PayrollController.updateEmployee);
router.put('/employees/:empId/lop', PayrollController.updateEmployeeLOP);
router.delete('/employees/:empId', PayrollController.deleteEmployee);
router.post('/employees/bulk', PayrollController.bulkCreateEmployees);

// Allowance routes
router.get('/allowances', PayrollController.getAllAllowances);
router.post('/allowances', PayrollController.createAllowance);
router.put('/allowances/:id', PayrollController.updateAllowance);
router.delete('/allowances/:id', PayrollController.deleteAllowance);

// Deduction routes
router.get('/deductions', PayrollController.getAllDeductions);
router.post('/deductions', PayrollController.createDeduction);
router.put('/deductions/:id', PayrollController.updateDeduction);
router.delete('/deductions/:id', PayrollController.deleteDeduction);

// Payslip routes
router.post('/payslips/generate', PayrollController.generatePayslip);
router.get('/payslips/download/:id', PayrollController.downloadPayslip);
router.get('/payslips/employee/:empId', PayrollController.getPayslipsByEmployee);
router.get('/payslips/month', PayrollController.getPayslipsByMonth);
router.post('/payslips/bulk-generate', PayrollController.bulkGeneratePayslips);
router.get('/payslips', PayrollController.getAllPayslips);

// New route for calculating base after deductions
router.get('/calculate-base/:empId', PayrollController.calculateBaseAfterDeductions);

export default router;
