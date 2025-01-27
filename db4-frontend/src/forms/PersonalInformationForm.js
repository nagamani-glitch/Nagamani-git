import React, { useState } from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Paper, FormControl, Button, Typography, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { Checkbox, Divider } from '@mui/material';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4 }
};

const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  caste: Yup.string().required('Caste is required'),
  category: Yup.string().required('Category is required'),
  religion: Yup.string().required('Religion is required'),
  bloodGroup: Yup.string().required('Blood group is required'),
  homeState: Yup.string(),
  homeDistrict: Yup.string()
});

const addressInfoSchema = Yup.object().shape({
  presentAddress: Yup.string().required('Present address is required'),
  block: Yup.string(),
  panchayat: Yup.string(),
  district: Yup.string().required('District is required'),
  state: Yup.string().required('State is required'),
  pinCode: Yup.string().matches(/^\d{6}$/, 'Invalid PIN code').required('PIN code is required'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone number is required'),
  permanentAddress: Yup.string(),
  permanentBlock: Yup.string(),
  permanentPanchayat: Yup.string(),
  permanentDistrict: Yup.string(),
  permanentState: Yup.string(),
  permanentPinCode: Yup.string().matches(/^\d{6}$/, 'Invalid PIN code')
});

const AnimatedTextField = ({ field, form, label, ...props }) => {
  const handleChange = (e) => {
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
        onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
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
          '& .MuiInputBase-input:-webkit-autofill': {
            '-webkit-text-fill-color': '#000000',
            'transition': 'background-color 5000s ease-in-out 0s',
          }
        }}
      />
    </motion.div>
  );
};

const PersonalInformationForm = ({ nextStep, handleFormDataChange, savedPersonalInfo, savedAddressinfo }) => {
  const [step, setStep] = useState(1);
  const [employeeImage, setEmployeeImage] = useState(null);

  const initialPersonalInfo = savedPersonalInfo || {
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    caste: '',
    category: '',
    religion: '',
    bloodGroup: '',
    homeState: '',
    homeDistrict: ''
  };

  const initialAddressInfo = savedAddressinfo || {
    presentAddress: '',
    block: '',
    panchayat: '',
    district: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
    permanentAddress: '',
    permanentBlock: '',
    permanentPanchayat: '',
    permanentDistrict: '',
    permanentState: '',
    permanentPinCode: ''
  };

  const handleImageUpload = (event) => {
    setEmployeeImage(event.target.files[0]);
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div {...pageTransition}>
        {step === 1 ? (
          <Formik
            initialValues={initialPersonalInfo}
            validationSchema={personalInfoSchema}
            onSubmit={(values) => {
              handleFormDataChange("personalInfo", values);
              setStep(2);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Personal Information Fields */}
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="firstName"
                        component={AnimatedTextField}
                        label="First Name"
                        fullWidth
                        error={touched.firstName && errors.firstName}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="lastName"
                        component={AnimatedTextField}
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
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={touched.dob && errors.dob}
                        helperText={touched.dob && errors.dob}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset" fullWidth>
                        <Typography variant="body1">Gender<span className="required">*</span></Typography>
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
  <Field
    name="maritalStatus"
    component={AnimatedTextField}
    label="Marital Status"
    fullWidth
    error={touched.maritalStatus && errors.maritalStatus}
    helperText={touched.maritalStatus && errors.maritalStatus}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="caste"
    component={AnimatedTextField}
    label="Caste"
    fullWidth
    error={touched.caste && errors.caste}
    helperText={touched.caste && errors.caste}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="category"
    component={AnimatedTextField}
    label="Category"
    fullWidth
    error={touched.category && errors.category}
    helperText={touched.category && errors.category}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="religion"
    component={AnimatedTextField}
    label="Religion"
    fullWidth
    error={touched.religion && errors.religion}
    helperText={touched.religion && errors.religion}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="bloodGroup"
    component={AnimatedTextField}
    label="Blood Group"
    fullWidth
    error={touched.bloodGroup && errors.bloodGroup}
    helperText={touched.bloodGroup && errors.bloodGroup}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="homeState"
    component={AnimatedTextField}
    label="Home State"
    fullWidth
    error={touched.homeState && errors.homeState}
    helperText={touched.homeState && errors.homeState}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="homeDistrict" 
    component={AnimatedTextField}
    label="Home District"
    fullWidth
    error={touched.homeDistrict && errors.homeDistrict}
    helperText={touched.homeDistrict && errors.homeDistrict}
  />
</Grid>

                    <Grid item xs={12}>
                      <InputLabel>Employee Image</InputLabel>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ marginTop: '8px' }}
                      />
                    </Grid>
                  </Grid>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3 }}
                    >
                      Next
                    </StyledButton>
                  </motion.div>
                </StyledPaper>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={initialAddressInfo}
            validationSchema={addressInfoSchema}
            onSubmit={(values) => {
              handleFormDataChange("addressInfo", values);
              nextStep();
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
  <Form>
    <StyledPaper>
      <Typography variant="h5" gutterBottom color="primary">
        Address Information
      </Typography>
      <Grid container spacing={3}>
                    {/* Address Information Fields */}
                    <Grid item xs={12}>
                      <Field
                        name="presentAddress"
                        component={AnimatedTextField}
                        label="Present Address"
                        multiline
                        rows={4}
                        fullWidth
                        error={touched.presentAddress && errors.presentAddress}
                        helperText={touched.presentAddress && errors.presentAddress}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
  <Field
    name="block"
    component={AnimatedTextField}
    label="Block"
    fullWidth
    error={touched.block && errors.block}
    helperText={touched.block && errors.block}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="panchayat"
    component={AnimatedTextField}
    label="Panchayat"
    fullWidth
    error={touched.panchayat && errors.panchayat}
    helperText={touched.panchayat && errors.panchayat}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="district"
    component={AnimatedTextField}
    label="District"
    fullWidth
    error={touched.district && errors.district}
    helperText={touched.district && errors.district}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="state"
    component={AnimatedTextField}
    label="State"
    fullWidth
    error={touched.state && errors.state}
    helperText={touched.state && errors.state}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="pinCode"
    component={AnimatedTextField}
    label="PIN Code"
    fullWidth
    error={touched.pinCode && errors.pinCode}
    helperText={touched.pinCode && errors.pinCode}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="phoneNumber"
    component={AnimatedTextField}
    label="Phone Number"
    fullWidth
    error={touched.phoneNumber && errors.phoneNumber}
    helperText={touched.phoneNumber && errors.phoneNumber}
  />
</Grid>

<Grid item xs={12}>
          <Divider sx={{ my: 4 }}>
            <Typography variant="h6" color="primary">
              Permanent Address
            </Typography>
          </Divider>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    const presentFields = {
                      permanentAddress: values.presentAddress,
                      permanentBlock: values.block,
                      permanentPanchayat: values.panchayat,
                      permanentDistrict: values.district,
                      permanentState: values.state,
                      permanentPinCode: values.pinCode
                    };
                    Object.keys(presentFields).forEach(field => {
                      setFieldValue(field, presentFields[field]);
                    });
                  }
                }}
              />
            }
            label={
              <Typography variant="body1" color="primary">
                Same as Present Address
              </Typography>
            }
          />
        </Grid>

