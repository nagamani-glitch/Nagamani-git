// import express from 'express';
// import {
//   createFeedback,
//   getAllFeedbacks,
//   updateFeedback,
//   deleteFeedback,
//   getFeedbacksByType,
//   getFeedbackHistory,
//   addFeedbackComment,
//   setFeedbackReminder,
//   getFeedbackAnalytics
// } from '../controllers/feedbackController.js';

// const router = express.Router();

// // Basic CRUD routes
// router.post('/', createFeedback);
// router.get('/', getAllFeedbacks);
// router.put('/:id', updateFeedback);
// router.delete('/:id', deleteFeedback);
// router.get('/type/:type', getFeedbacksByType);

// // Enhanced feature routes
// router.get('/:id/history', getFeedbackHistory);
// router.post('/:id/comments', addFeedbackComment);
// router.post('/:id/reminders', setFeedbackReminder);
// router.get('/analytics/summary', getFeedbackAnalytics);

// export default router;

import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByType,
  getFeedbackHistory,
  addFeedbackComment,
  setFeedbackReminder,
  getFeedbackAnalytics,
  submitFeedbackResponse,
  bulkUpdateFeedback,
  getFeedbacksByEmployee,
  getOverdueFeedbacks,
  getUpcomingFeedbacks,
  getDueFeedbackReminders,
  markReminderComplete
} from '../controllers/feedbackController.js';

const router = express.Router();

// Basic CRUD routes
router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

// Feedback type routes
router.get('/type/:type', getFeedbacksByType);

// Enhanced feature routes
router.get('/:id/history', getFeedbackHistory);
router.post('/:id/comments', addFeedbackComment);
router.post('/:id/reminders', setFeedbackReminder);
router.post('/:id/response', submitFeedbackResponse);
router.get('/analytics/summary', getFeedbackAnalytics);

// Bulk operations
router.post('/bulk', bulkUpdateFeedback);

// Employee-specific routes
router.get('/employee/:employeeId', getFeedbacksByEmployee);

// Status-based routes
router.get('/status/overdue', getOverdueFeedbacks);
router.get('/status/upcoming', getUpcomingFeedbacks);

// Reminder routes
router.get('/reminders/due', getDueFeedbackReminders);
router.patch('/reminders/:feedbackId/:reminderId/complete', markReminderComplete);

export default router;
