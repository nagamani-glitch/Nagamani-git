import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Email } from '@mui/icons-material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(5); // 5 second countdown
    const navigate = useNavigate();

    // Countdown effect for auto-redirect
    useEffect(() => {
        let timer;
        if (openSuccessModal && redirectCountdown > 0) {
            timer = setTimeout(() => {
                setRedirectCountdown(redirectCountdown - 1);
            }, 1000);
        } else if (openSuccessModal && redirectCountdown === 0) {
            navigate('/login');
        }
        return () => clearTimeout(timer);
    }, [openSuccessModal, redirectCountdown, navigate]);

    const handleForgotPassword = async () => {
        // Basic email validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5002/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            // Show success modal and start countdown
            setOpenSuccessModal(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="forgot-password-wrapper" style={{
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
    mt: 8,
    p: 4,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'black',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '& input': {
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          // Add these styles for autofill
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px black inset',
            WebkitTextFillColor: 'white',
            caretColor: 'white',
            transition: 'background-color 5002s ease-in-out 0s',
          },
          '&:-webkit-autofill:hover, &:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px black inset',
            WebkitTextFillColor: 'white',
          },
        }
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      }
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
                        Forgot Password
                    </Typography>

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleForgotPassword}
                        sx={{
                            backgroundColor: '#4a90e2',
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#357abd'
                            }
                        }}
                    >
                        Send Reset Link
                    </Button>

                    {message && !openSuccessModal && (
                        <Typography 
                            sx={{ 
                                mt: 3, 
                                textAlign: 'center', 
                                color: 'rgba(255, 255, 255, 0.8)' 
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </Container>
            </motion.div>

            {/* Auto-redirect Success Modal */}
            <Dialog
                open={openSuccessModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: '10px',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        maxWidth: '400px',
                        width: '100%',
                        padding: '20px'
                    }
                }}
            >
                <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                    <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                    
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                        Password Reset Link Sent
                    </Typography>
                    
                    {/* Email highlight box */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: 'rgba(74, 144, 226, 0.2)', 
                        borderRadius: '8px',
                        padding: '12px',
                        margin: '16px 0'
                    }}>
                        <Email sx={{ color: '#4a90e2', mr: 1 }} />
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                fontWeight: 'bold',
                                color: '#4a90e2'
                            }}
                        >
                            {email}
                        </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Please check your inbox and follow the instructions to reset your password.
                    </Typography>
                    
                    {/* Countdown indicator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress 
                            variant="determinate" 
                            value={(redirectCountdown / 5) * 100} 
                            size={30} 
                            thickness={5}
                            sx={{ color: '#4a90e2', mr: 2 }}
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Redirecting to login in {redirectCountdown} seconds...
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ForgotPassword;

