import express from 'express';
import { 
  getCompanyDetails, 
  updateCompanyDetails, 
  updateCompanySettings,
  registerCompany,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  changePassword,
  verifyOtp,
  resendOtp,
  upload
} from '../controllers/companyController.js';
import {
  login,
  createUser
} from '../controllers/authControllerCompany.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import bcrypt from 'bcrypt'; // Add this import for the debug-reset-password route

const router = express.Router();

// PUBLIC ROUTES - NO AUTHENTICATION REQUIRED
// ==========================================

// Company registration and authentication
router.post('/register', registerCompany);
router.post('/login', login);

// OTP verification routes
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Password reset routes - public
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Verification status route - public
router.get('/verification-status/:companyCode', async (req, res) => {
  try {
    const { companyCode } = req.params;
    
    const company = await Company.findOne({ companyCode });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Find the admin user
    const adminUser = await User.findById(company.adminUserId);
    
    res.json({
      companyName: company.name,
      isActive: company.isActive,
      pendingVerification: company.pendingVerification,
      adminVerified: adminUser ? adminUser.isVerified : false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug routes - should be removed in production
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

router.post('/debug-reset-password', async (req, res) => {
  try {
    const { email, companyCode, newPassword } = req.body;
    
    if (!email || !companyCode || !newPassword) {
      return res.status(400).json({ message: 'Email, company code, and new password are required' });
    }
    
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      companyCode: companyCode.toUpperCase() 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ 
      message: 'Password reset successful',
      email: user.email,
      companyCode: user.companyCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROTECTED ROUTES - AUTHENTICATION REQUIRED
// =========================================
// Apply authentication middleware to all routes below this point
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
