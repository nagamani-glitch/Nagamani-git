import React from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Paper, FormControl, Button, Typography, Grid, Select, MenuItem , InputLabel, FormHelperText} from '@mui/material';
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
  aadharNumber: Yup.string().matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits').required('Aadhar number is required'),
  panNumber: Yup.string().length(10, 'PAN number must be 10 characters').required('PAN number is required'),
  mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  prefix: Yup.string().required('Prefix is required'),
  employeeImage: Yup.mixed()
    .required('Profile photo is required')
    .test('fileFormat', 'Only image formats are allowed', value => {
      if (!value) return false;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    })
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const prefixOptions = [{value: 'Mr.' , gender : 'Male'},
                       {value: 'Ms.' , gender : 'Female'},
                       {value: 'Dr.' , gender : 'Null'}];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const genderOptions = {
  'Mr.': ['Male'],
  'Ms.': ['Female'],
  // 'Mrs.': ['Female'],
  'Dr.': ['Male', 'Female', 'Other']
};

const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];



const PersonalInformationForm = ({ nextStep, handleFormDataChange, handleImageUpload }) => {
  const initialValues = {
    prefix:'',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
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
      // Handle email field normally
      if (field.name === 'email') {
        form.setFieldValue(field.name, e.target.value);
        return;
      }
      
      // Handle PAN number in uppercase
      if (field.name === 'panNumber') {
        form.setFieldValue(field.name, e.target.value.toUpperCase());
        return;
      }
      
      // Handle other fields in sentence case
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
  {/* Name fields in single line */}
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
        
        // Set gender automatically if prefix has defined gender
        if (selectedPrefix.gender) {
          form.setFieldValue('gender', selectedPrefix.gender);
        }
      }}
    >
      <MenuItem value="" disabled>
        <em>Title</em>
      </MenuItem>
      {prefixOptions.map(prefix => (
        <MenuItem key={prefix.value} value={prefix.value}>{prefix.value}</MenuItem>
      ))}
    </Select>
  )}
</Field>
      </FormControl>
    </Grid>
    
    <Grid item xs={3}>
      <Field name="firstName">
        {({ field, form }) => (
          <TextField
            {...field}
            label="First Name"
            fullWidth
            onChange={(e) => {
              const sentenceCaseValue = e.target.value
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              form.setFieldValue(field.name, sentenceCaseValue);
            }}
            error={touched.firstName && errors.firstName}
            helperText={touched.firstName && errors.firstName}
          />
        )}
      </Field>
    </Grid>

    <Grid item xs={3}>
      <Field name="middleName">
        {({ field, form }) => (
          <TextField
            {...field}
            label="Middle Name"
            fullWidth
            onChange={(e) => {
              const sentenceCaseValue = e.target.value
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              form.setFieldValue(field.name, sentenceCaseValue);
            }}
          />
        )}
      </Field>
    </Grid>

    <Grid item xs={4}>
      <Field name="lastName">
        {({ field, form }) => (
          <TextField
            {...field}
            label="Last Name"
            fullWidth
            onChange={(e) => {
              const sentenceCaseValue = e.target.value
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              form.setFieldValue(field.name, sentenceCaseValue);
            }}
            error={touched.lastName && errors.lastName}
            helperText={touched.lastName && errors.lastName}
          />
        )}
      </Field>
    </Grid>
  </Grid>            
          
  <Grid item xs={12} sm={6}>
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
  {touched.dob && errors.dob && (
    <Typography color="error" variant="caption">
      {errors.dob}
    </Typography>
  )}
</Grid>
              
              <Grid item container spacing={2}>
  <Grid item xs={6}>
    <FormControl fullWidth>
      <InputLabel>Gender</InputLabel>
      <Field name="gender">
        {({ field, form }) => (
          <Select
            {...field}
            label="Gender"
            displayEmpty
            error={touched.gender && errors.gender}
          >
            <MenuItem value="" disabled>
              <em>Select Gender</em>
            </MenuItem>
            {genderOptions[form.values.prefix]?.map(gender => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        )}
      </Field>
      {touched.gender && errors.gender && (
        <FormHelperText error>{errors.gender}</FormHelperText>
      )}
    </FormControl>
  </Grid>

  <Grid item xs={6}>
    <FormControl fullWidth>
      <InputLabel>Marital Status</InputLabel>
      <Field name="maritalStatus">
        {({ field, form }) => (
          <Select
            {...field}
            label="Marital Status"
            displayEmpty
            error={touched.maritalStatus && errors.maritalStatus}
          >
            <MenuItem value="" disabled>
              <em>Select Marital Status</em>
            </MenuItem>
            {maritalStatusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        )}
      </Field>
      {touched.maritalStatus && errors.maritalStatus && (
        <FormHelperText error>{errors.maritalStatus}</FormHelperText>
      )}
    </FormControl>
  </Grid>
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
    <Field name="nationality">
      {({ field, form }) => (
        <TextField
          {...field}
          label="Nationality"
          fullWidth
          onChange={(e) => {
            const sentenceCaseValue = e.target.value
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            form.setFieldValue(field.name, sentenceCaseValue);
          }}
          error={touched.nationality && errors.nationality}
          helperText={touched.nationality && errors.nationality}
        />
      )}
    </Field>
  </Grid>


  <Grid item xs={12} sm={6}>
    <Field name="aadharNumber">
      {({ field, form }) => (
        <TextField
          {...field}
          label="Aadhar Number"
          fullWidth
          onChange={(e) => {
            form.setFieldValue(field.name, e.target.value);
          }}
          error={touched.aadharNumber && errors.aadharNumber}
          helperText={touched.aadharNumber && errors.aadharNumber}
        />
      )}
    </Field>
  </Grid>

  <Grid item xs={12} sm={6}>
    <Field name="panNumber">
      {({ field, form }) => (
        <TextField
          {...field}
          label="PAN Number"
          fullWidth
          onChange={(e) => {
            form.setFieldValue(field.name, e.target.value.toUpperCase());
          }}
          error={touched.panNumber && errors.panNumber}
          helperText={touched.panNumber && errors.panNumber}
        />
      )}
    </Field>
  </Grid>

  <Grid item xs={12} sm={6}>
    <Field name="mobileNumber">
      {({ field, form }) => (
        <TextField
          {...field}
          label="Mobile Number"
          fullWidth
          onChange={(e) => {
            form.setFieldValue(field.name, e.target.value);
          }}
          error={touched.mobileNumber && errors.mobileNumber}
          helperText={touched.mobileNumber && errors.mobileNumber}
        />
      )}
    </Field>
  </Grid>

  <Grid item xs={12} sm={6}>
    <Field name="email">
      {({ field, form }) => (
        <TextField
          {...field}
          label="Email"
          fullWidth
          onChange={(e) => {
            form.setFieldValue(field.name, e.target.value);
          }}
          error={touched.email && errors.email}
          helperText={touched.email && errors.email}
        />
      )}
      </Field>
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

