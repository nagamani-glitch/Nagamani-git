import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  styled,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../../../screens/api/auth';

// Create theme
const theme = createTheme();

// Styled components
const RegisterContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
});

const RegisterPaper = styled(Paper)({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '800px',
  width: '100%',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
});

// Steps for registration
const steps = ['Company Information', 'Admin Account'];

const RegisterCompanyPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Company form data
  const [companyData, setCompanyData] = useState({
    name: '',
    companyCode: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });
  
  // Admin form data
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  
  // Handle company form change
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setCompanyData({
        ...companyData,
        [parent]: {
          ...companyData[parent],
          [child]: value
        }
      });
    } else if (name === 'companyCode') {
      // Convert company code to uppercase
      setCompanyData({
        ...companyData,
        [name]: value.toUpperCase()
      });
    } else {
      setCompanyData({
        ...companyData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (error) setError('');
  };
  
  // Handle admin form change
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      // Convert email to lowercase
      setAdminData({
        ...adminData,
        [name]: value.toLowerCase()
      });
    } else {
      setAdminData({
        ...adminData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (error) setError('');
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Validate company form
  const validateCompanyForm = () => {
    if (!companyData.name.trim()) {
      setError('Company name is required');
      return false;
    }
    
    if (!companyData.companyCode.trim()) {
      setError('Company code is required');
      return false;
    }
    
    // Company code format validation (alphanumeric, 3-10 chars)
    if (!/^[A-Z0-9]{3,10}$/.test(companyData.companyCode)) {
      setError('Company code must be 3-10 alphanumeric characters');
      return false;
    }
    
    if (!companyData.contactEmail.trim()) {
      setError('Contact email is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.contactEmail)) {
      setError('Please enter a valid contact email');
      return false;
    }
    
    return true;
  };
  
  // Validate admin form
  const validateAdminForm = () => {
    if (!adminData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!adminData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    
    if (!adminData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    
    if (!adminData.password) {
      setError('Password is required');
      return false;
    }
    
    // Password strength validation
    if (adminData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(adminData.password)) {
      setError('Password must include uppercase, lowercase, number and special character');
      return false;
    }
    
    if (adminData.password !== adminData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate company form before proceeding
      if (!validateCompanyForm()) return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate admin form
    if (!validateAdminForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for API
      const registrationData = {
        company: {
          ...companyData
        },
        admin: {
          ...adminData,
          name: `${adminData.firstName} ${adminData.middleName ? adminData.middleName + ' ' : ''}${adminData.lastName}`
        }
      };
      
      // Remove confirmPassword as it's not needed for the API
      delete registrationData.admin.confirmPassword;
      
      // Call API to register company
      const response = await authService.registerCompany(registrationData);
      
      // Redirect to OTP verification page
      if (response.email) {
        navigate(`/verify-email?email=${encodeURIComponent(response.email)}`);
      } else {
        // Fallback to admin email if response email is not available
        navigate(`/verify-email?email=${encodeURIComponent(adminData.email)}`);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Registration failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Render company form
  const renderCompanyForm = () => (
    <Box component="form" sx={{ mt: 2, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Company Name"
            name="name"
            value={companyData.name}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="companyCode"
            label="Company Code"
            name="companyCode"
            value={companyData.companyCode}
            onChange={handleCompanyChange}
            disabled={loading}
            helperText="3-10 characters, alphanumeric only"
            inputProps={{
              style: { textTransform: 'uppercase' }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="industry"
            label="Industry"
            name="industry"
            value={companyData.industry}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="contactEmail"
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={companyData.contactEmail}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="contactPhone"
            label="Contact Phone"
            name="contactPhone"
            value={companyData.contactPhone}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Company Address (Optional)
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="street"
            label="Street Address"
            name="address.street"
            value={companyData.address.street}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="city"
            label="City"
            name="address.city"
            value={companyData.address.city}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="state"
            label="State/Province"
            name="address.state"
            value={companyData.address.state}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="country"
            label="Country"
            name="address.country"
            value={companyData.address.country}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="zipCode"
            label="Zip/Postal Code"
            name="address.zipCode"
            value={companyData.address.zipCode}
            onChange={handleCompanyChange}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
  
  // Render admin form
  const renderAdminForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={adminData.firstName}
            onChange={handleAdminChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="middleName"
            label="Middle Name"
            name="middleName"
            value={adminData.middleName}
            onChange={handleAdminChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={adminData.lastName}
            onChange={handleAdminChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={adminData.email}
            onChange={handleAdminChange}
            disabled={loading}
            helperText="This will be your login email"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={adminData.password}
            onChange={handleAdminChange}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handleAdminChange}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Password must be at least 8 characters long and include uppercase, lowercase, 
            number and special character.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
  
  return (
    <ThemeProvider theme={theme}>
      <RegisterContainer maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <RegisterPaper elevation={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Register Your Company
            </Typography>
            
            <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {activeStep === 0 ? renderCompanyForm() : renderAdminForm()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, width: '100%' }}>
              <Button
                variant="outlined"
                color="primary"
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              
              <Box sx={{ flex: '1 1 auto' }} />
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                </Button>
              )}
            </Box>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </RegisterPaper>
        </motion.div>
      </RegisterContainer>
    </ThemeProvider>
  );
};

export default RegisterCompanyPage;


// import React, { useState } from 'react';
// import { debounce } from 'lodash';
// import axios from 'axios';
// import { 
//   TextField, 
//   Button, 
//   Grid, 
//   Typography, 
//   Paper, 
//   Box,
//   CircularProgress,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormHelperText
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// const RegisterCompanyForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   const validationSchema = Yup.object({
//     company: Yup.object({
//       name: Yup.string().required('Company name is required'),
//       companyCode: Yup.string().required('Company code is required'),
//       industry: Yup.string().required('Industry is required'),
//       contactEmail: Yup.string().email('Invalid email').required('Contact email is required'),
//       contactPhone: Yup.string().required('Contact phone is required'),
//       address: Yup.object({
//         street: Yup.string().required('Street address is required'),
//         city: Yup.string().required('City is required'),
//         state: Yup.string().required('State is required'),
//         country: Yup.string().required('Country is required'),
//         zipCode: Yup.string().required('Zip code is required')
//       })
//     }),
//     admin: Yup.object({
//       firstName: Yup.string().required('First name is required'),
//       lastName: Yup.string().required('Last name is required'),
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       password: Yup.string()
//         .min(8, 'Password must be at least 8 characters')
//         .matches(
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//           'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
//         )
//         .required('Password is required')
//     })
//   });

//   const formik = useFormik({
//     initialValues: {
//       company: {
//         name: '',
//         companyCode: '',
//         industry: '',
//         contactEmail: '',
//         contactPhone: '',
//         address: {
//           street: '',
//           city: '',
//           state: '',
//           country: '',
//           zipCode: ''
//         },
//         settings: {
//           leavePolicy: {
//             casualLeavePerYear: 12,
//             sickLeavePerYear: 12,
//             earnedLeavePerYear: 12
//           },
//           workingHours: {
//             start: '09:00',
//             end: '18:00'
//           },
//           workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//         }
//       },
//       admin: {
//         firstName: '',
//         middleName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         role: 'admin'
//       }
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       // Set admin name from first, middle, and last name
//       values.admin.name = `${values.admin.firstName} ${values.admin.middleName ? values.admin.middleName + ' ' : ''}${values.admin.lastName}`;
//       handleSubmit(values);
//     }
//   });

//   // Debounce the submit function
//   const handleSubmit = debounce(async (formData) => {
//     if (isSubmitting) return;
    
//     try {
//       setIsSubmitting(true);
//       setError('');
//       setSuccess('');
      
//       console.log('Submitting registration data:', formData);
      
//       const response = await axios.post(`${API_URL}/auth/register-company`, formData);
      
//       setSuccess('Registration successful! Please check your email for verification.');
//       console.log('Registration response:', response.data);
      
//       // Redirect to verification page or show verification form
//       // history.push('/verify-email', { email: formData.admin.email });
//     } catch (error) {
//       console.error('Registration error:', error);
//       setError(error.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, 300);

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         Register Company
//       </Typography>
      
//       {error && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       )}
      
//       {success && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
//           <Typography color="success.dark">{success}</Typography>
//         </Box>
//       )}
      
//       <form onSubmit={formik.handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Typography variant="h6" gutterBottom>
//               Company Information
//             </Typography>
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.name"
//               name="company.name"
//               label="Company Name"
//               value={formik.values.company.name}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.name && Boolean(formik.errors.company?.name)}
//               helperText={formik.touched.company?.name && formik.errors.company?.name}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.companyCode"
//               name="company.companyCode"
//               label="Company Code"
//               value={formik.values.company.companyCode}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.companyCode && Boolean(formik.errors.company?.companyCode)}
//               helperText={formik.touched.company?.companyCode && formik.errors.company?.companyCode}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.industry"
//               name="company.industry"
//               label="Industry"
//               value={formik.values.company.industry}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.industry && Boolean(formik.errors.company?.industry)}
//               helperText={formik.touched.company?.industry && formik.errors.company?.industry}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.contactEmail"
//               name="company.contactEmail"
//               label="Contact Email"
//               value={formik.values.company.contactEmail}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.contactEmail && Boolean(formik.errors.company?.contactEmail)}
//               helperText={formik.touched.company?.contactEmail && formik.errors.company?.contactEmail}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.contactPhone"
//               name="company.contactPhone"
//               label="Contact Phone"
//               value={formik.values.company.contactPhone}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.contactPhone && Boolean(formik.errors.company?.contactPhone)}
//               helperText={formik.touched.company?.contactPhone && formik.errors.company?.contactPhone}
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Typography variant="h6" gutterBottom>
//               Company Address
//             </Typography>
//           </Grid>
          
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="company.address.street"
//               name="company.address.street"
//               label="Street Address"
//               value={formik.values.company.address.street}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.address?.street && Boolean(formik.errors.company?.address?.street)}
//               helperText={formik.touched.company?.address?.street && formik.errors.company?.address?.street}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.address.city"
//               name="company.address.city"
//               label="City"
//               value={formik.values.company.address.city}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.address?.city && Boolean(formik.errors.company?.address?.city)}
//               helperText={formik.touched.company?.address?.city && formik.errors.company?.address?.city}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.address.state"
//               name="company.address.state"
//               label="State/Province"
//               value={formik.values.company.address.state}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.address?.state && Boolean(formik.errors.company?.address?.state)}
//               helperText={formik.touched.company?.address?.state && formik.errors.company?.address?.state}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.address.country"
//               name="company.address.country"
//               label="Country"
//               value={formik.values.company.address.country}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.address?.country && Boolean(formik.errors.company?.address?.country)}
//               helperText={formik.touched.company?.address?.country && formik.errors.company?.address?.country}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="company.address.zipCode"
//               name="company.address.zipCode"
//               label="Zip/Postal Code"
//               value={formik.values.company.address.zipCode}
//               onChange={formik.handleChange}
//               error={formik.touched.company?.address?.zipCode && Boolean(formik.errors.company?.address?.zipCode)}
//               helperText={formik.touched.company?.address?.zipCode && formik.errors.company?.address?.zipCode}
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Typography variant="h6" gutterBottom>
//               Admin User Information
//             </Typography>
//           </Grid>
          
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               id="admin.firstName"
//               name="admin.firstName"
//               label="First Name"
//               value={formik.values.admin.firstName}
//               onChange={formik.handleChange}
//               error={formik.touched.admin?.firstName && Boolean(formik.errors.admin?.firstName)}
//               helperText={formik.touched.admin?.firstName && formik.errors.admin?.firstName}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               id="admin.middleName"
//               name="admin.middleName"
//               label="Middle Name (Optional)"
//               value={formik.values.admin.middleName}
//               onChange={formik.handleChange}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               id="admin.lastName"
//               name="admin.lastName"
//               label="Last Name"
//               value={formik.values.admin.lastName}
//               onChange={formik.handleChange}
//               error={formik.touched.admin?.lastName && Boolean(formik.errors.admin?.lastName)}
//               helperText={formik.touched.admin?.lastName && formik.errors.admin?.lastName}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="admin.email"
//               name="admin.email"
//               label="Email"
//               value={formik.values.admin.email}
//               onChange={formik.handleChange}
//               error={formik.touched.admin?.email && Boolean(formik.errors.admin?.email)}
//               helperText={formik.touched.admin?.email && formik.errors.admin?.email}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               id="admin.password"
//               name="admin.password"
//               label="Password"
//               type="password"
//               value={formik.values.admin.password}
//               onChange={formik.handleChange}
//               error={formik.touched.admin?.password && Boolean(formik.errors.admin?.password)}
//               helperText={formik.touched.admin?.password && formik.errors.admin?.password}
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 disabled={isSubmitting}
//                 sx={{ minWidth: 200 }}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
//                     Registering...
//                   </>
//                 ) : (
//                   'Register Company'
//                 )}
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// export default RegisterCompanyForm;

            

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Row, Col, Alert, InputGroup, Modal } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Velustro } from "uvcanvas";
// import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
// import authService from '../../api/auth';
// import './RegisterCompanyPage.css';

// const RegisterCompanyPage = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [countdown, setCountdown] = useState(5);
  
//   // Password strength indicators
//   const [passwordStrength, setPasswordStrength] = useState({
//     length: false,
//     hasUpperCase: false,
//     hasLowerCase: false,
//     hasNumber: false,
//     hasSpecialChar: false
//   });
  
//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     companyCode: '',
//     contactEmail: '',
//     contactPhone: '',
//     industry: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       country: '',
//       zipCode: ''
//     },
//     settings: {
//       leavePolicy: {
//         casualLeavePerYear: 12,
//         sickLeavePerYear: 12,
//         earnedLeavePerYear: 12
//       },
//       workingHours: {
//         start: '09:00',
//         end: '18:00'
//       },
//       workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//     }
//   });

//   // Admin user state - split name into separate fields
//   const [adminData, setAdminData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   // Field validation state
//   const [validationErrors, setValidationErrors] = useState({});
  
//   // Check password strength whenever password changes
//   useEffect(() => {
//     const password = adminData.password;
//     setPasswordStrength({
//       length: password.length >= 8,
//       hasUpperCase: /[A-Z]/.test(password),
//       hasLowerCase: /[a-z]/.test(password),
//       hasNumber: /[0-9]/.test(password),
//       hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
//     });
//   }, [adminData.password]);

//   // Countdown timer for redirect
//   useEffect(() => {
//     let timer;
//     if (showSuccessModal && countdown > 0) {
//       timer = setTimeout(() => {
//         setCountdown(countdown - 1);
//       }, 1000);
//     } else if (showSuccessModal && countdown === 0) {
//       // Redirect to verify OTP page with email
//       navigate('/verifyotp', { state: { email: adminData.email } });
//     }
//     return () => clearTimeout(timer);
//   }, [showSuccessModal, countdown, navigate, adminData.email]);

//   // Function to capitalize first letter of each word
//   const toSentenceCase = (str) => {
//     if (!str) return '';
//     return str
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//             // Handle nested properties (address fields)
//             const [parent, child] = name.split('.');
      
//             // Apply specific validations for address fields
//             if (child === 'zipCode') {
//               // Only allow 6 numerical characters for postal code
//               const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
//               setFormData({
//                 ...formData,
//                 [parent]: {
//                   ...formData[parent],
//                   [child]: numericValue
//                 }
//               });
//             } else if (child === 'street' || child === 'city' || child === 'state' || child === 'country') {
//               // Apply sentence case for address fields
//               setFormData({
//                 ...formData,
//                 [parent]: {
//                   ...formData[parent],
//                   [child]: toSentenceCase(value)
//                 }
//               });
//             } else {
//               setFormData({
//                 ...formData,
//                 [parent]: {
//                   ...formData[parent],
//                   [child]: value
//                 }
//               });
//             }
//           } else {
//             // Handle specific field validations
//             if (name === 'contactPhone') {
//               // Only allow 10 numerical characters for phone
//               const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
//               setFormData({
//                 ...formData,
//                 [name]: numericValue
//               });
//             } else if (name === 'contactEmail') {
//               // Convert email to lowercase
//               setFormData({
//                 ...formData,
//                 [name]: value.toLowerCase()
//               });
//             } else if (name === 'companyCode') {
//               // Convert to uppercase and remove special characters
//               const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
//               setFormData({
//                 ...formData,
//                 [name]: alphanumericValue
//               });
//             } else if (name === 'name' || name === 'industry') {
//               // Apply sentence case for company name and industry
//               setFormData({
//                 ...formData,
//                 [name]: toSentenceCase(value)
//               });
//             } else {
//               setFormData({
//                 ...formData,
//                 [name]: value
//               });
//             }
//           }
          
//           // Clear validation error for this field if it exists
//           if (validationErrors[name]) {
//             setValidationErrors({
//               ...validationErrors,
//               [name]: ''
//             });
//           }
//         };
      
//         // Handle admin data changes
//         const handleAdminChange = (e) => {
//           const { name, value } = e.target;
          
//           // Special handling for different fields
//           if (name === 'email') {
//             // Convert email to lowercase
//             setAdminData({
//               ...adminData,
//               [name]: value.toLowerCase()
//             });
//           } else if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
//             // Apply sentence case for name fields
//             setAdminData({
//               ...adminData,
//               [name]: toSentenceCase(value)
//             });
//           } else {
//             setAdminData({
//               ...adminData,
//               [name]: value
//             });
//           }
          
//           // Clear validation error for this field if it exists
//           if (validationErrors[`admin.${name}`]) {
//             setValidationErrors({
//               ...validationErrors,
//               [`admin.${name}`]: ''
//             });
//           }
//         };
      
//         // Handle working days selection
//         const handleWorkingDayChange = (day) => {
//           const currentDays = [...formData.settings.workingDays];
          
//           if (currentDays.includes(day)) {
//             // Remove day if already selected
//             const updatedDays = currentDays.filter(d => d !== day);
//             setFormData({
//               ...formData,
//               settings: {
//                 ...formData.settings,
//                 workingDays: updatedDays
//               }
//             });
//           } else {
//             // Add day if not selected
//             setFormData({
//               ...formData,
//               settings: {
//                 ...formData.settings,
//                 workingDays: [...currentDays, day]
//               }
//             });
//           }
//         };
      
//         // Toggle password visibility
//         const togglePasswordVisibility = () => {
//           setShowPassword(!showPassword);
//         };
        
//         // Toggle confirm password visibility
//         const toggleConfirmPasswordVisibility = () => {
//           setShowConfirmPassword(!showConfirmPassword);
//         };
      
//         // Validate form fields
//         const validateForm = () => {
//           const errors = {};
          
//           // Company validation
//           if (!formData.name.trim()) {
//             errors['name'] = 'Company name is required';
//           }
          
//           if (!formData.companyCode.trim()) {
//             errors['companyCode'] = 'Company code is required';
//           } else if (!/^[A-Z0-9]{2,10}$/.test(formData.companyCode)) {
//             errors['companyCode'] = 'Company code must be 2-10 alphanumeric characters in uppercase';
//           }
          
//           if (!formData.contactEmail.trim()) {
//             errors['contactEmail'] = 'Contact email is required';
//           } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
//             errors['contactEmail'] = 'Please enter a valid email address';
//           }
          
//           if (formData.contactPhone && formData.contactPhone.length !== 10) {
//             errors['contactPhone'] = 'Phone number must be exactly 10 digits';
//           }
          
//           // Address validation
//           if (formData.address.zipCode && formData.address.zipCode.length !== 6) {
//             errors['address.zipCode'] = 'Postal code must be exactly 6 digits';
//           }
          
//           // Admin validation
//           if (!adminData.firstName.trim()) {
//             errors['admin.firstName'] = 'First name is required';
//           }
          
//           if (!adminData.lastName.trim()) {
//             errors['admin.lastName'] = 'Last name is required';
//           }
          
//           if (!adminData.email.trim()) {
//             errors['admin.email'] = 'Email is required';
//           } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
//             errors['admin.email'] = 'Please enter a valid email address';
//           }
          
//           if (!adminData.password) {
//             errors['admin.password'] = 'Password is required';
//           } else if (adminData.password.length < 8) {
//             errors['admin.password'] = 'Password must be at least 8 characters';
//           } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(adminData.password)) {
//             errors['admin.password'] = 'Password must include uppercase, lowercase, number and special character';
//           }
          
//           if (!adminData.confirmPassword) {
//             errors['admin.confirmPassword'] = 'Please confirm your password';
//           } else if (adminData.password !== adminData.confirmPassword) {
//             errors['admin.confirmPassword'] = 'Passwords do not match';
//           }
          
//           setValidationErrors(errors);
//           return Object.keys(errors).length === 0;
//         };
      
//         // Handle form submission
// // Handle form submission
// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   // Reset error state
//   setError('');
  
//   // Validate form
//   if (!validateForm()) {
//     setError('Please correct the errors in the form');
//     return;
//   }
  
//   try {
//     setLoading(true);
    
//     // Create registration payload
//     const payload = {
//       company: formData,
//       admin: {
//         firstName: adminData.firstName.trim(),
//         middleName: adminData.middleName.trim(),
//         lastName: adminData.lastName.trim(),
//         name: `${adminData.firstName.trim()} ${adminData.middleName.trim() ? adminData.middleName.trim() + ' ' : ''}${adminData.lastName.trim()}`,
//         email: adminData.email.trim(),
//         password: adminData.password,
//         role: 'admin'
//       }
//     };
    
//     console.log('Sending registration data:', payload);
    
//     // Use authService instead of direct axios call
//     const response = await authService.registerCompany(payload);
    
//     console.log('Registration response:', response);
    
//     // Check if the response indicates successful storage
//     if (response && response.success) {
//       setSuccess('Company registered successfully! Redirecting to verify OTP...');

//       sessionStorage.setItem('verificationEmail', adminData.email.trim());
//   console.log('Admin email stored for verification:', adminData.email.trim());
      
//       // Store the admin email before clearing the form data
//       const adminEmail = adminData.email.trim();
//       console.log('Admin email for OTP verification:', adminEmail);
      
//       // Clear form
//       setFormData({
//         name: '',
//         companyCode: '',
//         contactEmail: '',
//         contactPhone: '',
//         industry: '',
//         address: {
//           street: '',
//           city: '',
//           state: '',
//           country: '',
//           zipCode: ''
//         },
//         settings: {
//           leavePolicy: {
//             casualLeavePerYear: 12,
//             sickLeavePerYear: 12,
//             earnedLeavePerYear: 12
//           },
//           workingHours: {
//             start: '09:00',
//             end: '18:00'
//           },
//           workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//         }
//       });
      
//       setAdminData({
//         firstName: '',
//         middleName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//       });
      
//       // Show success modal with countdown
//       setShowSuccessModal(true);
      
//       // No need for setTimeout here as the useEffect with countdown will handle navigation
//     } else {
//       // If we got a response but no success flag, show a warning
//       setError('Registration completed but data storage status is unclear. Please contact support.');
//       console.warn('Unexpected response format:', response);
//     }
//   } catch (error) {
//     console.error('Registration error details:', error);
    
//     // Detailed error handling
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Error response data:', error.response.data);
//       console.error('Error response status:', error.response.status);
//       console.error('Error response headers:', error.response.headers);
      
//       setError(
//         error.response.data.message || 
//         `Server error: ${error.response.status} - ${error.response.statusText}`
//       );
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Error request:', error.request);
//       setError('No response received from server. Please check your connection and try again.');
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error message:', error.message);
//       setError(`Error: ${error.message}`);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// // Update the countdown effect to navigate to the OTP verification page:
// useEffect(() => {
//   let timer;
//   if (showSuccessModal && countdown > 0) {
//     timer = setTimeout(() => {
//       setCountdown(countdown - 1);
//     }, 1000);
//   } else if (showSuccessModal && countdown === 0) {
//     // Redirect to verify OTP page with email
//     navigate('/verifyotp', { state: { email: adminData.email } });
//   }
//   return () => clearTimeout(timer);
// }, [showSuccessModal, countdown, navigate, adminData.email]);
      
//         return (
//           <div className="register-page-wrapper">
//             <div className="velustro-container">
//               <Velustro />
//             </div>
            
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="register-content"
//               style={{ width: '80%', maxWidth: '1200px' }}
//             >
//               <Card className="register-card">
//                 <Card.Body>
//                   <h2 className="text-center mb-4">Company Registration</h2>
                  
//                   {error && <Alert variant="danger">{error}</Alert>}
//                   {success && <Alert variant="success">{success}</Alert>}
                  
//                   <Form onSubmit={handleSubmit} noValidate>
//                     <div className="form-section mb-4">
//                       <h3 className="mb-3">Company Information</h3>
                      
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Company Name*</Form.Label>
//                             <Form.Control
//                               type="text"
//                               name="name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               placeholder="Enter company name"
//                               isInvalid={!!validationErrors.name}
//                               required
//                             />
//                             <Form.Control.Feedback type="invalid" className="error-message">
//                               {validationErrors.name}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
                        
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Company Code*</Form.Label>
//                             <Form.Control
//                               type="text"
//                               name="companyCode"
//                               value={formData.companyCode}
//                               onChange={handleChange}
//                               placeholder="Enter unique company code"
//                               isInvalid={!!validationErrors.companyCode}
//                               required
//                             />
//                             <Form.Text className="text-muted">
//                               This code will be used for company identification (2-10 alphanumeric characters)
//                             </Form.Text>
//                             <Form.Control.Feedback type="invalid" className="error-message">
//                               {validationErrors.companyCode}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
//                       </Row>
                      
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Contact Email*</Form.Label>
//                             <Form.Control
//                               type="email"
//                               name="contactEmail"
//                               value={formData.contactEmail}
//                               onChange={handleChange}
//                               placeholder="Enter company email"
//                               isInvalid={!!validationErrors.contactEmail}
//                               required
//                             />
//                             <Form.Control.Feedback type="invalid" className="error-message">
//                               {validationErrors.contactEmail}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
                        
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Contact Phone</Form.Label>
//                             <Form.Control
//                               type="text"
//                               name="contactPhone"
//                               value={formData.contactPhone}
//                               onChange={handleChange}
//                               placeholder="Enter 10-digit phone number"
//                               isInvalid={!!validationErrors.contactPhone}
//                             />
//                             <Form.Text className="text-muted">
//                               Numbers only (10 digits)
//                             </Form.Text>
//                             <Form.Control.Feedback type="invalid" className="error-message">
//                               {validationErrors.contactPhone}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
//                       </Row>
                      
//                       <Form.Group className="mb-3">
//                         <Form.Label>Industry</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="industry"
//                           value={formData.industry}
//                           onChange={handleChange}
//                           placeholder="Enter industry"
//                         />
//                       </Form.Group>
//                     </div>
                    
//                     <div className="form-section mb-4">
//                       <h4 className="mb-3">Company Address</h4>
                      
//                       <Form.Group className="mb-3">
//                         <Form.Label>Street Address</Form.Label>
//                         <Form.Control
//                     type="text"
//                     name="address.street"
//                     value={formData.address.street}
//                     onChange={handleChange}
//                     placeholder="Enter street address"
//                   />
//                 </Form.Group>
                
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>City</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.city"
//                         value={formData.address.city}
//                         onChange={handleChange}
//                         placeholder="Enter city"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>State/Province</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.state"
//                         value={formData.address.state}
//                         onChange={handleChange}
//                         placeholder="Enter state/province"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Country</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.country"
//                         value={formData.address.country}
//                         onChange={handleChange}
//                         placeholder="Enter country"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Postal Code</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.zipCode"
//                         value={formData.address.zipCode}
//                         onChange={handleChange}
//                         placeholder="Enter 6-digit postal code"
//                         isInvalid={!!validationErrors['address.zipCode']}
//                       />
//                       <Form.Text className="text-muted">
//                         Numbers only (6 digits)
//                       </Form.Text>
//                       <Form.Control.Feedback type="invalid" className="error-message">
//                         {validationErrors['address.zipCode']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </div>
              
//               <div className="form-section mb-4">
//                 <h3 className="mb-3">Admin Account Information</h3>
                
//                 <Row>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name*</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={adminData.firstName}
//                         onChange={handleAdminChange}
//                         placeholder="Enter first name"
//                         isInvalid={!!validationErrors['admin.firstName']}
//                         required
//                       />
//                       <Form.Control.Feedback type="invalid" className="error-message">
//                         {validationErrors['admin.firstName']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Middle Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="middleName"
//                         value={adminData.middleName}
//                         onChange={handleAdminChange}
//                         placeholder="Enter middle name (optional)"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Last Name*</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="lastName"
//                         value={adminData.lastName}
//                         onChange={handleAdminChange}
//                         placeholder="Enter last name"
//                         isInvalid={!!validationErrors['admin.lastName']}
//                         required
//                       />
//                       <Form.Control.Feedback type="invalid" className="error-message">
//                         {validationErrors['admin.lastName']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Form.Group className="mb-3">
//                   <Form.Label>Admin Email*</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={adminData.email}
//                     onChange={handleAdminChange}
//                     placeholder="Enter admin email"
//                     isInvalid={!!validationErrors['admin.email']}
//                     required
//                   />
//                   <Form.Text className="text-muted">
//                     This email will be used for admin login
//                   </Form.Text>
//                   <Form.Control.Feedback type="invalid" className="error-message">
//                     {validationErrors['admin.email']}
//                   </Form.Control.Feedback>
//                 </Form.Group>
                
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Password*</Form.Label>
//                       <InputGroup>
//                         <Form.Control
//                           type={showPassword ? "text" : "password"}
//                           name="password"
//                           value={adminData.password}
//                           onChange={handleAdminChange}
//                           placeholder="Enter password"
//                           isInvalid={!!validationErrors['admin.password']}
//                           required
//                           minLength="8"
//                         />
//                         <Button 
//                           variant="outline-secondary"
//                           onClick={togglePasswordVisibility}
//                         >
//                           {showPassword ? <FaEyeSlash /> : <FaEye />}
//                         </Button>
//                         <Form.Control.Feedback type="invalid" className="error-message">
//                           {validationErrors['admin.password']}
//                         </Form.Control.Feedback>
//                       </InputGroup>
                      
//                       <div className="password-strength-container mt-2">
//                         <div className="password-criteria-header">Password must contain:</div>
//                         <div className={`password-criteria ${passwordStrength.length ? 'valid' : ''}`}>
//                           {passwordStrength.length ? <FaCheck className="criteria-icon valid"/> : <FaTimes className="criteria-icon"/>}
//                           At least 8 characters
//                         </div>
//                         <div className={`password-criteria ${passwordStrength.hasUpperCase ? 'valid' : ''}`}>
//                           {passwordStrength.hasUpperCase ? <FaCheck className="criteria-icon valid"/> : <FaTimes className="criteria-icon"/>}
//                           Uppercase letter
//                         </div>
//                         <div className={`password-criteria ${passwordStrength.hasLowerCase ? 'valid' : ''}`}>
//                           {passwordStrength.hasLowerCase ? <FaCheck className="criteria-icon valid"/> : <FaTimes className="criteria-icon"/>}
//                           Lowercase letter
//                         </div>
//                         <div className={`password-criteria ${passwordStrength.hasNumber ? 'valid' : ''}`}>
//                           {passwordStrength.hasNumber ? <FaCheck className="criteria-icon valid"/> : <FaTimes className="criteria-icon"/>}
//                           Number
//                         </div>
//                         <div className={`password-criteria ${passwordStrength.hasSpecialChar ? 'valid' : ''}`}>
//                           {passwordStrength.hasSpecialChar ? <FaCheck className="criteria-icon valid"/> : <FaTimes className="criteria-icon"/>}
//                           Special character
//                         </div>
//                       </div>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Confirm Password*</Form.Label>
//                       <InputGroup>
//                         <Form.Control
//                           type={showConfirmPassword ? "text" : "password"}
//                           name="confirmPassword"
//                           value={adminData.confirmPassword}
//                           onChange={handleAdminChange}
//                           placeholder="Confirm password"
//                           isInvalid={!!validationErrors['admin.confirmPassword']}
//                           required
//                         />
//                         <Button 
//                           variant="outline-secondary"
//                           onClick={toggleConfirmPasswordVisibility}
//                         >
//                           {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                         </Button>
//                         <Form.Control.Feedback type="invalid" className="error-message">
//                           {validationErrors['admin.confirmPassword']}
//                         </Form.Control.Feedback>
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </div>
              
//               <div className="d-grid gap-2 mt-4">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button 
//                     variant="primary" 
//                     type="submit" 
//                     size="lg"
//                     disabled={loading}
//                     className="submit-button"
//                   >
//                     {loading ? (
//                       <div className="d-flex align-items-center justify-content-center">
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Registering...
//                       </div>
//                     ) : 'Register Company'}
//                   </Button>
//                 </motion.div>
//               </div>
              
//               <div className="text-center mt-3">
//                 Already have an account? <Link to="/login" className="auth-link">Login here</Link>
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </motion.div>
      
//       {/* Success Modal with Countdown */}
//       <Modal 
//         show={showSuccessModal} 
//         centered
//         backdrop="static"
//         keyboard={false}
//         className="success-modal"
//       >
//         <Modal.Header>
//           <Modal.Title>Registration Successful!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center mb-3">
//             <div className="success-icon-container">
//               <FaCheck className="success-icon" />
//             </div>
//             <h4>Your company has been registered successfully!</h4>
//             <p>An OTP has been sent to your email address. You will be redirected to the verification page in {countdown} seconds.</p>
//           </div>
//           <div className="progress">
//             <div 
//               className="progress-bar bg-success" 
//               role="progressbar" 
//               style={{ width: `${(5-countdown)/5*100}%` }} 
//               aria-valuenow={5-countdown} 
//               aria-valuemin="0" 
//               aria-valuemax="5"
//             ></div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default RegisterCompanyPage;
