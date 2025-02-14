import React from 'react';
import { TextField, Paper, FormControl, Button, Typography, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  presentAddress: Yup.string().required('Present address is required'),
  presentCity: Yup.string().required('City is required'),
  presentState: Yup.string().required('State is required'),
  presentPinCode: Yup.string().matches(/^[0-9]{6}$/, 'Pin code must be 6 digits').required('Pin code is required'),
  presentCountry: Yup.string().required('Country is required'),
  permanentAddress: Yup.string().required('Permanent address is required'),
  permanentCity: Yup.string().required('City is required'),
  permanentState: Yup.string().required('State is required'),
  permanentPinCode: Yup.string().matches(/^[0-9]{6}$/, 'Pin code must be 6 digits').required('Pin code is required'),
  permanentCountry: Yup.string().required('Country is required'),
  presentDistrict: Yup.string().required('District is required'),
  permanentDistrict: Yup.string().required('District is required'),
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
    <TextField
      {...field}
      {...props}
      label={label}
      onChange={handleChange}
      sx={{
        '& .MuiInputBase-input': {
          color: '#000000',
        }
      }}
    />
  );
};

const AddressDetailsForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  const initialValues = {
    presentAddress: '',
    presentCity: '',
    presentState: '',
    presentPinCode: '',
    presentCountry: '',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentPinCode: '',
    permanentCountry: '',
    presentDistrict:'',
    permanentDistrict:''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleFormDataChange("addressInfo", values);
        nextStep();
      }}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Present Address
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  name="presentAddress"
                  component={AnimatedTextField}
                  label="Address"
                  multiline
                  rows={4}
                  fullWidth
                  error={touched.presentAddress && errors.presentAddress}
                  helperText={touched.presentAddress && errors.presentAddress}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentCity"
                  component={AnimatedTextField}
                  label="City"
                  fullWidth
                  error={touched.presentCity && errors.presentCity}
                  helperText={touched.presentCity && errors.presentCity}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentDistrict"
                  component={AnimatedTextField}
                  label="District"
                  fullWidth
                  error={touched.presentDistrict && errors.presentDistrict}
                  helperText={touched.presentDistrict && errors.presentDistrict}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentState"
                  component={AnimatedTextField}
                  label="State"
                  fullWidth
                  error={touched.presentState && errors.presentState}
                  helperText={touched.presentState && errors.presentState}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentPinCode"
                  component={AnimatedTextField}
                  label="Pin Code"
                  fullWidth
                  error={touched.presentPinCode && errors.presentPinCode}
                  helperText={touched.presentPinCode && errors.presentPinCode}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentCountry"
                  component={AnimatedTextField}
                  label="Country"
                  fullWidth
                  error={touched.presentCountry && errors.presentCountry}
                  helperText={touched.presentCountry && errors.presentCountry}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFieldValue('permanentAddress', values.presentAddress);
                          setFieldValue('permanentCity', values.presentCity);
                          setFieldValue('permanentState', values.presentState);
                          setFieldValue('permanentDistrict', values.presentDistrict);
                          setFieldValue('permanentPinCode', values.presentPinCode);
                          setFieldValue('permanentCountry', values.presentCountry);
                        }
                      }}
                    />
                  }
                  label="Same as Present Address"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary">
                  Permanent Address
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="permanentAddress"
                  component={AnimatedTextField}
                  label="Address"
                  multiline
                  rows={4}
                  fullWidth
                  error={touched.permanentAddress && errors.permanentAddress}
                  helperText={touched.permanentAddress && errors.permanentAddress}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="permanentCity"
                  component={AnimatedTextField}
                  label="City"
                  fullWidth
                  error={touched.permanentCity && errors.permanentCity}
                  helperText={touched.permanentCity && errors.permanentCity}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="permanentDistrict"
                  component={AnimatedTextField}
                  label="District"
                  fullWidth
                  error={touched.permanentDistrict && errors.permanentDistrict}
                  helperText={touched.permanentDistrict && errors.permanentDistrict}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="permanentState"
                  component={AnimatedTextField}
                  label="State"
                  fullWidth
                  error={touched.permanentState && errors.permanentState}
                  helperText={touched.permanentState && errors.permanentState}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="permanentPinCode"
                  component={AnimatedTextField}
                  label="Pin Code"
                  fullWidth
                  error={touched.permanentPinCode && errors.permanentPinCode}
                  helperText={touched.permanentPinCode && errors.permanentPinCode}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="permanentCountry"
                  component={AnimatedTextField}
                  label="Country"
                  fullWidth
                  error={touched.permanentCountry && errors.permanentCountry}
                  helperText={touched.permanentCountry && errors.permanentCountry}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={prevStep}
                    variant="outlined"
                    fullWidth
                  >
                    Previous
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={6}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Next
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default AddressDetailsForm;
