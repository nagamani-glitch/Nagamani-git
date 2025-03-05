// import { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import './RegisterPage.css';
// import { motion } from 'framer-motion';
// import { Box, Button, TextField, Typography, Container, InputAdornment, IconButton } from '@mui/material';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match!');
//       return;
//     }
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', formData);
//       alert('OTP sent to email. Please verify.');
//       setOtpSent(true);
//       navigate('/verifyOtp', { state: { email: formData.email } });
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         setError('User already exists. Please try login!');
//       } else {
//         setError('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       style={{ marginTop: '120px' }}
//     >
//       <Container
//         component="main"
//         maxWidth="xs"
//         sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}
//       >
//         <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
//           Register
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Name"
//             name="name"
//             type="text"
//             autoComplete="name"
//             autoFocus
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Email Address"
//             name="email"
//             type="email"
//             autoComplete="email"
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Password"
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             autoComplete="new-password"
//             onChange={handleChange}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={togglePasswordVisibility} edge="end">
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type={showConfirmPassword ? 'text' : 'password'}
//             autoComplete="new-password"
//             onChange={handleChange}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
//                     {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           {error && (
//             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//               {error}
//             </Typography>
//           )}
//           <motion.div whileHover={{ scale: 1.05 }}>
//             <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//               Register
//             </Button>
//           </motion.div>
//           <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
//             Already a user? <Link to='/login'>Login here</Link>
//           </Typography>
//         </Box>
//       </Container>
//     </motion.div>
//   );
// };

// export default RegisterPage;

import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Velustro } from "uvcanvas";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('OTP sent to email. Please verify.');
      setOtpSent(true);
      navigate('/verifyOtp', { state: { email: formData.email } });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please try login!');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-main-wrapper">
      <div className="velustro-container">
        <Velustro />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="register-content"
      >
        <Container
          component="main"
          maxWidth="xs"
          // sx={{
          //   mt: 8,
          //   p: 4,
          //   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          //   borderRadius: '20px',
          //   backgroundColor: 'rgba(0, 0, 0, 0.75)',
          //   backdropFilter: 'blur(15px)',
          //   border: '1px solid hsla(0, 0.00%, 100.00%, 0.18)',
          //   '& .MuiTextField-root': {
          //     '& .MuiOutlinedInput-root': {
          //       '& fieldset': {
          //         borderColor: 'rgba(255, 255, 255, 0.3)',
          //       },
          //       '&:hover fieldset': {
          //         borderColor: 'rgba(255, 255, 255, 0.5)',
          //       },
          //     },
          //     '& .MuiInputLabel-root': {
          //       color: 'rgba(255, 255, 255, 0.7)',


          //     },
          //     '& .MuiOutlinedInput-input': {
          //       color: 'white',
          //      backgroundColor:'#000',
          //       //background: "transparent",
          //       // opacity:'0.7',
          //     },
          //   },
          // }}

          // Update the Container sx prop styling:

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
                backgroundColor: 'black', // Add this line
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '& input': { // Add this block
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
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
            component="h1"
            sx={{
              mb: 2,
              textAlign: 'center',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              autoFocus
              onChange={handleChange}
              required
            />

            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
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
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#4a90e2',
                  '&:hover': {
                    backgroundColor: '#357abd'
                  },
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                Register
              </Button>
            </motion.div>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                '& a': {
                  color: '#4a90e2',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              Already a user? <Link to='/login'>Login here</Link>
            </Typography>
          </Box>
        </Container>

      </motion.div>
    </div>
  );
};

export default RegisterPage;
