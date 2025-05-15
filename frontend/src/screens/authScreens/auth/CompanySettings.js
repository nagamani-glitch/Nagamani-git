import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar
} from '@mui/material';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const CompanySettings = () => {
  const {
    companyData,
    loading,
    error,
    updateSuccess,
    getCompanyDetails,
    updateDetails,
    updateSettings,
    clearState
  } = useCompanySettings();
  
  const [localCompanyData, setLocalCompanyData] = useState({
    name: '',
    companyCode: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    settings: {
      leavePolicy: {
        casualLeavePerYear: 12,
        sickLeavePerYear: 12,
        earnedLeavePerYear: 12
      },
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    console.log('CompanySettings component mounted, fetching company details');
    getCompanyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (companyData) {
      console.log('Updating local company data with fetched data');
      setLocalCompanyData(companyData);
    }
  }, [companyData]);

  useEffect(() => {
    if (updateSuccess) {
      setSuccessMessage('Company settings updated successfully');
      clearState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setLocalCompanyData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleLeavePolicyChange = (e) => {
    const { name, value } = e.target;
    setLocalCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        leavePolicy: {
          ...prev.settings.leavePolicy,
          [name]: parseInt(value, 10) || 0
        }
      }
    }));
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setLocalCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingHours: {
          ...prev.settings.workingHours,
          [name]: value
        }
      }
    }));
  };

  const handleWorkingDaysChange = (e) => {
    setLocalCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingDays: e.target.value
      }
    }));
  };

  const saveCompanyDetails = async () => {
    console.log('Saving company details:', {
      name: localCompanyData.name,
      industry: localCompanyData.industry,
      contactEmail: localCompanyData.contactEmail,
      contactPhone: localCompanyData.contactPhone,
      address: localCompanyData.address
    });
    
    try {
      await updateDetails({
        name: localCompanyData.name,
        industry: localCompanyData.industry,
        contactEmail: localCompanyData.contactEmail,
        contactPhone: localCompanyData.contactPhone,
        address: localCompanyData.address
      });
    } catch (error) {
      console.error('Error saving company details:', error);
    }
  };

  const saveCompanySettings = async () => {
    console.log('Saving company settings:', {
      leavePolicy: localCompanyData.settings.leavePolicy,
      workingHours: localCompanyData.settings.workingHours,
      workingDays: localCompanyData.settings.workingDays
    });
    
    try {
      await updateSettings({
        leavePolicy: localCompanyData.settings.leavePolicy,
        workingHours: localCompanyData.settings.workingHours,
        workingDays: localCompanyData.settings.workingDays
      });
    } catch (error) {
      console.error('Error saving company settings:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  if (loading && !localCompanyData.name) return <Typography>Loading company details...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Company Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* Company Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="name"
                  value={localCompanyData.name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Code"
                  name="companyCode"
                  value={localCompanyData.companyCode}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={localCompanyData.industry}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contactEmail"
                  value={localCompanyData.contactEmail}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  name="contactPhone"
                  value={localCompanyData.contactPhone}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Address
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={localCompanyData.address.street}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={localCompanyData.address.city}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={localCompanyData.address.state}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={localCompanyData.address.country}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="zipCode"
                  value={localCompanyData.address.zipCode}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={saveCompanyDetails}
              >
                Save Company Details
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Company Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Leave Policy
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Casual Leave Per Year"
                  name="casualLeavePerYear"
                  type="number"
                  value={localCompanyData.settings.leavePolicy.casualLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Sick Leave Per Year"
                  name="sickLeavePerYear"
                  type="number"
                  value={localCompanyData.settings.leavePolicy.sickLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Earned Leave Per Year"
                  name="earnedLeavePerYear"
                  type="number"
                  value={localCompanyData.settings.leavePolicy.earnedLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Working Hours
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="start"
                  type="time"
                  value={localCompanyData.settings.workingHours.start}
                  onChange={handleWorkingHoursChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="end"
                  type="time"
                  value={localCompanyData.settings.workingHours.end}
                  onChange={handleWorkingHoursChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Working Days
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Working Days</InputLabel>
              <Select
                multiple
                value={localCompanyData.settings.workingDays}
                onChange={handleWorkingDaysChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={saveCompanySettings}
              >
                Save Company Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default CompanySettings;
