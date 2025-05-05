import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  styled,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../../../screens/api/auth';

// Create theme
const theme = createTheme();

// Styled components
const ResetContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
});

const ResetPaper = styled(Paper)({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '450px',
  width: '100%',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
});

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const companyCodeParam = params.get('companyCode');
    
    if (emailParam) setEmail(emailParam);
    if (companyCodeParam) setCompanyCode(companyCodeParam);
    
        // Verify token on mount
        if (token && emailParam && companyCodeParam) {
            verifyToken(token, emailParam, companyCodeParam);
          } else {
            setVerifying(false);
            setError('Missing required parameters. Please use the link from your email.');
          }
        }, [location, token]);
        
        // Verify reset token
        const verifyToken = async (token, email, companyCode) => {
          try {
            await authService.verifyResetToken({ token, email, companyCode });
            setVerifying(false);
          } catch (err) {
            console.error('Token verification error:', err);
            setVerifying(false);
            
            if (err.response) {
              setError(err.response.data.message || 'Invalid or expired reset link');
            } else {
              setError('Network error. Please try again or request a new reset link.');
            }
          }
        };
        
        // Toggle password visibility
        const togglePasswordVisibility = () => {
          setShowPassword(!showPassword);
        };
        
        // Toggle confirm password visibility
        const toggleConfirmPasswordVisibility = () => {
          setShowConfirmPassword(!showConfirmPassword);
        };
        
        // Validate password
        const validatePassword = () => {
          // Password must be at least 8 characters
          if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
          }
          
          // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!passwordRegex.test(password)) {
            setError('Password must include uppercase, lowercase, number and special character');
            return false;
          }
          
          // Passwords must match
          if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
          }
          
          return true;
        };
        
        // Handle form submission
        const handleSubmit = async (e) => {
          e.preventDefault();
          
          // Clear previous errors
          setError('');
          
          // Validate form
          if (!validatePassword()) {
            return;
          }
          
          setLoading(true);
          
          try {
            // Call API to reset password
            await authService.resetPassword({
              token,
              email,
              companyCode,
              password
            });
            
            // Show success message
            setSuccess('Password has been reset successfully!');
            
            // Redirect to login after a short delay
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } catch (err) {
            console.error('Password reset error:', err);
            
            if (err.response) {
              setError(err.response.data.message || 'Failed to reset password');
            } else {
              setError('Network error. Please try again.');
            }
          } finally {
            setLoading(false);
          }
        };
        
        return (
          <ThemeProvider theme={theme}>
            <ResetContainer maxWidth="sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ResetPaper elevation={3}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Reset Password
                  </Typography>
                  
                  {verifying ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Verifying your reset link...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                          {error}
                        </Alert>
                      )}
                      
                      {success && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                          {success}
                        </Alert>
                      )}
                      
                      {!success && (
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                  >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={toggleConfirmPasswordVisibility}
                                    edge="end"
                                    aria-label="toggle confirm password visibility"
                                  >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                            Password must be at least 8 characters long and include uppercase, lowercase, 
                            number and special character.
                          </Typography>
                          
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ mt: 2, mb: 2 }}
                          >
                            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                          </Button>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => navigate('/login')}
                          sx={{ textTransform: 'none' }}
                        >
                          Back to Login
                        </Button>
                      </Box>
                    </>
                  )}
                </ResetPaper>
              </motion.div>
            </ResetContainer>
          </ThemeProvider>
        );
      };
      
      export default ResetPassword;
      
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   Container, Box, Typography, TextField, Button, 
//   LinearProgress, Alert, InputAdornment, IconButton,
//   Dialog, DialogContent, CircularProgress
// } from '@mui/material';
// import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { Velustro } from "uvcanvas";

// const ResetPassword = () => {
//     const { token } = useParams();
//     const navigate = useNavigate();
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const [passwordFeedback, setPasswordFeedback] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [openSuccessModal, setOpenSuccessModal] = useState(false);
//     const [redirectCountdown, setRedirectCountdown] = useState(5); // 5 second countdown

