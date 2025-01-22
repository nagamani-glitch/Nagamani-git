// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Avatar,
//   TextField,
//   Button,
//   Box,
//   Menu,
//   MenuItem,
//   ToggleButton,
//   ToggleButtonGroup,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import { Add, Search, List, GridView, FilterList, MoreVert } from '@mui/icons-material';
// import axios from 'axios';

// const RecruitmentCandidate = () => {
//   const [view, setView] = useState("grid");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [newCandidate, setNewCandidate] = useState({
//     name: '',
//     email: '',
//     position: '',
//     status: 'Not-Hired',
//     color: '#ff9800',
//   });
//   const [filter, setFilter] = useState(""); // For filtering
//   const [groupBy, setGroupBy] = useState(false); // For grouping
//   const [selectedCandidates, setSelectedCandidates] = useState([]); // For batch actions

//   useEffect(() => {
//     // Fetch the candidates when the component mounts
//     axios.get('http://localhost:5000/api/applicantProfiles') // Corrected URL path
//       .then(response => {
//         setCandidates(response.data);
//       })
//       .catch(error => {
//         console.error("There was an error fetching the candidates!", error);
//       });
//   }, []);

//   const handleViewChange = (event, nextView) => {
//     if (nextView !== null) {
//       setView(nextView);
//     }
//   };

//   const handleMenuOpen = (event, candidate) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedCandidate(candidate);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleDeleteClick = () => {
//     setDeleteDialogOpen(true);
//     handleMenuClose();
//   };

//   const confirmDelete = () => {
//     axios.delete(`http://localhost:5000/api/applicantProfiles/${selectedCandidate._id}`) // Corrected URL path
//       .then(() => {
//         setCandidates(candidates.filter(candidate => candidate._id !== selectedCandidate._id));
//         setDeleteDialogOpen(false);
//       })
//       .catch(error => {
//         console.error("There was an error deleting the candidate!", error);
//       });
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//   };

//   const handleCreateDialogOpen = () => {
//     setCreateDialogOpen(true);
//   };

//   const handleCreateDialogClose = () => {
//     setCreateDialogOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCandidate({ ...newCandidate, [name]: value });
//   };

//   const handleCreateSubmit = () => {
//     axios.post('http://localhost:5000/api/applicantProfiles', newCandidate) // Corrected URL path
//       .then(response => {
//         setCandidates([...candidates, response.data]);
//         setCreateDialogOpen(false);
//         setNewCandidate({
//           name: '',
//           email: '',
//           position: '',
//           status: 'Not-Hired',
//           color: '#ff9800',
//         });
//       })
//       .catch(error => {
//         console.error("There was an error creating the candidate!", error);
//       });
//   };

//   const handleFilterChange = () => {
//     setFilter(filter === "" ? "Hired" : filter === "Hired" ? "Not-Hired" : "");
//   };

//   const handleGroupByToggle = () => {
//     setGroupBy(!groupBy);
//   };

//   const handleCandidateSelect = (candidate) => {
//     setSelectedCandidates((prevSelected) => {
//       if (prevSelected.includes(candidate)) {
//         return prevSelected.filter(c => c !== candidate);
//       }
//       return [...prevSelected, candidate];
//     });
//   };

//   const handleBatchDelete = () => {
//     axios.delete('http://localhost:5000/api/applicantProfiles/batch', { data: { ids: selectedCandidates.map(c => c._id) } }) // Corrected URL path
//       .then(() => {
//         setCandidates(candidates.filter(candidate => !selectedCandidates.includes(candidate)));
//         setSelectedCandidates([]); // Clear selection after delete
//       })
//       .catch(error => {
//         console.error("There was an error deleting the selected candidates!", error);
//       });
//   };

//   const filteredCandidates = candidates.filter(
//     candidate =>
//       candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filter ? candidate.status === filter : true)
//   );

//   const groupedCandidates = groupBy
//     ? filteredCandidates.reduce((groups, candidate) => {
//         const position = candidate.position;
//         if (!groups[position]) groups[position] = [];
//         groups[position].push(candidate);
//         return groups;
//       }, {})
//     : { All: filteredCandidates };

