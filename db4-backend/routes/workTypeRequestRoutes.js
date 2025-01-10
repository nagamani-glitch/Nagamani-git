import express from 'express';
const router = express.Router();
import { 
  getAllWorkTypeRequests, 
  createWorkTypeRequest, 
  updateWorkTypeRequest, 
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest 
} from '../controllers/workTypeRequestController.js';

router.get('/', getAllWorkTypeRequests);
router.post('/', createWorkTypeRequest);
router.put('/:id', updateWorkTypeRequest);
router.delete('/:id', deleteWorkTypeRequest);
router.put('/:id/approve', approveWorkTypeRequest);
router.put('/:id/reject', rejectWorkTypeRequest);

export default router;
