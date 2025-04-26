import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateFeedback.css';
import { Autocomplete, TextField, Box, Avatar, Typography, CircularProgress } from '@mui/material';

const CreateFeedback = ({ addFeedback, editData, onClose, feedbackType, currentUser }) => {
  const [formData, setFormData] = useState(editData || {
    title: '',
    employee: '',
    manager: '',
    subordinates: '',
    colleague: '',
    period: '',
    startDate: '',
    dueDate: '',
    questionTemplate: '',
    keyResult: '',
    status: 'Not Started',
    priority: 'Medium',
    description: ''
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees data on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/employees/registered');
        
        // Transform the data to the format we need
        const formattedEmployees = response.data.map(emp => ({
          id: emp.Emp_ID,
          name: `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.trim(),
          email: emp.personalInfo?.email || '',
          designation: emp.joiningDetails?.initialDesignation || 'No Designation',
          department: emp.joiningDetails?.department || 'No Department'
        }));
        
        setEmployees(formattedEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employees data');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  // In the CreateFeedback component, add:
useEffect(() => {
  // If it's self-feedback, pre-fill with current user's info
//   if (props.feedbackType === 'selfFeedback' && props.currentUser) {
//     setFormData(prev => ({
//       ...prev,
//       employee: `${props.currentUser.personalInfo.firstName} ${props.currentUser.personalInfo.lastName}`,
//       employeeId: props.currentUser.Emp_ID
//     }));
//   }
// }, [props.currentUser, props.feedbackType]);
if (feedbackType === 'selfFeedback' && currentUser) {
  setFormData(prev => ({
    ...prev,
    employee: `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`,
    employeeId: currentUser.Emp_ID
  }));
}
}, [currentUser, feedbackType]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmployeeSelect = (field, value) => {
    if (value) {
      // If value is an object (selected from dropdown)
      if (typeof value === 'object' && value !== null) {
        setFormData((prevData) => ({
          ...prevData,
          [field]: value.name,
          [`${field}Data`]: value // Store the full employee data
        }));
      } else {
        // If value is a string (manually entered)
        setFormData((prevData) => ({
          ...prevData,
          [field]: value,
          [`${field}Data`]: null
        }));
      }
    } else {
      // If value is null (cleared)
      setFormData((prevData) => ({
        ...prevData,
        [field]: '',
        [`${field}Data`]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      id: editData ? editData.id : Date.now(),
      ...formData
    };
    addFeedback(newFeedback, editData ? true : false);
    onClose();
  };  

  return (
    <div className="create-filter-popup">
      <h3>{editData ? 'Edit Feedback' : 'Create Feedback'}</h3>
      <form onSubmit={handleSubmit}>
        <label>Employee</label>
        <Autocomplete
          options={employees}
          getOptionLabel={(option) => {
            // Handle both string values and option objects
            if (typeof option === 'string') {
              return option;
            }
            return option.name || '';
          }}
          freeSolo
          value={formData.employeeData || formData.employee}
          onChange={(event, newValue) => handleEmployeeSelect('employee', newValue)}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {option.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.id} • {option.designation} • {option.department}
                </Typography>
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Select or enter employee name"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        
        <div className="group">
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label>
            Manager
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.name || '';
              }}
              freeSolo
              value={formData.managerData || formData.manager}
              onChange={(event, newValue) => handleEmployeeSelect('manager', newValue)}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.id} • {option.designation} • {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select or enter manager name"
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </label>
        </div>

        <div className="group">
          <label>
            Subordinates
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.name || '';
              }}
              freeSolo
              value={formData.subordinatesData || formData.subordinates}
              onChange={(event, newValue) => handleEmployeeSelect('subordinates', newValue)}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.id} • {option.designation} • {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select or enter subordinate name"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </label>
          <label>
            Colleague
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.name || '';
              }}
              freeSolo
              value={formData.colleagueData || formData.colleague}
              onChange={(event, newValue) => handleEmployeeSelect('colleague', newValue)}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.id} • {option.designation} • {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select or enter colleague name"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </label>
        </div>

        <div className="group">
          <label>
            Period
            <input type="text" name="period" value={formData.period} onChange={handleChange} required />
          </label>
          <label>
            Start Date
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </label>
          <label>
            Due Date
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
          </label>
        </div>

        <div className="group">
          <label>
            Question Template
            <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} required />
          </label>
          <label>
            Key Result
            <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} required />
          </label>
        </div>

        <div className="group">
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </label>
          <label>
            Priority
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
        </div>

        <div className="group">
          <label>
            Description
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange} 
              rows="3"
            />
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="save-btn">{editData ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default CreateFeedback;
