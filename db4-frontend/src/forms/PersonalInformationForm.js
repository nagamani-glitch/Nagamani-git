import React from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Paper, FormControl, Button, Typography, Grid, Select, MenuItem , InputLabel} from '@mui/material';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  bloodGroup: Yup.string().required('Blood group is required'),
  nationality: Yup.string().required('Nationality is required'),
  aadharNumber: Yup.string().length(12, 'Aadhar number must be 12 digits').required('Aadhar number is required'),
  panNumber: Yup.string().length(10, 'PAN number must be 10 characters').required('PAN number is required'),
  mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  employeeImage: Yup.mixed()
    .required('Profile photo is required')
    .test('fileFormat', 'Only image formats are allowed', value => {
      if (!value) return false;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    })
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PersonalInformationForm = ({ nextStep, handleFormDataChange, handleImageUpload }) => {
  const initialValues = {
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
    email: '',
    employeeImage: null
  };

  const AnimatedTextField = ({ field, form, label, ...props }) => {
    const handleChange = (e) => {
      // Skip sentence case for email field
      if (field.name === 'email') {
        form.setFieldValue(field.name, e.target.value);
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
            },
            '& .MuiInputBase-input[type="date"]': {
              padding: '16.5px 14px',
              '&::-webkit-calendar-picker-indicator': {
                cursor: 'pointer',
                padding: '8px',
                marginRight: '-8px'
              }
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
      onSubmit={(values) => {
        handleFormDataChange("personalInfo", values);
        nextStep();
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="firstName"
                  as={TextField}
                  label="First Name"
                  fullWidth
                  error={touched.firstName && errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="lastName"
                  as={TextField}
                  label="Last Name"
                  fullWidth
                  error={touched.lastName && errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="dob"
                  component={AnimatedTextField}
                  type="date"
                  label="Date of Birth"
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { 
                    color: 'rgba(0, 0, 0, 0.87)',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  }
                }}
                  error={touched.dob && errors.dob}
                  helperText={touched.dob && errors.dob}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="body1">Gender</Typography>
                  <Field name="gender">
                    {({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="body1">Marital Status</Typography>
                  <Field name="maritalStatus">
                    {({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="Single" control={<Radio />} label="Single" />
                        <FormControlLabel value="Married" control={<Radio />} label="Married" />
                        <FormControlLabel value="Divorced" control={<Radio />} label="Divorced" />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Field name="bloodGroup">
                    {({ field }) => (
                      <Select
                        {...field}
                        label="Blood Group"
                        displayEmpty
                        placeholder="Select Blood Group"
                        error={touched.bloodGroup && errors.bloodGroup}
                      >
                        <MenuItem value="" disabled>
                          <em>Select Blood Group </em> 
                        </MenuItem>
                        {bloodGroups.map(group => (
                          <MenuItem key={group} value={group}>{group}</MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="nationality"
                  as={TextField}
                  label="Nationality"
                  fullWidth
                  error={touched.nationality && errors.nationality}
                  helperText={touched.nationality && errors.nationality}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="aadharNumber"
                  as={TextField}
                  label="Aadhar Number"
                  fullWidth
                  error={touched.aadharNumber && errors.aadharNumber}
                  helperText={touched.aadharNumber && errors.aadharNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="panNumber"
                  as={TextField}
                  label="PAN Number"
                  fullWidth
                  error={touched.panNumber && errors.panNumber}
                  helperText={touched.panNumber && errors.panNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="mobileNumber"
                  as={TextField}
                  label="Mobile Number"
                  fullWidth
                  error={touched.mobileNumber && errors.mobileNumber}
                  helperText={touched.mobileNumber && errors.mobileNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
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
            const file = event.target.files[0];
            form.setFieldValue("employeeImage", file);
            handleImageUpload(event);
          }}
          required
        />
        {form.touched.employeeImage && form.errors.employeeImage && (
          <Typography color="error">{form.errors.employeeImage}</Typography>
        )}
      </div>
    )}
  </Field>
</Grid>
            </Grid>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
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

