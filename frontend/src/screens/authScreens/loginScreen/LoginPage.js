import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Alert, 
  IconButton, 
  InputAdornment,
  useMediaQuery,
  styled,
  ThemeProvider,
  createTheme,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Velustro } from "uvcanvas";
import { debounce } from 'lodash';
import { useAuth } from '../../../hooks/useAuth';

// Create a theme
const theme = createTheme();

// Styled components using the theme
const LoginWrapper = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: '20px',
});

const VelustroContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
});

const LoginContent = styled(motion.div)({
  width: '100%',
  maxWidth: '450px',
  position: 'relative',
  zIndex: 1,
  '@media (max-width: 600px)': {
    maxWidth: '100%',
  },
});

const LoginFormContainer = styled(Container)({
  padding: '32px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  borderRadius: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  '@media (max-width: 600px)': {
    padding: '24px',
    marginTop: '32px',
  },
});

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { 
    loading, 
    error, 
    login, 
    verificationNeeded, 
    verificationEmail,
    verifyEmail,
    setError,
    
  } = useAuth();
  
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Media queries for responsive design
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/Dashboards');
    }
  }, [navigate]);

  useEffect(() => {
    if (!loading && isSubmitting) {
      setIsSubmitting(false);
    }
  }, [loading, isSubmitting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Check if there's a pending login attempt in sessionStorage
    try {
      const pendingLogin = sessionStorage.getItem('pendingLogin');
      if (pendingLogin) {
        const loginData = JSON.parse(pendingLogin);
        setFormData(loginData);
      }
    } catch (error) {
      console.error('Error retrieving pending login data:', error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format input values based on field name
    let formattedValue = value;
    
    if (name === 'companyCode') {
      // Convert company code to uppercase
      formattedValue = value.toUpperCase();
    } else if (name === 'email') {
      // Convert email to lowercase
      formattedValue = value.toLowerCase();
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const togglePasswordVisibility = useCallback((e) => {
    // Prevent form submission when clicking the eye icon
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowPassword(prev => !prev);
  }, []);

  const validateForm = useCallback(() => {
    // Basic form validation
    if (!formData.companyCode.trim()) {
      setError('Company code is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  }, [formData, setError]);

  // Handle form submission
const handleSubmit = useCallback(async (e) => {
  // Prevent default form submission behavior
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Prevent double submission
  if (isSubmitting || loading) return;
  
  // Validate form inputs
  if (!validateForm()) {
    return;
  }
  
  // Save current form state to session storage in case of page reload
  try {
    sessionStorage.setItem('pendingLogin', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving form data to session storage:', error);
  }
  
  // Set submission state
  setIsSubmitting(true);
  
  try {
    console.log('Submitting login form with:', {
      email: formData.email,
      companyCode: formData.companyCode,
      passwordProvided: !!formData.password
    });
    // Attempt login
    const response = await login(formData);
    console.log('Login response in component:', {
      success: !!response,
      hasUser: !!response?.user,
      hasToken: !!response?.token
    });
    
    // Clear pending login on success
    sessionStorage.removeItem('pendingLogin');
    
    // Navigate to dashboard on success
    if (isMounted.current) {
      console.log('Navigating to dashboard...');
      navigate('/Dashboards');
    }
  } catch (error) {
    // Error handling is done in the useAuth hook
    console.log('Login failed, but error is handled in the hook');
    
    // // Make sure to reset loading state here
    // resetLoadingState();
    
    // Reset submission state
    if (isMounted.current) {
      setIsSubmitting(false);
    }
  } finally {
    if (isMounted.current) {
      setIsSubmitting(false);

      setTimeout(() => {
        if (isMounted.current) {
          navigate('/Dashboards');
          console.log('Navigation triggered');
        }
      }, 100);
    }
    }
  
}, [formData, isSubmitting, loading, validateForm, login, navigate]);

  // Handle verification request
  const handleRequestVerification = useCallback(() => {
    if (!verificationEmail) return;
    
    // Save the current login attempt for after verification
    sessionStorage.setItem('pendingLogin', JSON.stringify(formData));
    
    // Redirect to verification page with email
    verifyEmail(verificationEmail);
  }, [verificationEmail, formData, verifyEmail]);

  // Custom text field styling
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'black',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4a90e2',
      },
      '& input': {
        color: 'white',
        '&::placeholder': {
          color: 'rgba(255, 255, 255, 0.7)',
          opacity: 1,
        },
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px black inset',
          WebkitTextFillColor: 'white',
          caretColor: 'white',
          transition: 'background-color 5002s ease-in-out 0s',
        },
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#4a90e2',
      }
    },
    marginBottom: 2
  };

  return (
    <ThemeProvider theme={theme}>
      <LoginWrapper>
        <VelustroContainer>
          <Velustro />
        </VelustroContainer>
        
        <LoginContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginFormContainer 
            maxWidth="xs"
            sx={{
              mt: isMobile ? 0 : 4,
              mx: 'auto',
              width: isMobile ? '90%' : 'auto',
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: 'white',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            >
              Login
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 1, 
                  mb: 2,
                  '& .MuiAlert-message': {
                    color: '#f44336',
                    fontWeight: 500,
                  },
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  borderRadius: '8px',
                }}
                action={
                  verificationNeeded && (
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={handleRequestVerification}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Verify Now
                    </Button>
                  )
                }
              >
                {error}
              </Alert>
            )}
            
            {/* Use div instead of form to avoid implicit form submission */}
            <Box 
              component="div"
              sx={{ 
                mt: 1,
                '& .MuiTextField-root': {
                  mb: 2
                }
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <TextField
                fullWidth
                required
                id="companyCode"
                label="Company Code"
                name="companyCode"
                autoComplete="organization"
                value={formData.companyCode}
                onChange={handleChange}
                autoFocus
                sx={textFieldSx}
                size={isMobile ? "small" : "medium"}
                disabled={loading || isSubmitting}
                inputProps={{
                  style: { textTransform: 'uppercase' }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              
              <TextField
                fullWidth
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={textFieldSx}
                size={isMobile ? "small" : "medium"}
                disabled={loading || isSubmitting}
                inputProps={{
                  style: { textTransform: 'lowercase' }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              
              <TextField
                fullWidth
                required
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={textFieldSx}
                size={isMobile ? "small" : "medium"}
                disabled={loading || isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        size={isMobile ? "small" : "medium"}
                        disabled={loading || isSubmitting}
                        type="button" // Explicitly set type to button
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              
              <motion.div whileHover={{ scale: loading || isSubmitting ? 1 : 1.03 }} whileTap={{ scale: loading || isSubmitting ? 1 : 0.98 }}>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#4a90e2',
                    '&:hover': {
                      backgroundColor: loading || isSubmitting ? '#4a90e2' : '#357abd'
                    },
                    padding: isMobile ? '8px' : '12px',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
                    position: 'relative'
                  }}
                  disabled={loading || isSubmitting}
                  type="button" // Explicitly set type to button
                >
                  {loading || isSubmitting ? (
                    <>
                      <CircularProgress 
                        size={24} 
                        sx={{ 
                          color: 'white',
                          position: 'absolute',
                          left: 'calc(50% - 12px)',
                          top: 'calc(50% - 12px)'
                        }} 
                      />
                      <span style={{ visibility: 'hidden' }}>Sign In</span>
                    </>
                  ) : 'Sign In'}
                </Button>
              </motion.div>
              
              {verificationNeeded && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Button
                    onClick={handleRequestVerification}
                    fullWidth
                    variant="outlined"
                    sx={{
                      color: '#4a90e2',
                      borderColor: '#4a90e2',
                      '&:hover': {
                        backgroundColor: 'rgba(74, 144, 226, 0.08)',
                        borderColor: '#357abd'
                      },
                      padding: isMobile ? '6px' : '10px',
                      fontSize: isMobile ? '13px' : '15px',
                      fontWeight: 500,
                      borderRadius: '8px',
                      textTransform: 'none'
                    }}
                    disabled={loading || isSubmitting}
                  >
                    Verify Email Now
                  </Button>
                </Box>
              )}
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
  <Typography 
    variant="body2" 
    sx={{
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: isMobile ? '12px' : '14px',
      '& a': {
        color: '#4a90e2',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }}
  >
    <Link to='/forgot-password' style={{ marginRight: '10px' }}>
      Forgot Password?
    </Link>
  </Typography>
  
  <Typography 
    variant="body2" 
    sx={{
      mt: 1,
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: isMobile ? '12px' : '14px',
      '& a': {
        color: '#4a90e2',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }}
  >
    Don't have an account?{' '}
    <Link to="/register-company" style={{ color: '#4a90e2', textDecoration: 'none' }}>
      Sign up
    </Link>
  </Typography>
</Box>
            </Box>
          </LoginFormContainer>
        </LoginContent>
      </LoginWrapper>
    </ThemeProvider>
  );
};

export default LoginPage;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { Velustro } from "uvcanvas";
// import "./LoginPage.css";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const config = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       withCredentials: true
//     };

//     try {
//       const response = await axios.post(
//         'http://localhost:5002/api/auth/login',
//         formData,
//         config
//       );

//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userId', response.data.user.userId);
//       console.log('Token stored in localStorage:', response.data.token);
//       console.log('UserId stored in localStorage:', response.data.user.userId);

      
//       navigate('/Dashboards');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="login-main-wrapper">
//       <div className="velustro-container">
//         <Velustro />
//       </div>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="login-content"
//       >
//         <Container
//           component="main"
//           maxWidth="xs"
//           // sx={{
//           //   mt: 8,
//           //   p: 4,
//           //   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//           //   borderRadius: '20px',
//           //   backgroundColor: 'rgba(0, 0, 0, 0.75)',
//           //   backdropFilter: 'blur(15px)',
//           //   border: '1px solid rgba(255, 255, 255, 0.18)',
//           //   '& .MuiTextField-root': {
//           //     '& .MuiOutlinedInput-root': {
//           //       '& fieldset': {
//           //         borderColor: 'rgba(255, 255, 255, 0.3)',
//           //       },
//           //       '&:hover fieldset': {
//           //         borderColor: 'rgba(255, 255, 255, 0.5)',
//           //       },
//           //     },
//           //     '& .MuiInputLabel-root': {
//           //       color: 'rgba(255, 255, 255, 0.7)',
//           //     },
//           //     '& .MuiOutlinedInput-input': {
//           //       color: 'white',
//           //       backgroundColor:'#000',

//           //     },
//           //   },
//           // }}

//           // Update the Container sx prop styling:

//           sx={{
//             mt: 8,
//             p: 4,
//             boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//             borderRadius: '20px',
//             backgroundColor: 'rgba(0, 0, 0, 0.75)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255, 255, 255, 0.18)',
//             '& .MuiTextField-root': {
//               '& .MuiOutlinedInput-root': {
//                 backgroundColor: 'black', // Add this line
//                 '& fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.3)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.5)',
//                 },
//                 '& input': { // Add this block
//                   color: 'white',
//                   '&::placeholder': {
//                     color: 'rgba(255, 255, 255, 0.7)',
//                   },
//                   '&:-webkit-autofill': {
//                     WebkitBoxShadow: '0 0 0 1000px black inset',
//                     WebkitTextFillColor: 'white',
//                     caretColor: 'white',
//                     transition: 'background-color 5002s ease-in-out 0s',
//                   },
//                   '&:-webkit-autofill:hover, &:-webkit-autofill:focus': {
//                     WebkitBoxShadow: '0 0 0 1000px black inset',
//                     WebkitTextFillColor: 'white',
//                   },
//                 }
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'rgba(255, 255, 255, 0.7)',
//               }
//             }
//           }}

//         >
//           <Typography
//             variant="h4"
//             component="h1"
//             sx={{
//               mb: 2,
//               textAlign: 'center',
//               color: 'white',
//               fontWeight: 600,
//               textTransform: 'uppercase',
//               letterSpacing: '2px'
//             }}
//           >
//             Login
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               fullWidth
//               label="Email Address"
//               name="email"
//               type="email"
//               autoComplete="email"
//               autoFocus
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               autoComplete="current-password"
//               onChange={handleChange}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <IconButton
//                     onClick={togglePasswordVisibility}
//                     edge="end"
//                     aria-label="toggle password visibility"
//                     sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </IconButton>
//                 ),
//               }}
//             />
//             {error && (
//               <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//                 {error}
//               </Typography>
//             )}
//             <motion.div whileHover={{ scale: 1.05 }}>
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   mt: 3,
//                   mb: 2,
//                   backgroundColor: '#4a90e2',
//                   '&:hover': {
//                     backgroundColor: '#357abd'
//                   },
//                   padding: '12px',
//                   fontSize: '16px',
//                   fontWeight: 600
//                 }}
//               >
//                 Login
//               </Button>
//             </motion.div>
//             <Typography
//               variant="body2"
//               sx={{
//                 mt: 2,
//                 textAlign: 'center',
//                 color: 'rgba(255, 255, 255, 0.8)',
//                 '& a': {
//                   color: '#4a90e2',
//                   textDecoration: 'none',
//                   '&:hover': {
//                     textDecoration: 'underline'
//                   }
//                 }
//               }}
//             >
//               <Link to='/forgot-password' style={{ marginRight: '10px' }}>
//                 Forgot Password?
//               </Link>
//               <br />
//               New user? <Link to='/register'>Register here</Link>
//             </Typography>
//           </Box>
//         </Container>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;
