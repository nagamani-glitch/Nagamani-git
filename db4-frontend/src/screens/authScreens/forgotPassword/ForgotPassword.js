import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

  const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setMessage('');

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:5000/api/auth/forgot-password',
  //       { email }
  //     );
  //     console.log('Response:', response); // Add this line
  //     setMessage('Reset link sent! Please check your email inbox and spam folder.');
  //     setEmail('');
  //   } catch (err) {
  //     console.error('Error details:', err); // Add this line
  //     setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setMessage('');
  
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:5000/api/auth/forgot-password',
  //       { email },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
  //     setMessage('Reset link sent! Please check your email inbox.');
  //     setEmail('');
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError(
  //       err.response?.data?.message || 
  //       'Connection error. Please check your network and try again.'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setMessage('');

  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     withCredentials: true
  //   };

  //   try {
  //     console.log('Sending request...'); // Debug log
  //     const response = await axios.post(
  //       'http://localhost:5000/api/auth/forgot-password',
  //       { email },
  //       config
  //     );
  //     console.log('Response received:', response.data); // Debug log
      
  //     setMessage('Reset link sent! Please check your email inbox.');
  //     setEmail('');
  //   } catch (err) {
  //     console.log('Error occurred:', err); // Debug log
  //     if (err.response) {
  //       setError(err.response.data.message);
  //     } else {
  //       setError('Network error. Please try again.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setMessage('');

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:5000/api/auth/forgot-password',
  //       { email },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
      
  //     if (response.data) {
  //       setMessage('Reset link sent! Please check your email inbox.');
  //       setEmail('');
  //     }
  //   } catch (err) {
  //     console.error('Error details:', err);
  //     setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
  //   }
  // };  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setMessage('');
  
  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     withCredentials: true
  //   };
  
  //   try {
  //     console.log('Sending request...'); // Debug log
  //     const response = await axios.post(
  //       'http://localhost:5000/api/auth/forgot-password',
  //       { email },
  //       config
  //     );
  //     console.log('Response received:', response.data); // Debug log
      
  //     setMessage('Reset link sent! Please check your email inbox.');
  //     setEmail('');
  //   } catch (err) {
  //     console.log('Error occurred:', err); // Debug log
  //     if (err.response) {
  //       setError(err.response.data.message);
  //     } else {
  //       setError('Network error. Please try again.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    
      if (response.data) {
        setMessage('Reset link sent! Please check your email inbox.');
        setEmail('');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: "120px" }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!email}
            >
              Send Link
            </Button>
            
            {message && (
              <Typography color="primary" textAlign="center" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography color="error" textAlign="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </motion.div>
  );};

export default ForgotPassword;