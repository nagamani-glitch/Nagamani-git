import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Company from '../models/Company.js';
import  User  from '../models/User.js';
import { sendOtpEmail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';



// Get the current file's path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads/company-logos');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for logo uploads
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
}).single('logo');

export {upload};

// Update the registerCompany function to handle file uploads
export const registerCompany = async (req, res) => {
  // Use multer to handle file upload
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 2MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else {
        // An unknown error occurred
        return res.status(400).json({ message: err.message });
      }
    }
    
    try {
      console.log('Registration request received');
      console.log('Request body keys:', Object.keys(req.body));
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'Company logo is required' });
      }
      
      console.log('File received:', req.file);
      
      // Parse JSON data from form fields
      let company, admin;
      try {
        company = JSON.parse(req.body.company);
        admin = JSON.parse(req.body.admin);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON data in form fields' });
      }
      
      // Add logo URL to company data
      const logoUrl = `/uploads/company-logos/${req.file.filename}`;
      company.logo = logoUrl;
      
      console.log('Processing registration with data:', {
        companyCode: company.companyCode,
        adminEmail: admin.email,
        logoUrl
      });
      
      // Check if company code already exists
      const existingCompany = await Company.findOne({ companyCode: company.companyCode });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company with this code already exists' });
      }
      
      // Check if admin email already exists
      const existingAdmin = await User.findOne({ email: admin.email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin email is already registered' });
      }
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP as string
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);

      let finalPasswordHash;
      
      const isAlreadyHashed = admin.password.startsWith('$2a$');
      
      console.log('Password check:', {
        email: admin.email,
        passwordLength: admin.password.length,
        isAlreadyHashed: isAlreadyHashed
      });
      
      // Only hash the password if it's not already hashed
      if (!isAlreadyHashed) {
        const salt = await bcrypt.genSalt(10);
        finalPasswordHash = await bcrypt.hash(admin.password, salt);
        console.log('Password hashed for new user:', {
          email: admin.email,
          originalLength: admin.password.length,
          hashedLength: finalPasswordHash.length
        });
      } else {
        console.log('Password already hashed, using as-is');
        finalPasswordHash = admin.password;
      }
      
      // Create admin user with provided name components
      const newAdmin = new User({
        firstName: admin.firstName,
        middleName: admin.middleName || '',
        lastName: admin.lastName,
        name: admin.name || `${admin.firstName} ${admin.lastName}`,
        email: admin.email.toLowerCase(),
        password: finalPasswordHash, // Use finalPasswordHash here
        role: 'admin',
        companyCode: company.companyCode.toUpperCase(),
        isActive: true,
        isVerified: false,
        otp,
        otpExpires
      });
      
      await newAdmin.save();
      console.log('Admin user created:', {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      });
      
      // Create new company but mark it as pending verification
      const newCompany = new Company({
        ...company,
        isActive: false, // Set company as inactive until verification
        adminUserId: newAdmin._id,
        pendingVerification: true // Add a flag to indicate pending verification
      });
      
      await newCompany.save();
      console.log('Company created with pending verification:', newCompany);
      
      try {
        const { getCompanyConnection } = await import('../config/db.js');
        await getCompanyConnection(company.companyCode);
        console.log(`Company database initialized for ${company.companyCode}`);
      } catch (dbError) {
        console.error('Error initializing company database:', dbError);
        // Continue with the response even if database initialization fails
      }


      // Send OTP email
      try {
        await sendOtpEmail(admin.email, otp, {
          name: newAdmin.name,
          companyName: company.name
        });
        console.log(`OTP sent to ${admin.email}: ${otp}`);
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        // Continue with the response even if email fails
      }
      
      res.status(201).json({
        success: true,
        message: 'Registration initiated. Please verify your email with the OTP sent to complete registration.',
        email: admin.email
      });
      


    } catch (error) {
      console.warn('Registration error:', error);
      return res.status(400).json({ message: error.message });
    }
  });
};

