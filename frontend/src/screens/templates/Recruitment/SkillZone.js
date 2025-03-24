// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   Paper,
//   Grid,
//   Container,
//   Fade,
//   Tooltip,
//   ThemeProvider,
//   createTheme,
// } from "@mui/material";
// import {
//   ExpandMore,
//   Edit,
//   Delete,
//   Search,
//   PersonAdd,
//   WorkOutline,
// } from "@mui/icons-material";
// import axios from "axios";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2",
//       light: "#42a5f5",
//       dark: "#1565c0",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//       },
//     },
//   },
// });

// const SkillZone = () => {
//   const [skills, setSkills] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newSkillName, setNewSkillName] = useState("");
//   const [newCandidateName, setNewCandidateName] = useState("");
//   const [newReason, setNewReason] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [currentSkillId, setCurrentSkillId] = useState(null);
//   const [currentCandidateId, setCurrentCandidateId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchSkills();
//   }, []);

//   const fetchSkills = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:5000/api/skill-zone");
//       setSkills(response.data);
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClickOpen = () => {
//     setEditing(false);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setNewSkillName("");
//     setNewCandidateName("");
//     setNewReason("");
//     setCurrentSkillId(null);
//     setCurrentCandidateId(null);
//   };

//   const handleAddSkill = async () => {
//     if (!newSkillName || !newCandidateName || !newReason) return;

//     try {
//       const newCandidate = {
//         name: newCandidateName,
//         reason: newReason,
//         addedOn: new Date().toLocaleDateString(),
//       };

//       const response = await axios.post(
//         "http://localhost:5000/api/skill-zone",
//         {
//           name: newSkillName,
//           candidates: [newCandidate],
//         }
//       );

//       setSkills([...skills, response.data]);
//       handleClose();
//     } catch (error) {
//       console.error("Error adding skill:", error);
//     }
//   };
//   const handleEditCandidate = (skillId, candidateId) => {
//     const skill = skills.find((s) => s._id === skillId);
//     const candidate = skill.candidates.find((c) => c._id === candidateId);
//     setCurrentSkillId(skillId);
//     setCurrentCandidateId(candidateId);
//     setNewCandidateName(candidate.name);
//     setNewReason(candidate.reason);
//     setNewSkillName(skill.name);
//     setEditing(true);
//     setOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`,
//         {
//           name: newCandidateName,
//           reason: newReason,
//         }
//       );
//       setSkills((prevSkills) =>
//         prevSkills.map((skill) =>
//           skill._id === currentSkillId ? response.data : skill
//         )
//       );
//       handleClose();
//     } catch (error) {
//       console.error("Error updating candidate:", error);
//     }
//   };

//   const handleDeleteCandidate = async (skillId, candidateId) => {
//     if (!window.confirm("Are you sure you want to delete this candidate?"))
//       return;

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/skill-zone/${skillId}/candidates/${candidateId}`
//       );
//       setSkills((prevSkills) =>
//         prevSkills.map((skill) =>
//           skill._id === skillId
//             ? {
//                 ...skill,
//                 candidates: skill.candidates.filter(
//                   (c) => c._id !== candidateId
//                 ),
//               }
//             : skill
//         )
//       );
//     } catch (error) {
//       console.error("Error deleting candidate:", error);
//     }
//   };

//   const handleDeleteSkill = async (skillId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this skill and all its candidates?"
//       )
//     )
//       return;

//     try {
//       await axios.delete(`http://localhost:5000/api/skill-zone/${skillId}`);
//       setSkills((prevSkills) =>
//         prevSkills.filter((skill) => skill._id !== skillId)
//       );
//     } catch (error) {
//       console.error("Error deleting skill:", error);
//     }
//   };

//   const filteredSkills = skills.filter(
//     (skill) =>
//       skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       skill.candidates.some((candidate) =>
//         candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Fade in={true} timeout={800}>
//           <Paper
//             elevation={3}
//             sx={{ p: 4, borderRadius: 2, bgcolor: "#ffffff" }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 4,
//                 borderBottom: "2px solid #1976d2",
//                 pb: 2,
//               }}
//             >
//               <WorkOutline
//                 sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
//               />
//               <Typography
//                 variant="h4"
//                 sx={{
//                   color: "primary.main",
//                   fontWeight: 600,
//                   flexGrow: 1,
//                   textAlign: "center",
//                 }}
//               >
//                 Skill Zone Management
//               </Typography>
//             </Box>

//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={8}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   placeholder="Search skills or candidates..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     bgcolor: "#f8f9fa",
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": {
//                         borderColor: "primary.main",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<PersonAdd />}
//                   onClick={handleClickOpen}
//                   sx={{
//                     height: "56px",
//                     boxShadow: 2,
//                     "&:hover": {
//                       boxShadow: 4,
//                     },
//                   }}
//                 >
//                   Add New Skill
//                 </Button>
//               </Grid>
//             </Grid>

//             <Box sx={{ mt: 3 }}>
//               {filteredSkills.map((skill) => (
//                 <Accordion
//                   key={skill._id}
//                   sx={{
//                     mb: 2,
//                     border: "1px solid #e0e0e0",
//                     "&:hover": { boxShadow: 2 },
//                     transition: "box-shadow 0.3s ease-in-out",
//                   }}
//                 >
//                   <AccordionSummary
//                     expandIcon={<ExpandMore />}
//                     sx={{
//                       "&:hover": {
//                         bgcolor: "rgba(25, 118, 210, 0.04)",
//                       },
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{ flexGrow: 1, fontWeight: 500 }}
//                     >
//                       {skill.name}
//                     </Typography>
//                     <Tooltip title="Delete Skill">
//                       <IconButton
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteSkill(skill._id);
//                         }}
//                         sx={{
//                           "&:hover": {
//                             color: "error.main",
//                           },
//                         }}
//                       >
//                         <Delete />
//                       </IconButton>
//                     </Tooltip>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell
//                             sx={{ fontWeight: 600, color: "primary.main" }}
//                           >
//                             Candidate
//                           </TableCell>
//                           <TableCell
//                             sx={{ fontWeight: 600, color: "primary.main" }}
//                           >
//                             Reason
//                           </TableCell>
//                           <TableCell
//                             align="right"
//                             sx={{ fontWeight: 600, color: "primary.main" }}
//                           >
//                             Actions
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {skill.candidates.map((candidate) => (
//                           <TableRow
//                             key={candidate._id}
//                             sx={{
//                               "&:hover": {
//                                 bgcolor: "rgba(0, 0, 0, 0.04)",
//                               },
//                             }}
//                           >
//                             <TableCell>{candidate.name}</TableCell>
//                             <TableCell>{candidate.reason}</TableCell>
//                             <TableCell align="right">
//                               <Tooltip title="Edit">
//                                 <IconButton
//                                   onClick={() =>
//                                     handleEditCandidate(
//                                       skill._id,
//                                       candidate._id
//                                     )
//                                   }
//                                   sx={{ color: "primary.main" }}
//                                 >
//                                   <Edit />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete">
//                                 <IconButton
//                                   onClick={() =>
//                                     handleDeleteCandidate(
//                                       skill._id,
//                                       candidate._id
//                                     )
//                                   }
//                                   sx={{ color: "error.main" }}
//                                 >
//                                   <Delete />
//                                 </IconButton>
//                               </Tooltip>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </Box>

//             <Dialog
//               open={open}
//               onClose={handleClose}
//               maxWidth="sm"
//               fullWidth
//               PaperProps={{
//                 elevation: 24,
//                 sx: { borderRadius: 2 },
//               }}
//             >
//               <DialogTitle
//                 sx={{
//                   bgcolor: "primary.main",
//                   color: "white",
//                   py: 2,
//                 }}
//               >
//                 {editing ? "Edit Candidate" : "Add New Skill"}
//               </DialogTitle>
//               <DialogContent sx={{ pt: 3 }}>
//                 <TextField
//                   fullWidth
//                   label="Skill Name"
//                   value={newSkillName}
//                   onChange={(e) => setNewSkillName(e.target.value)}
//                   disabled={editing}
//                   sx={{ mb: 2, mt:2 }}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Candidate Name"
//                   value={newCandidateName}
//                   onChange={(e) => setNewCandidateName(e.target.value)}
//                   sx={{ mb: 2 }}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Reason"
//                   value={newReason}
//                   onChange={(e) => setNewReason(e.target.value)}
//                   multiline
//                   rows={3}
//                 />
//               </DialogContent>
//               <DialogActions sx={{ p: 2 }}>
//                 <Button
//                   onClick={handleClose}
//                   color="inherit"
//                   sx={{
//                     border: '2px solid #1976d2',
//                     color: '#1976d2',
//                     '&:hover': {
//                       border: '2px solid #64b5f6',
//                       backgroundColor: '#e3f2fd',
//                       color: '#1976d2'
//                     },
//                     textTransform: 'none',
//                     borderRadius: '8px',
//                     px: 3,
//                     fontWeight: 600
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={editing ? handleSaveEdit : handleAddSkill}
//                   variant="contained"
//                   sx={{ px: 3 }}
//                 >
//                   {editing ? "Save Changes" : "Add Skill"}
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </Paper>
//         </Fade>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default SkillZone;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Paper,
  Grid,
  Container,
  Fade,
  Tooltip,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import {
  ExpandMore,
  Edit,
  Delete,
  Search,
  PersonAdd,
  WorkOutline,
  Add,
} from "@mui/icons-material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const SkillZone = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newReason, setNewReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/skill-zone");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      showSnackbar("Error fetching skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleClickOpen = () => {
    setEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewSkillName("");
    setNewCandidateName("");
    setNewReason("");
    setCurrentSkillId(null);
    setCurrentCandidateId(null);
  };

  const handleOpenAddCandidateDialog = (skillId) => {
    setCurrentSkillId(skillId);
    setNewCandidateName("");
    setNewReason("");
    setAddCandidateDialogOpen(true);
  };

  const handleCloseAddCandidateDialog = () => {
    setAddCandidateDialogOpen(false);
    setCurrentSkillId(null);
    setNewCandidateName("");
    setNewReason("");
  };

  const handleAddSkill = async () => {
    if (!newSkillName) {
      showSnackbar("Please enter a skill name", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/skill-zone",
        {
          name: newSkillName,
          candidates: [], // Start with empty candidates array
        }
      );

      setSkills([...skills, response.data]);
      handleClose();
      showSnackbar("Skill added successfully");
    } catch (error) {
      console.error("Error adding skill:", error);
      showSnackbar("Error adding skill", "error");
    } finally {
      setLoading(false);
    }
  };

  // const handleAddCandidate = async () => {
  //   if (!newCandidateName || !newReason) {
  //     showSnackbar("Please fill all fields", "error");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const newCandidate = {
  //       name: newCandidateName,
  //       reason: newReason,
  //       addedOn: new Date().toLocaleDateString(),
  //     };

  //     const response = await axios.post(
  //       `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates`,
  //       newCandidate
  //     );

  //     setSkills(prevSkills =>
  //       prevSkills.map(skill =>
  //         skill._id === currentSkillId ? response.data : skill
  //       )
  //     );
      
  //     handleCloseAddCandidateDialog();
  //     showSnackbar("Candidate added successfully");
  //   } catch (error) {
  //     console.error("Error adding candidate:", error);
  //     showSnackbar("Error adding candidate", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleAddCandidate = async () => {
    if (!newCandidateName || !newReason) {
      showSnackbar("Please fill all fields", "error");
      return;
    }
  
    try {
      setLoading(true);
      const newCandidate = {
        name: newCandidateName,
        reason: newReason,
        addedOn: new Date().toLocaleDateString(),
      };
  
      // Make sure this URL matches exactly what's defined in your routes
      const response = await axios.post(
        `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates`,
        newCandidate
      );
  
      setSkills(prevSkills =>
        prevSkills.map(skill =>
          skill._id === currentSkillId ? response.data : skill
        )
      );
      
      handleCloseAddCandidateDialog();
      showSnackbar("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate:", error);
      showSnackbar("Error adding candidate", "error");
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditCandidate = (skillId, candidateId) => {
    const skill = skills.find((s) => s._id === skillId);
    const candidate = skill.candidates.find((c) => c._id === candidateId);
    setCurrentSkillId(skillId);
    setCurrentCandidateId(candidateId);
    setNewCandidateName(candidate.name);
    setNewReason(candidate.reason);
    setNewSkillName(skill.name);
    setEditing(true);
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`,
        {
          name: newCandidateName,
          reason: newReason,
        }
      );
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === currentSkillId ? response.data : skill
        )
      );
      handleClose();
      showSnackbar("Candidate updated successfully");
    } catch (error) {
      console.error("Error updating candidate:", error);
      showSnackbar("Error updating candidate", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (skillId, candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/skill-zone/${skillId}/candidates/${candidateId}`
      );
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === skillId
            ? {
                ...skill,
                candidates: skill.candidates.filter(
                  (c) => c._id !== candidateId
                ),
              }
            : skill
        )
      );
      showSnackbar("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      showSnackbar("Error deleting candidate", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this skill and all its candidates?"
      )
    )
      return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/skill-zone/${skillId}`);
      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill._id !== skillId)
      );
      showSnackbar("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      showSnackbar("Error deleting skill", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.candidates.some((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 2, bgcolor: "#ffffff" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                borderBottom: "2px solid #1976d2",
                pb: 2,
              }}
            >
              <WorkOutline
                sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                Skill Zone Management
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search skills or candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#f8f9fa",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WorkOutline />}
                  onClick={handleClickOpen}
                  sx={{
                    height: "56px",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  Add New Skill
                </Button>
              </Grid>
            </Grid>

            {loading && skills.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredSkills.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" color="textSecondary">
                  No skills found. Create your first skill!
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ mt: 3 }}>
                {filteredSkills.map((skill) => (
                  <Accordion
                    key={skill._id}
                    sx={{
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      "&:hover": { boxShadow: 2 },
                      transition: "box-shadow 0.3s ease-in-out",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 500 }}
                        >
                          {skill.name}
                          <span
                            style={{
                              color: "#e74c3c",
                              marginLeft: 12,
                              backgroundColor: "#f8f9fa",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: "0.8rem",
                            }}
                          >
                            {skill.candidates.length} candidates
                          </span>
                        </Typography>
                        <Box>
                          <Tooltip title="Add Candidate">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAddCandidateDialog(skill._id);
                              }}
                              sx={{ mr: 1 }}
                            >
                              <PersonAdd />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Skill">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkill(skill._id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              Candidate
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              Reason
                              </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              Added On
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {skill.candidates.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Typography variant="body2" color="textSecondary">
                                  No candidates added yet. Click the "Add Candidate" button to add candidates.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            skill.candidates.map((candidate) => (
                              <TableRow key={candidate._id}>
                                <TableCell>{candidate.name}</TableCell>
                                <TableCell>{candidate.reason}</TableCell>
                                <TableCell>{candidate.addedOn}</TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleEditCandidate(skill._id, candidate._id)
                                    }
                                    sx={{ mr: 1 }}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteCandidate(skill._id, candidate._id)
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Paper>
        </Fade>

        {/* Add/Edit Skill Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "500px",
              borderRadius: "16px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              padding: "24px 32px",
            }}
          >
            {editing ? "Edit Candidate" : "Add New Skill"}
          </DialogTitle>

          <DialogContent sx={{ padding: "32px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {!editing && (
                <TextField
                  label="Skill Name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              )}

              {editing && (
                <>
                  <TextField
                    label="Candidate Name"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Reason"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ padding: "16px 32px" }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                px: 3,
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editing ? handleSaveEdit : handleAddSkill}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "8px",
                px: 3,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                editing ? "Save Changes" : "Add Skill"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Candidate Dialog */}
        <Dialog
          open={addCandidateDialogOpen}
          onClose={handleCloseAddCandidateDialog}
          PaperProps={{
            sx: {
              width: "500px",
              borderRadius: "16px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #2e7d32, #4caf50)",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              padding: "24px 32px",
            }}
          >
            Add Candidate to Skill
          </DialogTitle>

          <DialogContent sx={{ padding: "32px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Candidate Name"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2e7d32",
                    },
                  },
                }}
              />
              <TextField
                label="Reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#2e7d32",
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ padding: "16px 32px" }}>
            <Button
              onClick={handleCloseAddCandidateDialog}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                px: 3,
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCandidate}
              variant="contained"
              disabled={loading}
              color="success"
              sx={{
                borderRadius: "8px",
                px: 3,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Candidate"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Add Button */}
        <Tooltip title="Add New Skill">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              boxShadow: 3,
            }}
            onClick={handleClickOpen}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Container>
    </ThemeProvider>
  );
};

export default SkillZone;

