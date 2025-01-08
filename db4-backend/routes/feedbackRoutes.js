import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByType
} from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);
router.get('/type/:type', getFeedbacksByType);

export default router;