//     // Countdown effect for auto-redirect
//     useEffect(() => {
//         let timer;
//         if (openSuccessModal && redirectCountdown > 0) {
//             timer = setTimeout(() => {
//                 setRedirectCountdown(redirectCountdown - 1);
//             }, 1000);
//         } else if (openSuccessModal && redirectCountdown === 0) {
//             navigate('/login');
//         }
//         return () => clearTimeout(timer);
//     }, [openSuccessModal, redirectCountdown, navigate]);

//     // Password strength validation function (copied from RegisterPage)
//     const checkPasswordStrength = (password) => {
//         // Initialize strength as 0
//         let strength = 0;
//         let feedback = [];

//         // If password is empty, return
//         if (password.length === 0) {
//             setPasswordStrength(0);
//             setPasswordFeedback('');
//             return;
//         }

//         // Check length
//         if (password.length < 8) {
//             feedback.push("Password should be at least 8 characters");
//         } else {
//             strength += 20;
//         }

//         // Check for lowercase letters
//         if (password.match(/[a-z]/)) {
//             strength += 20;
//         } else {
//             feedback.push("Include lowercase letters");
//         }

//         // Check for uppercase letters
//         if (password.match(/[A-Z]/)) {
//             strength += 20;
//         } else {
//             feedback.push("Include uppercase letters");
//         }

//         // Check for numbers
//         if (password.match(/[0-9]/)) {
//             strength += 20;
//         } else {
//             feedback.push("Include numbers");
//         }

//         // Check for special characters
//         if (password.match(/[^a-zA-Z0-9]/)) {
//             strength += 20;
//         } else {
//             feedback.push("Include special characters");
//         }

//         setPasswordStrength(strength);
//         setPasswordFeedback(feedback.join(', '));
//     };

//     const getPasswordStrengthColor = () => {
//         if (passwordStrength < 40) return 'error';
//         if (passwordStrength < 80) return 'warning';
//         return 'success';
//     };

//     // Toggle password visibility
//     const handleTogglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     // Toggle confirm password visibility
//     const handleToggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     // Update password strength when password changes
//     useEffect(() => {
//         checkPasswordStrength(password);
//     }, [password]);

//     const handleResetPassword = async () => {
//         // Validate password strength
//         if (passwordStrength < 60) {
//             setMessage('Please choose a stronger password');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setMessage('Passwords do not match');
//             return;
//         }

//         try {
//             const response = await axios.post(`http://localhost:5002/api/auth/reset-password/${token}`, { password });
//             setMessage(response.data.message);
            
//             // Show success modal and start countdown
//             setOpenSuccessModal(true);
//         } catch (error) {
//             console.error('Detailed error:', error);
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 console.error('Error data:', error.response.data);
//                 console.error('Error status:', error.response.status);
//                 console.error('Error headers:', error.response.headers);
//                 setMessage(error.response.data.message || `Error ${error.response.status}: Bad Request`);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 console.error('Error request:', error.request);
//                 setMessage('No response received from server');
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 console.error('Error message:', error.message);
//                 setMessage('Error setting up request: ' + error.message);
//             }
//         }
//     };        

//     return (
//         <div className="reset-password-wrapper" style={{
//             minHeight: '100vh',
//             position: 'relative',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         }}>
//             <div style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 zIndex: 0
//             }}>
//                 <Velustro />
//             </div>

//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <Container
//                     component="main"
//                     maxWidth="xs"
//                     sx={{
//                         position: 'relative',
//                         zIndex: 1,
//                         mt: 8,
//                         p: 4,
//                         boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//                         borderRadius: '20px',
//                         backgroundColor: 'rgba(0, 0, 0, 0.75)',
//                         backdropFilter: 'blur(15px)',
//                         border: '1px solid rgba(255, 255, 255, 0.18)',
//                         '& .MuiTextField-root': {
//                             '& .MuiOutlinedInput-root': {
//                                 backgroundColor: 'black',
//                                 '& fieldset': {
//                                     borderColor: 'rgba(255, 255, 255, 0.3)',
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: 'rgba(255, 255, 255, 0.5)',
//                                 },
//                                 '& input': {
//                                     color: 'white',
//                                     '&::placeholder': {
//                                         color: 'rgba(255, 255, 255, 0.7)',
//                                     },
//                                 '&:-webkit-autofill': {
//                                         WebkitBoxShadow: '0 0 0 1000px black inset',
//                                         WebkitTextFillColor: 'white',
//                                     },
//                                 '&:-webkit-autofill:hover, &:-webkit-autofill:focus': {
//                                     WebkitBoxShadow: '0 0 0 1000px black inset',
//                                     WebkitTextFillColor: 'white',      
//                                 },
//                             }
//                         },
//                             '& .MuiInputLabel-root': {
//                                 color: 'rgba(255, 255, 255, 0.7)',
//                             }
//                         }
//                     }}
//                 >
//                     <Typography 
//                         variant="h4" 
//                         component="h1" 
//                         gutterBottom 
//                         align="center"
//                         sx={{
//                             color: 'white',
//                             fontWeight: 600,
//                             textTransform: 'uppercase',
//                             letterSpacing: '2px',
//                             mb: 3
//                         }}
//                     >
//                         Reset Password
//                     </Typography>
                    
