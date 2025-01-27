import express from 'express';
import { registerAuth, verifyOtp, loginAuth, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAuth);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;

