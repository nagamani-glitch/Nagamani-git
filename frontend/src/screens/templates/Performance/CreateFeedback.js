// import React, { useState } from 'react';
// import './CreateFeedback.css'

// const CreateFeedback = ({ addFeedback, editData, onClose }) => {
//   const [formData, setFormData] = useState(editData || {
//     title: '',
//     employee: '',
//     manager: '',
//     subordinates: '',
//     colleague: '',
//     period: '',
//     startDate: '',
//     dueDate: '',
//     questionTemplate: '',
//     keyResult: '',
//     status: 'Not Started'
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newFeedback = {
//       id: editData ? editData.id : Date.now(),
//       ...formData
//     };
//     addFeedback(newFeedback, editData ? true : false);
//     onClose();
//   };  

//   return (
//     <div className="create-filter-popup">
//       <h3>{editData ? 'Edit Feedback' : 'Create Feedback'}</h3>
//       <form onSubmit={handleSubmit}>
//         <label>Employee</label>
//         <input type="text" name="employee" value={formData.employee} onChange={handleChange} required />
        
//         <div className="group">
//           <label>
//             Title
//             <input type="text" name="title" value={formData.title} onChange={handleChange} required />
//           </label>
//           <label>
//             Manager
//             <input type="text" name="manager" value={formData.manager} onChange={handleChange} required />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Subordinates
//             <input type="text" name="subordinates" value={formData.subordinates} onChange={handleChange} />
//           </label>
//           <label>
//             Colleague
//             <input type="text" name="colleague" value={formData.colleague} onChange={handleChange} />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Period
//             <input type="text" name="period" value={formData.period} onChange={handleChange} required />
//           </label>
//           <label>
//             Start Date
//             <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
//           </label>
//           <label>
//             Due Date
//             <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Question Template
//             <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} required />
//           </label>
//           <label>
//             Key Result
//             <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} required />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Status
//             <select name="status" value={formData.status} onChange={handleChange} required>
//               <option value="Not Started">Not Started</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </label>
//         </div>

//         <button type="submit" className="save-btn">{editData ? 'Update' : 'Save'}</button>
//       </form>
//     </div>
//   );
// };

// export default CreateFeedback;

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Stack,
  Grid,
  Autocomplete,
  Chip,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import './CreateFeedback.css';

const CreateFeedback = ({ addFeedback, editData, onClose, statusOptions, employees }) => {
  const [formData, setFormData] = useState(editData || {
    title: '',
    employee: '',
    manager: '',
    subordinates: [],
    colleagues: [],
    period: '',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    questionTemplate: '',
    keyResults: [],
    status: 'Not Started',
    description: '',
    feedbackType: 'feedbackToReview',
    isAnonymous: false,
    priority: 'Medium'
  });

  const [loading, setLoading] = useState(false);
  const [selectedSubordinate, setSelectedSubordinate] = useState(null);
  const [selectedColleague, setSelectedColleague] = useState(null);
  const [selectedKeyResult, setSelectedKeyResult] = useState('');

  // Periods options
  const periodOptions = [
    'Monthly Review',
    'Quarterly Review',
    'Half-Yearly Review',
    'Annual Review',
    'Project Completion',
    'Probation Review'
  ];

  // Question template options
  const templateOptions = [
    'Performance Review Template',
    'Peer Feedback Template',
    'Self Assessment Template',
    'Manager Evaluation Template',
    'Project Feedback Template',
    'Skills Assessment Template'
  ];

  // Key results options (would typically come from objectives)
  const keyResultOptions = [
    'Increase sales by 20%',
    'Reduce customer complaints by 15%',
    'Complete project X by Q3',
    'Improve team productivity by 10%',
    'Launch new product feature',
    'Achieve 95% customer satisfaction'
  ];

  // Priority options
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    // If editing, ensure arrays are properly initialized
    if (editData) {
      setFormData(prev => ({
        ...prev,
        subordinates: Array.isArray(prev.subordinates) ? prev.subordinates : [],
        colleagues: Array.isArray(prev.colleagues) ? prev.colleagues : [],
        keyResults: Array.isArray(prev.keyResults) ? prev.keyResults : []
      }));
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Format dates for submission
    const formattedData = {
      ...formData,
      startDate: formData.startDate instanceof Date ? formData.startDate.toISOString() : formData.startDate,
      dueDate: formData.dueDate instanceof Date ? formData.dueDate.toISOString() : formData.dueDate
    };
    
    // Add ID if it's a new feedback
    const newFeedback = {
      id: editData ? editData.id : Date.now(),
      ...formattedData
    };
    
    // Simulate API delay
    setTimeout(() => {
      addFeedback(newFeedback, editData ? true : false);
      setLoading(false);
      onClose();
    }, 800);
  };

  // Handle adding subordinates
  const handleAddSubordinate = () => {
    if (selectedSubordinate) {
      setFormData(prev => ({
        ...prev,
        subordinates: [...prev.subordinates, selectedSubordinate]
      }));
      setSelectedSubordinate(null);
    }
  };

  // Handle removing subordinates
  const handleRemoveSubordinate = (index) => {
    setFormData(prev => ({
      ...prev,
      subordinates: prev.subordinates.filter((_, i) => i !== index)
    }));
  };

  // Handle adding colleagues
  const handleAddColleague = () => {
    if (selectedColleague) {
      setFormData(prev => ({
        ...prev,
        colleagues: [...prev.colleagues, selectedColleague]
      }));
      setSelectedColleague(null);
    }
  };

  // Handle removing colleagues
  const handleRemoveColleague = (index) => {
    setFormData(prev => ({
      ...prev,
      colleagues: prev.colleagues.filter((_, i) => i !== index)
    }));
  };

  // Handle adding key results
  const handleAddKeyResult = () => {
    if (selectedKeyResult) {
      setFormData(prev => ({
        ...prev,
        keyResults: [...prev.keyResults, selectedKeyResult]
      }));
      setSelectedKeyResult('');
    }
  };

  // Handle removing key results
  const handleRemoveKeyResult = (index) => {
    setFormData(prev => ({
      ...prev,
      keyResults: prev.keyResults.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Q2 Performance Review"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Feedback Type</InputLabel>
            <Select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              required
            >
              <MenuItem value="selfFeedback">Self Feedback</MenuItem>
              <MenuItem value="requestedFeedback">Requested Feedback</MenuItem>
              <MenuItem value="feedbackToReview">Feedback to Review</MenuItem>
              <MenuItem value="anonymousFeedback">Anonymous Feedback</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={employees || []}
            getOptionLabel={(option) => option.name || option}
            value={formData.employee}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                employee: newValue
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee"
                required
                placeholder="Select employee"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={employees || []}
            getOptionLabel={(option) => option.name || option}
            value={formData.manager}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                manager: newValue
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Manager"
                required
                placeholder="Select manager"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
            Feedback Participants
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* Subordinates Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Subordinates
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Autocomplete
                options={employees || []}
                getOptionLabel={(option) => option.name || option}
                value={selectedSubordinate}
                onChange={(_, newValue) => setSelectedSubordinate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select subordinate"
                    fullWidth
                    size="small"
                  />
                )}
                sx={{ flex: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddSubordinate}
                disabled={!selectedSubordinate}
                sx={{ 
                  minWidth: '80px',
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  borderRadius: "8px"
                }}
              >
                Add
              </Button>
            </Box>
            
            {/* Display added subordinates */}
            {formData.subordinates.length > 0 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  p: 2, 
                  bgcolor: '#f0f7ff', 
                  borderRadius: 2,
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                {formData.subordinates.map((subordinate, index) => (
                  <Chip
                    key={index}
                    label={subordinate.name || subordinate}
                    onDelete={() => handleRemoveSubordinate(index)}
                    avatar={<Avatar>{(subordinate.name || subordinate).charAt(0)}</Avatar>}
                    sx={{ 
                      bgcolor: '#e3f2fd',
                      '&:hover': { bgcolor: '#bbdefb' }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Colleagues Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Colleagues
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Autocomplete
                options={employees || []}
                getOptionLabel={(option) => option.name || option}
                value={selectedColleague}
                onChange={(_, newValue) => setSelectedColleague(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select colleague"
                    fullWidth
                    size="small"
                  />
                )}
                sx={{ flex: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddColleague}
                disabled={!selectedColleague}
                sx={{ 
                  minWidth: '80px',
                  background: "linear-gradient(45deg, #ff9800, #ffb74d)",
                  borderRadius: "8px"
                }}
              >
                Add
              </Button>
            </Box>
            
            {/* Display added colleagues */}
            {formData.colleagues.length > 0 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  p: 2, 
                  bgcolor: '#fff8e1', 
                  borderRadius: 2,
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                {formData.colleagues.map((colleague, index) => (
                  <Chip
                    key={index}
                    label={colleague.name || colleague}
                    onDelete={() => handleRemoveColleague(index)}
                    avatar={<Avatar>{(colleague.name || colleague).charAt(0)}</Avatar>}
                    sx={{ 
                      bgcolor: '#ffecb3',
                      '&:hover': { bgcolor: '#ffe082' }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
            Feedback Schedule & Content
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Period</InputLabel>
            <Select
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            >
              {periodOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => handleDateChange('dueDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Question Template</InputLabel>
            <Select
              name="questionTemplate"
              value={formData.questionTemplate}
              onChange={handleChange}
              required
            >
              {templateOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
                            {priorityOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Key Results
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Autocomplete
                options={keyResultOptions}
                value={selectedKeyResult}
                onChange={(_, newValue) => setSelectedKeyResult(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select key result"
                    fullWidth
                    size="small"
                  />
                )}
                sx={{ flex: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddKeyResult}
                disabled={!selectedKeyResult}
                sx={{ 
                  minWidth: '80px',
                  background: "linear-gradient(45deg, #2e7d32, #66bb6a)",
                  borderRadius: "8px"
                }}
              >
                Add
              </Button>
            </Box>
            
            {/* Display added key results */}
            {formData.keyResults.length > 0 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  p: 2, 
                  bgcolor: '#e8f5e9', 
                  borderRadius: 2,
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                {formData.keyResults.map((keyResult, index) => (
                  <Chip
                    key={index}
                    label={keyResult}
                    onDelete={() => handleRemoveKeyResult(index)}
                    sx={{ 
                      bgcolor: '#c8e6c9',
                      '&:hover': { bgcolor: '#a5d6a7' }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Provide additional context or instructions for this feedback"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statusOptions?.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              )) || (
                <>
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Anonymous Feedback</InputLabel>
            <Select
              name="isAnonymous"
              value={formData.isAnonymous}
              onChange={handleChange}
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={onClose}
              variant="outlined"
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "#e3f2fd",
                },
                textTransform: "none",
                borderRadius: "8px",
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                textTransform: "none",
                borderRadius: "8px",
                px: 3
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : editData ? 'Update Feedback' : 'Create Feedback'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateFeedback;

