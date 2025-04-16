// import React, { useState, useEffect } from "react";
// import "./CandidateView.css";
// import axios from "axios";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   IconButton,
//   Tooltip,
//   Chip,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Search as SearchIcon,
// } from "@mui/icons-material";

// const API_URL = "http://localhost:5000/api/hired-employees";

// const CandidatesView = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     status: "All",
//     department: "All",
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const initialFormState = {
//     name: "",
//     email: "",
//     joiningDate: "",
//     probationEnds: "",
//     jobPosition: "",
//     recruitment: "",
//     status: "Pending",
//     department: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const departments = ["Engineering", "Product", "Marketing", "Sales", "HR"];
//   const statuses = ["Pending", "Offer Letter Accepted", "Offer Letter Rejected"]

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const fetchCandidates = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(API_URL);
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error fetching candidates", "error");
//     }
//     setLoading(false);
//   };

//   const handleFilterChange = async (type, value) => {
//     const newFilters = { ...filters, [type]: value };
//     setFilters(newFilters);

//     try {
//       const response = await axios.get(`${API_URL}/filter`, {
//         params: {
//           department:
//             newFilters.department !== "All" ? newFilters.department : "",
//           status: newFilters.status !== "All" ? newFilters.status : "",
//           search: searchTerm,
//         },
//       });
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error applying filters", "error");
//     }
//   };

//   const handleSearch = async (value) => {
//     setSearchTerm(value);
//     try {
//       const response = await axios.get(`${API_URL}/filter`, {
//         params: {
//           department: filters.department !== "All" ? filters.department : "",
//           status: filters.status !== "All" ? filters.status : "",
//           search: value,
//         },
//       });
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error applying search", "error");
//     }
//   };
//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const candidateData = {
//         ...formData,
//         probationEnds: new Date(formData.joiningDate).setMonth(
//           new Date(formData.joiningDate).getMonth() + 3
//         ),
//         recruitment: formData.recruitment || "Direct",
//       };

//       if (editMode) {
//         const response = await axios.put(
//           `${API_URL}/${selectedCandidate._id}`,
//           candidateData
//         );
//         setCandidates((prev) =>
//           prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
//         );
//         showSnackbar("Candidate updated successfully");
//       } else {
//         const response = await axios.post(API_URL, candidateData);
//         setCandidates((prev) => [...prev, response.data]);
//         showSnackbar("New candidate added successfully");
//       }
//       handleDialogClose();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || "Operation failed",
//         "error"
//       );
//     }
//   };

//   const handleEdit = (candidate) => {
//     setSelectedCandidate(candidate);
//     setFormData({
//       name: candidate.name,
//       email: candidate.email,
//       joiningDate: candidate.joiningDate.split("T")[0],
//       probationEnds: candidate.probationEnds.split("T")[0],
//       jobPosition: candidate.jobPosition,
//       recruitment: candidate.recruitment,
//       status: candidate.status,
//       department: candidate.department,
//     });
//     setEditMode(true);
//     setDialogOpen(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setCandidates((prev) => prev.filter((c) => c._id !== id));
//       showSnackbar("Candidate deleted successfully", "warning");
//     } catch (error) {
//       showSnackbar("Error deleting candidate", "error");
//     }
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setEditMode(false);
//     setSelectedCandidate(null);
//     setFormData(initialFormState);
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const getStatusChipColor = (status) => {
//     const colors = {
//       "Pending": "warning",
//       "Offer Letter Accepted": "success",
//       "Offer Letter Rejected": "error"
//     };
//     return colors[status] || "default";
//   };
  
  

//   return (
//     <div className="candidate-view">
//       <Box className="header-section">
//         <Typography variant="h4">Hired Candidates</Typography>
//         <Button
//           startIcon={<AddIcon />}
//           variant="contained"
//           onClick={() => setDialogOpen(true)}
//         >
//           Add Candidate
//         </Button>
//       </Box>

//       <Box className="filters-section">
//         <TextField
//           className="search-field"
//           placeholder="Search candidates..."
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           InputProps={{
//             startAdornment: <SearchIcon color="action" />,
//           }}
//         />
//         <FormControl size="small" variant="outlined" className="filter-select">
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={filters.status}
//             onChange={(e) => handleFilterChange("status", e.target.value)}
//             label="Status"
//           >
//             <MenuItem value="All">All Status</MenuItem>
//             {statuses.map((status) => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl size="small" variant="outlined" className="filter-select">
//           <InputLabel>Department</InputLabel>
//           <Select
//             value={filters.department}
//             onChange={(e) => handleFilterChange("department", e.target.value)}
//             label="Department"
//           >
//             <MenuItem value="All">All Departments</MenuItem>
//             {departments.map((dept) => (
//               <MenuItem key={dept} value={dept}>
//                 {dept}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {loading ? (
//         <Box className="loading-container">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <table className="candidate-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Department</th>
//               <th>Joining Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {candidates.map((candidate) => (
//               <tr key={candidate._id}>
//                 <td>{candidate.name}</td>
//                 <td>{candidate.email}</td>
//                 <td>{candidate.department}</td>
//                 <td>{new Date(candidate.joiningDate).toLocaleDateString()}</td>
//                 <td>
//                   <Chip
//                     label={candidate.status}
//                     color={getStatusChipColor(candidate.status)}
//                     size="small"
//                   />
//                 </td>
//                 <td className="actions-cell">
//                   <Tooltip title="Edit">
//                     <IconButton
//                       size="small"
//                       onClick={() => handleEdit(candidate)}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Delete">
//                     <IconButton
//                       size="small"
//                       onClick={() => handleDelete(candidate._id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <Dialog
//         open={dialogOpen}
//         onClose={handleDialogClose}
//         PaperProps={{
//           sx: {
//             width: "600px",
//             borderRadius: "20px",
//             overflow: "hidden",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//             color: "white",
//             fontSize: "1.5rem",
//             fontWeight: 600,
//             padding: "24px 32px",
//           }}
//         >
//           {editMode ? "Edit Candidate" : "Add New Candidate"}
//         </DialogTitle>

//         <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
//           <Box
//             className="dialog-form"
//             sx={{ display: "flex", flexDirection: "column", gap: 3 }}
//           >
//             <TextField
//               name="name"
//               label="Name"
//               value={formData.name}
//               onChange={handleFormChange}
//               fullWidth
//               required
//               sx={{
//                 mt: 2,
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#1976d2",
//                 },
//               }}
//             />

//             <TextField
//               name="email"
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={handleFormChange}
//               fullWidth
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//               }}
//             />

//             <TextField
//               name="joiningDate"
//               label="Joining Date"
//               type="date"
//               value={formData.joiningDate}
//               onChange={handleFormChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//               }}
//             />

//             <TextField
//               name="jobPosition"
//               label="Job Position"
//               value={formData.jobPosition}
//               onChange={handleFormChange}
//               fullWidth
//               required
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//               }}
//             />

//             <FormControl fullWidth>
//               <InputLabel>Department</InputLabel>
//               <Select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleFormChange}
//                 label="Department"
//                 sx={{
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "& .MuiOutlinedInput-notchedOutline": {
//                     "&:hover": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               >
//                 {departments.map((dept) => (
//                   <MenuItem key={dept} value={dept}>
//                     {dept}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleFormChange}
//                 label="Status"
//                 sx={{
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "& .MuiOutlinedInput-notchedOutline": {
//                     "&:hover": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               >
//                 {statuses.map((status) => (
//                   <MenuItem key={status} value={status}>
//                     {status}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             padding: "24px 32px",
//             backgroundColor: "#f8fafc",
//             borderTop: "1px solid #e0e0e0",
//             gap: 2,
//           }}
//         >
//           <Button
//             onClick={handleDialogClose}
//             sx={{
//               border: "2px solid #1976d2",
//               color: "#1976d2",
//               "&:hover": {
//                 border: "2px solid #64b5f6",
//                 backgroundColor: "#e3f2fd",
//                 color: "#1976d2",
//               },
//               textTransform: "none",
//               borderRadius: "8px",
//               px: 3,
//               fontWeight: 600,
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             onClick={handleSubmit}
//             variant="contained"
//             color="primary"
//             sx={{
//               background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//               fontSize: "0.95rem",
//               textTransform: "none",
//               padding: "8px 32px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #1565c0, #42a5f5)",
//               },
//             }}
//           >
//             {editMode ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default CandidatesView;


// import React, { useState, useEffect } from "react";
// import "./CandidateView.css";
// import axios from "axios";
// import { styled } from "@mui/material/styles";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   IconButton,
//   Tooltip,
//   Chip,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Paper,
//   InputAdornment,
//   useTheme,
//   useMediaQuery,
//   Container,
//   alpha
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Search as SearchIcon,
//   FilterList as FilterListIcon
// } from "@mui/icons-material";

// const API_URL = "http://localhost:5000/api/hired-employees";

// // Add these styled components for consistent styling with AttendanceRecords.js
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   borderRadius: theme.spacing(1),
//   boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
//   [theme.breakpoints.down("sm")]: {
//     padding: theme.spacing(2),
//   },
// }));

// const SearchTextField = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: theme.spacing(2),
//     "&:hover fieldset": {
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

// const CandidatesView = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     status: "All",
//     department: "All",
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const initialFormState = {
//     name: "",
//     email: "",
//     joiningDate: "",
//     probationEnds: "",
//     jobPosition: "",
//     recruitment: "",
//     status: "Pending",
//     department: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const departments = ["Engineering", "Product", "Marketing", "Sales", "HR"];
//   const statuses = ["Pending", "Offer Letter Accepted", "Offer Letter Rejected"]

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const fetchCandidates = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(API_URL);
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error fetching candidates", "error");
//     }
//     setLoading(false);
//   };

//   const handleFilterChange = async (type, value) => {
//     const newFilters = { ...filters, [type]: value };
//     setFilters(newFilters);

//     try {
//       const response = await axios.get(`${API_URL}/filter`, {
//         params: {
//           department:
//             newFilters.department !== "All" ? newFilters.department : "",
//           status: newFilters.status !== "All" ? newFilters.status : "",
//           search: searchTerm,
//         },
//       });
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error applying filters", "error");
//     }
//   };

//   const handleSearch = async (value) => {
//     setSearchTerm(value);
//     try {
//       const response = await axios.get(`${API_URL}/filter`, {
//         params: {
//           department: filters.department !== "All" ? filters.department : "",
//           status: filters.status !== "All" ? filters.status : "",
//           search: value,
//         },
//       });
//       setCandidates(response.data);
//     } catch (error) {
//       showSnackbar("Error applying search", "error");
//     }
//   };
  
//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const candidateData = {
//         ...formData,
//         probationEnds: new Date(formData.joiningDate).setMonth(
//           new Date(formData.joiningDate).getMonth() + 3
//         ),
//         recruitment: formData.recruitment || "Direct",
//       };

//       if (editMode) {
//         const response = await axios.put(
//           `${API_URL}/${selectedCandidate._id}`,
//           candidateData
//         );
//         setCandidates((prev) =>
//           prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
//         );
//         showSnackbar("Candidate updated successfully");
//       } else {
//         const response = await axios.post(API_URL, candidateData);
//         setCandidates((prev) => [...prev, response.data]);
//         showSnackbar("New candidate added successfully");
//       }
//       handleDialogClose();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || "Operation failed",
//         "error"
//       );
//     }
//   };

//   const handleEdit = (candidate) => {
//     setSelectedCandidate(candidate);
//     setFormData({
//       name: candidate.name,
//       email: candidate.email,
//       joiningDate: candidate.joiningDate.split("T")[0],
//       probationEnds: candidate.probationEnds.split("T")[0],
//       jobPosition: candidate.jobPosition,
//       recruitment: candidate.recruitment,
//       status: candidate.status,
//       department: candidate.department,
//     });
//     setEditMode(true);
//     setDialogOpen(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setCandidates((prev) => prev.filter((c) => c._id !== id));
//       showSnackbar("Candidate deleted successfully", "warning");
//     } catch (error) {
//       showSnackbar("Error deleting candidate", "error");
//     }
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setEditMode(false);
//     setSelectedCandidate(null);
//     setFormData(initialFormState);
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const getStatusChipColor = (status) => {
//     const colors = {
//       "Pending": "warning",
//       "Offer Letter Accepted": "success",
//       "Offer Letter Rejected": "error"
//     };
//     return colors[status] || "default";
//   };

//   return (
//     <Container maxWidth="xl" disableGutters>
//       <Box 
      
//       x={{
//         display: "flex",
//         flexDirection: { xs: "column", sm: "row" },
//         justifyContent: "space-between",
//         alignItems: { xs: "flex-start", sm: "center" },
//         gap: 2,
//         mb: 3,
//       }}
      
//       >
//         <Typography
//           variant="h4"
//           // sx={{
//           //   mb: { xs: 2, sm: 3, md: 4 },
//           //   color: theme.palette.primary.main,
//           //   fontWeight: 600,
//           //   letterSpacing: 0.5,
//           //   fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
//           // }}
//           sx={{
//             fontSize: {
//               xs: "1.2rem",
//               sm: "1.5rem",
//               md: "1.8rem",
//             },
//             fontWeight: "bold",
//           }}
//         >
//           Hired Candidates
//         </Typography>

//         {/* <StyledPaper>
//           <Box
//             display="flex"
//             flexDirection={{ xs: "column", md: "row" }}
//             alignItems={{ xs: "flex-start", md: "center" }}
//             gap={{ xs: 2, md: 3 }}
//             sx={{
//               width: "100%",
//               justifyContent: "space-between",
//             }}
//           >
//             <SearchTextField
//               placeholder="Search candidates..."
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 width: { xs: "100%", sm: "100%", md: "350px", lg: "400px" },
//                 marginRight: { xs: 0, md: "auto" },
//                 flexShrink: 0,
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box
//               sx={{
//                 display: "flex",
//                 gap: { xs: 1, sm: 2, md: 2 },
//                 width: { xs: "100%", md: "auto" },
//                 flexDirection: { xs: "column", sm: "row" },
//                 alignItems: { xs: "stretch", sm: "center" },
//                 justifyContent: { xs: "flex-start", md: "flex-end" },
//                 flexShrink: 0,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 2,
//                   width: { xs: "100%", sm: "auto" },
//                   flexDirection: { xs: "column", sm: "row" },
//                 }}
//               >
//                 <FormControl 
//                   size={isMobile ? "small" : "medium"}
//                   sx={{
//                     width: { xs: "100%", sm: "150px", md: "150px", lg: "180px" },
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                     flexShrink: 0,
//                   }}
//                 >
//                   <InputLabel>Status</InputLabel>
//                   <Select
//                     value={filters.status}
//                     onChange={(e) => handleFilterChange("status", e.target.value)}
//                     label="Status"
//                   >
//                     <MenuItem value="All">All Status</MenuItem>
//                     {statuses.map((status) => (
//                       <MenuItem key={status} value={status}>
//                         {status}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <FormControl 
//                   size={isMobile ? "small" : "medium"}
//                   sx={{
//                     width: { xs: "100%", sm: "150px", md: "150px", lg: "180px" },
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                     flexShrink: 0,
//                   }}
//                 >
//                   <InputLabel>Department</InputLabel>
//                   <Select
//                     value={filters.department}
//                     onChange={(e) => handleFilterChange("department", e.target.value)}
//                     label="Department"
//                   >
//                     <MenuItem value="All">All Departments</MenuItem>
//                     {departments.map((dept) => (
//                       <MenuItem key={dept} value={dept}>
//                         {dept}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>

//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => setDialogOpen(true)}
//                 // sx={{
//                 //   height: { xs: "auto", sm: "auto", md: 40, lg: 44 },
//                 //   padding: { xs: "10px 16px", sm: "10px 20px", md: "8px 24px", lg: "10px 28px" },
//                 //   width: { xs: "100%", sm: "auto" },
//                 //   minWidth: { xs: "auto", sm: "180px", md: "200px", lg: "220px" },
//                 //   background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//                 //   color: "white",
//                 //   "&:hover": {
//                 //     background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
//                 //   },
//                 //   borderRadius: "8px",
//                 //   boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
//                 //   textTransform: "none",
//                 //   fontWeight: 600,
//                 //   fontSize: { xs: "0.875rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" },
//                 //   whiteSpace: "nowrap",
//                 //   overflow: "hidden",
//                 //   textOverflow: "ellipsis",
//                 //   flexShrink: 0,
//                 // }}

//                 sx={{
//                   fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
//                   px: { xs: 1.5, sm: 2 },
//                   alignSelf: { xs: "stretch", sm: "unset" }, // full-width on mobile
//                 }}
//                 fullWidth={isMobile}
//               >
              
//                 Add Candidate
//               </Button>
//             </Box>
//           </Box>
//         </StyledPaper> */}
//         <StyledPaper>
//   <Box
//     display="flex"
//     flexDirection={{ xs: "column", sm: "column", md: "row" }}
//     alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
//     gap={{ xs: 2, sm: 2, md: 3 }}
//     sx={{
//       width: "100%",
//       justifyContent: "space-between",
//     }}
//   >
//     <SearchTextField
//       placeholder="Search candidates..."
//       value={searchTerm}
//       onChange={(e) => handleSearch(e.target.value)}
//       size={isMobile ? "small" : "medium"}
//       sx={{
//         width: { xs: "100%", sm: "100%", md: "300px", lg: "350px" },
//         marginRight: { xs: 0, md: "auto" },
//         flexShrink: 0,
//       }}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <SearchIcon color="primary" />
//           </InputAdornment>
//         ),
//       }}
//     />

//     <Box
//       sx={{
//         display: "flex",
//         gap: { xs: 1, sm: 2, md: 2 },
//         width: { xs: "100%", sm: "100%", md: "auto" },
//         flexDirection: { xs: "column", sm: "row" },
//         alignItems: { xs: "stretch", sm: "center" },
//         justifyContent: { xs: "flex-start", sm: "flex-end" },
//         flexShrink: 0,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           gap: { xs: 1, sm: 2 },
//           width: { xs: "100%", sm: "auto" },
//           flexDirection: { xs: "column", sm: "row" },
//         }}
//       >
//         <FormControl 
//           size={isMobile ? "small" : "medium"}
//           sx={{
//             width: { xs: "100%", sm: "180px", md: "160px", lg: "180px" },
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//             flexShrink: 0,
//           }}
//         >
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={filters.status}
//             onChange={(e) => handleFilterChange("status", e.target.value)}
//             label="Status"
//           >
//             <MenuItem value="All">All Status</MenuItem>
//             {statuses.map((status) => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl 
//           size={isMobile ? "small" : "medium"}
//           sx={{
//             width: { xs: "100%", sm: "180px", md: "160px", lg: "180px" },
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//             flexShrink: 0,
//           }}
//         >
//           <InputLabel>Department</InputLabel>
//           <Select
//             value={filters.department}
//             onChange={(e) => handleFilterChange("department", e.target.value)}
//             label="Department"
//           >
//             <MenuItem value="All">All Departments</MenuItem>
//             {departments.map((dept) => (
//               <MenuItem key={dept} value={dept}>
//                 {dept}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Button
//         variant="contained"
//         startIcon={<AddIcon />}
//         onClick={() => setDialogOpen(true)}
//         sx={{
//           height: { xs: "auto", sm: "40px", md: "40px" },
//           padding: { xs: "10px 16px", sm: "8px 16px", md: "8px 20px" },
//           width: { xs: "100%", sm: "auto" },
//           minWidth: { sm: "160px", md: "180px" },
//           background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//           color: "white",
//           "&:hover": {
//             background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
//           },
//           borderRadius: "8px",
//           boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
//           textTransform: "none",
//           fontWeight: 600,
//           fontSize: { xs: "0.875rem", sm: "0.875rem", md: "0.9rem" },
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           flexShrink: 0,
//         }}
//       >
//         Add Candidate
//       </Button>
//     </Box>
//   </Box>
// </StyledPaper>


//         {/* Rest of the component remains the same */}
//         {loading ? (
//           <Box className="loading-container" sx={{ 
//             display: "flex", 
//             justifyContent: "center", 
//             alignItems: "center", 
//             minHeight: "200px" 
//           }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Paper sx={{ 
//             borderRadius: "12px", 
//             overflow: "hidden", 
//             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
//           }}>
//             <Box sx={{ overflowX: "auto" }}>
//               <table className="candidate-table" style={{ 
//                 width: "100%", 
//                 borderCollapse: "collapse",
//                 minWidth: isMobile ? "800px" : "auto" // Force horizontal scroll on mobile
//               }}>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Department</th>
//                     <th>Joining Date</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {candidates.map((candidate) => (
//                     <tr key={candidate._id}>
//                       <td>{candidate.name}</td>
//                       <td>{candidate.email}</td>
//                       <td>{candidate.department}</td>
//                       <td>{new Date(candidate.joiningDate).toLocaleDateString()}</td>
//                       <td>
                       
//                       <Chip
//                           label={candidate.status}
//                           color={getStatusChipColor(candidate.status)}
//                           size="small"
//                         />
//                       </td>
//                       <td>
//                         <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
//                           <Tooltip title="Edit">
//                             <IconButton
//                               size="small"
//                               color="primary"
//                               onClick={() => handleEdit(candidate)}
//                               sx={{
//                                 backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.primary.main, 0.2),
//                                 }
//                               }}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete">
//                             <IconButton
//                               size="small"
//                               color="error"
//                               onClick={() => handleDelete(candidate._id)}
//                               sx={{
//                                 backgroundColor: alpha(theme.palette.error.main, 0.1),
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.error.main, 0.2),
//                                 }
//                               }}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </td>
//                     </tr>
//                   ))}
//                   {candidates.length === 0 && (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
//                         <Typography variant="body1" color="textSecondary">
//                           No candidates found. Add a new candidate or adjust your filters.
//                         </Typography>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </Box>
//           </Paper>
//         )}

//         {/* Add/Edit Candidate Dialog */}
//         <Dialog 
//           open={dialogOpen} 
//           onClose={handleDialogClose}
//           fullScreen={isMobile}
//           maxWidth="md"
//           PaperProps={{
//             sx: {
//               borderRadius: isMobile ? 0 : 3,
//               width: isMobile ? '100%' : '650px',
//               maxWidth: "650px",
//               margin: isMobile ? 0 : 2,
//               overflow: 'hidden',
//             }
//           }}
//         >
//           <DialogTitle
//             sx={{
//               background: 'linear-gradient(135deg, #1976d2, #2196f3)',
//               color: 'white',
//               fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
//               fontWeight: 600,
//               padding: { xs: '16px 20px', sm: '20px 28px', md: '24px 32px' },
//               m: 0
//             }}
//           >
//             {editMode ? "Edit Candidate" : "Add New Candidate"}
//           </DialogTitle>
//           <DialogContent sx={{ 
//             backgroundColor: '#f8fafc',
//             padding: { xs: '16px', sm: '20px', md: '24px 32px' },
//             paddingTop: { xs: '20px', sm: '24px', md: '28px' }
//           }}>
//             <Box
//               component="form"
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                 gap: 2,
//                 width: "100%",
//               }}
//             >
//               <TextField
//                 label="Full Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 required
//                 fullWidth
//                 variant="outlined"
//                 size={isMobile ? "small" : "medium"}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 sx={{
//                   gridColumn: { xs: "1", sm: "1 / 3" },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               />
//               <TextField
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleFormChange}
//                 required
//                 fullWidth
//                 variant="outlined"
//                 size={isMobile ? "small" : "medium"}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 sx={{
//                   gridColumn: { xs: "1", sm: "1 / 3" },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               />
//               <TextField
//                 label="Job Position"
//                 name="jobPosition"
//                 value={formData.jobPosition}
//                 onChange={handleFormChange}
//                 required
//                 fullWidth
//                 variant="outlined"
//                 size={isMobile ? "small" : "medium"}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               />
//               <FormControl 
//                 fullWidth 
//                 variant="outlined" 
//                 size={isMobile ? "small" : "medium"}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               >
//                 <InputLabel>Department</InputLabel>
//                 <Select
//                   name="department"
//                   value={formData.department}
//                   onChange={handleFormChange}
//                   label="Department"
//                   required
//                 >
//                   {departments.map((dept) => (
//                     <MenuItem key={dept} value={dept}>
//                       {dept}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Joining Date"
//                 name="joiningDate"
//                 type="date"
//                 value={formData.joiningDate}
//                 onChange={handleFormChange}
//                 required
//                 fullWidth
//                 variant="outlined"
//                 size={isMobile ? "small" : "medium"}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               />
//               <FormControl 
//                 fullWidth 
//                 variant="outlined" 
//                 size={isMobile ? "small" : "medium"}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               >
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleFormChange}
//                   label="Status"
//                   required
//                 >
//                   {statuses.map((status) => (
//                     <MenuItem key={status} value={status}>
//                       {status}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <FormControl 
//                 fullWidth 
//                 variant="outlined" 
//                 size={isMobile ? "small" : "medium"}
//                 sx={{
//                   gridColumn: { xs: "1", sm: "1 / 3" },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: 'white'
//                   }
//                 }}
//               >
//                 <InputLabel>Recruitment Source</InputLabel>
//                 <Select
//                   name="recruitment"
//                   value={formData.recruitment}
//                   onChange={handleFormChange}
//                   label="Recruitment Source"
//                 >
//                   <MenuItem value="Direct">Direct</MenuItem>
//                   <MenuItem value="Referral">Referral</MenuItem>
//                   <MenuItem value="Agency">Agency</MenuItem>
//                   <MenuItem value="LinkedIn">LinkedIn</MenuItem>
//                   <MenuItem value="Job Portal">Job Portal</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </DialogContent>
//           <DialogActions 
//             sx={{ 
//               backgroundColor: '#f8fafc',
//               padding: { xs: '16px', sm: '20px', md: '24px 32px' },
//               flexDirection: { xs: 'column', sm: 'row' },
//               gap: { xs: 1, sm: 2 },
//               justifyContent: 'flex-end'
//             }}
//           >
//             <Button
//               onClick={handleDialogClose}
//               fullWidth={isMobile}
//               variant="outlined"
//               sx={{
//                 borderRadius: 2,
//                 borderWidth: 2,
//                 borderColor: '#1976d2',
//                 color: '#1976d2',
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 '&:hover': {
//                   borderWidth: 2,
//                   borderColor: '#1565c0',
//                   backgroundColor: 'rgba(25, 118, 210, 0.04)'
//                 },
//                 width: isMobile ? '100%' : 'auto',
//                 minWidth: '120px'
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               fullWidth={isMobile}
//               variant="contained"
//               sx={{
//                 borderRadius: 2,
//                 background: 'linear-gradient(135deg, #1976d2, #2196f3)',
//                 color: 'white',
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1565c0, #1976d2)'
//                 },
//                 width: isMobile ? '100%' : 'auto',
//                 minWidth: '180px'
//               }}
//             >
//               {editMode ? "Update Candidate" : "Add Candidate"}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Snackbar for notifications */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default CandidatesView;



import React, { useState, useEffect } from "react";
import "./CandidateView.css";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Container,
  alpha,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  DialogContentText
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/hired-employees";

// Add these styled components for consistent styling with AttendanceRecords.js
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
  padding: theme.spacing(2),
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transition: "background-color 0.2s ease",
  },
}));



const CandidatesView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    department: "All",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    joiningDate: "",
    probationEnds: "",
    jobPosition: "",
    recruitment: "",
    status: "Pending",
    department: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const departments = ["Engineering", "Product", "Marketing", "Sales", "HR"];
  const statuses = ["Pending", "Offer Letter Accepted", "Offer Letter Rejected"]

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    candidateId: null,
    candidateName: ''
  });
  
  // Modify the handleDelete function to show confirmation first
  const handleDelete = (id, name) => {
    setDeleteConfirmDialog({
      open: true,
      candidateId: id,
      candidateName: name
    });
  };
  
  // Add a new function to handle the actual deletion after confirmation
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${deleteConfirmDialog.candidateId}`);
      setCandidates((prev) => prev.filter((c) => c._id !== deleteConfirmDialog.candidateId));
      showSnackbar("Candidate deleted successfully", "warning");
    } catch (error) {
      showSnackbar("Error deleting candidate", "error");
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmDialog({
        open: false,
        candidateId: null,
        candidateName: ''
      });
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error fetching candidates", "error");
    }
    setLoading(false);
  };

  const handleFilterChange = async (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    try {
      const response = await axios.get(`${API_URL}/filter`, {
        params: {
          department:
            newFilters.department !== "All" ? newFilters.department : "",
          status: newFilters.status !== "All" ? newFilters.status : "",
          search: searchTerm,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error applying filters", "error");
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    try {
      const response = await axios.get(`${API_URL}/filter`, {
        params: {
          department: filters.department !== "All" ? filters.department : "",
          status: filters.status !== "All" ? filters.status : "",
          search: value,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error applying search", "error");
    }
  };
  
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const candidateData = {
        ...formData,
        probationEnds: new Date(formData.joiningDate).setMonth(
          new Date(formData.joiningDate).getMonth() + 3
        ),
        recruitment: formData.recruitment || "Direct",
      };

      if (editMode) {
        const response = await axios.put(
          `${API_URL}/${selectedCandidate._id}`,
          candidateData
        );
        setCandidates((prev) =>
          prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
        );
        showSnackbar("Candidate updated successfully");
      } else {
        const response = await axios.post(API_URL, candidateData);
        setCandidates((prev) => [...prev, response.data]);
        showSnackbar("New candidate added successfully");
      }
      handleDialogClose();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      joiningDate: candidate.joiningDate.split("T")[0],
      probationEnds: candidate.probationEnds.split("T")[0],
      jobPosition: candidate.jobPosition,
      recruitment: candidate.recruitment,
      status: candidate.status,
      department: candidate.department,
    });
    setEditMode(true);
    setDialogOpen(true);
  };


  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedCandidate(null);
    setFormData(initialFormState);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getStatusChipColor = (status) => {
    const colors = {
      "Pending": "warning",
      "Offer Letter Accepted": "success",
      "Offer Letter Rejected": "error"
    };
    return colors[status] || "default";
  };

  return (
    <Box 
    sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
     <Typography
    variant="h4"
    sx={{
      mb: { xs: 2, sm: 3, md: 4 },
      color: theme.palette.primary.main,
      fontWeight: 600,
      letterSpacing: 0.5,
      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
    }}
  >
    Hired Candidates
  </Typography>

      {/* <StyledPaper>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <SearchTextField
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: "auto",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Status"
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) => handleFilterChange("department", e.target.value)}
                  label="Department"
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                height: 40,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              Add Candidate
            </Button>
          </Box>
        </Box>
      </StyledPaper> */}

<StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={{ xs: 2, sm: 2 }}
      sx={{
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <SearchTextField
        placeholder="Search candidates..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        size="small"
        sx={{
          width: { xs: "100%", sm: "300px" },
          marginRight: { xs: 0, sm: "auto" },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 1 },
          width: { xs: "100%", sm: "auto" }
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 1 },
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              width: { xs: "100%", sm: "auto" }
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All Status</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              width: { xs: "100%", sm: "auto" }
            }}
          >
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              label="Department"
            >
              <MenuItem value="All">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            height: { xs: "auto", sm: 40 },
            padding: { xs: "10px 16px", sm: "8px 16px" },
            width: { xs: "100%", sm: "auto" },
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: "white",
            "&:hover": {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
            },
          }}
        >
          Add Candidate
        </Button>
      </Box>
    </Box>
  </StyledPaper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Joining Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <StyledTableRow key={candidate._id}>
                  <TableCell sx={{ fontWeight: 500 }}>{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.department}</TableCell>
                  <TableCell>{new Date(candidate.joiningDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.status}
                      color={getStatusChipColor(candidate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(candidate)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                        size="small"
                        onClick={() => handleDelete(candidate._id)}
                        sx={{
                          color: theme.palette.error.main,
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon />
              </IconButton> */}

<IconButton
  size="small"
  onClick={() => handleDelete(candidate._id, candidate.name)}
  sx={{
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  }}
>
  <DeleteIcon />
</IconButton>

{/* <IconButton
  size="small"
  onClick={() => handleDelete(candidate._id, candidate.name)}
  sx={{
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  }}
>
  <DeleteIcon />
</IconButton> */}
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
              {candidates.length === 0 && (
                <StyledTableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No candidates found. Add a new candidate or adjust your filters.
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
 
 {/* Delete Confirmation Dialog */} 

{/* <Dialog
  open={deleteConfirmDialog.open}
  onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
>
  <DialogTitle sx={{ fontWeight: 600 }}>Confirm Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete the candidate "{deleteConfirmDialog.candidateName}"? 
      This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions sx={{ p: 2, gap: 1 }}>
    <Button 
      onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
      variant="outlined"
      sx={{ borderRadius: 1 }}
    >
      Cancel
    </Button>
    <Button 
      onClick={confirmDelete}
      variant="contained" 
      color="error"
      sx={{ borderRadius: 1 }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog> */}

<Dialog
  open={deleteConfirmDialog.open}
  onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
  PaperProps={{
    sx: {
      width: { xs: "95%", sm: "500px" },
      maxWidth: "500px",
      borderRadius: "20px",
      overflow: "hidden",
      margin: { xs: "8px", sm: "32px" },
    },
  }}
>
  <DialogTitle
    sx={{
      background: "linear-gradient(45deg, #f44336, #ff7961)",
      fontSize: { xs: "1.25rem", sm: "1.5rem" },
      fontWeight: 600,
      padding: { xs: "16px 24px", sm: "24px 32px" },
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <DeleteIcon color="white" />
    Confirm Deletion
  </DialogTitle>
  <DialogContent 
    sx={{
      padding: { xs: "24px", sm: "32px" },
      backgroundColor: "#f8fafc",
      paddingTop: { xs: "24px", sm: "32px" },
    }}
  >
    <Alert severity="warning" sx={{ mb: 2 }}>
      Are you sure you want to delete this candidate? This action cannot be undone.
    </Alert>
    <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
      <Typography variant="body1" fontWeight={600} color="#2c3e50">
        Candidate: {deleteConfirmDialog.candidateName}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        Deleting this candidate will permanently remove all their information from the system.
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions 
    sx={{
      padding: { xs: "16px 24px", sm: "24px 32px" },
      backgroundColor: "#f8fafc",
      borderTop: "1px solid #e0e0e0",
      gap: 2,
    }}
  >
    <Button
      onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
      sx={{
        border: "2px solid #1976d2",
        color: "#1976d2",
        "&:hover": {
          border: "2px solid #64b5f6",
          backgroundColor: "#e3f2fd",
          color: "#1976d2",
        },
        textTransform: "none",
        borderRadius: "8px",
        px: 3,
        fontWeight: 600,
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={confirmDelete}
      variant="contained"
      color="error"
      disabled={loading}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : null
      }
      sx={{
        background: "linear-gradient(45deg, #f44336, #ff7961)",
        fontSize: "0.95rem",
        textTransform: "none",
        padding: "8px 32px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
        color: "white",
        "&:hover": {
          background: "linear-gradient(45deg, #d32f2f, #f44336)",
        },
      }}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  </DialogActions>
</Dialog>

      {/* Dialog and Snackbar code remains the same */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          {editMode ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box
            className="dialog-form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
                        <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1976d2",
                },
              }}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <TextField
              name="joiningDate"
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <TextField
              name="jobPosition"
              label="Job Position"
              value={formData.jobPosition}
              onChange={handleFormChange}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                label="Department"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
            sx={{
              border: "2px solid #1976d2",
              color: "#1976d2",
              "&:hover": {
                border: "2px solid #64b5f6",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
              },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidatesView;

