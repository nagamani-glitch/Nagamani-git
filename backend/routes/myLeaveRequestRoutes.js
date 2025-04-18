import express from 'express';
import {
  getAllLeaveRequests,
  createLeaveRequest,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getEmployeeLeaveRequests,
  getLeaveBalance,
  getLeaveStatistics,
  resetAnnualLeaves,
  updateLeaveComment,
  recalculateLeaveBalance,
  updateEarnedLeaveBalance
} from '../controllers/myLeaveRequestController.js';

const router = express.Router();

// Employee routes
router.get('/employee/:employeeCode', getEmployeeLeaveRequests);
router.get('/balance/:employeeCode', getLeaveBalance);
router.get('/statistics/:employeeCode', getLeaveStatistics);

// Admin/HR routes
router.get('/', getAllLeaveRequests);
router.post('/', createLeaveRequest);
router.delete('/:id', deleteLeaveRequest);
router.put('/:id/approve', approveLeaveRequest);
router.put('/:id/reject', rejectLeaveRequest);
router.post('/reset-annual', resetAnnualLeaves);
router.post('/update-earned-leave', updateEarnedLeaveBalance);
// Add this route
router.post('/recalculate-balance/:employeeCode', recalculateLeaveBalance);


// Comment update route
router.put('/:id', updateLeaveComment);

export default router;
