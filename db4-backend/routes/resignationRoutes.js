import express from 'express';
import {
  createResignation,
  getAllResignations,
  updateResignation,
  deleteResignation
} from '../controllers/resignationController.js';

const router = express.Router();

router.post('/', createResignation);
router.get('/', getAllResignations);
router.put('/:id', updateResignation);
router.delete('/:id', deleteResignation);

export default router;
