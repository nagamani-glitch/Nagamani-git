import express from 'express';
import { getLeaveRequests, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest } from '../controllers/leaveRequestController.js';

const router = express.Router();

router.get('/', getLeaveRequests);
router.post('/', createLeaveRequest);
router.put('/:id', updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

export default router;