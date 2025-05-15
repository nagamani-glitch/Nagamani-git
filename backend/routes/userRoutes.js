import express from 'express';
import { inviteUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Invite a new user (admin and HR only)
router.post('/invite', authorize(['manage_company_settings']), inviteUser);

export default router;
