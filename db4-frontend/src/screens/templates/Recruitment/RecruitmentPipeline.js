import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Avatar,
  Divider,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

const initialColumns = {
  'Recruitment Drive': ['Initial', 'Interview', 'Hired', 'Cancelled', 'Technical'],
  'FutureForce Recruitment': ['Applied', 'Screening', 'Interviewed', 'Offered', 'Rejected'],
  'Operating Manager': ['Reviewed', 'In Progress', 'Completed'],
  'Hiring Employees': ['Shortlisted', 'Offer Extended', 'Joined'],
};

const RecruitmentPipeline = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    department: '',
    column: 'Initial',
    stars: 0,
  });
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Memoize the tab labels array
  const tabLabels = useMemo(
    () => [
      'Recruitment Drive',
      'FutureForce Recruitment',
      'Operating Manager',
      'Hiring Employees',
    ],
    []
  );

  // Fetch candidates when the component mounts or when tabIndex changes
  useEffect(() => {
    fetchCandidates(tabLabels[tabIndex]);
  }, [tabIndex, tabLabels]); // Use memoized tabLabels as a dependency

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchCandidates = async (recruitment) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recruitment/${recruitment}`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleDialogOpen = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setNewCandidate({ ...candidate });
    } else {
      setEditingCandidate(null);
      setNewCandidate({
        name: '',
        email: '',
        department: '',
        column: 'Initial',
        stars: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => setIsDialogOpen(false);

  // Handle adding or editing a candidate
  const handleAddOrEditCandidate = async () => {
    const selectedTabLabel = tabLabels[tabIndex];
    try {
      if (editingCandidate) {
        // Update the existing candidate
        console.log('Updating candidate', newCandidate);
        await axios.put(`http://localhost:5000/api/recruitment/${editingCandidate._id}`, newCandidate);
      } else {
        // Add a new candidate
        console.log('Adding new candidate', { ...newCandidate, recruitment: selectedTabLabel });
        await axios.post('http://localhost:5000/api/recruitment', { ...newCandidate, recruitment: selectedTabLabel });
      }

      fetchCandidates(selectedTabLabel);  // Refresh the candidate list
      setIsDialogOpen(false);  // Close the dialog
    } catch (error) {
      console.error('Error adding/editing candidate:', error);
    }
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = async (candidateId) => {
    const selectedTabLabel = tabLabels[tabIndex];
    try {
      console.log('Deleting candidate', candidateId);
      await axios.delete(`http://localhost:5000/api/recruitment/${candidateId}`);
      fetchCandidates(selectedTabLabel);  // Refresh the candidate list
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = initialColumns[tabLabels[tabIndex]];

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Recruitments</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mr: 2, width: 200 }}
          >
            <SearchIcon />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ mr: 1 }}>
            Filter
          </Button>
          <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => handleDialogOpen()}>
            Add Candidate
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {/* Column-based Candidate Display */}
      <Grid container spacing={2}>
        {columns.map((column) => (
          <Grid item xs={12} md={3} key={column}>
            <Paper sx={{ padding: 2, backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
                {column}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {filteredCandidates
                .filter((candidate) => candidate.column === column)
                .map((candidate) => (
                  <Paper key={candidate._id} elevation={2} sx={{ padding: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: '#FF5C8D', mr: 1 }}>
                        {candidate.name.split(' ').map((n) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {candidate.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <StarIcon
                              key={starIdx}
                              sx={{
                                fontSize: 16,
                                color: starIdx < candidate.stars ? '#FFD700' : '#E0E0E0',
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {candidate.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {candidate.department}
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: 'auto' }}>
                        <IconButton size="small" onClick={() => handleDialogOpen(candidate)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteCandidate(candidate._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Add/Edit Candidate */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Department"
            variant="outlined"
            margin="normal"
            value={newCandidate.department}
            onChange={(e) => setNewCandidate({ ...newCandidate, department: e.target.value })}
          />
          <TextField
            select
            fullWidth
            label="Column"
            variant="outlined"
            margin="normal"
            value={newCandidate.column}
            onChange={(e) => setNewCandidate({ ...newCandidate, column: e.target.value })}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>

          {/* Star Rating Input */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Rating:</Typography>
            {Array.from({ length: 5 }).map((_, starIdx) => (
              <IconButton
                key={starIdx}
                onClick={() => setNewCandidate({ ...newCandidate, stars: starIdx + 1 })}
                color={starIdx < newCandidate.stars ? 'primary' : 'default'}
              >
                <StarIcon />
              </IconButton>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditCandidate} color="primary">
            {editingCandidate ? 'Save Changes' : 'Add Candidate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentPipeline;
