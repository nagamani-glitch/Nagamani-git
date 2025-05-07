import jwt from 'jsonwebtoken';
import  User  from '../models/User.js';
import Company from '../models/Company.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// Register a new company and admin user
export const registerCompany = async (req, res) => {
  try {
    const { 
      companyName, 
      companyCode, 
      industry, 
      contactEmail,
      contactPhone,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPassword
    } = req.body;
    
    // Check if company code already exists
    const existingCompany = await Company.findOne({ companyCode });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company code already in use' });
    }
    
    // Create new company
    const company = new Company({
      name: companyName,
      companyCode,
      industry,
      contactEmail,
      contactPhone,
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    });
    
    await company.save();
    
    // Create admin user for the company
    const adminUser = new User({
      firstName: adminFirstName,
      lastName: adminLastName,
      name: `${adminFirstName} ${adminLastName}`,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      companyCode,
      isVerified: true,
      isActive: true
    });
    
    // Assign permissions based on role
    adminUser.assignPermissions();
    
    await adminUser.save();
    
    res.status(201).json({ 
      message: 'Company and admin user created successfully',
      companyCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;
    
    console.log('Login attempt received:', { 
      email, 
      companyCode,
      passwordProvided: !!password,
      passwordLength: password ? password.length : 0
    });
    
    // Find user by email and company code
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      companyCode: companyCode.toUpperCase() 
    });
    
    console.log('User found:', user ? {
      id: user._id,
      email: user.email,
      companyCode: user.companyCode,
      isVerified: user.isVerified,
      isActive: user.isActive,
      passwordHashPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
    } : 'No user found');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or company code' 
      });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      console.log('User status check failed:', {
        isVerified: user.isVerified,
        isActive: user.isActive
      });
      
      // Generate new OTP for unverified users
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      
      // Find company for this user
      const company = await Company.findOne({ companyCode: user.companyCode });
      
      // Send OTP email
      try {
        await sendOtpEmail(email, otp, {
          name: user.name,
          companyName: company ? company.name : 'HRMS'
        });
        
        console.log('Verification OTP sent to:', email);
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        // Continue with response even if email fails
      }
      
      return res.status(403).json({ 
        success: false,
        message: 'Email not verified. A verification code has been sent to your email.',
        requiresVerification: true,
        email: user.email
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      console.log('User inactive:', user.email);
      return res.status(401).json({ 
        success: false,
        message: 'Your account is inactive. Please contact your administrator.' 
      });
    }
    
    // Check if company exists and is active
    const company = await Company.findOne({ companyCode: user.companyCode });
    if (!company) {
      console.log('Company not found:', user.companyCode);
      return res.status(401).json({ 
        success: false,
        message: 'Company not found' 
      });
    }
    
    if (!company.isActive) {
      console.log('Company inactive:', company.companyCode);
      return res.status(401).json({ 
        success: false,
        message: 'Company account is inactive' 
      });
    }
    
    // Verify password - log detailed information
    console.log('Password verification attempt:', {
      userEmail: user.email,
      passwordProvided: !!password,
      passwordLength: password ? password.length : 0,
      storedPasswordHashPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
    });
    
    // Try both the comparePassword method and direct bcrypt compare
    let isPasswordValid = false;
    try {
      isPasswordValid = await user.comparePassword(password);
      console.log('Password validation using user.comparePassword:', isPasswordValid);
    } catch (pwError) {
      console.error('Error using comparePassword method:', pwError);
    }
    
    // THIS IS THE FIX: Check if password is valid before proceeding
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, companyCode: user.companyCode, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Login successful for user:', user.email);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        companyCode: user.companyCode
      }
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// // Login user
// export const login = async (req, res) => {
//   try {
//     const { email, password, companyCode } = req.body;
    
//     console.log('Login attempt received:', { 
//       email, 
//       companyCode,
//       passwordProvided: !!password,
//       passwordLength: password ? password.length : 0
//     });
    
