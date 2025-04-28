// import express from 'express';
// import {
//   getAllWorktypes,
//   createWorktype,
//   updateWorktype,
//   deleteWorktype,
//   approveWorktype,
//   rejectWorktype,
//   bulkApprove,
//   bulkReject
// } from '../controllers/rotatingWorktypeController.js';

// const router = express.Router();

// router.get('/shifts', getAllWorktypes);
// router.post('/shifts', createWorktype);
// router.put('/shifts/:id', updateWorktype);
// router.delete('/shifts/:id', deleteWorktype);
// router.put('/shifts/:id/approve', approveWorktype);
// router.put('/shifts/:id/reject', rejectWorktype);
// router.post('/shifts/bulk-approve', bulkApprove);
// router.post('/shifts/bulk-reject', bulkReject);

// export default router;

import express from 'express';
import {
  getAllWorktypes,
  getUserWorktypes,
  createWorktype,
  updateWorktype,
  deleteWorktype,
  approveWorktype,
  rejectWorktype,
  bulkApprove,
  bulkReject
} from '../controllers/rotatingWorktypeController.js';

const router = express.Router();

// Get all worktype requests with optional filtering
router.get('/shifts', getAllWorktypes);

// Get worktype requests for a specific user
router.get('/shifts/user/:userId', getUserWorktypes);

// Create a new worktype request
router.post('/shifts', createWorktype);

// Update a worktype request
router.put('/shifts/:id', updateWorktype);

// Delete a worktype request
router.delete('/shifts/:id', deleteWorktype);

// Approve a worktype request
router.put('/shifts/:id/approve', approveWorktype);

// Reject a worktype request
router.put('/shifts/:id/reject', rejectWorktype);

// Bulk approve worktype requests
router.post('/shifts/bulk-approve', bulkApprove);

// Bulk reject worktype requests
router.post('/shifts/bulk-reject', bulkReject);

export default router;
