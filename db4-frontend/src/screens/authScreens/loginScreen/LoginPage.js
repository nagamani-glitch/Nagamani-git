// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {Link} from 'react-router-dom'

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/login', formData);
//       alert('User logged in successfully');
//       console.log(response.data.token)
//       localStorage.setItem('token', response.data.token);
//       navigate('/home')
      
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="form">
//         <h4>Login</h4>
//         <label htmlFor='email'>Email</label>
//         <input type="email" id='email' name="email" placeholder="Your Email..." onChange={handleChange} />
//         <label htmlFor='password'>Password</label>
//         <input type="password" id='password' name="password" placeholder="Your Password..." onChange={handleChange} />
//         <button type="submit">  Login</button>
//         <p>New user? <Link to='/register' >Register here</Link></p>  
//       </form>
//     </div>
//   );
// };

// export default LoginPage;





// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(''); // Clear the error message when the user starts typing
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send login request to backend
//       const response = await axios.post('/api/auth/login', formData);
//       alert('User logged in successfully');
//       console.log(response.data.token);

//       // Store the token in localStorage
//       localStorage.setItem('token', response.data.token);

//       // Redirect to home page after successful login
//       navigate('/home');
      
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setError('Invalid email or password. Please try again.');
//       } else {
//         setError('An error occurred. Please try again later.');
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="form">
//         <h4>Login</h4>
        
//         {/* Email Input */}
//         <label htmlFor='email'>Email</label>
//         <input 
//           type="email" 
//           id='email' 
//           name="email" 
//           placeholder="Your Email..." 
//           onChange={handleChange} 
//           value={formData.email}
//         />

//         {/* Password Input */}
//         <label htmlFor='password'>Password</label>
//         <input 
//           type="password" 
//           id='password' 
//           name="password" 
//           placeholder="Your Password..." 
//           onChange={handleChange} 
//           value={formData.password}
//         />

//         {/* Display error if login fails */}
//         {error && <p className="error">{error}</p>}

//         {/* Submit Button */}
//         <button type="submit">Login</button>

//         {/* Registration link for new users */}
//         <p>New user? <Link to='/register'>Register here</Link></p>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;




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
<<<<<<< HEAD
      navigate('/Dashboards');
=======
      navigate('/home');
>>>>>>> 1db990a3128176f87a28635846e59738514912c0
    } catch (error) {
      if (error.response && error.response.status === 401) {
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
