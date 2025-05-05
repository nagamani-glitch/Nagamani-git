import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// Configure axios with base URL
axios.defaults.baseURL = API_URL;

// Create API instance with base configuration
const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid
      if (error.response.data.message === 'Invalid token') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register a new company
  registerCompany: async (companyData) => {
    try {
      const response = await api.post('/companies/register', companyData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
login: async (credentials) => {
  try {
    console.log('Auth service: Making login request with:', {
      companyCode: credentials.companyCode.toUpperCase(),
      email: credentials.email.toLowerCase(),
      passwordProvided: !!credentials.password
    });
    const response = await api.post('/companies/login', {
      companyCode: credentials.companyCode.toUpperCase(),
      email: credentials.email.toLowerCase(),
      password: credentials.password
    });

    console.log('Auth service: Login response received:', {
      success: response.data.success,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user
    });
    
    // Store auth data in localStorage only on successful login
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userId', response.data.user._id || response.data.user.id);
      localStorage.setItem('companyCode', credentials.companyCode.toUpperCase());
      console.log('Auth service: User data stored in localStorage');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error in auth service:', error);
    throw error;
  }
},

  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyCode');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post('/companies/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },
  
  // Resend OTP
  resendOtp: async (email) => {
    try {
      const response = await api.post('/companies/resend-otp', { email });
      return response.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },
  
  // Request password reset
  forgotPassword: async (data) => {
    try {
      const response = await api.post('/companies/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  // Verify reset token
  verifyResetToken: async (data) => {
    try {
      const response = await api.post('/companies/verify-reset-token', data);
      return response.data;
    } catch (error) {
      console.error('Verify reset token error:', error);
      throw error;
    }
  },
  
  // Reset password
  resetPassword: async (data) => {
    try {
      const response = await api.post('/companies/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  // Change password (for authenticated users)
  changePassword: async (data) => {
    try {
      const response = await api.post('/companies/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
};

export default authService;


// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// // Configure axios
// axios.defaults.baseURL = API_URL;

// const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });


// // Add request interceptor to include token in requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor to handle common errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle session expiration
//     if (error.response && error.response.status === 401) {
//       // Clear local storage and redirect to login if token is invalid
//       if (error.response.data.message === 'Invalid token') {
//         localStorage.clear();
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );



// // Add a request interceptor to include the token in all requests
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle token expiration
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// const authService = {
//   // Keep existing methods
//   registerCompany: async (companyData) => {
//       const response = await axios.post('/api/companies/register', companyData);
//       return response.data;
//   },
  
//   // Add or update the login method
//   login: async (credentials) => {
//       try {
//           const response = await axios.post('/api/companies/login', {
//               companyCode: credentials.companyCode.toUpperCase(),
//               email: credentials.email.toLowerCase(),
//               password: credentials.password
//           });
          
//           // Store auth data in localStorage
//           if (response.data.token) {
//               localStorage.setItem('token', response.data.token);
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//               localStorage.setItem('userId', response.data.user._id || response.data.user.id);
//               localStorage.setItem('companyCode', credentials.companyCode.toUpperCase());
//           }
          
//           return response.data;
//       } catch (error) {
//           console.error('Login error in auth service:', error);
//           throw error;
//       }
//   },
  
//   // Add or update logout method
//   logout: () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('companyCode');
//   },
  
//   // Add or update getCurrentUser method
//   getCurrentUser: () => {
//       const user = localStorage.getItem('user');
//       return user ? JSON.parse(user) : null;
//   },
  
//   // Add or update isAuthenticated method
//   isAuthenticated: () => {
//       return !!localStorage.getItem('token');
//   },
  
//   // Add or update forgotPassword method
//   forgotPassword: async (data) => {
//       return await axios.post('/api/companies/forgot-password', data);
//   },
  
//   // Add or update resetPassword method
//   resetPassword: async (data) => {
//       return await axios.post('/api/companies/reset-password', data);
//   },
  
//   // Add or update verifyResetToken method
//   verifyResetToken: async (data) => {
//       return await axios.post('/api/companies/verify-reset-token', data);
//   }
// };

// export default authService;
