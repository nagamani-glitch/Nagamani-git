import express from 'express';
const router = express.Router();
import { 
  getAllWorkTypeRequests, 
  createWorkTypeRequest, 
  updateWorkTypeRequest, 
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest,
  bulkApproveRequests,
  bulkRejectRequests 
} from '../controllers/workTypeRequestController.js';

router.get('/', getAllWorkTypeRequests);
router.post('/', createWorkTypeRequest);
router.put('/:id', updateWorkTypeRequest);
router.delete('/:id', deleteWorkTypeRequest);
router.put('/:id/approve', approveWorkTypeRequest);
router.put('/:id/reject', rejectWorkTypeRequest);
router.put('/bulk-approve', bulkApproveRequests);
router.put('/bulk-reject', bulkRejectRequests);

export default router;
