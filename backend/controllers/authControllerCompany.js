import jwt from 'jsonwebtoken';
import MainUser, { getUserModel } from '../models/User.js';
import Company from '../models/Company.js';
import crypto from 'crypto';
import { sendOtpEmail } from '../utils/mailer.js';
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
    
    // Check if company code already exists in the main database
    const existingCompany = await Company.findOne({ companyCode });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company code already in use' });
    }
    
    // Create new company in main database
    const company = new Company({
      name: companyName,
      companyCode,
      industry,
      contactEmail,
      contactPhone,
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      isActive: false, // Set as inactive until verification
      pendingVerification: true
    });
    
    // Handle logo if it was uploaded
    if (req.file) {
      company.logoUrl = `/uploads/company-logos/${req.file.filename}`;
    }
    
    // Save the company to the main database
    await company.save();
    console.log(`Company ${companyName} (${companyCode}) created in main database`);
    
    // Get a connection to the company-specific database
    const { getCompanyConnection } = await import('../config/db.js');
    const companyConn = await getCompanyConnection(companyCode);
    
    // Define the User model for this specific company
    const UserSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      name: String,
      email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true 
      },
      password: String,
      role: String,
      companyCode: String,
      isVerified: Boolean,
      isActive: Boolean,
      otp: String,
      otpExpires: Date,
      permissions: [String]
    });
    
    // Add method to assign permissions
    UserSchema.methods.assignPermissions = function() {
      if (this.role === 'admin') {
        this.permissions = ['all']; // Admin has all permissions
      }
    };
    
    // Create the User model for this company
    const CompanyUser = companyConn.model('User', UserSchema);
    
    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Check if admin email already exists in this company database
    const existingUser = await CompanyUser.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      // If company was created but user exists, we should delete the company
      await Company.findByIdAndDelete(company._id);
      return res.status(400).json({ message: 'Admin email already in use' });
    }
    
    // Create admin user for the company in company-specific database ONLY
    const adminUser = new CompanyUser({
      firstName: adminFirstName,
      lastName: adminLastName,
      name: `${adminFirstName} ${adminLastName}`,
      email: adminEmail.toLowerCase(), // Ensure email is lowercase for consistency
      password: adminPassword, // This will be hashed by the schema pre-save hook
      role: 'admin',
      companyCode,
      isVerified: false,
      isActive: true,
      otp,
      otpExpires
    });
    
    // Assign permissions based on role
    adminUser.assignPermissions();
    
    // Hash the password before saving
    const bcrypt = await import('bcrypt');
    adminUser.password = await bcrypt.hash(adminPassword, 10);
    
    // Save the admin user to the company-specific database
    await adminUser.save();
    console.log(`Admin user ${adminEmail} created in company database for ${companyCode}`);
    
    // Send OTP email
    try {
      const { sendOtpEmail } = await import('../services/emailService.js');
      await sendOtpEmail(adminEmail, otp, {
        name: adminUser.name,
        companyName: companyName
      });
      
      console.log('Verification OTP sent to:', adminEmail);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Continue with response even if email fails
    }
    
    res.status(201).json({ 
      message: 'Company registration initiated. Please verify your email with the OTP sent to complete registration.',
      email: adminEmail,
      companyCode
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// export const registerCompany = async (req, res) => {
//   try {
//     const { 
//       companyName, 
//       companyCode, 
//       industry, 
//       contactEmail,
//       contactPhone,
//       adminFirstName,
//       adminLastName,
//       adminEmail,
//       adminPassword
//     } = req.body;
    
//     // Check if company code already exists
//     const existingCompany = await Company.findOne({ companyCode });
//     if (existingCompany) {
//       return res.status(400).json({ message: 'Company code already in use' });
//     }
    
//     // Create new company in main database
//     const company = new Company({
//       name: companyName,
//       companyCode,
//       industry,
//       contactEmail,
//       contactPhone,
//       subscriptionStatus: 'trial',
//       trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
//       isActive: false, // Set as inactive until verification
//       pendingVerification: true
//     });
    
//     await company.save();
    
//     // Generate OTP for verification
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
//     // Create admin user for the company in main database
//     const adminUser = new MainUser({
//       firstName: adminFirstName,
//       lastName: adminLastName,
//       name: `${adminFirstName} ${adminLastName}`,
//       email: adminEmail,
//       password: adminPassword,
//       role: 'admin',
//       companyCode,
//       isVerified: false,
//       isActive: true,
//       otp,
//       otpExpires
//     });
    
//     // Assign permissions based on role
//     adminUser.assignPermissions();
    
//     await adminUser.save();
    
//     // Send OTP email
//     try {
//       await sendOtpEmail(adminEmail, otp, {
//         name: adminUser.name,
//         companyName: companyName
//       });
      
//       console.log('Verification OTP sent to:', adminEmail);
//     } catch (emailError) {
//       console.error('Error sending OTP email:', emailError);
//       // Continue with response even if email fails
//     }
    
//     res.status(201).json({ 
//       message: 'Company registration initiated. Please verify your email with the OTP sent to complete registration.',
//       email: adminEmail,
//       companyCode
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Login user



// export const login = async (req, res) => {
//   try {
//     const { email, password, companyCode } = req.body;
    
//     console.log('Login attempt received:', { 
//       email, 
//       companyCode,
//       passwordProvided: !!password,
//       passwordLength: password ? password.length : 0
//     });
    
//     // First check if company exists and is active in main database
//     const company = await Company.findOne({ 
//       companyCode: companyCode.toUpperCase(),
//       isActive: true
//     });
    
//     if (!company) {
//       console.log('Company not found or inactive:', companyCode);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Invalid company code or company is inactive' 
//       });
//     }
    
//     // Try to find user in company-specific database first
//     let user = null;
//     let isCompanyUser = false;
    
//     try {
//       // Get company-specific User model
//       const CompanyUserModel = await getUserModel(companyCode);
      
//       // Find user in company database
//       user = await CompanyUserModel.findOne({ 
//         email: email.toLowerCase()
//       });
      
//       if (user) {
//         isCompanyUser = true;
//         console.log('User found in company database:', {
//           id: user._id,
//           email: user.email,
//           companyCode: user.companyCode,
//           isVerified: user.isVerified,
//           isActive: user.isActive
//         });
//       }
//     } catch (dbError) {
//       console.error('Error accessing company database:', dbError);
//       // Continue to check main database
//     }
    
//     // If user not found in company database, check main database
//     if (!user) {
//       user = await MainUser.findOne({ 
//         email: email.toLowerCase(), 
//         companyCode: companyCode.toUpperCase() 
//       });
      
//       console.log('User found in main database:', user ? {
//         id: user._id,
//         email: user.email,
//         companyCode: user.companyCode,
//         isVerified: user.isVerified,
//         isActive: user.isActive
//       } : 'No user found');
      
//       if (!user) {
//         return res.status(401).json({ 
//           success: false,
//           message: 'Invalid email or company code' 
//         });
//       }
      
//       // If user exists in main DB but not verified, handle OTP
//       if (!user.isVerified) {
//         console.log('User status check failed:', {
//           isVerified: user.isVerified,
//           isActive: user.isActive
//         });
        
//         // Generate new OTP for unverified users
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
//         user.otp = otp;
//         user.otpExpires = otpExpires;
//         await user.save();
        
//         // Send OTP email
//         try {
//           await sendOtpEmail(email, otp, {
//             name: user.name,
//             companyName: company.name
//           });
          
//           console.log('Verification OTP sent to:', email);
//         } catch (emailError) {
//           console.error('Error sending OTP email:', emailError);
//           // Continue with response even if email fails
//         }
        
//         return res.status(403).json({ 
//           success: false,
//           message: 'Email not verified. A verification code has been sent to your email.',
//           requiresVerification: true,
//           email: user.email
//         });
//       }
      
//       // If user is verified in main DB but not in company DB, they need to be added to company DB
//       if (user.isVerified && !isCompanyUser) {
//         try {
//           // Get company-specific User model
//           const CompanyUserModel = await getUserModel(companyCode);
          
//           // Create user in company database
//           const companyUser = new CompanyUserModel({
//             userId: user.userId,
//             firstName: user.firstName,
//             middleName: user.middleName,
//             lastName: user.lastName,
//             name: user.name,
//             email: user.email,
//             password: user.password, // Already hashed
//             role: user.role,
//             companyCode: user.companyCode,
//             permissions: user.permissions,
//             isVerified: true,
//             isActive: user.isActive
//           });
          
//           await companyUser.save();
//           console.log('User created in company database:', companyUser.email);
          
//           // Use the company user for the rest of the login process
//           user = companyUser;
//           isCompanyUser = true;
//         } catch (dbError) {
//           console.error('Error creating user in company database:', dbError);
//           // Continue with main user if company user creation fails
//         }
//       }
//     }
    
//     // Check if user is active
//     if (!user.isActive) {
//       console.log('User inactive:', user.email);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Your account is inactive. Please contact your administrator.' 
//       });
//     }
    
//     // Verify password
//     console.log('Password verification attempt:', {
//       userEmail: user.email,
//       passwordProvided: !!password,
//       passwordLength: password ? password.length : 0
//     });
    
//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await user.comparePassword(password);
//       console.log('Password validation result:', isPasswordValid);
//     } catch (pwError) {
//       console.error('Error using comparePassword method:', pwError);
      
//       // Fallback to direct bcrypt compare if method fails
//       try {
//         isPasswordValid = await bcrypt.compare(password, user.password);
//         console.log('Direct bcrypt compare result:', isPasswordValid);
//       } catch (bcryptError) {
//         console.error('Error using direct bcrypt compare:', bcryptError);
//       }
//     }
    
//     // Check if password is valid before proceeding
//     if (!isPasswordValid) {
//       console.log('Invalid password for user:', user.email);
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { 
//         userId: user._id, 
//         companyCode: user.companyCode, 
//         role: user.role,
//         isCompanyUser // Include flag to indicate if user is from company database
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
    
//     console.log('Login successful for user:', user.email);
    
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

// // Login user
// export const login = async (req, res) => {
//   try {
//     const { email, password, companyCode } = req.body;
    
//     console.log('Login attempt received:', { 
//       email, 
//       companyCode,
//       passwordProvided: !!password
//     });
    
//     // First check if company exists and is active in main database
//     const company = await Company.findOne({ 
//       companyCode: companyCode.toUpperCase(),
//       isActive: true
//     });
    
//     if (!company) {
//       console.log('Company not found or inactive:', companyCode);
//       return res.status(401).json({ 
//         success: false,
//         message: 'Invalid company code or company is inactive' 
//       });
//     }
    
//     // Try to find user in company-specific database first
//     let user = null;
//     let isCompanyUser = false;
    
//     try {
//       // Get company-specific User model
//       const CompanyUserModel = await getUserModel(companyCode);
      
//       // Find user in company database
//       user = await CompanyUserModel.findOne({ 
//         email: email.toLowerCase()
//       });
      
//       if (user) {
//         isCompanyUser = true;
//         console.log('User found in company database:', {
//           id: user._id,
//           email: user.email,
//           companyCode: user.companyCode
//         });
//       }
//     } catch (dbError) {
//       console.error('Error accessing company database:', dbError);
//       // Continue to check main database
//     }
    
//     // If user not found in company database, check main database
//     if (!user) {
//       user = await MainUser.findOne({ 
//         email: email.toLowerCase(), 
//         companyCode: companyCode.toUpperCase() 
//       });
      
//       if (!user) {
//         return res.status(401).json({ 
//           success: false,
//           message: 'Invalid email or company code' 
//         });
//       }
      
//       // If user exists in main DB but not verified, handle OTP
//       if (!user.isVerified) {
//         // Generate new OTP for unverified users
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
//         user.otp = otp;
//         user.otpExpires = otpExpires;
//         await user.save();
        
//         // Send OTP email
//         try {
//           await sendOtpEmail(email, otp, {
//             name: user.name,
//             companyName: company.name
//           });
//         } catch (emailError) {
//           console.error('Error sending OTP email:', emailError);
//         }
        
//         return res.status(403).json({ 
//           success: false,
//           message: 'Email not verified. A verification code has been sent to your email.',
//           requiresVerification: true,
//           email: user.email
//         });
//       }
      
//       // If user is verified in main DB but not in company DB, create in company DB
//       if (user.isVerified) {
//         try {
//           // Get company-specific User model
//           const CompanyUserModel = await getUserModel(companyCode);
          
//           // Create user in company database
//           const companyUser = new CompanyUserModel({
//             userId: user.userId,
//             firstName: user.firstName,
//             middleName: user.middleName,
//             lastName: user.lastName,
//             name: user.name,
//             email: user.email,
//             password: user.password, // Already hashed
//             role: user.role,
//             companyCode: user.companyCode,
//             permissions: user.permissions,
//             isVerified: true,
//             isActive: user.isActive
//           });
          
//           await companyUser.save();
//           console.log('User created in company database:', companyUser.email);
          
//           // Use the company user for the rest of the login process
//           user = companyUser;
//           isCompanyUser = true;
//         } catch (dbError) {
//           console.error('Error creating user in company database:', dbError);
//           // Continue with main user if company user creation fails
//         }
//       }
//     }
    
//     // Check if user is active
//     if (!user.isActive) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Your account is inactive. Please contact your administrator.' 
//       });
//     }
    
//     // Verify password
//     let isPasswordValid = false;
    
//     try {
//       if (typeof user.comparePassword === 'function') {
//         isPasswordValid = await user.comparePassword(password);
//       } else {
//         // Fallback to direct bcrypt compare
//         isPasswordValid = await bcrypt.compare(password, user.password);
//       }
//     } catch (pwError) {
//       console.error('Password comparison error:', pwError);
//       // Try direct bcrypt compare as fallback
//       try {
//         isPasswordValid = await bcrypt.compare(password, user.password);
//       } catch (bcryptError) {
//         console.error('Bcrypt error:', bcryptError);
//       }
//     }
    
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { 
//         userId: user._id, 
//         companyCode: user.companyCode, 
//         role: user.role,
//         isCompanyUser // Include flag to indicate if user is from company database
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
    
//     console.log('Login successful for user:', user.email);
    
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

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;
    
    console.log('Login attempt received:', { 
      email, 
      companyCode,
      passwordProvided: !!password
    });
    
    // First check if company exists and is active in main database
    const company = await Company.findOne({ 
      companyCode: companyCode.toUpperCase(),
      isActive: true
    });
    
    if (!company) {
      console.log('Company not found or inactive:', companyCode);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid company code or company is inactive' 
      });
    }
    
    // Try to find user in company-specific database first
    let user = null;
    let isCompanyUser = false;
    
    try {
      // Get company-specific User model
      const { getUserModel } = await import('../models/User.js');
      const CompanyUserModel = await getUserModel(companyCode);
      
      // Find user in company database
      user = await CompanyUserModel.findOne({ 
        email: email.toLowerCase()
      });
      
      if (user) {
        isCompanyUser = true;
        console.log('User found in company database:', {
          id: user._id,
          email: user.email,
          companyCode: user.companyCode
        });
        
        // Verify password directly with bcrypt
        console.log('Comparing password for user:', user.email);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isPasswordValid);
        
        if (!isPasswordValid) {
          // For debugging, log password details
          console.log('Password comparison failed:', {
            providedPasswordLength: password.length,
            storedPasswordLength: user.password.length,
            storedPasswordPrefix: user.password.substring(0, 10) + '...'
          });
          
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: user._id, 
            companyCode: user.companyCode, 
            role: user.role,
            isCompanyUser: true
          },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '24h' }
        );
        
        console.log('Login successful for company user:', user.email);
        
        return res.status(200).json({
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
      }
    } catch (dbError) {
      console.error('Error accessing company database:', dbError);
      // Continue to check main database
    }
    
    // If user not found in company database, check main database
    user = await MainUser.findOne({ 
      email: email.toLowerCase(), 
      companyCode: companyCode.toUpperCase() 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP for unverified users
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      
      // Send OTP email
      try {
        await sendOtpEmail(email, otp, {
          name: user.name,
          companyName: company.name
        });
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
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
      return res.status(401).json({ 
        success: false,
        message: 'Your account is inactive. Please contact your administrator.' 
      });
    }
    
    // Verify password for main database user
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password match result for main user:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // If user is verified in main DB but not in company DB, create in company DB
    try {
      // Get company-specific User model
      const CompanyUserModel = await getUserModel(companyCode);
      
      // Create user in company database
      const companyUser = new CompanyUserModel({
        userId: user.userId || `USER-${Date.now()}`,
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
      
      await companyUser.save();
      console.log('User created in company database:', companyUser.email);
      
      // Use the company user for the rest of the login process
      user = companyUser;
      isCompanyUser = true;
    } catch (dbError) {
      console.error('Error creating user in company database:', dbError);
      // Continue with main user if company user creation fails
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        companyCode: user.companyCode, 
        role: user.role,
        isCompanyUser
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
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



// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('Received verification request:', { email, otp });
    
    // Find user in main database
    const user = await MainUser.findOne({ email });
    
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
    
    // Activate company if this is an admin user
    if (user.role === 'admin') {
      const company = await Company.findOne({ companyCode: user.companyCode });
      if (company) {
        company.isActive = true;
        company.pendingVerification = false;
        await company.save();
        console.log('Company activated:', company.name);
        
        // Create admin user in company database
        try {
          // Get company-specific User model
          const CompanyUserModel = await getUserModel(user.companyCode);
          
          // Create user in company database
          const companyUser = new CompanyUserModel({
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
          
          await companyUser.save();
          console.log('Admin user created in company database:', companyUser.email);
          
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
            adminUserId: companyUser._id,
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
    
    // Get company-specific User model
    const CompanyUserModel = await getUserModel(companyCode);
    
        // Check if user with email already exists in company database
        const existingUser = await CompanyUserModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // Also check main database to avoid conflicts
        const existingMainUser = await MainUser.findOne({ email, companyCode });
        if (existingMainUser) {
          return res.status(400).json({ message: 'User with this email already exists in main database' });
        }
        
        // Generate temporary password
        const tempPassword = crypto.randomBytes(8).toString('hex');
        
        // Create new user in company database
        const user = new CompanyUserModel({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          password: tempPassword,
          role,
          companyCode,
          isVerified: true,
          isActive: true
        });
        
        // Assign permissions based on role
        user.assignPermissions();
        
        await user.save();
        
        // Send invitation email with temporary password
        try {
          // Get company details
          const company = await Company.findOne({ companyCode });
          
          // Create email message
          const message = `
            <h1>Welcome to ${company ? company.name : 'our HRMS system'}</h1>
            <p>Hello ${firstName} ${lastName},</p>
            <p>An account has been created for you with the following details:</p>
            <ul>
              <li>Email: ${email}</li>
              <li>Temporary Password: ${tempPassword}</li>
              <li>Company Code: ${companyCode}</li>
            </ul>
            <p>Please login using these credentials and change your password immediately.</p>
            <p>Login URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</p>
          `;
          
          // Setup email transporter
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'a.dineshsundar02@gmail.com',
              pass: 'xnbj tvjf odej ynit'
            }
          });
          
          // Send email
          await transporter.sendMail({
            from: `"HRMS Support" <${'a.dineshsundar02@gmail.com'}>`,
            to: email,
            subject: 'Your HRMS Account',
            html: message
          });
          
          console.log(`Invitation email sent to ${email} with password: ${tempPassword}`);
        } catch (emailError) {
          console.error('Error sending invitation email:', emailError);
          // Continue with the response even if email fails
        }
        
        res.status(201).json({ 
          message: 'User created successfully',
          userId: user.userId
        });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
      }
    };
    
    // Resend OTP
    export const resendOtp = async (req, res) => {
      try {
        const { email, companyCode } = req.body;
        
        if (!email) {
          return res.status(400).json({ message: 'Email is required' });
        }
        
        // Find user in main database
        const user = await MainUser.findOne({ 
          email,
          companyCode: companyCode ? companyCode.toUpperCase() : undefined
        });
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.isVerified) {
          return res.status(400).json({ message: 'Email is already verified' });
        }
        
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Update user with new OTP
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
          
          console.log(`OTP resent to ${email}: ${otp}`);
        } catch (emailError) {
          console.error('Error sending OTP email:', emailError);
          return res.status(500).json({ 
            message: 'Error sending OTP email. Please try again later.',
            error: emailError.message 
          });
        }
        
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
    
    // Forgot password
    export const forgotPassword = async (req, res) => {
      try {
        const { email, companyCode } = req.body;
        
        if (!email || !companyCode) {
          return res.status(400).json({ message: 'Email and company code are required' });
        }
        
        // Try to find user in company database first
        let user = null;
        let isCompanyUser = false;
        
        try {
          // Get company-specific User model
          const CompanyUserModel = await getUserModel(companyCode);
          
          // Find user in company database
          user = await CompanyUserModel.findOne({ email: email.toLowerCase() });
          
          if (user) {
            isCompanyUser = true;
            console.log('User found in company database for password reset:', user.email);
          }
        } catch (dbError) {
          console.error('Error accessing company database:', dbError);
          // Continue to check main database
        }
        
        // If not found in company database, check main database
        if (!user) {
          user = await MainUser.findOne({ 
            email: email.toLowerCase(), 
            companyCode: companyCode.toUpperCase() 
          });
          
          if (!user) {
            return res.status(404).json({ message: 'User not found with this email and company code' });
          }
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token
        const hashedToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');
        
        // Set token expiry (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();
        
        // If user is in company database, also update main database record
        if (isCompanyUser) {
          const mainUser = await MainUser.findOne({ 
            email: email.toLowerCase(), 
            companyCode: companyCode.toUpperCase() 
          });
          
          if (mainUser) {
            mainUser.resetPasswordToken = hashedToken;
            mainUser.resetPasswordExpires = user.resetPasswordExpires;
            await mainUser.save();
          }
        }
        
        // Create reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}?email=${encodeURIComponent(email)}&companyCode=${encodeURIComponent(companyCode)}`;
        
        // Send password reset email
        try {
          // Setup email transporter
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'a.dineshsundar02@gmail.com',
              pass: 'xnbj tvjf odej ynit'
            }
          });
          
          // Create email message
          const message = `
            <h1>Password Reset Request</h1>
            <p>Hello ${user.name},</p>
            <p>You requested a password reset for your HRMS account. Click the link below to reset your password:</p>
            <p><a href="${resetUrl}">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `;
          
          // Send email
          await transporter.sendMail({
            from: `"HRMS Support" <${'a.dineshsundar02@gmail.com'}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: message
          });
          
          console.log('Password reset email sent to:', user.email);
        } catch (emailError) {
          console.error('Error sending password reset email:', emailError);
          
          // Update user to remove token since email failed
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();
          
          return res.status(500).json({ 
            message: 'Error sending email. Please try again later.',
            error: emailError.message 
          });
        }
        
        res.status(200).json({ 
          success: true, 
          message: 'Password reset link sent to your email' 
        });
      } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
          message: 'Server error during password reset request',
          error: error.message 
        });
      }
    };
    
    // Reset password
    export const resetPassword = async (req, res) => {
      try {
        const { token, email, companyCode, password } = req.body;
        
        if (!token || !email || !companyCode || !password) {
          return res.status(400).json({ 
            message: 'Token, email, company code, and new password are required' 
          });
        }
        
        // Hash the token from the URL
        const hashedToken = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
        
        // Try to find user in company database first
        let user = null;
        let isCompanyUser = false;
        
        try {
          // Get company-specific User model
          const CompanyUserModel = await getUserModel(companyCode);
          
          // Find user in company database
          user = await CompanyUserModel.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
          });
          
          if (user) {
            isCompanyUser = true;
            console.log('User found in company database for password reset:', user.email);
          }
        } catch (dbError) {
          console.error('Error accessing company database:', dbError);
          // Continue to check main database
        }
        
        // If not found in company database, check main database
        if (!user) {
          user = await MainUser.findOne({
            email: email.toLowerCase(),
            companyCode: companyCode.toUpperCase(),
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
          });
          
          if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
          }
        }
        
        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        
        // If user is in company database, also update main database record
        if (isCompanyUser) {
          const mainUser = await MainUser.findOne({ 
            email: email.toLowerCase(), 
            companyCode: companyCode.toUpperCase() 
          });
          
          if (mainUser) {
            mainUser.password = user.password; // Use the already hashed password
            mainUser.resetPasswordToken = undefined;
            mainUser.resetPasswordExpires = undefined;
            await mainUser.save();
          }
        }
        // If user is in main database, also update company database record
        else {
          try {
            // Get company-specific User model
            const CompanyUserModel = await getUserModel(companyCode);
            
            // Find user in company database
            const companyUser = await CompanyUserModel.findOne({
              email: email.toLowerCase()
            });
            
            if (companyUser) {
              companyUser.password = user.password; // Use the already hashed password
              companyUser.resetPasswordToken = undefined;
              companyUser.resetPasswordExpires = undefined;
              await companyUser.save();
            }
          } catch (dbError) {
            console.error('Error updating company user password:', dbError);
            // Continue with the response even if this fails
          }
        }
        
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
    
