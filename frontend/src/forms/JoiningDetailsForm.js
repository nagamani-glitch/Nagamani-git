import React from 'react';
import { TextField, Button, Box, Typography, Divider, Grid, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';

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
  dateOfAppointment: Yup.date().required('Date of appointment is required'),
  department: Yup.string().required('Department is required'),
  dateOfJoining: Yup.date().required('Date of joining is required'),
  initialDesignation: Yup.string().required('Initial designation is required'),
  modeOfRecruitment: Yup.string().required('Mode of recruitment is required'),
  employeeType: Yup.string().required('Employee type is required')
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

const JoiningDetailsForm = ({ nextStep, prevStep, handleFormDataChange, savedJoiningDetails }) => {
  const initialValues = savedJoiningDetails || {
    dateOfAppointment: new Date().toISOString().split('T')[0],
    department: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    initialDesignation: '',
    modeOfRecruitment: '',
    employeeType: ''
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleFormDataChange("joiningDetails", values);
            nextStep();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <StyledPaper>
                <Typography variant="h5" gutterBottom color="primary">
                  Joining Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="dateOfAppointment"
                      component={AnimatedTextField}
                      label="Date of Appointment"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.dateOfAppointment && errors.dateOfAppointment}
                      helperText={touched.dateOfAppointment && errors.dateOfAppointment}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="department"
                      component={AnimatedTextField}
                      label="Department"
                      fullWidth
                      error={touched.officeName && errors.officeName}
                      helperText={touched.officeName && errors.officeName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="dateOfJoining"
                      component={AnimatedTextField}
                      label="Date of Joining"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.dateOfJoining && errors.dateOfJoining}
                      helperText={touched.dateOfJoining && errors.dateOfJoining}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="initialDesignation"
                      component={AnimatedTextField}
                      label="Initial Designation"
                      fullWidth
                      error={touched.initialDesignation && errors.initialDesignation}
                      helperText={touched.initialDesignation && errors.initialDesignation}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="modeOfRecruitment"
                      component={AnimatedTextField}
                      label="Mode of Recruitment"
                      fullWidth
                      error={touched.modeOfRecruitment && errors.modeOfRecruitment}
                      helperText={touched.modeOfRecruitment && errors.modeOfRecruitment}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="employeeType"
                      component={AnimatedTextField}
                      label="Employee Type"
                      fullWidth
                      error={touched.employeeType && errors.employeeType}
                      helperText={touched.employeeType && errors.employeeType}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StyledButton
                      onClick={prevStep}
                      variant="outlined"
                      fullWidth
                    >
                      Previous
                    </StyledButton>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      fullWidth
                    >
                      Next
                    </StyledButton>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Form>
          )}
        </Formik>
      </motion.div>
    </AnimatePresence>
  );
};

export default JoiningDetailsForm;
