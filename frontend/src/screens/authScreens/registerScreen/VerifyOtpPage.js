import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Link,
  styled,
  ThemeProvider,
  createTheme,
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';
import authService from '../../../screens/api/auth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Styled components
const OtpContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  position: 'relative',
  zIndex: 1,
});

const OtpPaper = styled(Paper)({
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
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const OtpField = styled(TextField)({
  margin: '8px',
  width: '50px',
  '& input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '10px 0',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#3f51b5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
      borderWidth: 2,
    },
  },
});

const CanvasBackground = styled('canvas')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
});

const SuccessModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendSuccessModal, setResendSuccessModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Parse email from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get email from session storage
      const pendingLogin = sessionStorage.getItem('pendingLogin');
      if (pendingLogin) {
        try {
          const loginData = JSON.parse(pendingLogin);
          setEmail(loginData.email);
        } catch (err) {
          console.error('Error parsing pending login data:', err);
        }
      }
    }
  }, [location]);
  
  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown]);
  
  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Initialize canvas animation
    initCanvas();
    
    // Clean up canvas animation on unmount
    return () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };
  }, []);
  
  // Initialize canvas with UV animation
  const initCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${Math.random() * 0.5 + 0.3})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.1;
        
        // Boundary check
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particle array
    const particlesArray = [];
    const numberOfParticles = 100;
    
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(63, 81, 181, 0.2)');
      gradient.addColorStop(1, 'rgba(100, 181, 246, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Connect particles with lines
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    // Connect particles with lines
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(100, 181, 246, ${0.1 - distance/1000})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  };
  
  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear any previous errors
    if (error) setError('');
    
    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key press in OTP fields
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };
  
  // Clear OTP fields
  const clearOtpFields = () => {
    setOtp(['', '', '', '', '', '']);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };
  
  // Verify OTP
  const verifyOtp = async () => {
    // Check if OTP is complete
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    
    // Check if email is available
    if (!email) {
      setError('Email address is missing. Please go back to login.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call API to verify OTP
      const response = await authService.verifyOtp(email, otpValue);
      
      setSuccessMessage('Email verified successfully! Redirecting to login...');
      setOpenSuccessModal(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        setOpenSuccessModal(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('OTP verification error:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to verify OTP');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Resend OTP
  const resendOtp = async () => {
    if (resendDisabled) return;
    
    if (!email) {
      setError('Email address is missing. Please go back to login.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call API to resend OTP
      await authService.resendOtp(email);
      
      // Clear OTP fields
      clearOtpFields();
      
      // Show resend success modal
      setResendSuccessModal(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setResendSuccessModal(false);
      }, 2000);
      
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);
    } catch (err) {
      console.error('Resend OTP error:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to resend OTP');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle success modal close
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };
  
  // Handle resend success modal close
  const handleCloseResendModal = () => {
    setResendSuccessModal(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CanvasBackground ref={canvasRef} />
      <OtpContainer maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OtpPaper elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
              Verify Your Email
            </Typography>
            
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              We've sent a 6-digit OTP to<br />
              <strong>{email || 'your email'}</strong>
            </Typography>
            
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
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 3 
              }}
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <OtpField
                  key={index}
                  inputRef={el => inputRefs.current[index] = el}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  disabled={loading}
                />
              ))}
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={verifyOtp}
              disabled={loading || otp.join('').length !== 6}
              sx={{ 
                mb: 2, 
                py: 1.5, 
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Didn't receive the code?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={resendOtp}
                  disabled={resendDisabled}
                  sx={{
                    textDecoration: 'none',
                    cursor: resendDisabled ? 'default' : 'pointer',
                    color: resendDisabled ? 'text.disabled' : 'primary.main',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {resendDisabled 
                    ? `Resend OTP (${countdown}s)` 
                    : 'Resend OTP'}
                </Link>
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.08)'
                  }
                }}
              >
                Back to Login
              </Button>
            </Box>
          </OtpPaper>
        </motion.div>
      </OtpContainer>
      
      {/* Success Verification Modal */}
      <Modal
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSuccessModal}>
          <SuccessModalContent>
            <CheckCircleOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: '#4caf50', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              Verification Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your email has been verified successfully. Redirecting to login...
            </Typography>
            <CircularProgress size={24} sx={{ color: '#3f51b5' }} />
          </SuccessModalContent>
        </Fade>
      </Modal>
      
      {/* Resend OTP Success Modal */}
      <Modal
        open={resendSuccessModal}
        onClose={handleCloseResendModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={resendSuccessModal}>
          <SuccessModalContent>
            <CheckCircleOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: '#4caf50', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              OTP Resent!
            </Typography>
            <Typography variant="body1">
              A new OTP has been sent to your email address. Please check your inbox.
            </Typography>
          </SuccessModalContent>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default VerifyOtpPage;


// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Box, Button, TextField, Typography, Container, Grid } from '@mui/material';
// import { motion } from 'framer-motion';
// import { Velustro } from "uvcanvas";

// const VerifyOtpPage = () => {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { email } = location.state;
  
//   // Create refs for each input field
//   const inputRefs = useRef([]);
  
//   // Initialize refs array
//   useEffect(() => {
//     inputRefs.current = inputRefs.current.slice(0, 6);
//   }, []);

//   const handleOtpChange = (index, value) => {
//     // Only allow numbers
//     if (!/^\d*$/.test(value)) return;
    
//     // Create a new array with the updated value
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
    
//     // Auto-focus to next input if current input is filled
//     if (value !== '' && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };
  
//   const handleKeyDown = (index, e) => {
//     // Move to previous input on backspace if current input is empty
//     if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };
  
//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text');
    
//     // Check if pasted content is a 6-digit number
//     if (/^\d{6}$/.test(pastedData)) {
//       const digits = pastedData.split('');
//       setOtp(digits);
      
//       // Focus the last input
//       inputRefs.current[5].focus();
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     const otpString = otp.join('');
    
//     if (otpString.length !== 6) {
//       setError('Please enter all 6 digits of the OTP');
//       return;
//     }
    
//     try {
//       await axios.post('http://localhost:5002/api/auth/verify-otp', { email, otp: otpString });
//       alert('Email verified successfully');
//       navigate('/login');
//     } catch (error) {
//       setError('Invalid OTP. Please try again.');
//     }
//   };

//   return (
//     <div className="verify-otp-wrapper" style={{
//       minHeight: '100vh',
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     }}>
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         zIndex: 0
//       }}>
//         <Velustro />
//       </div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Container
//           component="main"
//           maxWidth="xs"
//           sx={{
//             position: 'relative',
//             zIndex: 1,
//             p: 4,
//             boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//             borderRadius: '20px',
//             backgroundColor: 'rgba(0, 0, 0, 0.75)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255, 255, 255, 0.18)',
//             '& .MuiTextField-root': {
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.3)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.5)',
//                 },
//                 '& input': {
//                   color: 'white',
//                   textAlign: 'center',
//                   fontSize: '1.5rem',
//                   padding: '12px 0',
//                   '&:-webkit-autofill': {
//                     WebkitBoxShadow: '0 0 0 1000px black inset',
//                     WebkitTextFillColor: 'white',
//                     caretColor: 'white',
//                     transition: 'background-color 5002s ease-in-out 0s',
//                   },
//                 }
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'rgba(255, 255, 255, 0.7)',
//               },
//             }
//           }}
//         >
//           <Typography 
//             variant="h4" 
//             sx={{ 
//               textAlign: 'center', 
//               mb: 3,
//               color: 'white',
//               fontWeight: 600,
//               textTransform: 'uppercase',
//               letterSpacing: '2px'
//             }}
//           >
//             Verify OTP
//           </Typography>
          
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               textAlign: 'center', 
//               mb: 3,
//               color: 'rgba(255, 255, 255, 0.7)',
//             }}
//           >
//             Enter the 6-digit code sent to {email}
//           </Typography>

