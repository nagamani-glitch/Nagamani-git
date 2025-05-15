import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';

// Authenticate middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    console.log('Authenticating request with token');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    // Get company code from header or from token
    let companyCode = req.headers['x-company-code'] || decoded.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ message: 'Authentication required. Company code not found.' });
    }
    
    console.log(`Authentication: Using company code ${companyCode}`);
    
    // Check if company exists
    const company = await Company.findOne({ companyCode });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Find user by ID and company code
    const user = await User.findOne({ 
      _id: decoded.userId,
      companyCode: companyCode
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found or not authorized for this company' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is inactive' });
    }
    
    // Add user and company code to request object
    req.user = user;
    req.companyCode = companyCode;
    
    console.log(`Authentication successful for user: ${user.email} (${user.role})`);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Authorization middleware
export const authorize = (permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Check if user has admin role (admins can do everything)
      if (req.user.role === 'admin') {
        return next();
      }
      
      // Check if user has any of the required permissions
      const hasPermission = permissions.some(permission => 
        req.user.permissions.includes(permission)
      );
      
      if (!hasPermission) {
        console.log(`Authorization failed for user ${req.user.email}: Required permissions: ${permissions.join(', ')}, User permissions: ${req.user.permissions.join(', ')}`);
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
      
      console.log(`Authorization successful for user ${req.user.email}`);
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Authorization error' });
    }
  };
};

// Company filter middleware
export const companyFilter = (req, res, next) => {
    // Add company filter to all queries
    if (req.companyCode && req.query) {
      req.companyFilter = { companyCode: req.companyCode };
    }
    next();
  };

// import jwt from 'jsonwebtoken';
// import { getUserModel } from '../models/User.js';

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


