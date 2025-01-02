import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Divider, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from "../components/Footer";

const JoiningDetailsForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  // State to track errors for each field
  const [errors, setErrors] = useState({});
  const [joiningDetails, setJoiningDetails] = useState({
    dateOfAppointment:"",
    officeName:"",
    dateOfJoining:"",
    initialDesignation:"",
    modeOfRecruitment:"",
    employeeType:""
  })

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJoiningDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Clear error when the user starts typing in a field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the error for the field
    }));
  };

  // Validate fields
  const validateFields = () => {
    const newErrors = {};
    if (!joiningDetails.dateOfAppointment) newErrors.dateOfAppointment = '*Required';
    if (!joiningDetails.officeName) newErrors.officeName = '*Required';
    if (!joiningDetails.dateOfJoining) newErrors.dateOfJoining = '*Required';
    if (!joiningDetails.initialDesignation) newErrors.initialDesignation = '*Required';
    if (!joiningDetails.modeOfRecruitment) newErrors.modeOfRecruitment = '*Required';
    if (!joiningDetails.employeeType) newErrors.employeeType = '*Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    if (validateFields()) {
      handleFormDataChange("joiningDetails", joiningDetails)
      console.log("Joining details:", joiningDetails)
      nextStep(); // Proceed to the next form if validation is successful
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Employment Details */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Joining Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Appointment"
                  type="date"
                  name="dateOfAppointment"
                  value={joiningDetails.dateOfAppointment}
                  onChange={handleChange}
                  error={!!errors.dateOfAppointment}
                  helperText={errors.dateOfAppointment || ''}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Office Name at the time of Initial Joining in Dept"
                  name="officeName"
                  value={joiningDetails.officeName}
                  onChange={handleChange}
                  error={!!errors.officeName}
                  helperText={errors.officeName || ''}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Joining in the Dept"
                  type="date"
                  name="dateOfJoining"
                  value={joiningDetails.dateOfJoining}
                  onChange={handleChange}
                  error={!!errors.dateOfJoining}
                  helperText={errors.dateOfJoining || ''}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Initial Designation"
                  name="initialDesignation"
                  value={joiningDetails.initialDesignation}
                  onChange={handleChange}
                  error={!!errors.initialDesignation}
                  helperText={errors.initialDesignation || ''}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mode of Recruitment"
                  name="modeOfRecruitment"
                  value={joiningDetails.modeOfRecruitment}
                  onChange={handleChange}
                  error={!!errors.modeOfRecruitment}
                  helperText={errors.modeOfRecruitment || ''}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee Type"
                  name="employeeType"
                  value={joiningDetails.employeeType}
                  onChange={handleChange}
                  error={!!errors.employeeType}
                  helperText={errors.employeeType || ''}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ marginY: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={prevStep}>
              Prev
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Next
            </Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </motion.div>
  );
};

export default JoiningDetailsForm;

