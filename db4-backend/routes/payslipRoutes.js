import express from 'express';
import { payslipController } from '../controllers/payslipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, payslipController.getAllPayslips);
router.post('/', protect, payslipController.createPayslip);
router.put('/:id', protect, payslipController.updatePayslip);
router.delete('/:id', protect, payslipController.deletePayslip);

export default router;
