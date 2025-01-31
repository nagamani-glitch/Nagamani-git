import express from 'express';
const router = express.Router();
import {
  getAllShiftRequests,
  createShiftRequest,
  updateShiftRequest,
  deleteShiftRequest,
  approveShiftRequest,
  rejectShiftRequest,
  bulkApproveRequests,
  bulkRejectRequests
} from '../controllers/shiftRequestController.js';

router.get('/shifts', getAllShiftRequests);
router.post('/shifts', createShiftRequest);
router.put('/shifts/:id', updateShiftRequest);
router.delete('/shifts/:id', deleteShiftRequest);
router.put('/shifts/:id/approve', approveShiftRequest);
router.put('/shifts/:id/reject', rejectShiftRequest);
router.post('/shifts/bulk-approve', bulkApproveRequests);
router.post('/shifts/bulk-reject', bulkRejectRequests);

export default router;