//   return (
//     <Box p={3} bgcolor="#f5f5f5">
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
//         <Typography variant="h5" fontWeight="bold">Candidates</Typography>
//         <Box display="flex" alignItems="center">
//           <TextField
//             variant="outlined"
//             placeholder="Search"
//             size="small"
//             InputProps={{
//               startAdornment: <Search fontSize="small" />,
//             }}
//             value={searchTerm}
//             onChange={handleSearchChange}
//             sx={{ mr: 2, width: 200 }}
//           />
//           <ToggleButtonGroup
//             value={view}
//             exclusive
//             onChange={handleViewChange}
//             aria-label="view toggle"
//             sx={{ mr: 2 }}
//           >
//             <ToggleButton value="list" aria-label="list view">
//               <List />
//             </ToggleButton>
//             <ToggleButton value="grid" aria-label="grid view">
//               <GridView />
//             </ToggleButton>
//           </ToggleButtonGroup>
//           <Button variant="outlined" startIcon={<FilterList />} onClick={handleFilterChange} sx={{ mr: 2 }}>
//             {filter || "Filter"}
//           </Button>
//           <Button variant="outlined" onClick={handleGroupByToggle} sx={{ mr: 2 }}>
//             {groupBy ? "Ungroup" : "Group By Position"}
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleBatchDelete}
//             disabled={selectedCandidates.length === 0}
//             sx={{ mr: 2 }}
//           >
//             Delete Selected
//           </Button>
//           <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleCreateDialogOpen}>
//             Create
//           </Button>
//         </Box>
//       </Box>

//       {Object.entries(groupedCandidates).map(([position, candidates]) => (
//         <Box key={position} mt={2}>
//           {groupBy && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{position}</Typography>}
//           <Grid container spacing={2}>
//             {candidates.map((candidate, index) => (
//               <Grid item xs={view === "grid" ? 3 : 12} key={index}>
//                 <Card
//                   variant="outlined"
//                   sx={{
//                     borderLeft: `4px solid ${candidate.color}`,
//                     borderRadius: 2,
//                     bgcolor: selectedCandidates.includes(candidate) ? "#e0f7fa" : "inherit",
//                   }}
//                   onClick={() => handleCandidateSelect(candidate)}
//                 >
//                   <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Avatar sx={{ bgcolor: candidate.color, mr: 2 }}>
//                       {candidate.name.split(" ").map(n => n[0]).join("")}
//                     </Avatar>
//                     <Box flexGrow={1}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {candidate.name}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {candidate.email}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {candidate.position}
//                       </Typography>
//                     </Box>
//                     <IconButton onClick={(event) => handleMenuOpen(event, candidate)}>
//                       <MoreVert />
//                     </IconButton>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       ))}

//       <Menu
//         id="actions-menu"
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
//       </Menu>

//       <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//         <DialogTitle>Delete Candidate</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Are you sure you want to delete this candidate?</DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={cancelDelete}>Cancel</Button>
//           <Button onClick={confirmDelete} color="error">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
//         <DialogTitle>Create Candidate</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Name"
//             name="name"
//             value={newCandidate.name}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Email"
//             name="email"
//             value={newCandidate.email}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Position"
//             name="position"
//             value={newCandidate.position}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Status</InputLabel>
//             <Select
//               name="status"
//               value={newCandidate.status}
//               onChange={handleInputChange}
//             >
//               <MenuItem value="Not-Hired">Not-Hired</MenuItem>
//               <MenuItem value="Hired">Hired</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCreateDialogClose}>Cancel</Button>
//           <Button onClick={handleCreateSubmit} color="primary">Create</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RecruitmentCandidate;

import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, IconButton, Avatar,
  TextField, Button, Box, Menu, MenuItem, ToggleButton,
  ToggleButtonGroup, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, InputLabel, Select, Paper, Chip,
  Container, Alert, Snackbar
} from '@mui/material';
import { Add, Search, List, GridView, FilterList, MoreVert } from '@mui/icons-material';
import axios from 'axios';

