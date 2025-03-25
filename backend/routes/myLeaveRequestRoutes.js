// import express from 'express';
// import {
//   getAllLeaveRequests,
//   createLeaveRequest,
//   updateLeaveRequest,
//   deleteLeaveRequest,
//   approveLeaveRequest,
//   rejectLeaveRequest,
// } from '../controllers/myLeaveRequestController.js';

// const router = express.Router();

// router.get('/', getAllLeaveRequests);
// router.post('/', createLeaveRequest);
// router.put('/:id', updateLeaveRequest);
// router.delete('/:id', deleteLeaveRequest);
// router.put('/:id/approve', approveLeaveRequest);
// router.put('/:id/reject', rejectLeaveRequest);

// export default router;

import express from 'express';
import {
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getEmployeeLeaveRequests
} from '../controllers/myLeaveRequestController.js';

const router = express.Router();

// Employee routes
router.get('/', getAllLeaveRequests);
router.post('/', createLeaveRequest);
router.put('/:id', updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

// Get leave requests for a specific employee
router.get('/employee/:employeeCode', getEmployeeLeaveRequests);

// Admin/HR routes - these will be used by the LeaveRequests component
router.put('/:id/approve', approveLeaveRequest);
router.put('/:id/reject', rejectLeaveRequest);

export default router;
