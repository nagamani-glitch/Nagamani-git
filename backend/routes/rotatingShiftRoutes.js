// import express from 'express';
// import {
//   getAllShifts,
//   getUserShifts,
//   createShift,
//   updateShift,
//   deleteShift,
//   approveShift,
//   rejectShift,
//   bulkApprove,
//   bulkReject,
//   bulkDelete
// } from '../controllers/rotatingShiftController.js';

// const router = express.Router();

// // Admin routes - for all shift requests
// router.get('/shifts', getAllShifts);

// // User-specific routes
// router.get('/shifts/user/:userId', getUserShifts);

// // Create new shift request
// router.post('/shifts', createShift);

// // Update, delete, approve, reject specific shift request
// router.put('/shifts/:id', updateShift);
// router.delete('/shifts/:id', deleteShift);
// router.put('/shifts/:id/approve', approveShift);
// router.put('/shifts/:id/reject', rejectShift);

// // Bulk operations
// router.post('/shifts/bulk-approve', bulkApprove);
// router.post('/shifts/bulk-reject', bulkReject);

// export default router;



import express from 'express';
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  approveShift,
  rejectShift,
  bulkApprove,
  bulkReject,
  bulkDelete,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/rotatingShiftController.js';

const router = express.Router();

// Existing routes
router.get('/', getAllShifts);
router.get('/:id', getShiftById);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);
router.put('/:id/approve', approveShift);
router.put('/:id/reject', rejectShift);
router.post('/bulk-approve', bulkApprove);
router.post('/bulk-reject', bulkReject);
router.post('/bulk-delete', bulkDelete);

// New notification routes
router.get('/notifications/:userId', getUserNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/:userId/read-all', markAllNotificationsAsRead);

export default router;
