import express from 'express';
import { payslipController } from '../controllers/payslipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, payslipController.getAllPayslips);
router.post('/', protect, payslipController.createPayslip);
router.put('/:id', protect, payslipController.updatePayslip);
router.delete('/:id', protect, payslipController.deletePayslip);
router.post('/bulk-delete', protect, payslipController.bulkDeletePayslips);
router.put('/:id/mail-status', protect, payslipController.updateMailStatus);

export default router;
