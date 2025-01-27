import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login', 
          formData,
          config
        );
    
        localStorage.setItem('token', response.data.token);
        navigate('/Dashboards');
      } catch (error) {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    };


  return (
    <motion.div
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
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              ),
            }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
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
            <Link to='/forgot-password' style={{ color: 'red', textDecoration: 'none', marginRight: '10px' }}>
              Forgot Password?
            </Link><br></br>
            New user? <Link to='/register'>Register here</Link>
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
};

export default LoginPage;
