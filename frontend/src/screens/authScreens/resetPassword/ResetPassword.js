// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Visibility, VisibilityOff } from '@mui/icons-material';

// const ResetPassword = () => {
//     const { token } = useParams();
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const navigate = useNavigate();

//     const handleResetPassword = async () => {
//         if (password !== confirmPassword) {
//             setMessage('Passwords do not match');
//             return;
//         }

//         try {
//             const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
//             setMessage(response.data.message);
//             setTimeout(() => navigate('/login'), 2000);
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
//             }}
//         >
//             <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
//                 Reset Password
//             </Typography>
//             <TextField
//                 label="New Password"
//                 type={showPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 fullWidth
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 sx={{ mb: 3 }}
//                 InputProps={{
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <IconButton
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 edge="end"
//                             >
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//             <TextField
//                 label="Confirm Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 fullWidth
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 sx={{ mb: 3 }}
//                 InputProps={{
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <IconButton
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 edge="end"
//                             >
//                                 {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//             <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleResetPassword}
//                 sx={{
//                     background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
//                     color: 'white',
//                     py: 1.5,
//                     fontSize: '1rem',
//                 }}
//             >
//                 Reset Password
//             </Button>
//             {message && (
//                 <Typography sx={{ mt: 3, textAlign: 'center', color: message.includes('match') ? 'red' : 'green' }}>
//                     {message}
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// export default ResetPassword;


import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, IconButton, InputAdornment, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred.');
        }
    };

    return (
        <div className="reset-password-wrapper" style={{
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

                    // sx={{
                    //     // ... existing styles ...
                    //     '& .MuiTextField-root': {
                    //         '& .MuiOutlinedInput-root': {
                    //             backgroundColor: 'black', // This will apply to all inputs
                    //             '& fieldset': {
                    //                 borderColor: 'rgba(255, 255, 255, 0.3)',
                    //             },
                    //             '&:hover fieldset': {
                    //                 borderColor: 'rgba(255, 255, 255, 0.5)',
                    //             },
                    //             '& input': {
                    //                 color: 'white',
                    //                 backgroundColor: 'black', // This ensures the input area itself is black
                    //             }
                    //         },
                    //         '& .MuiInputLabel-root': {
                    //             color: 'rgba(255, 255, 255, 0.7)',
                    //         },
                    //     }
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
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}
                    >
                        Reset Password
                    </Typography>

                    <TextField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleResetPassword}
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
                        Reset Password
                    </Button>

                    {message && (
                        <Typography
                            sx={{
                                mt: 3,
                                textAlign: 'center',
                                color: message.includes('match') ? '#ff4444' : 'rgba(255, 255, 255, 0.8)'
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

export default ResetPassword;
