import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check for token directly
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  console.log('PrivateRoute check - isAuthenticated:', isAuthenticated);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child routes
  console.log('Authenticated, rendering protected content');
  return <Outlet />;
};

export default PrivateRoute;


// import React from 'react';
// import { Outlet, Navigate } from 'react-router-dom';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     const token = localStorage.getItem('token');

//     return token ? <Outlet /> : <Navigate to="/login" />;
  
// };

// export default PrivateRoute;
