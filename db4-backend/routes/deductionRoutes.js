import express from 'express';
import { createDeduction, getDeductions, updateDeduction, deleteDeduction } from '../controllers/deductionController.js';

const router = express.Router();

router.post('/', createDeduction);
router.get('/', getDeductions);
router.put('/:id', updateDeduction);
router.delete('/:id', deleteDeduction);

export default router;
