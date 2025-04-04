// import express from 'express';
// import {
//   createFeedback,
//   getAllFeedbacks,
//   updateFeedback,
//   deleteFeedback,
//   getFeedbacksByType
// } from '../controllers/feedbackController.js';

// const router = express.Router();

// router.post('/', createFeedback);
// router.get('/', getAllFeedbacks);
// router.put('/:id', updateFeedback);
// router.delete('/:id', deleteFeedback);
// router.get('/type/:type', getFeedbacksByType);

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
  getFeedbackAnalytics
} from '../controllers/feedbackController.js';

const router = express.Router();

// Basic CRUD routes
router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);
router.get('/type/:type', getFeedbacksByType);

// Enhanced feature routes
router.get('/:id/history', getFeedbackHistory);
router.post('/:id/comments', addFeedbackComment);
router.post('/:id/reminders', setFeedbackReminder);
router.get('/analytics/summary', getFeedbackAnalytics);

export default router;
