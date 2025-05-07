import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, logoutUser } from '../redux/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check authentication status once on mount
    const token = localStorage.getItem('token');
    
    if (isAuthenticated && !token) {
      // If Redux says we're authenticated but token is missing, logout properly
      console.log('PrivateRoute: Token missing but Redux state is authenticated, dispatching logout');
      dispatch(logoutUser()).then(() => {
        setShouldRedirect(true);
      });
    } else {
      // Authentication check complete
      setIsChecking(false);
    }
  }, [isAuthenticated, dispatch]);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated or if we determined we should redirect
  if (!isAuthenticated || shouldRedirect) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the child routes
  console.log('Authenticated, rendering protected content');
  return <Outlet />;
};

export default PrivateRoute;

