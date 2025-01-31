import express from 'express';
import {
  getAllWorktypes,
  createWorktype,
  updateWorktype,
  deleteWorktype,
  approveWorktype,
  rejectWorktype,
  bulkApprove,
  bulkReject
} from '../controllers/rotatingWorktypeController.js';

const router = express.Router();

router.get('/shifts', getAllWorktypes);
router.post('/shifts', createWorktype);
router.put('/shifts/:id', updateWorktype);
router.delete('/shifts/:id', deleteWorktype);
router.put('/shifts/:id/approve', approveWorktype);
router.put('/shifts/:id/reject', rejectWorktype);
router.post('/shifts/bulk-approve', bulkApprove);
router.post('/shifts/bulk-reject', bulkReject);

export default router;