// Add a new controller function to verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('Received verification request:', { email, otp });
    
    if (!email || !otp) {
      console.log('Missing email or OTP in request:', req.body);
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    // Find user by email first
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    console.log('Found user:', { 
      id: user._id, 
      email: user.email, 
      storedOtp: user.otp,
      otpExpires: user.otpExpires,
      now: new Date(),
      isExpired: user.otpExpires < new Date(),
      passwordHash: user.password.substring(0, 10) + '...'
    });
    
    // Check if OTP matches
    if (user.otp !== otp) {
      console.log('OTP mismatch:', { provided: otp, stored: user.otp });
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Check if OTP is expired
    if (user.otpExpires < new Date()) {
      console.log('OTP expired:', { expires: user.otpExpires, now: new Date() });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }
    
    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();
    console.log('User verified successfully:', user.email);
    
    // Now activate the company if this is an admin user
    if (user.role === 'admin') {
      const company = await Company.findOne({ 
        companyCode: user.companyCode,
        adminUserId: user._id
      });
      
      if (company) {
        company.isActive = true;
        company.pendingVerification = false;
        await company.save();
        console.log('Company activated:', company.name);

        // Create admin user in company database
        try {
          const { getUserModel } = await import('../models/User.js');
          const CompanyUserModel = await getUserModel(user.companyCode);
          
          // Create a copy of the admin user in the company database
          const companyAdmin = new CompanyUserModel({
            userId: user.userId,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            name: user.name,
            email: user.email,
            password: user.password, // Already hashed
            role: user.role,
            companyCode: user.companyCode,
            permissions: user.permissions,
            isVerified: true,
            isActive: true
          });
          
          await companyAdmin.save();
          console.log('Admin user created in company database:', companyAdmin.email);
          
          // Also create a Company document in the company database
          const { companySchema } = await import('../models/Company.js');
          const createCompanyModel = (await import('../models/modelFactory.js')).default;
          const CompanyModel = await createCompanyModel(user.companyCode, 'Company', companySchema);
          
          const companyRecord = new CompanyModel({
            name: company.name,
            companyCode: company.companyCode,
            address: company.address,
            contactEmail: company.contactEmail,
            contactPhone: company.contactPhone,
            logo: company.logo,
            industry: company.industry,
            isActive: true,
            settings: company.settings,
            adminUserId: companyAdmin._id,
            registrationNumber: company.registrationNumber,
            pendingVerification: false
          });
          
          await companyRecord.save();
          console.log('Company record created in company database');
        } catch (dbError) {
          console.error('Error creating records in company database:', dbError);
          // Continue with the response even if this fails
        }


      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Your company registration is now complete.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyCode: user.companyCode
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      message: 'Server error during OTP verification',
      error: error.message 
    });
  }
};



