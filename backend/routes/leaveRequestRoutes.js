import express from 'express';
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  updateLeaveStatus,
  updateLeaveComment
} from '../controllers/leaveRequestController.js';

const router = express.Router();

router.route('/')
  .get(getLeaveRequests)
  .post(createLeaveRequest);

router.route('/:id')
  .put(updateLeaveRequest)
  .delete(deleteLeaveRequest);

router.put('/:id/status', updateLeaveStatus);
router.put('/:id/comment', updateLeaveComment);

export default router;