//           <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
//             <Grid container spacing={1} justifyContent="center">
//               {otp.map((digit, index) => (
//                 <Grid item key={index}>
//                   <TextField
//                     inputRef={(el) => (inputRefs.current[index] = el)}
//                     value={digit}
//                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     onPaste={index === 0 ? handlePaste : null}
//                     inputProps={{
//                       maxLength: 1,
//                       style: { 
//                         padding: '12px',
//                         width: '40px',
//                         height: '40px'
//                       }
//                     }}
//                     variant="outlined"
//                     autoComplete="off"
//                     sx={{
//                       width: '50px',
//                       height: '60px',
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '8px',
//                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                       }
//                     }}
//                   />
//                 </Grid>
//               ))}
//             </Grid>

//             {error && (
//               <Typography 
//                 sx={{ 
//                   color: '#ff4444', 
//                   textAlign: 'center', 
//                   mt: 2,
//                   mb: 2 
//                 }}
//               >
//                 {error}
//               </Typography>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{
//                 mt: 4,
//                 backgroundColor: '#4a90e2',
//                 padding: '12px',
//                 fontSize: '16px',
//                 fontWeight: 600,
//                 '&:hover': {
//                   backgroundColor: '#357abd'
//                 }
//               }}
//             >
//               Verify
//             </Button>
            
//             {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
//               <Typography 
//                 variant="body2" 
//                 sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
//               >
//                 Didn't receive the code?
//               </Typography>
//               <Button 
//                 sx={{ 
//                   color: '#4a90e2', 
//                   textTransform: 'none',
//                   '&:hover': {
//                     backgroundColor: 'transparent',
//                     textDecoration: 'underline'
//                   }
//                 }}
//               >
//                 Resend OTP
//               </Button>
//             </Box> */}
//           </Box>
//         </Container>
//       </motion.div>
//     </div>
//   );
// };

// export default VerifyOtpPage;
