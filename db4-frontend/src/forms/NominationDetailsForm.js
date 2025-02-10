import React from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Container, 
  Box,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { 
  PersonAdd, 
  ArrowBack, 
  Send,
  Home,
  Phone,
  Badge,
  Percent,
  CalendarToday,
  LocationOn
} from '@mui/icons-material';

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nominee name is required'),
  relation: Yup.string().required('Relation is required'),
  typeOfNomination: Yup.string().required('Type of nomination is required'),
  nominationPercentage: Yup.number()
    .required('Nomination percentage is required')
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100'),
  nomineeAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  presentAddress: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  state: Yup.string().required('State is required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Pin code must be 6 digits')
    .required('Pin code is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required')
});

const NominationDetailsForm = ({ handleSubmit, prevStep, handleFormDataChange, savedNominationDetails }) => {
  const initialValues = savedNominationDetails || {
    name: '',
    relation: '',
    typeOfNomination: '',
    nominationPercentage: '',
    nomineeAge: '',
    presentAddress: '',
    City: '',    
    district: '',
    state: '',
    pinCode: '',
    phoneNumber: ''
  };

  const handleFinalSubmit = (values) => {
    // First update the nomination details
    handleFormDataChange("nominationDetails", {
      ...values,
      nomineeAge: parseInt(values.nomineeAge),
      nominationPercentage: parseInt(values.nominationPercentage)
    });
    // Then trigger the final submission
    handleSubmit();
  };

  return (
    <Container 
      component={motion.div} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      maxWidth="md"
    >
      <StyledPaper elevation={3}>
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center" 
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          sx={{ 
            marginTop: '20px', 
            fontWeight: 'bold',
            color: 'primary.main' 
          }}
        >
          <PersonAdd sx={{ mr: 2, verticalAlign: 'middle' }} />
          EMPLOYEE NOMINATION DETAILS
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFinalSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Nominee Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    // InputProps={{
                    //   startAdornment: <Badge sx={{ mr: 1, color: 'primary.main' }} />
                    // }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="relation"
    label="Relation with Employee"
    value={values.relation}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.relation && Boolean(errors.relation)}
    helperText={touched.relation && errors.relation}
    // InputProps={{
    //   startAdornment: <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
    // }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="typeOfNomination"
    label="Type of Nomination"
    value={values.typeOfNomination}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.typeOfNomination && Boolean(errors.typeOfNomination)}
    helperText={touched.typeOfNomination && errors.typeOfNomination}
    // InputProps={{
    //   startAdornment: <Badge sx={{ mr: 1, color: 'primary.main' }} />
    // }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="nominationPercentage"
    label="Nomination Percentage (%)"
    type="number"
    value={values.nominationPercentage}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.nominationPercentage && Boolean(errors.nominationPercentage)}
    helperText={touched.nominationPercentage && errors.nominationPercentage}
    // InputProps={{
    //   startAdornment: <Percent sx={{ mr: 1, color: 'primary.main' }} />,
    //   inputProps: { min: 0, max: 100 }
    // }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="nomineeAge"
    label="Nominee Age"
    type="number"
    value={values.nomineeAge}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.nomineeAge && Boolean(errors.nomineeAge)}
    helperText={touched.nomineeAge && errors.nomineeAge}
    // InputProps={{
    //   startAdornment: <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />,
    //   inputProps: { min: 0 }
    // }}
  />
</Grid>



<Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="presentAddress"
                    label="Present Address"
                    value={values.presentAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.presentAddress && Boolean(errors.presentAddress)}
                    helperText={touched.presentAddress && errors.presentAddress}
                    // InputProps={{
                    //   startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    // }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  // InputProps={{
                  //   startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                  // }}
                  />
                </Grid>              

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="district"
    label="District"
    value={values.district}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.district && Boolean(errors.district)}
    helperText={touched.district && errors.district}
    InputProps={{
      startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
    }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="state"
    label="State"
    value={values.state}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.state && Boolean(errors.state)}
    helperText={touched.state && errors.state}
    InputProps={{
      startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
    }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="pinCode"
    label="Pin Code"
    value={values.pinCode}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.pinCode && Boolean(errors.pinCode)}
    helperText={touched.pinCode && errors.pinCode}
    InputProps={{
      startAdornment: <Home sx={{ mr: 1, color: 'primary.main' }} />
    }}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="phoneNumber"
    label="Phone Number"
    value={values.phoneNumber}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
    helperText={touched.phoneNumber && errors.phoneNumber}
    InputProps={{
      startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} />
    }}
  />
</Grid>

              </Grid>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4 
              }}>
                <Tooltip title="Previous Step">
                  <StyledButton
                    variant="outlined"
                    onClick={prevStep}
                    startIcon={<ArrowBack />}
                  >
                    Previous
                  </StyledButton>
                </Tooltip>

                <Tooltip title="Submit Registration">
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<Send />}
                  >
                    Submit
                  </StyledButton>
                </Tooltip>
              </Box>
            </Form>
          )}
        </Formik>
      </StyledPaper>
    </Container>
  );
};

export default NominationDetailsForm;
