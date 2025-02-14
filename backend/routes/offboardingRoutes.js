import express from 'express';
import {
  getAllOffboardings,
  createOffboarding,
  updateOffboarding,
  deleteOffboarding,
  getOffboardingsByStage
} from '../controllers/offboardingController.js';

const router = express.Router();

router.get('/', getAllOffboardings);
router.post('/', createOffboarding);
router.put('/:id', updateOffboarding);
router.delete('/:id', deleteOffboarding);
router.get('/stage/:stage', getOffboardingsByStage);

export default router;