const candidateColors = [
  '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', 
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
  '#16a085', '#d35400', '#2980b9', '#8e44ad'
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newCandidate, setNewCandidate] = useState({
    applicantName: '',
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
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applicantProfiles');
      const candidatesWithColors = response.data.map((candidate, index) => ({
        ...candidate,
        color: getRandomColor(index)
      }));
      setCandidates(candidatesWithColors);
    } catch (error) {
      showSnackbar('Error fetching candidates', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
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

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/applicantProfiles/${selectedCandidate._id}`);
      setCandidates(prev => prev.filter(candidate => candidate._id !== selectedCandidate._id));
      setDeleteDialogOpen(false);
      showSnackbar('Candidate deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting candidate', 'error');
    }
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewCandidate({
      applicantName: '',
      email: '',
      position: '',
      status: 'Not-Hired',
      color: candidateColors[Math.floor(Math.random() * candidateColors.length)]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate(prev => ({
      ...prev,
      [name === 'name' ? 'applicantName' : name]: value
    }));
  };

  const handleCreateSubmit = async () => {
    try {
      if (!newCandidate.applicantName || !newCandidate.email || !newCandidate.position) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const candidateData = {
        applicantName: newCandidate.applicantName,
        email: newCandidate.email,
        position: newCandidate.position,
        status: newCandidate.status,
        applicationDate: new Date().toISOString()
      };
      
      const response = await axios.post('http://localhost:5000/api/applicantProfiles', candidateData);
      const newCandidateWithColor = {
        ...response.data,
        color: candidateColors[Math.floor(Math.random() * candidateColors.length)]
      };
      
      setCandidates(prev => [...prev, newCandidateWithColor]);
      handleCreateDialogClose();
      showSnackbar('Candidate added successfully');
    } catch (error) {
      console.error('Error details:', error.response?.data);
      showSnackbar('Error creating candidate', 'error');
    }
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

  const handleBatchDelete = async () => {
    try {
      const selectedIds = selectedCandidates.map(c => c._id);
      await axios.delete('http://localhost:5000/api/applicantProfiles/batch', { 
        data: { ids: selectedIds } 
      });
      setCandidates(prev => prev.filter(candidate => !selectedIds.includes(candidate._id)));
      setSelectedCandidates([]);
      showSnackbar('Selected candidates deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting selected candidates', 'error');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (!candidate) return false;
    const candidateName = candidate.applicantName || '';
    const searchTermLower = searchTerm.toLowerCase();
    return candidateName.toLowerCase().includes(searchTermLower) && 
           (filter ? candidate.status === filter : true);
  });

  const groupedCandidates = groupBy
    ? filteredCandidates.reduce((groups, candidate) => {
        const position = candidate.position || 'Unassigned';
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {})
    : { All: filteredCandidates };
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Header Section */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} lg={4}>
                  <Typography variant="h4" sx={{ 
                    color: '#1a237e',
                    fontWeight: 700,
                    fontSize: { xs: '24px', md: '28px' }
                  }}>
                    Recruitment Candidates
                  </Typography>
                </Grid>
                
                <Grid item xs={12} lg={8}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: { xs: 'wrap', lg: 'nowrap' },
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}>
                    <TextField
                      variant="outlined"
                      placeholder="Search candidates..."
                      size="small"
                      sx={{ 
                        minWidth: { xs: '100%', sm: '280px', lg: '250px' },
                        flex: { xs: '1 1 100%', sm: '0 1 auto' }
                      }}
                      InputProps={{
                        startAdornment: <Search sx={{ color: '#95a5a6', mr: 1 }} />,
                        sx: {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': { backgroundColor: '#f1f5f9' }
                        }
                      }}
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
  
                    <ToggleButtonGroup
                      value={view}
                      exclusive
                      onChange={handleViewChange}
                      size="small"
                      sx={{
                        flexShrink: 0,
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
                      <ToggleButton value="list"><List /></ToggleButton>
                      <ToggleButton value="grid"><GridView /></ToggleButton>
                    </ToggleButtonGroup>
  
                    <Button 
                      variant="outlined" 
                      startIcon={<FilterList />}
                      onClick={handleFilterChange}
                      sx={{
                        borderColor: filter ? statusColors[filter] : '#e2e8f0',
                        color: filter ? statusColors[filter] : '#64748b',
                        minWidth: '120px',
                        flexShrink: 0
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
                        minWidth: '140px',
                        flexShrink: 0
                      }}
                    >
                      {groupBy ? "Ungroup" : "Group By Position"}
                    </Button>
  
                    {selectedCandidates.length > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleBatchDelete}
                        sx={{ 
                          minWidth: '140px',
                          flexShrink: 0
                        }}
                      >
                        Delete ({selectedCandidates.length})
                      </Button>
                    )}
  
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleCreateDialogOpen}
                      sx={{
                        backgroundColor: '#3498db',
                        minWidth: '140px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: '#2980b9' }
                      }}
                    >
                      Add Candidate
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
  
            {/* Candidates Grid/List Section */}
            <Box sx={{ p: 3 }}>
              {Object.entries(groupedCandidates).map(([position, candidates], groupIndex) => (
                <Box key={position} mb={groupIndex !== 0 ? 4 : 0}>
                  {groupBy && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 2,
                      px: 2 
                    }}>
                      <Typography variant="h6" sx={{ color: '#1a237e' }}>
                        {position}
                      </Typography>
                      <Chip 
                        label={candidates.length}
                        size="small"
                        sx={{ 
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  )}
                  
                  <Grid container spacing={2}>
                    {candidates.map((candidate, index) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={view === "grid" ? 6 : 12} 
                        md={view === "grid" ? 4 : 12} 
                        lg={view === "grid" ? 3 : 12} 
                        key={candidate._id}
                      >
                        <Card
                          onClick={() => handleCandidateSelect(candidate)}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            borderRadius: 2,
                            cursor: 'pointer',
                            backgroundColor: selectedCandidates.includes(candidate) ? '#f0f9ff' : '#ffffff',
                            boxShadow: '0 2px 4px rgba(148, 163, 184, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(148, 163, 184, 0.1)'
                            },
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
                        >
                          <CardContent sx={{ 
                            p: 2.5, 
                            flex: 1,
                            display: 'flex',
                            flexDirection: view === "list" ? 'row' : 'column',
                            alignItems: view === "list" ? 'center' : 'flex-start',
                            gap: 2
                          }}>
                            <Avatar 
                              sx={{ 
                                width: 48,
                                height: 48,
                                bgcolor: candidate.color || getRandomColor(index),
                                fontSize: '1.2rem',
                                fontWeight: 600
                              }}
                            >
                              {candidate.applicantName?.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                            
                            <Box sx={{ 
                              flex: 1, 
                              minWidth: 0,
                              width: view === "list" ? 'auto' : '100%'
                            }}>
                              <Typography 
                                variant="subtitle1" 
                                noWrap
                                sx={{ fontWeight: 600, color: '#1a237e' }}
                              >
                                {candidate.applicantName}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                noWrap
                                sx={{ color: '#64748b', mb: 1 }}
                              >
                                {candidate.email}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={candidate.position}
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    backgroundColor: '#f8fafc',
                                    color: '#475569'
                                  }}
                                />
                                <Chip
                                  label={candidate.status}
                                  size="small"
                                  sx={{
                                    fontSize: '0.75rem',
                                    backgroundColor: `${statusColors[candidate.status]}15`,
                                    color: statusColors[candidate.status]
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <IconButton 
                              size="small"
                              onClick={(event) => handleMenuOpen(event, candidate)}
                              sx={{
                                ml: view === "list" ? 2 : 'auto',
                                alignSelf: view === "list" ? 'center' : 'flex-start',
                                color: '#94a3b8',
                                '&:hover': { backgroundColor: '#f1f5f9' }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Paper>
  
          {/* Menus and Dialogs */}
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
                borderRadius: 2,
                width: '100%',
                maxWidth: '400px'
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
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2
              }
            }}
          >
            <DialogTitle sx={{ 
              borderBottom: '1px solid #e2e8f0',
              p: 3
            }}>
              Add New Candidate
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={newCandidate.applicantName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={newCandidate.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Position"
                    name="position"
                    value={newCandidate.position}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={newCandidate.status}
                      onChange={handleInputChange}
                      label="Status"
                    >
                      <MenuItem value="Not-Hired">Not Hired</MenuItem>
                      <MenuItem value="Hired">Hired</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ 
              p: 3,
              borderTop: '1px solid #e2e8f0'
            }}>
              <Button 
                onClick={handleCreateDialogClose}
                sx={{ color: '#64748b' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSubmit}
                variant="contained"
                sx={{
                  bgcolor: '#3498db',
                  '&:hover': { bgcolor: '#2980b9' }
                }}
              >
                Add Candidate
              </Button>
            </DialogActions>
          </Dialog>
  
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              severity={snackbar.severity}
              variant="filled"
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    );
  };
  
  export default RecruitmentCandidate;
  