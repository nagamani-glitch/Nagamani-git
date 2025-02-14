import express from 'express';
import {
  getAllPayslips,
  createPayslip,
  deletePayslip,
  bulkDeletePayslips,
  exportPayslips,
  updatePayslip
} from '../controllers/payslipController.js';

const router = express.Router();

router.get('/', getAllPayslips);
router.post('/', createPayslip);
router.put('/:id', updatePayslip);
router.delete('/:id', deletePayslip);
router.post('/bulk-delete', bulkDeletePayslips);
router.post('/export', exportPayslips);

export default router;
