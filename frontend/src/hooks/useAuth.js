import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../screens/api/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(authService.getCurrentUser());
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const navigate = useNavigate();
  
  // Add useEffect to handle user state changes
  useEffect(() => {
    // If user is set and we have a token, we're logged in
    const token = localStorage.getItem('token');
    if (user && token) {
      console.log('User is authenticated, ready for navigation if needed');
    }
  }, [user]);
  
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with credentials:', {
        email: credentials.email,
        companyCode: credentials.companyCode,
        passwordProvided: !!credentials.password
      });
      
      const response = await authService.login(credentials);
      console.log('Login response received:', {
        success: response.success,
        userReceived: !!response.user,
        tokenReceived: !!response.token
      });
      
      setUser(response.user);
      
      // Clear any pending login data
      sessionStorage.removeItem('pendingLogin');
      
      console.log('Login successful, user state updated');

      // Add direct navigation here as a backup
    if (response.success && response.token) {
      console.log('Navigating to dashboard from useAuth hook');
      navigate('/Dashboards');
    }
    
      return response;
    } catch (error) {
      console.error('Login error in useAuth hook:', error);
      
      if (error.response) {
        // Handle verification required case
        if (error.response.status === 403 && error.response.data?.requiresVerification) {
          setVerificationNeeded(true);
          setVerificationEmail(error.response.data.email || credentials.email);
          setError('Email not verified. Please verify your email to continue.');
          return { requiresVerification: true, email: error.response.data.email || credentials.email };
        }
        
        // Handle other error responses
        setError(error.response.data?.message || 
                `Login failed (${error.response.status}): ${error.response.statusText}`);
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);
  
  const verifyEmail = useCallback((email) => {
    navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
  }, [navigate]);

  const resetLoadingState = useCallback(() => {
    setLoading(false);
    setError('');
  }, []);
  
  return {
    user,
    loading,
    error,
    verificationNeeded,
    verificationEmail,
    login,
    logout,
    verifyEmail,
    setError,
    resetLoadingState
  };
};

