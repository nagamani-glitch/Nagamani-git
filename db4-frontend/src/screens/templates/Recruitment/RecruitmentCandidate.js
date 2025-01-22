import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, IconButton, Avatar,
  TextField, Button, Box, Menu, MenuItem, ToggleButton,
  ToggleButtonGroup, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, InputLabel, Select, Paper, Chip,
} from '@mui/material';
import { Add, Search, List, GridView, FilterList, MoreVert } from '@mui/icons-material';
import axios from 'axios';

// Color configurations
const candidateColors = [
  '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', 
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
];

const statusColors = {
  'Hired': '#2ecc71',
  'Not-Hired': '#e74c3c',
  'Pending': '#f1c40f'
};

const RecruitmentCandidate = () => {
  const [view, setView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    position: '',
    status: 'Not-Hired',
    color: candidateColors[Math.floor(Math.random() * candidateColors.length)]
  });
  const [filter, setFilter] = useState("");
  const [groupBy, setGroupBy] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const getRandomColor = (index) => {
    return candidateColors[index % candidateColors.length];
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/applicantProfiles')
      .then(response => {
        const candidatesWithColors = response.data.map((candidate, index) => ({
          ...candidate,
          color: getRandomColor(index)
        }));
        setCandidates(candidatesWithColors);
      })
      .catch(error => {
        console.error("There was an error fetching the candidates!", error);
      });
  }, []);

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleMenuOpen = (event, candidate) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/api/applicantProfiles/${selectedCandidate._id}`)
      .then(() => {
        setCandidates(candidates.filter(candidate => candidate._id !== selectedCandidate._id));
        setDeleteDialogOpen(false);
      })
      .catch(error => {
        console.error("There was an error deleting the candidate!", error);
      });
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewCandidate({
      name: '',
      email: '',
      position: '',
      status: 'Not-Hired',
      color: candidateColors[Math.floor(Math.random() * candidateColors.length)]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({ ...newCandidate, [name]: value });
  };

  const handleCreateSubmit = () => {
    const candidateWithColor = {
      ...newCandidate,
      color: candidateColors[Math.floor(Math.random() * candidateColors.length)]
    };
    
    axios.post('http://localhost:5000/api/applicantProfiles', candidateWithColor)
      .then(response => {
        setCandidates([...candidates, response.data]);
        handleCreateDialogClose();
      })
      .catch(error => {
        console.error("There was an error creating the candidate!", error);
      });
  };

  const handleFilterChange = () => {
    setFilter(filter === "" ? "Hired" : filter === "Hired" ? "Not-Hired" : "");
  };

  const handleGroupByToggle = () => {
    setGroupBy(!groupBy);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidates((prevSelected) => {
      if (prevSelected.includes(candidate)) {
        return prevSelected.filter(c => c !== candidate);
      }
      return [...prevSelected, candidate];
    });
  };

  const filteredCandidates = candidates.filter(
    candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter ? candidate.status === filter : true)
  );

  const groupedCandidates = groupBy
    ? filteredCandidates.reduce((groups, candidate) => {
        const position = candidate.position || 'Unassigned';
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {})
    : { All: filteredCandidates };

  return (
    <Box p={4} sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" sx={{ 
            color: '#1a237e',
            fontWeight: 700,
            fontSize: '28px',
            letterSpacing: '-0.5px'
          }}>
            Recruitment Candidates
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Search candidates..."
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ color: '#95a5a6', mr: 1 }} />,
                sx: {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  }
                }
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: 280 }}
            />

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid #e2e8f0',
                  '&.Mui-selected': {
                    backgroundColor: '#3498db',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="list">
                <List />
              </ToggleButton>
              <ToggleButton value="grid">
                <GridView />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              onClick={handleFilterChange}
              sx={{
                borderColor: filter ? statusColors[filter] : '#e2e8f0',
                color: filter ? statusColors[filter] : '#64748b',
                '&:hover': {
                  borderColor: filter ? statusColors[filter] : '#cbd5e1',
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              {filter || "All Status"}
            </Button>

            <Button 
              variant="outlined"
              onClick={handleGroupByToggle}
              sx={{
                borderColor: groupBy ? '#3498db' : '#e2e8f0',
                color: groupBy ? '#3498db' : '#64748b',
                '&:hover': {
                  borderColor: groupBy ? '#2980b9' : '#cbd5e1',
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              {groupBy ? "Ungroup" : "Group By Position"}
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateDialogOpen}
              sx={{
                backgroundColor: '#3498db',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#2980b9',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
                }
              }}
            >
              Add Candidate
            </Button>
          </Box>
        </Box>

        {Object.entries(groupedCandidates).map(([position, candidates], groupIndex) => (
          <Box key={position} mt={groupIndex > 0 ? 4 : 0}>
            {groupBy && (
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h6" sx={{ 
                  color: '#1a237e',
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}>
                  {position}
                </Typography>
                <Chip 
                  label={candidates.length}
                  size="small"
                  sx={{ 
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                />
              </Box>
            )}
            
            <Grid container spacing={2}>
              {candidates.map((candidate, index) => (
                <Grid item xs={12} md={view === "grid" ? 3 : 12} key={candidate._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 4px rgba(148, 163, 184, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(148, 163, 184, 0.1)',
                      },
                      backgroundColor: selectedCandidates.includes(candidate) ? '#f0f9ff' : '#ffffff',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: candidate.color || getRandomColor(index)
                      }
                    }}
                    onClick={() => handleCandidateSelect(candidate)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: candidate.color || getRandomColor(index),
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          {candidate.name.split(" ").map(n => n[0]).join("")}
                        </Avatar>
                        
                        <Box flexGrow={1}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#1a237e',
                              mb: 0.5,
                              fontSize: '1rem'
                            }}
                          >
                            {candidate.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              mb: 1,
                              fontSize: '0.875rem'
                            }}
                          >
                            {candidate.email}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip
                              label={candidate.position}
                              size="small"
                              sx={{
                                backgroundColor: '#f8fafc',
                                color: '#475569',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            />
                            <Chip
                              label={candidate.status}
                              size="small"
                              sx={{
                                backgroundColor: `${statusColors[candidate.status]}15`,
                                color: statusColors[candidate.status],
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <IconButton 
                          onClick={(event) => handleMenuOpen(event, candidate)}
                          sx={{
                            color: '#94a3b8',
                            '&:hover': {
                              backgroundColor: '#f8fafc'
                            }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              minWidth: 120
            }
          }}
        >
          <MenuItem 
            onClick={handleDeleteClick}
            sx={{
              color: '#ef4444',
              '&:hover': {
                backgroundColor: '#fef2f2'
              }
            }}
          >
            Delete
          </MenuItem>
        </Menu>

        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ color: '#ef4444', fontWeight: 600 }}>
            Delete Candidate
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#64748b' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="contained"
              sx={{
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={createDialogOpen} 
          onClose={handleCreateDialogClose}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              minWidth: '600px',
              maxWidth: '90vw',
              margin: '20px',
              backgroundColor: '#ffffff'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '2px solid #f0f2f5',
            color: '#1a237e',
            fontWeight: 700,
            fontSize: '1.5rem',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Add sx={{ color: '#3498db' }} />
            Add New Candidate
          </DialogTitle>

          <DialogContent sx={{ pt: 4, px: 4, pb: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={newCandidate.name}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: '12px',
                      height: '56px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={newCandidate.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: '12px',
                      height: '56px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Position"
                  name="position"
                  value={newCandidate.position}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: '12px',
                      height: '56px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newCandidate.status}
                    onChange={handleInputChange}
                    sx={{
                      borderRadius: '12px',
                      height: '56px'
                    }}
                  >
                    <MenuItem value="Not-Hired">Not Hired</MenuItem>
                    <MenuItem value="Hired">Hired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ 
            p: 3,
            borderTop: '2px solid #f0f2f5',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}>
            <Button 
              onClick={handleCreateDialogClose}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                px: 3,
                py: 1,
                color: '#64748b',
                borderColor: '#e2e8f0',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSubmit}
              variant="contained"
              sx={{
                borderRadius: '10px',
                px: 4,
                py: 1,
                bgcolor: '#3498db',
                '&:hover': { 
                  bgcolor: '#2980b9'
                },
                boxShadow: 'none',
                fontWeight: 600
              }}
            >
              Add Candidate
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default RecruitmentCandidate;

