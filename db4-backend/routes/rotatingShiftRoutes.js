import express from 'express';
import {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
  approveShift,
  rejectShift,
  bulkApprove,
  bulkReject
} from '../controllers/rotatingShiftController.js';

const router = express.Router();

router.get('/shifts', getAllShifts);
router.post('/shifts', createShift);
router.put('/shifts/:id', updateShift);
router.delete('/shifts/:id', deleteShift);
router.put('/shifts/:id/approve', approveShift);
router.put('/shifts/:id/reject', rejectShift);
router.post('/shifts/bulk-approve', bulkApprove);
router.post('/shifts/bulk-reject', bulkReject);

export default router;