//     // Find user by email and company code
//     const user = await User.findOne({ 
//       email: email.toLowerCase(), 
//       companyCode: companyCode.toUpperCase() 
//     });
    
//     console.log('User found:', user ? {
//       id: user._id,
//       email: user.email,
//       companyCode: user.companyCode,
//       isVerified: user.isVerified,
//       isActive: user.isActive,
//       passwordHashPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
//     } : 'No user found');
    
//     if (!user) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Invalid email or company code' 
//       });
//     }
    
//     // Check if user is verified
//     if (!user.isVerified) {
//       console.log('User status check failed:', {
//         isVerified: user.isVerified,
//         isActive: user.isActive
//       });
      
//       // Generate new OTP for unverified users
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
//       user.otp = otp;
//       user.otpExpires = otpExpires;
//       await user.save();
      
//       // Find company for this user
//       const company = await Company.findOne({ companyCode: user.companyCode });
      
//       // Send OTP email
//       try {
//         await sendOtpEmail(email, otp, {
//           name: user.name,
//           companyName: company ? company.name : 'HRMS'
//         });
        
//         console.log('Verification OTP sent to:', email);
//       } catch (emailError) {
//         console.error('Error sending OTP email:', emailError);
//         // Continue with response even if email fails
//       }
      
//       return res.status(403).json({ 
//         success: false,
//         message: 'Email not verified. A verification code has been sent to your email.',
//         requiresVerification: true,
//         email: user.email
//       });
//     }
    
//     // Check if user is active
//     if (!user.isActive) {
//       console.log('User inactive:', user.email);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Your account is inactive. Please contact your administrator.' 
//       });
//     }
    
//     // Check if company exists and is active
//     const company = await Company.findOne({ companyCode: user.companyCode });
//     if (!company) {
//       console.log('Company not found:', user.companyCode);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Company not found' 
//       });
//     }
    
//     if (!company.isActive) {
//       console.log('Company inactive:', company.companyCode);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Company account is inactive' 
//       });
//     }
    
//     // Verify password - log detailed information
//     console.log('Password verification attempt:', {
//       userEmail: user.email,
//       passwordProvided: !!password,
//       passwordLength: password ? password.length : 0,
//       storedPasswordHashPrefix: user.password ? user.password.substring(0, 10) + '...' : 'none'
//     });
    
//     // Try both the comparePassword method and direct bcrypt compare
//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await user.comparePassword(password);
//       console.log('Password validation using user.comparePassword:', isPasswordValid);
//     } catch (pwError) {
//       console.error('Error using comparePassword method:', pwError);
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, companyCode: user.companyCode, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
    
//     console.log('Login successful for user:', user.email);

//     // Add this to your login function for debugging
// console.log('Direct bcrypt compare test:');
// const directCompare = await bcrypt.compare(password, user.password);
// console.log('Direct bcrypt compare result:', directCompare);

    
//     res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         userId: user.userId,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         permissions: user.permissions,
//         companyCode: user.companyCode
//       }
//     });
//   } catch (error) {
//     console.error('Login error details:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error during login',
//       error: error.message 
//     });
//   }
// };

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('Received verification request:', { email, otp });
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const now = new Date();
    console.log('Found user:', {
      id: user._id,
      email: user.email,
      storedOtp: user.otp,
      otpExpires: user.otpExpires,
      now,
      isExpired: now > user.otpExpires
    });
    
    if (now > user.otpExpires) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP has expired' 
      });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }
    
    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    console.log('User verified successfully:', user.email);
    
    res.status(200).json({ 
      success: true,
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};



// Create a new user (by admin or HR)
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, companyCode } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email, companyCode });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    
    // Create new user
    const user = new User({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: tempPassword,
      role,
      companyCode,
      isVerified: false
    });
    
    // Assign permissions based on role
    user.assignPermissions();
    
    await user.save();
    
    // Send invitation email with temporary password
    // This is a placeholder - implement actual email sending logic
    console.log(`Invitation email sent to ${email} with password: ${tempPassword}`);
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: user.userId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
