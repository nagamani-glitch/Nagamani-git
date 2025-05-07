// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     unique: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   middleName: {
//     type: String,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'hr', 'manager', 'employee'],
//     default: 'employee'
//   },
//   companyCode: {
//     type: String,
//     required: true,
//     index: true
//   },
//   permissions: [{
//     type: String,
//     enum: [
//       'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
//       'view_payroll', 'manage_payroll',
//       'view_leave', 'approve_leave', 'manage_leave_policy',
//       'view_attendance', 'manage_attendance',
//       'view_reports', 'create_reports',
//       'manage_company_settings'
//     ]
//   }],
//   otp: String,
//   otpExpires: Date,
//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   resetPasswordToken: { 
//     type: String 
//   },
//   resetPasswordExpires: { 
//     type: Date 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Existing pre-save middleware for userId generation
// userSchema.pre('save', async function(next) {
//   // Only generate userId if it's a new user AND userId is not already set
//   if (this.isNew && !this.userId) {
//     // Extract domain from email
//     const emailParts = this.email.split('@');
//     const domain = emailParts[1].split('.')[0];
    
//     // Generate base for userId using first letter of first name, first letter of last name, and domain
//     const baseId = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}-${domain}`.toUpperCase();
    
//     // Find the count of existing users with similar userId pattern and same company code
//     const count = await mongoose.models.User.countDocuments({
//       userId: new RegExp(`^${baseId}`),
//       companyCode: this.companyCode
//     });
    
//     // Create userId with sequential number
//     this.userId = `${baseId}-${(count + 1).toString().padStart(4, '0')}`;
//   }
//   next();
// });

// // Hash password before saving
// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     console.log('DEBUG - About to hash password for user:', {
//       email: this.email,
//       companyCode: this.companyCode,
//       rawPassword: this.password // This logs the actual password - SECURITY RISK!
//     });
//     console.log(`Hashing password for user: ${this.email} (${this.companyCode})`);
//     console.log(`Original password length: ${this.password.length}`);
//     this.password = await bcrypt.hash(this.password, 10);
//     console.log(`Hashed password length: ${this.password.length}`);
//     console.log(`Hashed password: ${this.password.substring(0, 10)}...`);
//   }
//   next();
// });

// // Method to check password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     console.log('Comparing password for user:', this.email);
//     console.log('Candidate password length:', candidatePassword.length);
//     console.log('Stored password hash length:', this.password.length);
    
//     // Check if candidate password is already hashed (shouldn't happen in normal login)
//     if (candidatePassword.startsWith('$2a$')) {
//       console.warn('Warning: Candidate password appears to be already hashed!');
//     }
    
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     console.log('Password match result:', isMatch);
//     return isMatch;
//   } catch (error) {
//     console.error('Error comparing passwords:', error);
//     return false;
//   }
// };


// // Method to assign permissions based on role
// userSchema.methods.assignPermissions = function() {
//   switch(this.role) {
//     case 'admin':
//       this.permissions = [
//         'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
//         'view_payroll', 'manage_payroll',
//         'view_leave', 'approve_leave', 'manage_leave_policy',
//         'view_attendance', 'manage_attendance',
//         'view_reports', 'create_reports',
//         'manage_company_settings'
//       ];
//       break;
//     case 'hr':
//       this.permissions = [
//         'view_employees', 'edit_employees', 'create_employees',
//         'view_payroll', 'manage_payroll',
//         'view_leave', 'approve_leave', 'manage_leave_policy',
//         'view_attendance', 'manage_attendance',
//         'view_reports', 'create_reports'
//       ];
//       break;
//     case 'manager':
//       this.permissions = [
//         'view_employees',
//         'view_leave', 'approve_leave',
//         'view_attendance',
//         'view_reports'
//       ];
//       break;
//     case 'employee':
//       this.permissions = [
//         'view_leave'
//       ];
//       break;
//   }
// };

// const User = mongoose.model('User', userSchema);

// export default User;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import createCompanyModel from './modelFactory.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'manager', 'employee'],
    default: 'employee'
  },
  companyCode: {
    type: String,
    required: true,
    index: true
  },
  permissions: [{
    type: String,
    enum: [
      'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
      'view_payroll', 'manage_payroll',
      'view_leave', 'approve_leave', 'manage_leave_policy',
      'view_attendance', 'manage_attendance',
      'view_reports', 'create_reports',
      'manage_company_settings'
    ]
  }],
  otp: String,
  otpExpires: Date,
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Existing pre-save middleware for userId generation
userSchema.pre('save', async function(next) {
  // Only generate userId if it's a new user AND userId is not already set
  if (this.isNew && !this.userId) {
    // Extract domain from email
    const emailParts = this.email.split('@');
    const domain = emailParts[1].split('.')[0];
    
    // Generate base for userId using first letter of first name, first letter of last name, and domain
    const baseId = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}-${domain}`.toUpperCase();
    
    // Find the count of existing users with similar userId pattern and same company code
    const UserModel = await getUserModel(this.companyCode);
    const count = await UserModel.countDocuments({
      userId: new RegExp(`^${baseId}`),
      companyCode: this.companyCode
    });
    
    // Create userId with sequential number
    this.userId = `${baseId}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    console.log('DEBUG - About to hash password for user:', {
      email: this.email,
      companyCode: this.companyCode,
      rawPassword: this.password.substring(0, 3) + '...' // Log only first 3 chars for security
    });
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`Hashed password length: ${this.password.length}`);
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password for user:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Method to assign permissions based on role
userSchema.methods.assignPermissions = function() {
  switch(this.role) {
    case 'admin':
      this.permissions = [
        'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
        'view_payroll', 'manage_payroll',
        'view_leave', 'approve_leave', 'manage_leave_policy',
        'view_attendance', 'manage_attendance',
        'view_reports', 'create_reports',
        'manage_company_settings'
      ];
      break;
    case 'hr':
      this.permissions = [
        'view_employees', 'edit_employees', 'create_employees',
        'view_payroll', 'manage_payroll',
        'view_leave', 'approve_leave', 'manage_leave_policy',
        'view_attendance', 'manage_attendance',
        'view_reports', 'create_reports'
      ];
      break;
    case 'manager':
      this.permissions = [
        'view_employees',
        'view_leave', 'approve_leave',
        'view_attendance',
        'view_reports'
      ];
      break;
    case 'employee':
      this.permissions = [
        'view_leave'
      ];
      break;
  }
};

// This model will be in the main database for global user authentication
const MainUser = mongoose.model('User', userSchema);

// Function to get User model for a specific company
const getUserModel = async (companyCode) => {
  return await createCompanyModel(companyCode, 'User', userSchema);
};

export { userSchema, getUserModel };
export default MainUser;

