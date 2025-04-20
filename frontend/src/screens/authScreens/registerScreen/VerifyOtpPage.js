import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  
  // Create refs for each input field
  const inputRefs = useRef([]);
  
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Create a new array with the updated value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input if current input is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpString });
      alert('Email verified successfully');
      navigate('/login');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="verify-otp-wrapper" style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        <Velustro />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '& input': {
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  padding: '12px 0',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px black inset',
                    WebkitTextFillColor: 'white',
                    caretColor: 'white',
                    transition: 'background-color 5000s ease-in-out 0s',
                  },
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            Verify OTP
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Enter the 6-digit code sent to {email}
          </Typography>

          <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={1} justifyContent="center">
              {otp.map((digit, index) => (
                <Grid item key={index}>
                  <TextField
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : null}
                    inputProps={{
                      maxLength: 1,
                      style: { 
                        padding: '12px',
                        width: '40px',
                        height: '40px'
                      }
                    }}
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      width: '50px',
                      height: '60px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {error && (
              <Typography 
                sx={{ 
                  color: '#ff4444', 
                  textAlign: 'center', 
                  mt: 2,
                  mb: 2 
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: '#4a90e2',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#357abd'
                }
              }}
            >
              Verify
            </Button>
            
            {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Didn't receive the code?
              </Typography>
              <Button 
                sx={{ 
                  color: '#4a90e2', 
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Resend OTP
              </Button>
            </Box> */}
          </Box>
        </Container>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
