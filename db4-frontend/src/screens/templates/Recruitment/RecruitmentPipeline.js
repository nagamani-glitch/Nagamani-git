import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

const initialColumns = {
  "Recruitment Drive": [
    "Initial",
    "Interview",
    "Hired",
    "Cancelled",
    "Technical",
  ],
  "FutureForce Recruitment": [
    "Applied",
    "Screening",
    "Interviewed",
    "Offered",
    "Rejected",
  ],
  "Operating Manager": ["Reviewed", "In Progress", "Completed"],
  "Hiring Employees": ["Shortlisted", "Offer Extended", "Joined"],
};
const RecruitmentPipeline = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    department: "",
    column: "Initial",
    stars: 0,
  });
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Add these validation functions at the top of your component
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
  });

  // Memoize the tab labels array
  const tabLabels = useMemo(
    () => [
      "Recruitment Drive",
      "FutureForce Recruitment",
      "Operating Manager",
      "Hiring Employees",
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
      const response = await axios.get(
        `http://localhost:5000/api/recruitment/${recruitment}`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleDialogOpen = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setNewCandidate({ ...candidate });
    } else {
      setEditingCandidate(null);
      setNewCandidate({
        name: "",
        email: "",
        department: "",
        column: "Initial",
        stars: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => setIsDialogOpen(false);

  // Update the input change handler
  const handleInputChange = (field, value) => {
    setNewCandidate({ ...newCandidate, [field]: value });

    if (field === "name") {
      setValidationErrors({
        ...validationErrors,
        name: validateName(value)
          ? ""
          : "Name should contain only letters and be 2-30 characters long",
      });
    }

    if (field === "email") {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(value) ? "" : "Please enter a valid email address",
      });
    }
  };

  // Update the handleAddOrEditCandidate function
  const handleAddOrEditCandidate = async () => {
    if (
      !validateName(newCandidate.name) ||
      !validateEmail(newCandidate.email)
    ) {
      return;
    }

    const selectedTabLabel = tabLabels[tabIndex];
    try {
      if (editingCandidate) {
        await axios.put(
          `http://localhost:5000/api/recruitment/${editingCandidate._id}`,
          newCandidate
        );
      } else {
        await axios.post("http://localhost:5000/api/recruitment", {
          ...newCandidate,
          recruitment: selectedTabLabel,
        });
      }
      fetchCandidates(selectedTabLabel);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/editing candidate:", error);
    }
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = async (candidateId) => {
    const selectedTabLabel = tabLabels[tabIndex];
    try {
      console.log("Deleting candidate", candidateId);
      await axios.delete(
        `http://localhost:5000/api/recruitment/${candidateId}`
      );
      fetchCandidates(selectedTabLabel); // Refresh the candidate list
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = initialColumns[tabLabels[tabIndex]];
  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#1a237e",
          }}
        >
          Recruitments
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: 300,
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            <InputBase
              sx={{
                flex: 1,
                "& input": {
                  padding: "8px 0",
                },
              }}
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>

          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
            }}
          >
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
          <Grid 
            item 
            xs={12}      // Full width on mobile
            sm={6}       // 2 cards per row on small tablets
            md={4}       // 3 cards per row on tablets
            lg={3}       // 4 cards per row on desktop
            key={column}
          >
            <Paper
              sx={{
                padding: { xs: 1.5, sm: 2 },
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                boxShadow: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1, 
                  color: "#1976d2",
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {column}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: { xs: 300, sm: 400, md: 500 } }}>
                {filteredCandidates
                  .filter((candidate) => candidate.column === column)
                  .map((candidate) => (
                    <Paper
                      key={candidate._id}
                      elevation={2}
                      sx={{
                        padding: { xs: 1.5, sm: 2 },
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: 1
                      }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: "#FF5C8D",
                            width: { xs: 40, sm: 45 },
                            height: { xs: 40, sm: 45 }
                          }}
                        >
                          {candidate?.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: "bold",
                              fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                          >
                            {candidate.name}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            mt: 0.5,
                            flexWrap: 'wrap',
                            gap: 0.5
                          }}>
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <StarIcon
                                key={starIdx}
                                sx={{
                                  fontSize: { xs: 14, sm: 16 },
                                  color: starIdx < candidate.stars ? "#FFD700" : "#E0E0E0"
                                }}
                              />
                            ))}
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {candidate.email}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            {candidate.department}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex',
                          gap: 0.5,
                          marginLeft: 'auto'
                        }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDialogOpen(candidate)}
                            sx={{ padding: { xs: 0.5, sm: 1 } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCandidate(candidate._id)}
                            sx={{ padding: { xs: 0.5, sm: 1 } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog        open={isDialogOpen} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            width: '600px',
            borderRadius: '20px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 600,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          
          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>

        <DialogContent sx={{ 
          padding: '32px',
          backgroundColor: '#f8fafc'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3 
          }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={newCandidate.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#1976d2'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976d2'
                }
              }}
              sx={{marginTop: '16px'}}
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={newCandidate.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#1976d2'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Department"
              variant="outlined"
              value={newCandidate.department}
              onChange={(e) => setNewCandidate({ ...newCandidate, department: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#1976d2'
                  }
                }
              }}
            />
            <TextField
  select
  fullWidth
  label="Column"
  variant="outlined"
  value={newCandidate.column}
  onChange={(e) => setNewCandidate({ ...newCandidate, column: e.target.value })}
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      borderRadius: '12px',
      '&:hover fieldset': {
        borderColor: '#1976d2'
      }
    }
  }}
>
  {columns.map((column) => (
    <MenuItem key={column} value={column}>
      {column}
    </MenuItem>
  ))}
</TextField>


            <Box sx={{ 
              mt: 1,
              p: 3,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Rating
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <IconButton
                    key={starIdx}
                    onClick={() => setNewCandidate({ ...newCandidate, stars: starIdx + 1 })}
                    sx={{
                      color: starIdx < newCandidate.stars ? '#FFB400' : '#E0E0E0',
                      transform: 'scale(1.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 180, 0, 0.1)'
                      }
                    }}
                  >
                    <StarIcon />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          padding: '24px 32px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e0e0e0',
          gap: 2
        }}>
          <Button 
            onClick={handleDialogClose}
            sx={{
              color: '#64748b',
              fontSize: '0.95rem',
              textTransform: 'none',
              padding: '8px 24px',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddOrEditCandidate}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              fontSize: '0.95rem',
              textTransform: 'none',
              padding: '8px 32px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #42a5f5)'
              }
            }}
          >
            {editingCandidate ? 'Save Changes' : 'Add Candidate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentPipeline;
