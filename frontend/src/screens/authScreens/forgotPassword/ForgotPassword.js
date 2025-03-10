// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Typography, Box } from '@mui/material';

// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');

//     const handleForgotPassword = async () => {
//         try {
//             const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
//             setMessage(response.data.message);
//         } catch (error) {
//             setMessage(error.response.data.message || 'An error occurred.');
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 maxWidth: '400px',
//                 margin: 'auto',
//                 padding: '20px',
//                 borderRadius: '8px',
//                 boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//                 background: '#f9f9f9',
//                 marginTop: '150px',
//                 // mt: 8,
//             }}
//         >
//             <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
//                 Forgot Password
//             </Typography>
//             <TextField
//                 label="Email"
//                 variant="outlined"
//                 fullWidth
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 sx={{ mb: 3 }}
//             />
//             <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleForgotPassword}
//                 sx={{
//                     background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
//                     color: 'white',
//                     py: 1.5,
//                     fontSize: '1rem',
//                 }}
//             >
//                 Send Reset Link
//             </Button>
//             {message && (
//                 <Typography sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
//                     {message}
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";

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
                                backgroundColor:'#000',

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

                    {message && (
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
        </div>
    );
};

export default ForgotPassword;
