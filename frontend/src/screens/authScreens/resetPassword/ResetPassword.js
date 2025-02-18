import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
 
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
        <Box
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                marginTop: '150px',
            }}
        >
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
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
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                }}
            >
                Reset Password
            </Button>
            {message && (
                <Typography sx={{ mt: 3, textAlign: 'center', color: message.includes('match') ? 'red' : 'green' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};
 
export default ResetPassword;