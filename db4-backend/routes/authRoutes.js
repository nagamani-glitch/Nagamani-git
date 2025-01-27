import express from 'express';
// import { forgotPassword, resetPassword } from '../controllers/authController.js';
import { registerAuth, verifyOtp, loginAuth, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