//                     {message && !openSuccessModal && (
//                         <Alert 
//                             severity={message.includes('success') ? 'success' : 'error'} 
//                             sx={{ 
//                                 mb: 2,
//                                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                                 color: message.includes('match') ? '#ff4444' : 'rgba(255, 255, 255, 0.8)'
//                             }}
//                         >
//                             {message}
//                         </Alert>
//                     )}
                    
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="password"
//                         label="New Password"
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton
//                                         aria-label="toggle password visibility"
//                                         onClick={handleTogglePasswordVisibility}
//                                         edge="end"
//                                         sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//                                     >
//                                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             )
//                         }}
//                         sx={{ mb: 3 }}
//                     />
                    
//                     {password && (
//                         <>
//                             <LinearProgress 
//                                 variant="determinate" 
//                                 value={passwordStrength} 
//                                 color={getPasswordStrengthColor()}
//                                 sx={{ mt: 1, mb: 1 }}
//                             />
//                             <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                                 Password strength: {passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Medium' : 'Strong'}
//                             </Typography>
//                             {passwordFeedback && (
//                                 <Typography variant="caption" color="error" display="block">
//                                     {passwordFeedback}
//                                 </Typography>
//                             )}
//                         </>
//                     )}
                    
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="confirmPassword"
//                         label="Confirm Password"
//                         type={showConfirmPassword ? "text" : "password"}
//                         id="confirmPassword"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton
//                                         aria-label="toggle confirm password visibility"
//                                         onClick={handleToggleConfirmPasswordVisibility}
//                                         edge="end"
//                                         sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//                                     >
//                                         {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             )
//                         }}
//                         sx={{ mb: 3 }}
//                     />
                    
//                     <Button
//                         fullWidth
//                         variant="contained"
//                         color="primary"
//                         onClick={handleResetPassword}
//                         sx={{
//                             backgroundColor: '#4a90e2',
//                             padding: '12px',
//                             fontSize: '16px',
//                             fontWeight: 600,
//                             '&:hover': {
//                                 backgroundColor: '#357abd'
//                             }
//                         }}
//                     >
//                         Reset Password
//                     </Button>
//                 </Container>
//             </motion.div>

//             {/* Auto-redirect Success Modal */}
//             <Dialog
//                 open={openSuccessModal}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//                 PaperProps={{
//                     style: {
//                         backgroundColor: 'rgba(0, 0, 0, 0.85)',
//                         color: 'white',
//                         border: '1px solid rgba(255, 255, 255, 0.18)',
//                         borderRadius: '10px',
//                         boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//                         maxWidth: '400px',
//                         width: '100%',
//                         padding: '20px'
//                     }
//                 }}
//             >
//                 <DialogContent sx={{ textAlign: 'center', p: 3 }}>
//                     <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                    
//                     <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
//                         Password Reset Successful
//                     </Typography>
                    
//                     <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
//                         Your password has been reset successfully. You can now log in with your new password.
//                     </Typography>
                    
//                     {/* Countdown indicator */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
//                         <CircularProgress 
//                             variant="determinate" 
//                             value={(redirectCountdown / 5) * 100} 
//                             size={30} 
//                             thickness={5}
//                             sx={{ color: '#4a90e2', mr: 2 }}
//                         />
//                         <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                             Redirecting to login in {redirectCountdown} seconds...
//                         </Typography>
//                     </Box>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ResetPassword;
