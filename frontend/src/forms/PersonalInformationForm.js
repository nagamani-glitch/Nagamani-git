import {useState} from 'react';
import { TextField, Paper, FormControl, Button, Typography, Grid, Select, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';


const PersonalInformationForm = ({ nextStep ,setEmployeeId, onSave}) => {
  
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000), 'Employee must be at least 18 years old'),
  gender: Yup.string().required('Gender is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  bloodGroup: Yup.string().required('Blood group is required'),
  nationality: Yup.string().required('Nationality is required'),
  aadharNumber: Yup.string()
    .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
    .required('Aadhar number is required'),
  panNumber: Yup.string()
    .matches(/^[A-Z0-9]{10}$/, 'PAN number must be 10 characters')
    .required('PAN number is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .trim(),
  prefix: Yup.string().required('Prefix is required'),
  employeeImage: Yup.mixed().required('Profile photo is required')
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const prefixOptions = [
  {value: 'Mr.', gender: 'Male'},
  {value: 'Ms.', gender: 'Female'},
  {value: 'Dr.', gender: 'Null'}
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const[personalInfo,setPersonalInfo] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    nationality: '',
    aadharNumber: '',
    panNumber: '',
    mobileNumber: '',
    email: ''
});
const [imageFile, setImageFile] = useState(null);

const genderOptions = {
  'Mr.': ['Male'],
  'Ms.': ['Female'],
  'Dr.': ['Male', 'Female', 'Other']
};

const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const initialValues = {
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: new Date(),
    dobDay: new Date().getDate(),
    dobMonth: months[new Date().getMonth()],
    dobYear: new Date().getFullYear(),
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    nationality: '',
    aadharNumber: '',
    panNumber: '',
    mobileNumber: '',
    email: '',
    employeeImage: null
  };

  const handleSave = async (values) => {
    try {
      // Collect form data from the Formik values
      const personalInfoData = {
        prefix: values.prefix,
        firstName: values.firstName,
        lastName: values.lastName,
        dob: values.dob,
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        bloodGroup: values.bloodGroup,
        nationality: values.nationality,
        aadharNumber: values.aadharNumber || undefined, // Use undefined instead of empty string
        panNumber: values.panNumber || undefined,
        mobileNumber: values.mobileNumber,
        email: values.email || undefined
      };
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('formData', JSON.stringify({ personalInfo: personalInfoData }));
      
      // Add image file if it exists
      if (values.employeeImage) {
        formData.append('employeeImage', values.employeeImage);
      }
    
      const response = await axios.post(
        'http://localhost:5000/api/employees/personal-info',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    
      if (response.data.success) {
        // Call onSave with the employee ID
        onSave(response.data.employeeId);
        // Navigate to next step
        nextStep();
        toast.success('Personal information saved successfully');
      }
    } catch (error) {
      console.error('Error saving personal info:', error.response?.data || error.message);
      
      // Show appropriate error messages
      if (error.response?.data?.error?.includes('duplicate key error')) {
        if (error.response.data.error.includes('aadharNumber')) {
          toast.error('This Aadhar number is already registered');
        } else if (error.response.data.error.includes('panNumber')) {
          toast.error('This PAN number is already registered');
        } else if (error.response.data.error.includes('email')) {
          toast.error('This email is already registered');
        } else {
          toast.error('A duplicate entry was detected. Please check your information.');
        }
      } else {
        toast.error('Error saving personal information. Please try again.');
      }
    }
  };  
  
  const handleError = (error) => {
    // Handle validation errors from backend
    if (error?.details) {
      error.details.forEach(detail => {
        // Extract field name from the path
        const fieldMatch = detail.match(/Path `(.+)` is required/);
        if (fieldMatch) {
          const field = fieldMatch[1];
          // Map backend field paths to user-friendly messages
          const fieldMessages = {
            'personalInfo.prefix': 'Title/Prefix',
            'personalInfo.firstName': 'First Name',
            'personalInfo.lastName': 'Last Name',
            'personalInfo.dob': 'Date of Birth',
            'personalInfo.gender': 'Gender',
            'personalInfo.maritalStatus': 'Marital Status',
            'personalInfo.bloodGroup': 'Blood Group',
            'personalInfo.nationality': 'Nationality',
            'personalInfo.aadharNumber': 'Aadhar Number',
            'personalInfo.panNumber': 'PAN Number',
            'personalInfo.mobileNumber': 'Mobile Number',
            'personalInfo.email': 'Email Address',
            'personalInfo.employeeImage': 'Profile Photo'
          };
          
          const fieldName = fieldMessages[field] || field;
          toast.error(`${fieldName} is required`);
        } else {
          // Handle other validation errors
          toast.error(detail);
        }
      });
    } else if (error?.message) {
      // Handle specific error messages
      switch (error.field) {
        case 'email':
          toast.error('This email address is already registered');
          break;
        case 'aadharNumber':
          toast.error('This Aadhar number is already in use');
          break;
        case 'panNumber':
          toast.error('This PAN number is already registered');
          break;
        case 'mobileNumber':
          toast.error('This mobile number is already in use');
          break;
        default:
          toast.error(error.message);
      }
    } else {
      // Generic error message
      toast.error('Please fill in all required fields correctly');
    }
  };
  
  
    
  const AnimatedTextField = ({ field, form, label, ...props }) => {
    const handleChange = (e) => {
      if (field.name === 'email') {
        form.setFieldValue(field.name, e.target.value);
        return;
      }
      
      if (field.name === 'panNumber') {
        form.setFieldValue(field.name, e.target.value.toUpperCase());
        return;
      }
      
      const sentenceCaseValue = e.target.value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      form.setFieldValue(field.name, sentenceCaseValue);
    };
    return (
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TextField
          {...field}
          {...props}
          label={label}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              }
            },
            '& .MuiInputBase-input': {
              color: '#000000',
            }
          }}
        />
      </motion.div>
    );
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Personal Information
            </Typography>

            <Grid container spacing={3}>
              {/* Name fields */}
              <Grid item container spacing={2}>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <Field name="prefix">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          label="Title"
                          displayEmpty
                          error={touched.prefix && errors.prefix}
                          onChange={(e) => {
                            const selectedPrefix = prefixOptions.find(p => p.value === e.target.value);
                            form.setFieldValue('prefix', e.target.value);
                            if (selectedPrefix.gender !== 'Null') {
                              form.setFieldValue('gender', selectedPrefix.gender);
                            }
                          }}
                        >
                          <MenuItem value="" disabled>Title</MenuItem>
                          {prefixOptions.map(prefix => (
                            <MenuItem key={prefix.value} value={prefix.value}>{prefix.value}</MenuItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Field
                    name="firstName"
                    component={AnimatedTextField}
                    label="First Name"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <Field
                    name="middleName"
                    component={AnimatedTextField}
                    label="Middle Name"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4}>
                  <Field
                    name="lastName"
                    component={AnimatedTextField}
                    label="Last Name"
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} >
                <Typography variant="body1" gutterBottom>Date of Birth</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Date</InputLabel>
                      <Field name="dobDay">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            label="Date"
                            onChange={(e) => {
                              form.setFieldValue('dobDay', e.target.value);
                              const newDate = new Date(
                                form.values.dobYear,
                                months.indexOf(form.values.dobMonth),
                                e.target.value
                              );
                              form.setFieldValue('dob', newDate);
                            }}
                          >
                            {days.map(day => (
                              <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Month</InputLabel>
                      <Field name="dobMonth">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            label="Month"
                            onChange={(e) => {
                              form.setFieldValue('dobMonth', e.target.value);
                              const newDate = new Date(
                                form.values.dobYear,
                                months.indexOf(e.target.value),
                                form.values.dobDay
                              );
                              form.setFieldValue('dob', newDate);
                            }}
                          >
                            {months.map(month => (
                              <MenuItem key={month} value={month}>{month}</MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Year</InputLabel>
                      <Field name="dobYear">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            label="Year"
                            onChange={(e) => {
                              form.setFieldValue('dobYear', e.target.value);
                              const newDate = new Date(
                                e.target.value,
                                months.indexOf(form.values.dobMonth),
                                form.values.dobDay
                              );
                              form.setFieldValue('dob', newDate);
                            }}
                          >
                            {years.map(year => (
                              <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Gender */}

<Grid item xs={12} sm={6} >
  <FormControl fullWidth error={touched.gender && errors.gender}>
    <InputLabel>Gender</InputLabel>
    <Field name="gender">
      {({ field }) => (
        <Select
          {...field}
          label="Gender"
        >
          <MenuItem value="">Select Gender</MenuItem>
          {genderOptions[values.prefix]?.map(gender => (
            <MenuItem key={gender} value={gender}>{gender}</MenuItem>
          ))}
        </Select>
      )}
    </Field>
    {touched.gender && errors.gender && (
      <FormHelperText>{errors.gender}</FormHelperText>
    )}
  </FormControl>
</Grid>

    {/* Marital Status */}

<Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.maritalStatus && errors.maritalStatus}>
    <InputLabel>Marital Status</InputLabel>
    <Field name="maritalStatus">
      {({ field }) => (
        <Select
          {...field}
          label="Marital Status"
        >
          <MenuItem value="">Select Marital Status</MenuItem>
          {maritalStatusOptions.map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </Select>
      )}
    </Field>
    {touched.maritalStatus && errors.maritalStatus && (
      <FormHelperText>{errors.maritalStatus}</FormHelperText>
    )}
  </FormControl>
</Grid>

    {/* Blood Group */}

<Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.bloodGroup && errors.bloodGroup}>
    <InputLabel>Blood Group</InputLabel>
    <Field name="bloodGroup">
      {({ field }) => (
        <Select
          {...field}
          label="Blood Group"
        >
          <MenuItem value="">Select Blood Group</MenuItem>
          {bloodGroups.map(group => (
            <MenuItem key={group} value={group}>{group}</MenuItem>
          ))}
        </Select>
      )}
    </Field>
    {touched.bloodGroup && errors.bloodGroup && (
      <FormHelperText>{errors.bloodGroup}</FormHelperText>
    )}
  </FormControl>
</Grid>


              {/* Nationality */}
              <Grid item xs={12} sm={6}>
                <Field
                  name="nationality"
                  component={AnimatedTextField}
                  label="Nationality"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="aadharNumber"
                  component={AnimatedTextField}
                  label="Aadhar Number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="panNumber"
                  component={AnimatedTextField}
                  label="PAN Number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="mobileNumber"
                  component={AnimatedTextField}
                  label="Mobile Number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="email"
                  component={AnimatedTextField}
                  label="Email"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
  <InputLabel required>Employee Image</InputLabel>
  <Field name="employeeImage">
    {({ field, form }) => (
      <div>
        <input
  type="file"
  accept="image/*"
  onChange={(event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Only JPG, JPEG & PNG files are allowed');
        return;
      }
      form.setFieldValue("employeeImage", file);
    }
  }}
/>
        {form.touched.employeeImage && form.errors.employeeImage && (
          <Typography color="error" variant="caption">
            {form.errors.employeeImage}
          </Typography>
        )}
      </div>
    )}
  </Field>
</Grid>
</Grid>

            {/* Submit button */}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
  type="submit" // Change to submit type to trigger Formik validation
  variant="contained"
  color="primary"
  fullWidth
>
  Next
</Button>
            </motion.div>
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInformationForm;