<Grid item xs={12}>
  <Field
    name="permanentAddress"
    component={AnimatedTextField}
    label="Permanent Address"
    multiline
    rows={4}
    fullWidth
    error={touched.permanentAddress && errors.permanentAddress}
    helperText={touched.permanentAddress && errors.permanentAddress}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="permanentBlock"
    component={AnimatedTextField}
    label="Permanent Block"
    fullWidth
    error={touched.permanentBlock && errors.permanentBlock}
    helperText={touched.permanentBlock && errors.permanentBlock}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="permanentPanchayat"
    component={AnimatedTextField}
    label="Permanent Panchayat"
    fullWidth
    error={touched.permanentPanchayat && errors.permanentPanchayat}
    helperText={touched.permanentPanchayat && errors.permanentPanchayat}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="permanentDistrict"
    component={AnimatedTextField}
    label="Permanent District"
    fullWidth
    error={touched.permanentDistrict && errors.permanentDistrict}
    helperText={touched.permanentDistrict && errors.permanentDistrict}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="permanentState"
    component={AnimatedTextField}
    label="Permanent State"
    fullWidth
    error={touched.permanentState && errors.permanentState}
    helperText={touched.permanentState && errors.permanentState}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Field
    name="permanentPinCode"
    component={AnimatedTextField}
    label="PIN Code"
    fullWidth
    error={touched.permanentPinCode && errors.permanentPinCode}
    helperText={touched.permanentPinCode && errors.permanentPinCode}
  />
</Grid>

                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={6}>
                      <StyledButton
                        onClick={() => setStep(1)}
                        variant="outlined"
                        fullWidth
                      >
                        Back
                      </StyledButton>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledButton
                        type="submit"
                        variant="contained"
                        fullWidth
                      >
                        Submit
                      </StyledButton>
                    </Grid>
                  </Grid>
                </StyledPaper>
              </Form>
            )}
          </Formik>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonalInformationForm;
