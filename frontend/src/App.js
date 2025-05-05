import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainScreen from './screens/mainScreen/MainScreen';
import LoginPage from './screens/authScreens/loginScreen/LoginPage';
import RegisterPage from './screens/authScreens/registerScreen/RegisterPage';
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

// Add this to debug route rendering
console.log('App rendering, checking localStorage:', {
  hasToken: !!localStorage.getItem('token'),
  hasUser: !!localStorage.getItem('user')
});


  function App() {
    return (
      <BrowserRouter>
        <SidebarProvider>
          <NotificationProvider>
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
          </NotificationProvider>
        </SidebarProvider>
      </BrowserRouter>
    );
  }export default App;
