import './App.css';
import { Route, BrowserRouter, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainScreen from './screens/mainScreen/MainScreen';
import LoginPage from './screens/authScreens/loginScreen/LoginPage';
import HomeScreen from './screens/HomeScreen';
import Dashboard from './screens/templates/Dashboard';
import PrivateRoute from './screens/PrivateRoute';
import { Container } from 'react-bootstrap';
import { SidebarProvider } from './Context';
import VerifyOtpPage from './screens/authScreens/registerScreen/VerifyOtpPage';
import ForgotPassword from './screens/authScreens/forgotPassword/ForgotPassword';
import ResetPassword from './screens/authScreens/resetPassword/ResetPassword';
import Settings from './screens/Settings';
import { NotificationProvider } from './context/NotificationContext';
import RegisterCompanyPage from './screens/authScreens/registerScreen/RegisterCompanyPage.js';
import CompanySettings from './screens/authScreens/auth/CompanySettings.js';
import { selectIsAuthenticated, selectAuthLoading , logoutUser } from './redux/authSlice';

// Create a wrapper component to use hooks
function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('App mounted, authentication state:', isAuthenticated);
    
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (isAuthenticated && !token) {
      console.log('Token missing but state shows authenticated - dispatching logout');
      dispatch(logoutUser());
    }
  }, [isAuthenticated, dispatch]);
  
  // Add the navigation effect with debounce
  useEffect(() => {
    // Skip this effect during authentication transitions
    if (loading) return;
    
    // Check if user is authenticated but not on a protected route
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/login') {
        console.log('User is authenticated but on public route, redirecting to dashboard');
        
        // Use a small timeout to prevent rapid navigation
        const timeoutId = setTimeout(() => {
          navigate('/Dashboards');
        }, 100);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isAuthenticated, navigate, loading, location.pathname]);
  
  return (
    <>
      <Header />
      <Container fluid style={{ padding: "0", margin: "0", width: "100%" }}>
        <Routes>
          <Route path='/' element={<MainScreen />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/register' element={<RegisterCompanyPage />} />
          <Route path='/verifyOtp' element={<VerifyOtpPage />} />
          <Route path='/verify-email' element={<VerifyOtpPage />} />
      
          <Route element={<PrivateRoute />}>
            <Route path='/home' element={<HomeScreen />} />
            <Route path='/Dashboards/*' element={<Dashboard />} />
            <Route path="/admin/company-settings" element={<CompanySettings />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}


// Main App component
function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;


// import './App.css';
// import { Route, BrowserRouter, Routes, Navigate, Outlet, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Header from './components/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import MainScreen from './screens/mainScreen/MainScreen';
// import LoginPage from './screens/authScreens/loginScreen/LoginPage';
// import RegisterPage from './screens/authScreens/registerScreen/RegisterPage';
// import HomeScreen from './screens/HomeScreen';
// import Dashboard from './screens/templates/Dashboard';
// import { Container } from 'react-bootstrap';
// import { SidebarProvider } from './Context';
// import VerifyOtpPage from './screens/authScreens/registerScreen/VerifyOtpPage';
// import ForgotPassword from './screens/authScreens/forgotPassword/ForgotPassword';
// import ResetPassword from './screens/authScreens/resetPassword/ResetPassword';
// import Settings from './screens/Settings';
// import { NotificationProvider } from './context/NotificationContext';
// import RegisterCompanyPage from './screens/authScreens/registerScreen/RegisterCompanyPage.js';
// import CompanySettings from './screens/authScreens/auth/CompanySettings.js';
// import { selectIsAuthenticated, selectAuthLoading } from './redux/authSlice';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';
// import { useEffect } from 'react';

// // Redux-based PrivateRoute component
// const PrivateRoute = () => {
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const loading = useSelector(selectAuthLoading);
//   const navigate = useNavigate(); // Define navigate here

//   // Add the useEffect inside the component
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '100vh',
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Redirect to login if not authenticated
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// // LoginRoute component to handle redirects for authenticated users
// const LoginRoute = () => {
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   return isAuthenticated ? <Navigate to="/Dashboards" /> : <LoginPage />;
// };

// function App() {
//   // Add debug logging inside the component
//   console.log('App rendering, checking localStorage:', {
//     hasToken: !!localStorage.getItem('token'),
//     hasUser: !!localStorage.getItem('user')
//   });

//   return (
//     <BrowserRouter>
//       <SidebarProvider>
//         <NotificationProvider>
//           <Header />
//           <Container fluid style={{ padding: "0", margin: "0", width: "100%" }}>
//             <Routes>
//               {/* Public routes */}
//               <Route path='/' element={<MainScreen />} />
//               <Route path='/login' element={<LoginRoute />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path='/reset-password/:token' element={<ResetPassword />} />
//               <Route path='/register' element={<RegisterCompanyPage />} />
//               <Route path='/verifyOtp' element={<VerifyOtpPage />} />
//               <Route path='/verify-email' element={<VerifyOtpPage />} />
          
//               {/* Protected routes */}
//               <Route element={<PrivateRoute />}>
//                 <Route path='/home' element={<HomeScreen />} />
//                 <Route path='/Dashboards/*' element={<Dashboard />} />
//                 <Route path="/admin/company-settings" element={<CompanySettings />} />
//                 <Route path="/settings" element={<Settings />} />
//               </Route>
//             </Routes>
//           </Container>
//         </NotificationProvider>
//       </SidebarProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// import './App.css';
// import { Route, BrowserRouter, Routes } from 'react-router-dom';
// import Header from './components/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import MainScreen from './screens/mainScreen/MainScreen';
// import LoginPage from './screens/authScreens/loginScreen/LoginPage';
// import RegisterPage from './screens/authScreens/registerScreen/RegisterPage';
// import HomeScreen from './screens/HomeScreen';
// import Dashboard from './screens/templates/Dashboard';
// import PrivateRoute from './screens/PrivateRoute';
// import { Container } from 'react-bootstrap';
// import { SidebarProvider } from './Context';
// import VerifyOtpPage from './screens/authScreens/registerScreen/VerifyOtpPage';
// import ForgotPassword from './screens/authScreens/forgotPassword/ForgotPassword';
// import ResetPassword from './screens/authScreens/resetPassword/ResetPassword';
// import Settings from './screens/Settings';
// import { NotificationProvider } from './context/NotificationContext';
// import RegisterCompanyPage from './screens/authScreens/registerScreen/RegisterCompanyPage.js';
// import CompanySettings from './screens/authScreens/auth/CompanySettings.js';

// // Add this to debug route rendering
// console.log('App rendering, checking localStorage:', {
//   hasToken: !!localStorage.getItem('token'),
//   hasUser: !!localStorage.getItem('user')
// });


//   function App() {
//     return (
//       <BrowserRouter>
//         <SidebarProvider>
//           <NotificationProvider>
//             <Header />
//             <Container fluid style={{ padding: "0", margin: "0", width: "100%" }}>
//               <Routes>
//                 <Route path='/' element={<MainScreen />} />
//                 <Route path='/login' element={<LoginPage />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route path='/reset-password/:token' element={<ResetPassword />} />
//                 <Route path='/register' element={<RegisterCompanyPage />} />
//                 <Route path='/verifyOtp' element={<VerifyOtpPage />} />
//                 <Route path='/verify-email' element={<VerifyOtpPage />} />
            
//                 <Route element={<PrivateRoute />}>
//                   <Route path='/home' element={<HomeScreen />} />
//                   <Route path='/Dashboards/*' element={<Dashboard />} />

//                   <Route path="/admin/company-settings" element={<CompanySettings />} />
//                   <Route path="/settings" element={<Settings />} />
//                 </Route>
//               </Routes>
//             </Container>
//           </NotificationProvider>
//         </SidebarProvider>
//       </BrowserRouter>
//     );
//   }export default App;