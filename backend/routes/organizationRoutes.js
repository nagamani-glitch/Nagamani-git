import express from 'express';
import { organizationController } from '../controllers/organizationController.js';

const router = express.Router();

// Base route prefix: /api
router.get('/organization-chart', organizationController.getOrganizationChart);
router.post('/positions', organizationController.addPosition);
router.put('/positions/:id', organizationController.updatePosition);
router.delete('/positions/:id', organizationController.deletePosition);

export default router;
