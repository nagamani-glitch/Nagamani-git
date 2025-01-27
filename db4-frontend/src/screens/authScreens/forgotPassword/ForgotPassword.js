// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Container,
//   CircularProgress,
// } from "@mui/material";
// import { motion } from "framer-motion";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();





// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setLoading(true);
// //   setError('');
// //   setMessage('');
  
// //   try {
// //       const response = await axios.post(
// //           'http://localhost:5000/api/auth/forgot-password',
// //           { email },
// //           {
// //               headers: {
// //                   'Content-Type': 'application/json'
// //               },
// //               withCredentials: true
// //           }
// //       );
// //       setMessage('Reset link sent successfully to your email');
// //         setEmail('');
// //   } catch (error) {
// //     console.error('Detailed error:', {
// //         message: error.message,
// //         response: error.response,
// //         status: error.response?.status
// //     });
// //     setError(error.response?.data?.message || 'Failed to send reset link');
// // } finally {
// //     setLoading(false);
// // }
// // };



// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setLoading(true);
// //   setMessage('');
// //   setError('');
  
// //   try {
// //       const response = await axios({
// //           method: 'post',
// //           url: 'http://localhost:5000/api/auth/forgot-password',
// //           data: { email },
// //           headers: {
// //               'Content-Type': 'application/json'
// //           }
// //       });
      
// //       if (response.data) {
// //           setMessage('Reset link sent to your email successfully');
// //           setEmail('');
// //       }
// //   } catch (error) {
// //       console.log('Error details:', {
// //           status: error.response?.status,
// //           data: error.response?.data,
// //           message: error.message
// //       });
// //       setError('Unable to send reset link. Please try again.');
// //   } finally {
// //       setLoading(false);
// //   }
// // };



// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMessage('');
    
//     try {
//         const response = await axios({
//             method: 'post',
//             url: 'http://localhost:5000/api/auth/forgot-password',
//             data: { email },
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
        
//         if (response.data) {
//             setMessage('Reset link sent to your email successfully');
//             setEmail('');
//         }
//     } catch (error) {
//         console.log('Error details:', {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message
//         });
//         setError('Unable to send reset link. Please try again.');
//     } finally {
//         setLoading(false);
//     }
// };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       style={{ marginTop: "120px" }}
//     >
//       <Container component="main" maxWidth="xs">
//         <Box
//           sx={{
//             p: 4,
//             boxShadow: 3,
//             borderRadius: 2,
//             backgroundColor: "white",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h5" component="h1" gutterBottom>
//             Forgot Password
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{ mt: 1, width: "100%" }}
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading || !email}
//             >
//               {loading ? <CircularProgress size={24} /> : "Send  Link"}
//             </Button>

//             {message && (
//               <Typography color="primary" textAlign="center" sx={{ mt: 2 }}>
//                 {message}
//               </Typography>
//             )}
//             {error && (
//               <Typography color="error" textAlign="center" sx={{ mt: 2 }}>
//                 {error}
//               </Typography>
//             )}
//           </Box>
//         </Box>
//       </Container>
//     </motion.div>
//   );
// };

// export default ForgotPassword;




import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred.');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                mt: 8,
            }}
        >
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
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
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                }}
            >
                Send Reset Link
            </Button>
            {message && (
                <Typography sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ForgotPassword;
