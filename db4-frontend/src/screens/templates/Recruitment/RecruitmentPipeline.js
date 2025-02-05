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
    <Box sx={{  backgroundColor: "#f9f9f9" }}>
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
                        mb: 2,
                      
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
                            marginLeft:'10px',
                            width: '28px',
                            height: '28px',
                          }}
                        >
                          {candidate?.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: { xs: '0.9rem', sm: '14px' }
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
                              fontSize: { xs: '0.8rem', sm: '11px' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {candidate.email}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '11px' } }}
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
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCandidate(candidate._id)}
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


    
      <Dialog open={isDialogOpen}
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
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>

          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>

        <DialogContent sx={{
          // padding: '32px',
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
                marginTop: '16px',
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

// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Tabs,
//   Tab,
//   IconButton,
//   Paper,
//   Avatar,
//   Divider,
//   InputBase,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   MenuItem,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import StarIcon from "@mui/icons-material/Star";

// const initialColumns = {
//   "Recruitment Drive": ["Initial", "Interview", "Hired", "Cancelled", "Technical"],
//   "FutureForce Recruitment": ["Applied", "Screening", "Interviewed", "Offered", "Rejected"],
//   "Operating Manager": ["Reviewed", "In Progress", "Completed"],
//   "Hiring Employees": ["Shortlisted", "Offer Extended", "Joined"],
// };

// const RecruitmentPipeline = () => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [candidates, setCandidates] = useState([]);
//   const [newCandidate, setNewCandidate] = useState({
//     name: "",
//     email: "",
//     department: "",
//     column: "Initial",
//     stars: 0,
//   });
//   const [editingCandidate, setEditingCandidate] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({
//     name: "",
//     email: "",
//   });

//   const validateName = (name) => {
//     const nameRegex = /^[a-zA-Z\s]{2,30}$/;
//     return nameRegex.test(name);
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const tabLabels = useMemo(
//     () => [
//       "Recruitment Drive",
//       "FutureForce Recruitment",
//       "Operating Manager",
//       "Hiring Employees",
//     ],
//     []
//   );

//   useEffect(() => {
//     fetchCandidates(tabLabels[tabIndex]);
//   }, [tabIndex, tabLabels]);

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//   };

//   const fetchCandidates = async (recruitment) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/recruitment/${recruitment}`
//       );
//       setCandidates(response.data);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//     }
//   };

//   const handleDialogOpen = (candidate = null) => {
//     if (candidate) {
//       setEditingCandidate(candidate);
//       setNewCandidate({ ...candidate });
//     } else {
//       setEditingCandidate(null);
//       setNewCandidate({
//         name: "",
//         email: "",
//         department: "",
//         column: "Initial",
//         stars: 0,
//       });
//     }
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => setIsDialogOpen(false);

//   const handleInputChange = (field, value) => {
//     setNewCandidate({ ...newCandidate, [field]: value });

//     if (field === "name") {
//       setValidationErrors({
//         ...validationErrors,
//         name: validateName(value)
//           ? ""
//           : "Name should contain only letters and be 2-30 characters long",
//       });
//     }

//     if (field === "email") {
//       setValidationErrors({
//         ...validationErrors,
//         email: validateEmail(value) ? "" : "Please enter a valid email address",
//       });
//     }
//   };

//   const handleAddOrEditCandidate = async () => {
//     if (!validateName(newCandidate.name) || !validateEmail(newCandidate.email)) {
//       return;
//     }

//     const selectedTabLabel = tabLabels[tabIndex];
//     try {
//       if (editingCandidate) {
//         await axios.put(
//           `http://localhost:5000/api/recruitment/${editingCandidate._id}`,
//           newCandidate
//         );
//       } else {
//         await axios.post("http://localhost:5000/api/recruitment", {
//           ...newCandidate,
//           recruitment: selectedTabLabel,
//         });
//       }
//       fetchCandidates(selectedTabLabel);
//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error("Error adding/editing candidate:", error);
//     }
//   };

//   const handleDeleteCandidate = async (candidateId) => {
//     const selectedTabLabel = tabLabels[tabIndex];
//     try {
//       await axios.delete(`http://localhost:5000/api/recruitment/${candidateId}`);
//       fetchCandidates(selectedTabLabel);
//     } catch (error) {
//       console.error("Error deleting candidate:", error);
//     }
//   };

//   const handleSearchChange = (event) => setSearchTerm(event.target.value);

//   const filteredCandidates = candidates.filter((candidate) =>
//     candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const columns = initialColumns[tabLabels[tabIndex]];
//   return (
//     <Box sx={{ backgroundColor: "#f9f9f9" }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//           gap: 2,
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 500,
//             color: "#1a237e",
//           }}
//         >
//           Recruitments
//         </Typography>
  
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <Paper
//             component="form"
//             sx={{
//               p: "2px 8px",
//               display: "flex",
//               alignItems: "center",
//               width: 300,
//               borderRadius: "8px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               "&:hover": {
//                 boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//               },
//             }}
//           >
//             <SearchIcon sx={{ color: "action.active", mr: 1 }} />
//             <InputBase
//               sx={{ flex: 1 }}
//               placeholder="Search candidates..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </Paper>
  
//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<AddIcon />}
//             onClick={() => handleDialogOpen()}
//             sx={{
//               borderRadius: "8px",
//               textTransform: "none",
//               px: 3,
//               py: 1,
//             }}
//           >
//             Add Candidate
//           </Button>
//         </Box>
//       </Box>
  
//       <Tabs
//         value={tabIndex}
//         onChange={handleTabChange}
//         indicatorColor="primary"
//         textColor="inherit"
//         sx={{ mb: 2 }}
//         variant="scrollable"
//         scrollButtons="auto"
//       >
//         {tabLabels.map((label, index) => (
//           <Tab key={index} label={label} />
//         ))}
//       </Tabs>
  
//       <Divider sx={{ mb: 2 }} />
  
//       <Grid 
//         container 
//         sx={{ 
//           p: 2,
//           display: 'grid',
//           gridTemplateColumns: {
//             xs: '1fr',                    
//             sm: 'repeat(2, 1fr)',        
//             md: 'repeat(3, 1fr)',        
//             lg: 'repeat(4, 1fr)',        
//           },
//           gap: 3,
//           alignItems: 'start'
//         }}
//       >
//         {columns.map((column) => (
//           <Paper
//             key={column}
//             elevation={3}
//             sx={{
//               height: '100%',
//               borderRadius: '12px',
//               p: 2,
//               display: 'flex',
//               flexDirection: 'column',
//             }}
//           >
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               mb: 2,
//               pb: 1,
//               borderBottom: '1px solid #e0e0e0'
//             }}>
//               <Typography variant="h6">
//                 {column}
//               </Typography>
//               <Typography variant="caption" sx={{ px: 1.5, py: 0.5, borderRadius: '12px' }}>
//                 {filteredCandidates.filter(c => c.column === column).length}
//               </Typography>
//             </Box>
  
//             <Box sx={{ 
//               flexGrow: 1, 
//               overflowY: 'auto',
//               maxHeight: '70vh'
//             }}>
//               {filteredCandidates
//               .filter((candidate) => candidate.column === column)
//               .map((candidate) => (
//                 <Paper
//                   key={candidate._id}
//                   elevation={1}
//                   sx={{
//                     mb: 2,
//                     p: 2,
//                     borderRadius: '8px',
//                   }}
//                 >
//                   <Box sx={{
//                     display: 'flex',
//                     alignItems: 'flex-start',
//                     gap: 1.5
//                   }}>
//                     <Avatar sx={{ bgcolor: "#FF5C8D" }}>
//                       {candidate?.name?.[0]?.toUpperCase() || 'U'}
//                     </Avatar>
                    
//                     <Box sx={{ flexGrow: 1, minWidth: 0 }}>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                         {candidate.name}
//                       </Typography>
                      
//                       <Typography variant="body2" color="textSecondary">
//                         {candidate.email}
//                       </Typography>
                      
//                       <Box sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         mt: 1
//                       }}>
//                         <Box sx={{ display: 'flex', gap: 0.5 }}>
//                           {Array.from({ length: 5 }).map((_, starIdx) => (
//                             <StarIcon
//                               key={starIdx}
//                               sx={{
//                                 fontSize: 18,
//                                 color: starIdx < candidate.stars ? '#FFB400' : '#E0E0E0'
//                               }}
//                             />
//                           ))}
//                         </Box>
                        
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => handleDialogOpen(candidate)}
//                           >
//                             <EditIcon fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={() => handleDeleteCandidate(candidate._id)}
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </Box>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </Paper>
//               ))}
//           </Box>
//         </Paper>
//       ))}
//     </Grid>

//     <Dialog open={isDialogOpen} onClose={handleDialogClose}>
//       <DialogTitle>
//         {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
//       </DialogTitle>

//       <DialogContent>
//         <TextField
//           margin="dense"
//           label="Name"
//           fullWidth
//           value={newCandidate.name}
//           onChange={(e) => handleInputChange('name', e.target.value)}
//           error={!!validationErrors.name}
//           helperText={validationErrors.name}
//         />

//         <TextField
//           margin="dense"
//           label="Email"
//           fullWidth
//           value={newCandidate.email}
//           onChange={(e) => handleInputChange('email', e.target.value)}
//           error={!!validationErrors.email}
//           helperText={validationErrors.email}
//         />

//         <TextField
//           margin="dense"
//           label="Department"
//           fullWidth
//           value={newCandidate.department}
//           onChange={(e) => setNewCandidate({ ...newCandidate, department: e.target.value })}
//         />

//         <TextField
//           select
//           margin="dense"
//           label="Column"
//           fullWidth
//           value={newCandidate.column}
//           onChange={(e) => setNewCandidate({ ...newCandidate, column: e.target.value })}
//         >
//           {columns.map((column) => (
//             <MenuItem key={column} value={column}>
//               {column}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Box sx={{ mt: 2 }}>
//           <Typography variant="subtitle1">Rating</Typography>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             {Array.from({ length: 5 }).map((_, starIdx) => (
//               <IconButton
//                 key={starIdx}
//                 onClick={() => setNewCandidate({ ...newCandidate, stars: starIdx + 1 })}
//               >
//                 <StarIcon
//                   sx={{
//                     color: starIdx < newCandidate.stars ? '#FFB400' : '#E0E0E0'
//                   }}
//                 />
//               </IconButton>
//             ))}
//           </Box>
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={handleDialogClose}>Cancel</Button>
//         <Button onClick={handleAddOrEditCandidate} variant="contained">
//           {editingCandidate ? 'Save Changes' : 'Add Candidate'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   </Box>
// );
// };

// export default RecruitmentPipeline;
