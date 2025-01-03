// VerifyOtpPage
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      alert('Email verified successfully');
      navigate('/login');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
        Verify OTP
      </Typography>
      <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Enter OTP"
          name="otp"
          type="text"
          onChange={handleOtpChange}
          required
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Verify
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyOtpPage;