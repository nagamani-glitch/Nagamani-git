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
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Fab,
// } from "@mui/material";
// import {
//   ExpandMore,
//   Edit,
//   Delete,
//   Search,
//   PersonAdd,
//   WorkOutline,
//   Add,
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
//   const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
//   const [newSkillName, setNewSkillName] = useState("");
//   const [newCandidateName, setNewCandidateName] = useState("");
//   const [newReason, setNewReason] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [currentSkillId, setCurrentSkillId] = useState(null);
//   const [currentCandidateId, setCurrentCandidateId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

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
//       showSnackbar("Error fetching skills", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({
//       ...snackbar,
//       open: false,
//     });
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

//   const handleOpenAddCandidateDialog = (skillId) => {
//     setCurrentSkillId(skillId);
//     setNewCandidateName("");
//     setNewReason("");
//     setAddCandidateDialogOpen(true);
//   };

//   const handleCloseAddCandidateDialog = () => {
//     setAddCandidateDialogOpen(false);
//     setCurrentSkillId(null);
//     setNewCandidateName("");
//     setNewReason("");
//   };

//   const handleAddSkill = async () => {
//     if (!newSkillName) {
//       showSnackbar("Please enter a skill name", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:5000/api/skill-zone",
//         {
//           name: newSkillName,
//           candidates: [], // Start with empty candidates array
//         }
//       );

//       setSkills([...skills, response.data]);
//       handleClose();
//       showSnackbar("Skill added successfully");
//     } catch (error) {
//       console.error("Error adding skill:", error);
//       showSnackbar("Error adding skill", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleAddCandidate = async () => {
//   //   if (!newCandidateName || !newReason) {
//   //     showSnackbar("Please fill all fields", "error");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     const newCandidate = {
//   //       name: newCandidateName,
//   //       reason: newReason,
//   //       addedOn: new Date().toLocaleDateString(),
//   //     };

//   //     const response = await axios.post(
//   //       `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates`,
//   //       newCandidate
//   //     );

//   //     setSkills(prevSkills =>
//   //       prevSkills.map(skill =>
//   //         skill._id === currentSkillId ? response.data : skill
//   //       )
//   //     );
      
//   //     handleCloseAddCandidateDialog();
//   //     showSnackbar("Candidate added successfully");
//   //   } catch (error) {
//   //     console.error("Error adding candidate:", error);
//   //     showSnackbar("Error adding candidate", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleAddCandidate = async () => {
//     if (!newCandidateName || !newReason) {
//       showSnackbar("Please fill all fields", "error");
//       return;
//     }
  
//     try {
//       setLoading(true);
//       const newCandidate = {
//         name: newCandidateName,
//         reason: newReason,
//         addedOn: new Date().toLocaleDateString(),
//       };
  
//       // Make sure this URL matches exactly what's defined in your routes
//       const response = await axios.post(
//         `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates`,
//         newCandidate
//       );
  
//       setSkills(prevSkills =>
//         prevSkills.map(skill =>
//           skill._id === currentSkillId ? response.data : skill
//         )
//       );
      
//       handleCloseAddCandidateDialog();
//       showSnackbar("Candidate added successfully");
//     } catch (error) {
//       console.error("Error adding candidate:", error);
//       showSnackbar("Error adding candidate", "error");
//     } finally {
//       setLoading(false);
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
//       setLoading(true);
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
//       showSnackbar("Candidate updated successfully");
//     } catch (error) {
//       console.error("Error updating candidate:", error);
//       showSnackbar("Error updating candidate", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCandidate = async (skillId, candidateId) => {
//     if (!window.confirm("Are you sure you want to delete this candidate?"))
//       return;

//     try {
//       setLoading(true);
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
//       showSnackbar("Candidate deleted successfully");
//     } catch (error) {
//       console.error("Error deleting candidate:", error);
//       showSnackbar("Error deleting candidate", "error");
//     } finally {
//       setLoading(false);
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
//       setLoading(true);
//       await axios.delete(`http://localhost:5000/api/skill-zone/${skillId}`);
//       setSkills((prevSkills) =>
//         prevSkills.filter((skill) => skill._id !== skillId)
//       );
//       showSnackbar("Skill deleted successfully");
//     } catch (error) {
//       console.error("Error deleting skill:", error);
//       showSnackbar("Error deleting skill", "error");
//     } finally {
//       setLoading(false);
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
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity={snackbar.severity}
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
        
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
//                   startIcon={<WorkOutline />}
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

