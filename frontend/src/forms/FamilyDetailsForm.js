import React, { useState } from 'react';
import { TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const FamilyDetailsForm = ({ nextStep, prevStep, handleFormDataChange, savedFamilyDetails }) => {
  const [familyMembers, setFamilyMembers] = useState(savedFamilyDetails || [
    { name: '', relation: '', dob: '', dependent: 'No', employed: 'unemployed', sameDept: 'No', empCode: '', department: '', eSalaryCode: '' },
  ]);
  const [errors, setErrors] = useState([]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMembers = [...familyMembers];
    updatedMembers[index][name] = value;
    setFamilyMembers(updatedMembers);
  };

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: '', relation: '', dob: '', dependent: 'No', employed: 'unemployed', sameDept: 'No', empCode: '', department: '', eSalaryCode: '' },
    ]);
  };

  const removeFamilyMember = (index) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
  };

  const validateForm = () => {
    const newErrors = familyMembers.map((member) => {
      let error = {};
      if (!member.name) error.name = 'Name is required';
      if (!member.relation) error.relation = 'Relation is required';
      if (!member.dob) error.dob = 'Date of birth is required';
      return error;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleFormDataChange("familyDetails", familyMembers)
      console.log("familyDetails", familyMembers)
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" gutterBottom>
        FORM-5: EMPLOYEE FAMILY INFORMATION
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Family Member Name</TableCell>
              <TableCell>Relation</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Dependent</TableCell>
              <TableCell>Employment Status</TableCell>
              <TableCell>In Same Department?</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>E-Salary Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {familyMembers.map((member, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="name"
                    value={member.name}
                    onChange={(e) => handleInputChange(index, e)}
                    error={Boolean(errors[index]?.name)}
                    helperText={errors[index]?.name}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="relation"
                    value={member.relation}
                    onChange={(e) => handleInputChange(index, e)}
                    error={Boolean(errors[index]?.relation)}
                    helperText={errors[index]?.relation}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="date"
                    name="dob"
                    value={member.dob}
                    onChange={(e) => handleInputChange(index, e)}
                    error={Boolean(errors[index]?.dob)}
                    helperText={errors[index]?.dob}
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" variant="outlined">
                    <Select
                      name="dependent"
                      value={member.dependent}
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl size="small" variant="outlined">
                    <Select
                      name="employed"
                      value={member.employed}
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl size="small" variant="outlined">
                    <Select
                      name="sameDept"
                      value={member.sameDept}
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="empCode"
                    value={member.empCode}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="department"
                    value={member.department}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    name="eSalaryCode"
                    value={member.eSalaryCode}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeFamilyMember(index)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={addFamilyMember}
        style={{ marginTop: '10px' }}
      >
        Add Family Member
      </Button>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={prevStep}>&lt; Previous</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Next &gt;</Button>
      </div>
      <Footer />
    </motion.div>
  );
};

export default FamilyDetailsForm;