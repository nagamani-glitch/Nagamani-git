import express from 'express';
import { policyController } from '../controllers/policyController.js';

const router = express.Router();

router.get('/policies', policyController.getAllPolicies);
router.post('/policies', policyController.createPolicy);
router.put('/policies/:id', policyController.updatePolicy);
router.delete('/policies/:id', policyController.deletePolicy);

export default router;
