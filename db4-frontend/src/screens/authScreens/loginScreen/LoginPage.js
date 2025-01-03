import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  // Handle input changes
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear the error message when the user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert('User logged in successfully');
      
      localStorage.setItem('token', response.data.token);
      navigate('/Dashboards');

    } catch (error) {
      if (error.response) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{marginTop:"120px"}}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            required
          />
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </motion.div>
          {error && <Typography color="error">{error}</Typography>}
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            New user? <Link to='/register'>Register here</Link>
          </Typography>
        </Box>
      </Container>
    </motion.div>
    </>
  );
};

export default LoginPage;