//             {loading && skills.length === 0 ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//                 <CircularProgress />
//               </Box>
//             ) : filteredSkills.length === 0 ? (
//               <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
//                 <Typography variant="h6" color="textSecondary">
//                   No skills found. Create your first skill!
//                 </Typography>
//               </Paper>
//             ) : (
//               <Box sx={{ mt: 3 }}>
//                 {filteredSkills.map((skill) => (
//                   <Accordion
//                     key={skill._id}
//                     sx={{
//                       mb: 2,
//                       border: "1px solid #e0e0e0",
//                       "&:hover": { boxShadow: 2 },
//                       transition: "box-shadow 0.3s ease-in-out",
//                     }}
//                   >
//                     <AccordionSummary
//                       expandIcon={<ExpandMore />}
//                       sx={{
//                         "&:hover": {
//                           bgcolor: "rgba(25, 118, 210, 0.04)",
//                         },
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
//                         <Typography
//                           variant="h6"
//                           sx={{ fontWeight: 500 }}
//                         >
//                           {skill.name}
//                           <span
//                             style={{
//                               color: "#e74c3c",
//                               marginLeft: 12,
//                               backgroundColor: "#f8f9fa",
//                               padding: "2px 8px",
//                               borderRadius: 12,
//                               fontSize: "0.8rem",
//                             }}
//                           >
//                             {skill.candidates.length} candidates
//                           </span>
//                         </Typography>
//                         <Box>
//                           <Tooltip title="Add Candidate">
//                             <IconButton
//                               size="small"
//                               color="primary"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleOpenAddCandidateDialog(skill._id);
//                               }}
//                               sx={{ mr: 1 }}
//                             >
//                               <PersonAdd />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Skill">
//                             <IconButton
//                               size="small"
//                               color="error"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteSkill(skill._id);
//                               }}
//                             >
//                               <Delete />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </Box>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell
//                               sx={{ fontWeight: 600, color: "primary.main" }}
//                             >
//                               Candidate
//                             </TableCell>
//                             <TableCell
//                               sx={{ fontWeight: 600, color: "primary.main" }}
//                             >
//                               Reason
//                               </TableCell>
//                             <TableCell
//                               sx={{ fontWeight: 600, color: "primary.main" }}
//                             >
//                               Added On
//                             </TableCell>
//                             <TableCell
//                               sx={{ fontWeight: 600, color: "primary.main" }}
//                             >
//                               Actions
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {skill.candidates.length === 0 ? (
//                             <TableRow>
//                               <TableCell colSpan={4} align="center">
//                                 <Typography variant="body2" color="textSecondary">
//                                   No candidates added yet. Click the "Add Candidate" button to add candidates.
//                                 </Typography>
//                               </TableCell>
//                             </TableRow>
//                           ) : (
//                             skill.candidates.map((candidate) => (
//                               <TableRow key={candidate._id}>
//                                 <TableCell>{candidate.name}</TableCell>
//                                 <TableCell>{candidate.reason}</TableCell>
//                                 <TableCell>{candidate.addedOn}</TableCell>
//                                 <TableCell>
//                                   <IconButton
//                                     size="small"
//                                     color="primary"
//                                     onClick={() =>
//                                       handleEditCandidate(skill._id, candidate._id)
//                                     }
//                                     sx={{ mr: 1 }}
//                                   >
//                                     <Edit />
//                                   </IconButton>
//                                   <IconButton
//                                     size="small"
//                                     color="error"
//                                     onClick={() =>
//                                       handleDeleteCandidate(skill._id, candidate._id)
//                                     }
//                                   >
//                                     <Delete />
//                                   </IconButton>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                           )}
//                         </TableBody>
//                       </Table>
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Box>
//             )}
//           </Paper>
//         </Fade>

//         {/* Add/Edit Skill Dialog */}
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           PaperProps={{
//             sx: {
//               width: "500px",
//               borderRadius: "16px",
//               overflow: "hidden",
//             },
//           }}
//         >
//           <DialogTitle
//             sx={{
//               background: "linear-gradient(45deg, #1976d2, #42a5f5)",
//               color: "white",
//               fontSize: "1.5rem",
//               fontWeight: 600,
//               padding: "24px 32px",
//             }}
//           >
//             {editing ? "Edit Candidate" : "Add New Skill"}
//           </DialogTitle>

//           <DialogContent sx={{ padding: "32px" }}>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               {!editing && (
//                 <TextField
//                   label="Skill Name"
//                   value={newSkillName}
//                   onChange={(e) => setNewSkillName(e.target.value)}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&:hover fieldset": {
//                         borderColor: "primary.main",
//                       },
//                     },
//                   }}
//                 />
//               )}

//               {editing && (
//                 <>
//                   <TextField
//                     label="Candidate Name"
//                     value={newCandidateName}
//                     onChange={(e) => setNewCandidateName(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&:hover fieldset": {
//                           borderColor: "primary.main",
//                         },
//                       },
//                     }}
//                   />
//                   <TextField
//                     label="Reason"
//                     value={newReason}
//                     onChange={(e) => setNewReason(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={3}
//                     variant="outlined"
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&:hover fieldset": {
//                           borderColor: "primary.main",
//                         },
//                       },
//                     }}
//                   />
//                 </>
//               )}
//             </Box>
//           </DialogContent>

//           <DialogActions sx={{ padding: "16px 32px" }}>
//             <Button
//               onClick={handleClose}
//               variant="outlined"
//               sx={{
//                 borderRadius: "8px",
//                 px: 3,
//                 fontWeight: 600,
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={editing ? handleSaveEdit : handleAddSkill}
//               variant="contained"
//               disabled={loading}
//               sx={{
//                 borderRadius: "8px",
//                 px: 3,
//                 fontWeight: 600,
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : (
//                 editing ? "Save Changes" : "Add Skill"
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add Candidate Dialog */}
//         <Dialog
//           open={addCandidateDialogOpen}
//           onClose={handleCloseAddCandidateDialog}
//           PaperProps={{
//             sx: {
//               width: "500px",
//               borderRadius: "16px",
//               overflow: "hidden",
//             },
//           }}
//         >
//           <DialogTitle
//             sx={{
//               background: "linear-gradient(45deg, #2e7d32, #4caf50)",
//               color: "white",
//               fontSize: "1.5rem",
//               fontWeight: 600,
//               padding: "24px 32px",
//             }}
//           >
//             Add Candidate to Skill
//           </DialogTitle>

//           <DialogContent sx={{ padding: "32px" }}>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               <TextField
//                 label="Candidate Name"
//                 value={newCandidateName}
//                 onChange={(e) => setNewCandidateName(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&:hover fieldset": {
//                       borderColor: "#2e7d32",
//                     },
//                   },
//                 }}
//               />
//               <TextField
//                 label="Reason"
//                 value={newReason}
//                 onChange={(e) => setNewReason(e.target.value)}
//                 fullWidth
//                 multiline
//                 rows={3}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&:hover fieldset": {
//                       borderColor: "#2e7d32",
//                     },
//                   },
//                 }}
//               />
//             </Box>
//           </DialogContent>

//           <DialogActions sx={{ padding: "16px 32px" }}>
//             <Button
//               onClick={handleCloseAddCandidateDialog}
//               variant="outlined"
//               sx={{
//                 borderRadius: "8px",
//                 px: 3,
//                 fontWeight: 600,
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddCandidate}
//               variant="contained"
//               disabled={loading}
//               color="success"
//               sx={{
//                 borderRadius: "8px",
//                 px: 3,
//                 fontWeight: 600,
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : (
//                 "Add Candidate"
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Floating Add Button */}
//         <Tooltip title="Add New Skill">
//           <Fab
//             color="primary"
//             sx={{
//               position: 'fixed',
//               bottom: 24,
//               right: 24,
//               boxShadow: 3,
//             }}
//             onClick={handleClickOpen}
//           >
//             <Add />
//           </Fab>
//         </Tooltip>
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
  Autocomplete,
} from "@mui/material";
import {
  ExpandMore,
  Edit,
  Delete,
  Search,
  PersonAdd,
  WorkOutline,
  Add,
  Email,
  Work,
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
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    fetchSkills();
    fetchRegisteredEmployees();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/skill-zone");
      console.log("Fetched skills:", response.data);
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      showSnackbar("Error fetching skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get("http://localhost:5000/api/employees/registered");
      console.log("Fetched employees:", response.data);
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      showSnackbar("Error fetching employees", "error");
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    console.log("Selected employee:", employee);
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the candidate form with employee data
      const fullName = `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`.trim();
      setNewCandidateName(fullName);
      
      // Store additional employee data to be used when adding candidate
      const employeeDataObj = {
        employeeId: employee.Emp_ID,
        email: employee.personalInfo?.email || '',
        department: employee.joiningDetails?.department || '',
        designation: employee.joiningDetails?.initialDesignation || ''
      };
      console.log("Setting employee data:", employeeDataObj);
      setEmployeeData(employeeDataObj);
    } else {
      setEmployeeData(null);
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
    setSelectedEmployee(null);
    setEmployeeData(null);
  };

  const handleOpenAddCandidateDialog = (skillId) => {
    setCurrentSkillId(skillId);
    setNewCandidateName("");
    setNewReason("");
    setSelectedEmployee(null);
    setEmployeeData(null);
    setAddCandidateDialogOpen(true);
  };

  const handleCloseAddCandidateDialog = () => {
    setAddCandidateDialogOpen(false);
    setCurrentSkillId(null);
    setNewCandidateName("");
    setNewReason("");
    setSelectedEmployee(null);
    setEmployeeData(null);
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

  const handleAddCandidate = async () => {
    if (!newCandidateName || !newReason) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Create the candidate data object
      const candidateData = {
        name: newCandidateName,
        reason: newReason,
        addedOn: new Date().toLocaleDateString()
      };
      
      // Add employee data if available
      if (employeeData) {
        console.log("Adding employee data to candidate:", employeeData);
        candidateData.employeeId = employeeData.employeeId;
        candidateData.email = employeeData.email;
        candidateData.department = employeeData.department;
        candidateData.designation = employeeData.designation;
      }

      console.log("Sending candidate data:", candidateData);
      
      const response = await axios.post(
        `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates`,
        candidateData
      );

      console.log("Response after adding candidate:", response.data);

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
    
    console.log("Editing candidate:", candidate);
    
    setCurrentSkillId(skillId);
    setCurrentCandidateId(candidateId);
    setNewCandidateName(candidate.name);
    setNewReason(candidate.reason);
    setNewSkillName(skill.name);
    setEditing(true);
    
    // If candidate has employee data, try to find the corresponding employee
    if (candidate.employeeId) {
      const employee = registeredEmployees.find(emp => emp.Emp_ID === candidate.employeeId);
      setSelectedEmployee(employee || null);
      
      // Store employee data even if we can't find the employee in the list
      setEmployeeData({
        employeeId: candidate.employeeId,
        email: candidate.email || '',
        department: candidate.department || '',
        designation: candidate.designation || ''
      });
      
      console.log("Found employee for candidate:", employee);
    } else {
      setSelectedEmployee(null);
      setEmployeeData(null);
    }
    
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      
      // Create the updated candidate data
      const updatedCandidate = {
        name: newCandidateName,
        reason: newReason
      };
      
      // Include employee data if available
      if (employeeData) {
        console.log("Including employee data in update:", employeeData);
        updatedCandidate.employeeId = employeeData.employeeId;
        updatedCandidate.email = employeeData.email;
        updatedCandidate.department = employeeData.department;
        updatedCandidate.designation = employeeData.designation;
      }
      
      console.log("Sending updated candidate data:", updatedCandidate);
      
      const response = await axios.put(
        `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`,
        updatedCandidate
      );
      
      console.log("Response after updating candidate:", response.data);
      
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
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "#f8f9fa",
                  border: "1px dashed #ccc",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No skills found. Add your first skill!
                </Typography>
              </Paper>
            ) : (
              filteredSkills.map((skill) => (
                <Accordion
                  key={skill._id}
                  sx={{
                    mb: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    "&:before": { display: "none" },
                    borderRadius: "12px !important",
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: "#f8f9fa",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {skill.name}
                        <Typography
                          component="span"
                          sx={{
                            ml: 2,
                            bgcolor: "primary.light",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "0.8rem",
                          }}
                        >
                          {skill.candidates.length} candidates
                        </Typography>
                      </Typography>

                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="Add Candidate">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddCandidateDialog(skill._id);
                            }}
                            sx={{ color: "primary.main" }}
                          >
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Skill">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSkill(skill._id);
                            }}
                            sx={{ color: "error.main" }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Added On</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {skill.candidates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography
                                variant="body2"
                                sx={{ py: 2, color: "text.secondary" }}
                              >
                                No candidates added yet. Click the "Add
                                Candidate" button to add candidates.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          skill.candidates.map((candidate) => (
                            <TableRow
                              key={candidate._id}
                              sx={{
                                "&:hover": { bgcolor: "#f8f9fa" },
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography fontWeight={500}>
                                    {candidate.name}
                                  </Typography>
                                  {candidate.email && (
                                    <Tooltip title={candidate.email}>
                                      <Email fontSize="small" color="action" />
                                    </Tooltip>
                                  )}
                                </Box>
                                {candidate.email && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {candidate.email}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {candidate.employeeId ? (
                                  <Typography
                                    component="span"
                                    sx={{
                                      bgcolor: "#e3f2fd",
                                      color: "primary.main",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      fontSize: "0.8rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {candidate.employeeId}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    Not assigned
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {candidate.department ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Work fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      {candidate.department}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    N/A
                                  </Typography>
                                )}
                                {candidate.designation && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {candidate.designation}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>{candidate.reason}</TableCell>
                              <TableCell>{candidate.addedOn}</TableCell>
                              <TableCell>
                                <Tooltip title="Edit Candidate">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleEditCandidate(
                                        skill._id,
                                        candidate._id
                                      )
                                    }
                                    sx={{ color: "primary.main" }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Candidate">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDeleteCandidate(
                                        skill._id,
                                        candidate._id
                                      )
                                    }
                                    sx={{ color: "error.main" }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Paper>
        </Fade>

        {/* Add Skill Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "500px",
              borderRadius: "16px",
              p: 1,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              borderRadius: "12px 12px 0 0",
              fontWeight: 600,
            }}
          >
            {editing ? "Edit Candidate" : "Add New Skill"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {editing ? (
              <>
                <TextField
                  label="Skill Name"
                  value={newSkillName}
                  fullWidth
                  disabled
                  margin="normal"
                />
                
                {/* Employee Selection Autocomplete */}
                <Autocomplete
                  id="employee-select"
                  options={registeredEmployees}
                  getOptionLabel={(option) => 
                    `${option.Emp_ID} - ${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`
                  }
                  value={selectedEmployee}
                  onChange={handleEmployeeSelect}
                  loading={loadingEmployees}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Onboarded Employee (Optional)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      helperText="Link this candidate to an onboarded employee"
                    />
                  )}
                />
                
                <TextField
                  label="Candidate Name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Reason"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
              </>
            ) : (
              <TextField
                autoFocus
                label="Skill Name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              onClick={editing ? handleSaveEdit : handleAddSkill}
              variant="contained"
              disabled={
                editing
                  ? !newCandidateName || !newReason
                  : !newSkillName
              }
              sx={{ borderRadius: 8 }}
            >
              {editing ? "Save Changes" : "Add Skill"}
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
              p: 1,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              borderRadius: "12px 12px 0 0",
              fontWeight: 600,
            }}
          >
            Add Candidate to Skill
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {/* Employee Selection Autocomplete */}
            <Autocomplete
              id="employee-select-dialog"
              options={registeredEmployees}
              getOptionLabel={(option) => 
                `${option.Emp_ID} - ${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`
              }
              value={selectedEmployee}
              onChange={handleEmployeeSelect}
              loading={loadingEmployees}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Onboarded Employee (Optional)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  helperText="Link this candidate to an onboarded employee"
                />
              )}
            />
            
            <TextField
              autoFocus
              label="Candidate Name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Reason"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseAddCandidateDialog}
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCandidate}
              variant="contained"
              disabled={!newCandidateName || !newReason}
              sx={{ borderRadius: 8 }}
            >
              Add Candidate
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating action button for adding new skill */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 3,
          }}
        >
          <Add />
        </Fab>
      </Container>
    </ThemeProvider>
  );
};

export default SkillZone;
 
