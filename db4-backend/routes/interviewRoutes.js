import express from 'express'
const router = express.Router();
import {createInterview, getInterviews, updateInterview, deleteInterview} from '../controllers/interviewController.js';

// Define routes
router.post('/', createInterview);
router.get('/', getInterviews);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router
