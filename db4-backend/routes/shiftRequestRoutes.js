import express from 'express';
const router = express.Router();
import{ getAllShiftRequests,  createShiftRequest, updateShiftRequest, deleteShiftRequest, approveShiftRequest, rejectShiftRequest} from '../controllers/shiftRequestController.js';

router.get('/', getAllShiftRequests);
router.post('/', createShiftRequest);
router.put('/:id', updateShiftRequest);
router.delete('/:id', deleteShiftRequest);
router.put('/:id/approve', approveShiftRequest);
router.put('/:id/reject', rejectShiftRequest);

export default router;
