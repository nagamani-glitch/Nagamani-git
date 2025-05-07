// //for company auth middleware
// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // export const authenticate = async (req, res, next) => {
// //   try {
// //     const token = req.header('Authorization')?.replace('Bearer ', '');
    
// //     if (!token) {
// //       return res.status(401).json({ message: 'Authentication required' });
// //     }
    
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await User.findById(decoded.userId);
    
// //     if (!user || !user.isActive) {
// //       return res.status(401).json({ message: 'User not found or inactive' });
// //     }
    
// //     req.user = user;
// //     req.companyCode = user.companyCode;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: 'Invalid token' });
// //   }
// // };

// // export const authorize = (requiredPermissions) => {
// //   return (req, res, next) => {
// //     if (!req.user) {
// //       return res.status(401).json({ message: 'Authentication required' });
// //     }
    
// //     // Check if user has all required permissions
// //     const hasPermission = Array.isArray(requiredPermissions)
// //       ? requiredPermissions.every(permission => req.user.permissions.includes(permission))
// //       : req.user.permissions.includes(requiredPermissions);
    
// //     if (!hasPermission) {
// //       return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
// //     }
    
// //     next();
// //   };
// // };

// // export const companyFilter = (req, res, next) => {
// //   // Add company filter to all queries
// //   if (req.companyCode && req.query) {
// //     req.companyFilter = { companyCode: req.companyCode };
// //   }
// //   next();
// // };

// import jwt from 'jsonwebtoken';
// import { getUserModel } from '../models/User.js';

// // export const authenticate = async (req, res, next) => {
// //   try {
// //     const token = req.header('Authorization')?.replace('Bearer ', '');
    
// //     if (!token) {
// //       return res.status(401).json({ message: 'Authentication required' });
// //     }
    
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // Get user model for this company
// //     const UserModel = await getUserModel(decoded.companyCode);
    
// //     // Find user in company database
// //     const user = await UserModel.findById(decoded.userId);
    
// //     if (!user || !user.isActive) {
// //       return res.status(401).json({ message: 'User not found or inactive' });
// //     }
    
// //     req.user = user;
// //     req.companyCode = user.companyCode;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: 'Invalid token' });
// //   }
// // };

// // export const authenticate = async (req, res, next) => {
// //   try {
// //     const token = req.header('Authorization')?.replace('Bearer ', '');
    
// //     if (!token) {
// //       return res.status(401).json({ message: 'Authentication required' });
// //     }
    
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // Get user model for this company
// //     const UserModel = await getUserModel(decoded.companyCode);
    
// //     // Find user in company database
// //     const user = await UserModel.findById(decoded.userId);
    
// //     if (!user || !user.isActive) {
// //       return res.status(401).json({ message: 'User not found or inactive' });
// //     }
    
// //     req.user = user;
// //     req.companyCode = user.companyCode;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: 'Invalid token' });
// //   }
// // };


// export const authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
//     // Get the company code from the token
//     const companyCode = decoded.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ message: 'Invalid token: missing company code' });
//     }
    
//     let user;
    
//     // Check if this is a company user or main user
//     if (decoded.isCompanyUser) {
//       try {
//         // Get company-specific User model
//         const CompanyUserModel = await getUserModel(companyCode);
        
//         // Find user in company database
//         user = await CompanyUserModel.findById(decoded.userId);
//       } catch (dbError) {
//         console.error('Error accessing company database:', dbError);
//         return res.status(401).json({ message: 'Error accessing company database' });
//       }
//     } else {
//       // Fallback to main database
//       user = await MainUser.findById(decoded.userId);
//     }
    
//     if (!user || !user.isActive) {
//       return res.status(401).json({ message: 'User not found or inactive' });
//     }
    
//     req.user = user;
//     req.companyCode = companyCode;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export const authorize = (requiredPermissions) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }
    
//     // Check if user has all required permissions
//     const hasPermission = Array.isArray(requiredPermissions)
//       ? requiredPermissions.every(permission => req.user.permissions.includes(permission))
//       : req.user.permissions.includes(requiredPermissions);
    
//     if (!hasPermission) {
//       return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
//     }
    
//     next();
//   };
// };

// export const companyFilter = (req, res, next) => {
//   // Add company filter to all queries
//   if (req.companyCode && req.query) {
//     req.companyFilter = { companyCode: req.companyCode };
//   }
//   next();
// };


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Get JWT secret from environment variables or use a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: No token or invalid token format');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token verified for user:', decoded.userId);
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!user.isActive) {
      console.log('User is inactive:', user.email);
      return res.status(401).json({ message: 'User account is inactive' });
    }
    
    // Attach user and company code to request
    req.user = user;
    req.companyCode = user.companyCode;
    
    console.log('Authentication successful for user:', user.email);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

export const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user has all required permissions
    const hasPermission = Array.isArray(requiredPermissions)
      ? requiredPermissions.every(permission => req.user.permissions.includes(permission))
      : req.user.permissions.includes(requiredPermissions);
    
    if (!hasPermission) {
      console.log('Authorization failed for user:', req.user.email);
      console.log('Required permissions:', requiredPermissions);
      console.log('User permissions:', req.user.permissions);
      
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }
    
    console.log('Authorization successful for user:', req.user.email);
    next();
  };
};

export const companyFilter = (req, res, next) => {
  // Add company filter to all queries
  if (req.companyCode && req.query) {
    req.companyFilter = { companyCode: req.companyCode };
  }
  next();
};


