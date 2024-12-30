import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const ServiceHistoryForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  const [serviceHistory, setServiceHistory] = useState([
    { transactionType: '', office: '', post: '', orderNumber: '', orderDate: '', incrementDate: '', payScale: '', otherDept: '', areaType: '' },
  ]);
  const [errors, setErrors] = useState([]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedHistory = [...serviceHistory];
    updatedHistory[index][name] = value;
    setServiceHistory(updatedHistory);
  };

  const addServiceEntry = () => {
    setServiceHistory([
      ...serviceHistory,
      { transactionType: '', office: '', post: '', orderNumber: '', orderDate: '', incrementDate: '', payScale: '', otherDept: '', areaType: '' },
    ]);
  };

  const removeServiceEntry = (index) => {
    const updatedHistory = serviceHistory.filter((_, i) => i !== index);
    setServiceHistory(updatedHistory);
  };

  const validateForm = () => {
    const newErrors = serviceHistory.map((entry) => {
      let error = {};
      if (!entry.transactionType) error.transactionType = 'Transaction Type is required';
      if (!entry.office) error.office = 'Office is required';
      return error;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleFormDataChange("serviceHistory", serviceHistory);
      console.log("serviceHistory", serviceHistory);
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px' }}
    >
      <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#1976D2' }}>FORM-6: EMPLOYEE SERVICE HISTORY</h2>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Transaction Type</TableCell>
              <TableCell>To Office</TableCell>
              <TableCell>To Which Post</TableCell>
              <TableCell>Order Number</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Date of Increment</TableCell>
              <TableCell>Pay Scale</TableCell>
              <TableCell>Other Department (if Deputation)</TableCell>
              <TableCell>Area Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceHistory.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="transactionType"
                    value={entry.transactionType}
                    onChange={(e) => handleInputChange(index, e)}
                    error={!!errors[index]?.transactionType}
                    helperText={errors[index]?.transactionType}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="office"
                    value={entry.office}
                    onChange={(e) => handleInputChange(index, e)}
                    error={!!errors[index]?.office}
                    helperText={errors[index]?.office}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="post"
                    value={entry.post}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="orderNumber"
                    value={entry.orderNumber}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="date"
                    name="orderDate"
                    value={entry.orderDate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="date"
                    name="incrementDate"
                    value={entry.incrementDate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="payScale"
                    value={entry.payScale}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="otherDept"
                    value={entry.otherDept}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="areaType"
                    value={entry.areaType}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="error" size="small" onClick={() => removeServiceEntry(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={prevStep}> &lt; Previous</Button>
        <Button variant="contained" color="primary" onClick={addServiceEntry}>Add Service Entry</Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>Next &gt; </Button>
      </div>
      <Footer />
    </motion.div>
  );
};

export default ServiceHistoryForm;
