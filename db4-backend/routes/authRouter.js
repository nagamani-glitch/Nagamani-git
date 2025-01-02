



// import express from 'express';
// import { loginAuth, registerAuth, verifyOtp } from '../controllers/authController.js';

// const router = express.Router();

// // Route for registration
// router.post('/register', registerAuth);

// // Route for login
// router.post('/login', loginAuth);

// // Route for OTP verification
// router.post('/verify-otp', verifyOtp);

// export default router;



import express from 'express';
import { registerAuth, verifyOtp, loginAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAuth);  // Register user and send OTP
router.post('/verify-otp', verifyOtp);   // Verify OTP
router.post('/login', loginAuth);        // User login

export default router;


