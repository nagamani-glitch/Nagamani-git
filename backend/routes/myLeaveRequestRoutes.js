// import express from 'express';
// import {
//   getAllLeaveRequests,
//   createLeaveRequest,
//   deleteLeaveRequest,
//   approveLeaveRequest,
//   rejectLeaveRequest,
//   getEmployeeLeaveRequests,
//   getLeaveBalance,
//   getLeaveStatistics,
//   resetAnnualLeaves,
//   updateLeaveComment,
//   recalculateLeaveBalance,
//   updateEarnedLeaveBalance
// } from '../controllers/myLeaveRequestController.js';

// const router = express.Router();

// // Employee routes
// router.get('/employee/:employeeCode', getEmployeeLeaveRequests);
// router.get('/balance/:employeeCode', getLeaveBalance);
// router.get('/statistics/:employeeCode', getLeaveStatistics);

// // Admin/HR routes
// router.get('/', getAllLeaveRequests);
// router.post('/', createLeaveRequest);
// router.delete('/:id', deleteLeaveRequest);
// router.put('/:id/approve', approveLeaveRequest);
// router.put('/:id/reject', rejectLeaveRequest);
// router.post('/reset-annual', resetAnnualLeaves);
// router.post('/update-earned-leave', updateEarnedLeaveBalance);
// // Add this route
// router.post('/recalculate-balance/:employeeCode', recalculateLeaveBalance);


// // Comment update route
// router.put('/:id', updateLeaveComment);

// export default router;

import express from 'express';
import {
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveComment,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getEmployeeLeaveRequests,
  getLeaveBalance,
  recalculateLeaveBalance,
  bulkApproveLeaveRequests,
  bulkRejectLeaveRequests
} from '../controllers/myLeaveRequestController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all leave requests
router.get('/', getAllLeaveRequests);

// Create a new leave request
router.post('/', createLeaveRequest);

// Get leave requests for a specific employee
router.get('/employee/:employeeCode', getEmployeeLeaveRequests);

// Get leave balance for a specific employee
router.get('/balance/:employeeCode', getLeaveBalance);

// Recalculate leave balance for a specific employee
router.post('/recalculate-balance/:employeeCode', recalculateLeaveBalance);

// Bulk approve/reject leave requests
router.post('/bulk-approve', bulkApproveLeaveRequests);
router.post('/bulk-reject', bulkRejectLeaveRequests);

// Update, delete, approve, reject a specific leave request
router.put('/:id/comment', updateLeaveComment);
router.delete('/:id', deleteLeaveRequest);
router.put('/:id/approve', approveLeaveRequest);
router.put('/:id/reject', rejectLeaveRequest);

export default router;
