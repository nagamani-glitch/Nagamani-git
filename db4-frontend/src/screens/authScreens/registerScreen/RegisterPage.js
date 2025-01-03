import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons
import './RegisterPage.css';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [otp, setOtp] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false); // State to control the OTP modal visibility
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Show the OTP modal immediately after clicking Register
      setShowOtpModal(true);

      // Send the registration data to the backend
      await axios.post('/api/auth/register', formData);
      setOtpSent(true); // OTP has been sent
      navigate('/verifyOtp')
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please try login!');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/verify-otp', { email: formData.email, otp });
      alert('Email verified successfully');
      navigate('/login');
      setShowOtpModal(false); // Close the modal after successful OTP verification
    } catch (error) {
      setErrorOtp('Invalid OTP. Please try again.');
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
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
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            required
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
              Register
            </Button>
          </motion.div>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already a user? <Link to='/login'>Login here</Link>
          </Typography>
        </Box>
      </Container>
    </motion.div>
    </>
  );
};

export default RegisterPage;

// import { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import './RegisterPage.css';
// import { motion } from 'framer-motion';
// import { Box, Button, TextField, Typography, Container, IconButton, Modal } from '@mui/material';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [errorOtp, setErrorOtp] = useState('');
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setShowOtpModal(true);
//       await axios.post('/api/auth/register', formData);
//       setOtpSent(true);
//       navigate('/verifyOtp');
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         setError('User already exists. Please try login!');
//       } else {
//         setError('An error occurred. Please try again.');
//       }
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/auth/verify-otp', { email: formData.email, otp });
//       setErrorOtp('');
//       navigate('/login');
//       setShowOtpModal(false);
//     } catch (error) {
//       setErrorOtp('Invalid OTP. Please try again.');
//     }
//   };

//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         style={{ marginTop: "120px" }}
//       >
//         <Container
//           component="main"
//           maxWidth="xs"
//           sx={{
//             mt: 8,
//             p: 4,
//             boxShadow: 3,
//             borderRadius: 2,
//             backgroundColor: 'white',
//           }}
//         >
//           <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
//             Register
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               fullWidth
//               label="Name"
//               name="name"
//               type="text"
//               autoComplete="name"
//               autoFocus
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               fullWidth
//               label="Email Address"
//               name="email"
//               type="email"
//               autoComplete="email"
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               autoComplete="current-password"
//               onChange={handleChange}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <IconButton onClick={togglePasswordVisibility} edge="end">
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </IconButton>
//                 ),
//               }}
//             />
//             {error && (
//               <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//                 {error}
//               </Typography>
//             )}
//             <motion.div whileHover={{ scale: 1.05 }}>
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//               >
//                 Register
//               </Button>
//             </motion.div>
//             <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
//               Already a user? <Link to='/login'>Login here</Link>
//             </Typography>
//           </Box>
//         </Container>
//       </motion.div>

//       <Modal
//         open={showOtpModal}
//         onClose={() => setShowOtpModal(false)}
//       >
//         <Box sx={modalStyle}>
//           <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//             Enter OTP
//           </Typography>
//           <TextField
//             fullWidth
//             label="OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             margin="normal"
//           />
//           {errorOtp && (
//             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//               {errorOtp}
//             </Typography>
//           )}
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={handleOtpSubmit}
//             sx={{ mt: 2 }}
//           >
//             Verify OTP
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default RegisterPage;