// Get company details
export const getCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findOne({ companyCode: req.companyCode });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company details
export const updateCompanyDetails = async (req, res) => {
  try {
    const { name, address, contactEmail, contactPhone, industry, logo } = req.body;
    
    const company = await Company.findOne({ companyCode: req.companyCode });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Update fields
    if (name) company.name = name;
    if (address) company.address = address;
    if (contactEmail) company.contactEmail = contactEmail;
    if (contactPhone) company.contactPhone = contactPhone;
    if (industry) company.industry = industry;
    if (logo) company.logo = logo;
    
    await company.save();
    
    res.status(200).json({
      message: 'Company details updated successfully',
      company
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company settings
export const updateCompanySettings = async (req, res) => {
  try {
    const { leavePolicy, workingHours, workingDays } = req.body;
    
    const company = await Company.findOne({ companyCode: req.companyCode });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Update settings
    if (leavePolicy) company.settings.leavePolicy = leavePolicy;
    if (workingHours) company.settings.workingHours = workingHours;
    if (workingDays) company.settings.workingDays = workingDays;
    
    await company.save();
    
    res.status(200).json({
      message: 'Company settings updated successfully',
      settings: company.settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password - send reset link
export const forgotPassword = async (req, res) => {
  try {
    console.log('Received forgot password request:', req.body);
    const { email, companyCode } = req.body;
    
    console.log('Forgot password request:', { email, companyCode });
    
    if (!email || !companyCode) {
      return res.status(400).json({ message: 'Email and company code are required' });
    }
    
    // Find user by email and company code
    const user = await User.findOne({ email, companyCode });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email and company code' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to user
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}?email=${encodeURIComponent(email)}&companyCode=${encodeURIComponent(companyCode)}`;
    
    console.log('Reset URL generated:', resetUrl);
    
    // Create email message with enhanced professional design
const message = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
    }
    .email-container {
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }
    .logo {
      max-height: 60px;
      margin-bottom: 10px;
    }
    h1 {
      color: #2c3e50;
      margin-top: 0;
    }
    .content {
      padding: 0 15px;
    }
    .button {
      display: inline-block;
      background-color: #3498db;
      color: white !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #7f8c8d;
      text-align: center;
    }
    .security-note {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      font-size: 13px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <!-- <img src="https://yourcompany.com/logo.png" alt="Company Logo" class="logo"> -->
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password for your HRMS account. To complete the password reset process, please click on the button below:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button" clicktracking="off">Reset Password</a>
      </div>
      
      <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; font-size: 13px;"><a href="${resetUrl}">${resetUrl}</a></p>
      
      <div class="security-note">
        <strong>Important:</strong>
        <ul>
          <li>This link will expire in 1 hour for security reasons.</li>
          <li>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} HRMS. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

    
    try {
      // Setup email transporter
      const transporter = nodemailer.createTransport({
        service : 'gmail',
        // port: process.env.EMAIL_PORT,
        auth: {
          user: `a.dineshsundar02@gmail.com`,
          pass: `xnbj tvjf odej ynit`
        }
      });
      
      // Send email
      await transporter.sendMail({
        from: `"HRMS Support" <${'a.dineshsundar02@gmail.com'}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: message
      });
      
      console.log('Password reset email sent to:', user.email);
      
      res.status(200).json({ 
        success: true, 
        message: 'Password reset link sent to your email' 
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Update user to remove token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        message: 'Error sending email. Please try again later.',
        error: emailError.message 
      });
    }
  } catch (error) {
    console.error('Detailed forgot password error:', error);
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Server error during password reset request',
      error: error.message 
    });
  }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token, email, companyCode } = req.body;
    
    console.log('Token verification request:', { 
      token: token.substring(0, 10) + '...', 
      email, 
      companyCode 
    });
    
    if (!token || !email || !companyCode) {
      console.log('Missing required fields in token verification');
      return res.status(400).json({ message: 'Token, email, and company code are required' });
    }
    
    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    console.log('Looking for user with token:', { 
      email, 
      tokenHash: hashedToken.substring(0, 10) + '...' 
    });
    
    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      email,
      companyCode,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      console.log('Invalid or expired token for:', email);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    console.log('Token verified successfully for user:', user.email);
    
    res.status(200).json({ 
      success: true, 
      message: 'Token is valid' 
    });
    
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ 
      message: 'Error verifying reset token',
      error: error.message 
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, email, companyCode, password } = req.body;
    
    console.log('Password reset request received:', { 
      token: token.substring(0, 10) + '...', 
      email, 
      companyCode,
      passwordLength: password.length,
      passwordFirstChars: password.substring(0, 3)
    });

    console.log('DEBUG - Password reset with unhashed password:', {
      email,
      companyCode,
      rawPassword: password // This logs the actual password - SECURITY RISK!
    });
    
    if (!token || !email || !companyCode || !password) {
      console.log('Missing required fields in reset password request');
      return res.status(400).json({ 
        message: 'Token, email, company code, and new password are required' 
      });
    }
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character' 
      });
    }
    
    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with the token and check if token is still valid
    const user = await User.findOne({
      email,
      companyCode,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      console.log('Invalid or expired token for user:', email);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    console.log('Found user for password reset:', {
      id: user._id,
      email: user.email,
      companyCode: user.companyCode,
      currentPasswordHash: user.password.substring(0, 10) + '...'
    });
    
    // Check if new password is same as old password
    console.log('Checking if new password matches old password');
    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      console.log('New password is same as current password');
      return res.status(400).json({ 
        message: 'New password cannot be the same as your current password' 
      });
    }
    
    // Update password - this will trigger the pre-save middleware to hash it
    console.log('Setting new password (first 3 chars):', password.substring(0, 3));
    console.log('New password length:', password.length);
    user.password = password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    console.log('Password updated successfully for user:', user.email);
    console.log('New password hash:', user.password.substring(0, 10) + '...');
    
    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'a.dineshsundar02@gmail.com',
          pass: 'xnbj tvjf odej ynit'
        }
      });
      
      await transporter.sendMail({
        from: `"HRMS Support" <${'a.dineshsundar02@gmail.com'}>`,
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
          <h1>Password Reset Successful</h1>
          <p>Your password has been successfully reset.</p>
          <p>If you did not request this change, please contact support immediately.</p>
        `
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the response even if email fails
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Error resetting password',
      error: error.message 
    });
  }
};



// Change password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Error changing password',
      error: error.message 
    });
  }
};

// Add a new controller function to resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    
    await user.save();
    
    // Find company for this user
    const company = await Company.findOne({ companyCode: user.companyCode });
    
    // Send OTP email
    await sendOtpEmail(email, otp, {
      name: user.name,
      companyName: company ? company.name : 'HRMS'
    });
    
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      message: 'Server error during OTP resend',
      error: error.message 
    });
  }

};
