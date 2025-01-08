import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const NominationDetailsForm = ({ handleSubmit, prevStep, handleFormDataChange, savedNominationDetails }) => {
  const [nominee, setNominee] = useState(savedNominationDetails || {
    name: '',
    relation: '',
    typeOfNomination: '',
    nominationPercentage: '',
    nomineeAge:'' ,
    presentAddress: '',
    block: '',
    panchayatMandal: '',
    district: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
  });


  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNominee({ ...nominee, [name]: value });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!nominee.name) validationErrors.name = 'Nominee name is required';
    if (!nominee.relation) validationErrors.relation = 'Relation is required';
    if (!nominee.typeOfNomination) validationErrors.typeOfNomination = 'Type of nomination is required';
    if (!nominee.nominationPercentage) validationErrors.nominationPercentage = 'Nomination percentage is required';
    if (!nominee.nomineeAge) validationErrors.nomineeAge = 'Enter Age';
    if (!nominee.presentAddress) validationErrors.presentAddress = 'Present address is required';
    if (!nominee.district) validationErrors.district = 'District is required';
    if (!nominee.state) validationErrors.state = 'State is required';
    if (!nominee.pinCode) validationErrors.pinCode = 'Pin Code is required';
    if (!nominee.phoneNumber) validationErrors.phoneNumber = 'Phone number is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFinalSubmit  = (e) => {
    e.preventDefault()
    if (validateForm()) {
      handleFormDataChange("nominationDetails", nominee)
      console.log("nominationDetails", nominee)
      handleSubmit()
    }
  };

  return (
    <Container component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" style={{ marginTop: '20px', fontWeight: 'bold' }}>
        FORM-7: EMPLOYEE NOMINATION DETAILS
      </Typography>
      <Box component="form" onSubmit={handleFinalSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nominee Name"
              name="name"
              value={nominee.name}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Relation with Employee"
              name="relation"
              value={nominee.relation}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.relation}
              helperText={errors.relation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Type of Nomination"
              name="typeOfNomination"
              value={nominee.typeOfNomination}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.typeOfNomination}
              helperText={errors.typeOfNomination}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nomination Percentage (%)"
              type="number"
              name="nominationPercentage"
              value={nominee.nominationPercentage}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.nominationPercentage}
              helperText={errors.nominationPercentage}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nominee Age"
              type="number"
              name="nomineeAge"
              value={nominee.nomineeAge}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.nomineeAge}
              helperText={errors.nomineeAge}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Present Address"
              name="presentAddress"
              value={nominee.presentAddress}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              error={!!errors.presentAddress}
              helperText={errors.presentAddress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Block"
              name="block"
              value={nominee.block}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Panchayat/Mandal"
              name="panchayatMandal"
              value={nominee.panchayatMandal}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="District"
              name="district"
              value={nominee.district}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.district}
              helperText={errors.district}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              value={nominee.state}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pin Code"
              name="pinCode"
              value={nominee.pinCode}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.pinCode}
              helperText={errors.pinCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={nominee.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={prevStep} sx={{ padding: '10px 20px' }}>
            Previous
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ padding: '10px 20px' }}>
            Submit
          </Button>
        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default NominationDetailsForm;