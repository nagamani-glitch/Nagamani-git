import express from 'express';
import {
  getAllRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  getRequestById
} from '../controllers/timeOffRequestController.js';

const router = express.Router();

router.get('/', getAllRequests);
router.post('/', createRequest);
router.get('/:id', getRequestById);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
