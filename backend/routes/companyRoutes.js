import express from 'express';
import { 
  getCompanyDetails, 
  updateCompanyDetails, 
  updateCompanySettings,
  registerCompany ,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  changePassword,
  verifyOtp,
  resendOtp
} from '../controllers/companyController.js';
import {
  login,
  createUser
} from '../controllers/authControllerCompany.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';

const router = express.Router();

// Public routes
router.post('/register', registerCompany);
router.post('/login', login);

// OTP verification routes
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
// Add this route for debugging (remove in production)
router.get('/debug-otp/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      email: user.email,
      otp: user.otp,
      otpExpires: user.otpExpires,
      isVerified: user.isVerified,
      now: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Protected routes - require authentication
router.use(authenticate);

// Company management routes
router.get('/', getCompanyDetails);
router.put('/', authorize(['manage_company_settings']), updateCompanyDetails);
router.put('/settings', authorize(['manage_company_settings']), updateCompanySettings);

// User management routes
router.post('/users', authorize(['create_employees']), createUser);

// Change password (for authenticated users)
router.post('/change-password', changePassword);

export default router;
