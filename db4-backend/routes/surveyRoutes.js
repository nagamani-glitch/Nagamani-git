import express from 'express'
import {
  getAllTemplates,
  addTemplate,
  updateTemplate,
  deleteQuestion,
  deleteTemplate,
} from '../controllers/surveyController.js';

const router = express.Router();

// Get all survey templates
router.get('/api/recruitment-survey', getAllTemplates);

// Add a new template
router.post('/api/recruitment-survey/add', addTemplate);

// Edit a template by ID
router.put('/api/recruitment-survey/:id', updateTemplate);

// Delete a question by template and question ID
router.delete('/api/recruitment-survey/:templateId/questions/:questionId', deleteQuestion);

// Delete a template by ID
router.delete('/api/recruitment-survey/:id', deleteTemplate);

export default router
