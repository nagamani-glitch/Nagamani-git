// // VerifyOtpPage
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Box, Button, TextField, Typography, Container } from '@mui/material';

// const VerifyOtpPage = () => {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { email } = location.state;

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
//       alert('Email verified successfully');
//       navigate('/login');
//     } catch (error) {
//       setError('Invalid OTP. Please try again.');
//     }
//   };

//   return (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}
//     >
//       <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
//         Verify OTP
//       </Typography>
//       <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Enter OTP"
//           name="otp"
//           type="text"
//           onChange={handleOtpChange}
//           required
//         />
//         {error && (
//           <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//             {error}
//           </Typography>
//         )}
//         <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//           Verify
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default VerifyOtpPage;
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";

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
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
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

          <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Enter OTP"
              name="otp"
              type="text"
              onChange={handleOtpChange}
              required
              sx={{ mb: 3 }}
            />

            {error && (
              <Typography 
                sx={{ 
                  color: '#ff4444', 
                  textAlign: 'center', 
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
          </Box>
        </Container>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
