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
import { FaEye, FaEyeSlash, FaUpload, FaImage } from 'react-icons/fa';
import authService from '../../../screens/api/auth';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

// Styled components
const RegisterContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
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
  border: '1px solid rgba(255, 255, 255, 0.18)',
});

// Add these new styled components for logo upload
const LogoUploadContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
});

const LogoPreviewContainer = styled(Box)({
  width: '150px',
  height: '150px',
  border: '2px dashed #ccc',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#f8f9fa',
});

const LogoPreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#3f51b5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
    },
  },
});

// Steps for registration
const steps = ['Company Information', 'Admin Account'];

const RegisterCompanyPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(''); // Add this state for logo preview
  
  // Company form data
  const [companyData, setCompanyData] = useState({
    name: '',
    companyCode: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    logo: null, // Add this for the logo file
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    companyCode: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
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
  
  // Admin validation errors
  const [adminValidationErrors, setAdminValidationErrors] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  
  // Helper function to capitalize first letter of each word
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setValidationErrors({
        ...validationErrors,
        logo: 'Please upload a valid image file (JPEG, PNG, GIF, SVG)'
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setValidationErrors({
        ...validationErrors,
        logo: 'Image size should not exceed 2MB'
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Store the file in state
    setCompanyData({
      ...companyData,
      logo: file
    });
    
    // Clear error when user uploads a valid file
    setValidationErrors({
      ...validationErrors,
      logo: ''
    });
    
    if (error) setError('');
  };
  
  // Handle company form change
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let newErrors = { ...validationErrors };
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      
      // Apply sentence case for address fields
      if (['street', 'city', 'state', 'country'].includes(child)) {
        newValue = toSentenceCase(value);
      }
      
      // Validate zipCode - must be 6 digits
      if (child === 'zipCode') {
        if (value && !/^\d{0,6}$/.test(value)) {
          newErrors.address = {
            ...newErrors.address,
            zipCode: 'Zip code must be exactly 6 digits'
          };
        } else if (value && value.length !== 6 && value.length > 0) {
          newErrors.address = {
            ...newErrors.address,
            zipCode: 'Zip code must be exactly 6 digits'
          };
        } else {
          newErrors.address = {
            ...newErrors.address,
            zipCode: ''
          };
        }
      }
      
      setCompanyData({
        ...companyData,
        [parent]: {
          ...companyData[parent],
          [child]: newValue
        }
      });
    } else {
      // Handle non-nested fields
      switch (name) {
        case 'companyCode':
          // Convert company code to uppercase and validate
          newValue = value.toUpperCase();
          if (!/^[A-Z0-9]*$/.test(newValue)) {
            newErrors.companyCode = 'Company code can only contain letters and numbers';
          } else if (newValue.length > 0 && (newValue.length < 3 || newValue.length > 10)) {
            newErrors.companyCode = 'Company code must be 3-10 characters';
          } else {
            newErrors.companyCode = '';
          }
          break;
          
        case 'contactEmail':
          // Convert email to lowercase
          newValue = value.toLowerCase();
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
            newErrors.contactEmail = 'Please enter a valid email address';
          } else {
            newErrors.contactEmail = '';
          }
          break;
          
        case 'contactPhone':
          // Validate phone number - must be 10 digits
          if (value && !/^\d{0,10}$/.test(value)) {
            newErrors.contactPhone = 'Phone number must contain only digits';
          } else if (value && value.length !== 10 && value.length > 0) {
            newErrors.contactPhone = 'Phone number must be exactly 10 digits';
          } else {
            newErrors.contactPhone = '';
          }
          break;
          
        case 'name':
          if (!value.trim()) {
            newErrors.name = 'Company name is required';
          } else {
            newErrors.name = '';
          }
          break;
          
        case 'industry':
          if (!value.trim()) {
            newErrors.industry = 'Industry is required';
          } else {
            newErrors.industry = '';
          }
          break;
      }
      
      setCompanyData({
        ...companyData,
        [name]: newValue
      });
    }
    
    setValidationErrors(newErrors);
    
    // Clear error when user types
    if (error) setError('');
  };
  
  // Handle admin form change
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let newErrors = { ...adminValidationErrors };
    
    switch (name) {
      case 'email':
        // Convert email to lowercase
        newValue = value.toLowerCase();
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          newErrors.email = '';
        }
        break;
        
      case 'password':
        if (value && value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        } else if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          newErrors.password = 'Password must include uppercase, lowercase, number and special character';
        } else {
          newErrors.password = '';
        }
        
        // Also check confirm password match
        if (adminData.confirmPassword && value !== adminData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (adminData.confirmPassword) {
          newErrors.confirmPassword = '';
        }
        break;
        
      case 'confirmPassword':
        if (adminData.password && value !== adminData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
        
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else {
          newErrors[name] = '';
        }
        break;
    }
    
    setAdminData({
      ...adminData,
      [name]: newValue
    });
    
    setAdminValidationErrors(newErrors);
    
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
    let isValid = true;
    let newErrors = { ...validationErrors };
    
    // Company name validation
    if (!companyData.name.trim()) {
      newErrors.name = 'Company name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }
    
    // Company code validation
    if (!companyData.companyCode.trim()) {
      newErrors.companyCode = 'Company code is required';
      isValid = false;
    } else if (!/^[A-Z0-9]{3,10}$/.test(companyData.companyCode)) {
      newErrors.companyCode = 'Company code must be 3-10 alphanumeric characters';
      isValid = false;
    } else {
      newErrors.companyCode = '';
    }
    
    // Industry validation
    if (!companyData.industry.trim()) {
      newErrors.industry = 'Industry is required';
      isValid = false;
    } else {
      newErrors.industry = '';
    }
    
    // Contact email validation
    if (!companyData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid contact email';
      isValid = false;
    } else {
      newErrors.contactEmail = '';
    }
    
    // Contact phone validation
        // Contact phone validation
        if (!companyData.contactPhone.trim()) {
          newErrors.contactPhone = 'Contact phone is required';
          isValid = false;
        } else if (!/^\d{10}$/.test(companyData.contactPhone)) {
          newErrors.contactPhone = 'Phone number must be exactly 10 digits';
          isValid = false;
        } else {
          newErrors.contactPhone = '';
        }
        
        // Logo validation
        if (!companyData.logo) {
          newErrors.logo = 'Company logo is required';
          isValid = false;
        } else {
          newErrors.logo = '';
        }
        
        // Address validation - optional fields but validate format if provided
        if (companyData.address.zipCode && !/^\d{6}$/.test(companyData.address.zipCode)) {
          newErrors.address = {
            ...newErrors.address,
            zipCode: 'Zip code must be exactly 6 digits'
          };
          isValid = false;
        } else {
          newErrors.address = {
            ...newErrors.address,
            zipCode: ''
          };
        }
        
        setValidationErrors(newErrors);
        
        if (!isValid) {
          setError('Please correct the errors in the form before proceeding');
        }
        
        return isValid;
      };
      
      // Validate admin form
      const validateAdminForm = () => {
        let isValid = true;
        let newErrors = { ...adminValidationErrors };
        
        // First name validation
        if (!adminData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
          isValid = false;
        } else {
          newErrors.firstName = '';
        }
        
        // Last name validation
        if (!adminData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
          isValid = false;
        } else {
          newErrors.lastName = '';
        }
        
        // Email validation
        if (!adminData.email.trim()) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
          newErrors.email = 'Please enter a valid email';
          isValid = false;
        } else {
          newErrors.email = '';
        }
        
        // Password validation
        if (!adminData.password) {
          newErrors.password = 'Password is required';
          isValid = false;
        } else if (adminData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
          isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(adminData.password)) {
          newErrors.password = 'Password must include uppercase, lowercase, number and special character';
          isValid = false;
        } else {
          newErrors.password = '';
        }
        
        // Confirm password validation
        if (!adminData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (adminData.password !== adminData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
          isValid = false;
        } else {
          newErrors.confirmPassword = '';
        }
        
        setAdminValidationErrors(newErrors);
        
        if (!isValid) {
          setError('Please correct the errors in the form before submitting');
        }
        
        return isValid;
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
          // Create FormData for file upload
          const formData = new FormData();
          
          // Add the logo file to FormData
          if (companyData.logo) {
            formData.append('logo', companyData.logo);
          }
          
          // Prepare company data
          const companyFormData = {
            name: companyData.name,
            companyCode: companyData.companyCode,
            industry: companyData.industry,
            contactEmail: companyData.contactEmail,
            contactPhone: companyData.contactPhone,
            address: {
              street: companyData.address.street || '',
              city: companyData.address.city || '',
              state: companyData.address.state || '',
              country: companyData.address.country || '',
              zipCode: companyData.address.zipCode || ''
            }
          };
          
          // Prepare admin data
          const adminFormData = {
            firstName: adminData.firstName,
            middleName: adminData.middleName || '',
            lastName: adminData.lastName,
            name: `${adminData.firstName} ${adminData.middleName ? adminData.middleName + ' ' : ''}${adminData.lastName}`,
            email: adminData.email,
            password: adminData.password
          };
          
          // Add JSON data to FormData
          formData.append('company', JSON.stringify(companyFormData));
          formData.append('admin', JSON.stringify(adminFormData));
          
          console.log('Submitting registration with logo');
          
          // Call API to register company
          const response = await authService.registerCompany(formData);
          
          console.log('Registration response:', response);
          
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
          <LogoUploadContainer>
            <Typography variant="subtitle1" gutterBottom>
              Company Logo*
            </Typography>
            
            <LogoPreviewContainer>
              {logoPreview ? (
                <LogoPreviewImage src={logoPreview} alt="Company Logo Preview" />
              ) : (
                <FaImage size={50} color="#ccc" />
              )}
            </LogoPreviewContainer>
            
            <input
              accept="image/*"
              id="logo-upload"
              type="file"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="logo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<FaUpload />}
                disabled={loading}
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </label>
            
            {validationErrors.logo && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {validationErrors.logo}
              </Typography>
            )}
          </LogoUploadContainer>
    
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                id="name"
                label="Company Name"
                name="name"
                value={companyData.name}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="companyCode"
                label="Company Code"
                name="companyCode"
                value={companyData.companyCode}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.companyCode}
                helperText={validationErrors.companyCode || "3-10 characters, alphanumeric only"}
                inputProps={{
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="industry"
                label="Industry"
                name="industry"
                value={companyData.industry}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.industry}
                helperText={validationErrors.industry}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="contactEmail"
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={companyData.contactEmail}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.contactEmail}
                helperText={validationErrors.contactEmail}
                inputProps={{
                  style: { textTransform: 'lowercase' }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                fullWidth
                id="contactPhone"
                label="Contact Phone"
                name="contactPhone"
                value={companyData.contactPhone}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.contactPhone}
                helperText={validationErrors.contactPhone || "Enter 10-digit phone number"}
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*"
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                Company Address (Optional)
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
                fullWidth
                id="zipCode"
                label="Zip/Postal Code"
                name="address.zipCode"
                value={companyData.address.zipCode}
                onChange={handleCompanyChange}
                disabled={loading}
                error={!!validationErrors.address?.zipCode}
                helperText={validationErrors.address?.zipCode || "Enter 6-digit postal code"}
                inputProps={{
                  maxLength: 6,
                  pattern: "[0-9]*"
                }}
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
              <StyledTextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={adminData.firstName}
                onChange={handleAdminChange}
                disabled={loading}
                error={!!adminValidationErrors.firstName}
                helperText={adminValidationErrors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <StyledTextField
                fullWidth
                id="middleName"
                label="Middle Name"
                name="middleName"
                value={adminData.middleName}
                onChange={handleAdminChange}
                disabled={loading}
                error={!!adminValidationErrors.middleName}
                helperText={adminValidationErrors.middleName}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <StyledTextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={adminData.lastName}
                onChange={handleAdminChange}
                disabled={loading}
                error={!!adminValidationErrors.lastName}
                helperText={adminValidationErrors.lastName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={adminData.email}
                onChange={handleAdminChange}
                disabled={loading}
                error={!!adminValidationErrors.email}
                helperText={adminValidationErrors.email || "This will be your login email"}
                inputProps={{
                  style: { textTransform: 'lowercase' }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={adminData.password}
                onChange={handleAdminChange}
                disabled={loading}
                error={!!adminValidationErrors.password}
                helperText={adminValidationErrors.password}
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
          <StyledTextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handleAdminChange}
            disabled={loading}
            error={!!adminValidationErrors.confirmPassword}
            helperText={adminValidationErrors.confirmPassword}
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

    

