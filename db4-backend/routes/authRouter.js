import express from 'express';
import { registerAuth, verifyOtp, loginAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAuth);  // Register user and send OTP
router.post('/verify-otp', verifyOtp);   // Verify OTP
router.post('/login', loginAuth);        // User login

export default router;


