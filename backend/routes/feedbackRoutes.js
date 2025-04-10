import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByType,
  getFeedbackHistory,
  addFeedbackComment,
  getFeedbackAnalytics,
  submitFeedbackResponse,
  getFeedbacksByEmployee,
  getFeedbacksByDepartment,
  getFeedbacksOverdue,
  getFeedbacksDueThisWeek,
  bulkUpdateFeedbacks,
  bulkDeleteFeedbacks
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
router.get('/analytics/summary', getFeedbackAnalytics);

// Response submission
router.post('/:id/response', submitFeedbackResponse);

// Employee and department specific routes
router.get('/employee/:employeeId', getFeedbacksByEmployee);
router.get('/department/:department', getFeedbacksByDepartment);

// Due date related routes
router.get('/due/overdue', getFeedbacksOverdue);
router.get('/due/this-week', getFeedbacksDueThisWeek);

// Bulk operations
router.put('/bulk/update', bulkUpdateFeedbacks);
router.delete('/bulk/delete', bulkDeleteFeedbacks);

export default router;
