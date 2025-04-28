// import React, { useState, useEffect } from "react";
// import { styled } from "@mui/material/styles";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Menu,
//   Checkbox,
//   Typography,
//   Paper,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Switch,
//   FormControlLabel,
//   MenuItem,
//   InputAdornment,
//   useTheme,
//   alpha,
//   CircularProgress,
//   Alert,
// } from "@mui/material";

// import { Search, Add, Edit, Delete } from "@mui/icons-material";
// import {
//   fetchWorkTypeRequests,
//   createWorkTypeRequest,
//   updateWorkTypeRequest,
//   deleteWorkTypeRequest,
//   approveWorkTypeRequest,
//   rejectWorkTypeRequest,
// } from "../api/workTypeRequestApi";

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

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   fontSize: 14,
//   fontWeight: "bold",
//   padding: theme.spacing(2),
//   whiteSpace: "nowrap",
//   "&.MuiTableCell-body": {
//     color: theme.palette.text.primary,
//     fontSize: 14,
//     borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: alpha(theme.palette.primary.light, 0.05),
//   },
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.primary.light, 0.1),
//     transition: "background-color 0.2s ease",
//   },
//   // Hide last border
//   "&:last-child td, &:last-child th": {
//     borderBottom: 0,
//   },
// }));

// // API URL for current user's employee profile
// const USER_PROFILE_API_URL = "http://localhost:5000/api/employees/by-user";

// const WorkTypeRequest = () => {
//   const theme = useTheme();
//   const [selectedAllocations, setSelectedAllocations] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [isPermanentRequest, setIsPermanentRequest] = useState(false);
//   const [showSelectionButtons, setShowSelectionButtons] = useState(false);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [shiftRequests, setShiftRequests] = useState([]);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingShift, setEditingShift] = useState(null);
//   const [formData, setFormData] = useState({
//     employee: "",
//     employeeCode: "",
//     requestWorktype: "",
//     requestedDate: "",
//     requestedTill: "",
//     description: "",
//   });

//   // Add these state variables for user profile
//   const [currentUserProfile, setCurrentUserProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const [profileError, setProfileError] = useState(null);

//   // Add these state variables for delete functionality
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const checkUserRole = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         // Fetch user role from your authentication API
//         const response = await axios.get(
//           `http://localhost:5000/api/users/${userId}`
//         );
//         setIsAdmin(response.data.role === "admin");
//       } catch (error) {
//         console.error("Error checking user role:", error);
//       }
//     };

//     checkUserRole();
//     loadWorkTypeRequests();
//     fetchCurrentUserProfile();
//   }, []);

//   // Function to show snackbar messages
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     // In a real implementation, you would show a Snackbar component
//     console.log(`${severity}: ${message}`);
//   };

//   // Function to fetch the current user's profile
//   const fetchCurrentUserProfile = async () => {
//     try {
//       setLoadingProfile(true);
//       setProfileError(null);

//       // Get the current user ID from localStorage
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         setProfileError("User not logged in");
//         return;
//       }

//       const response = await axios.get(`${USER_PROFILE_API_URL}/${userId}`);

//       if (response.data.success) {
//         setCurrentUserProfile(response.data.data);

//         // Pre-fill the form with user data
//         const employeeData = response.data.data;
//         setFormData({
//           employee: `${employeeData.personalInfo?.firstName || ""} ${
//             employeeData.personalInfo?.lastName || ""
//           }`,
//           employeeCode: employeeData.Emp_ID || "",
//           requestWorktype: "",
//           currentWorktype: employeeData.joiningDetails?.workType || "Full Time",
//           requestedDate: "",
//           requestedTill: "",
//           description: "",
//         });
//       } else {
//         setProfileError("Failed to load profile data");
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       setProfileError("Error loading profile. Please try again.");
//     } finally {
//       setLoadingProfile(false);
//     }
//   };

//   useEffect(() => {
//     loadWorkTypeRequests();
//     fetchCurrentUserProfile();
//   }, []);

//   const handleDeleteClick = (shift, e) => {
//     if (e) e.stopPropagation();
//     setDeleteType("single");
//     setItemToDelete(shift);
//     setDeleteDialogOpen(true);
//   };

//   const handleBulkDeleteClick = () => {
//     setDeleteType("bulk");
//     setItemToDelete({
//       count: selectedAllocations.length,
//       ids: [...selectedAllocations],
//     });
//     setDeleteDialogOpen(true);
//     setAnchorEl(null);
//   };

//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       setLoading(true);

//       if (deleteType === "single" && itemToDelete) {
//         await deleteWorkTypeRequest(itemToDelete._id);
//         setShiftRequests((prevRequests) =>
//           prevRequests.filter((req) => req._id !== itemToDelete._id)
//         );
//         showSnackbar("Work type request deleted successfully");
//       } else if (
//         deleteType === "bulk" &&
//         itemToDelete &&
//         itemToDelete.ids.length > 0
//       ) {
//         const promises = itemToDelete.ids.map((id) =>
//           deleteWorkTypeRequest(id)
//         );
//         await Promise.all(promises);
//         setShiftRequests((prevRequests) =>
//           prevRequests.filter((req) => !itemToDelete.ids.includes(req._id))
//         );
//         setSelectedAllocations([]);
//         setShowSelectionButtons(false);
//         showSnackbar(`${itemToDelete.count} requests deleted successfully`);
//       }

//       handleCloseDeleteDialog();
//     } catch (error) {
//       console.error(`Error deleting ${deleteType}:`, error);
//       showSnackbar(
//         `Error deleting ${deleteType === "single" ? "request" : "requests"}`,
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkApprove = async () => {
//     try {
//       const promises = selectedAllocations.map((id) =>
//         approveWorkTypeRequest(id)
//       );
//       await Promise.all(promises);
//       await loadWorkTypeRequests();
//       setSelectedAllocations([]);
//       setShowSelectionButtons(false);
//     } catch (error) {
//       console.error("Error bulk approving requests:", error);
//     }
//   };

//   const handleBulkReject = async () => {
//     try {
//       const promises = selectedAllocations.map((id) =>
//         rejectWorkTypeRequest(id)
//       );
//       await Promise.all(promises);
//       await loadWorkTypeRequests();
//       setSelectedAllocations([]);
//       setShowSelectionButtons(false);
//     } catch (error) {
//       console.error("Error bulk rejecting requests:", error);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectAll = () => {
//     const allIds = shiftRequests.map((req) => req._id);
//     setSelectedAllocations(allIds);
//     setShowSelectionButtons(true);
//   };

//   const handleUnselectAll = () => {
//     setSelectedAllocations([]);
//     setShowSelectionButtons(false);
//   };

//   const handleApprove = async (id) => {
//     try {
//       const response = await approveWorkTypeRequest(id);
//       setShiftRequests((prevRequests) =>
//         prevRequests.map((req) => (req._id === id ? response.data : req))
//       );
//     } catch (error) {
//       console.error("Error approving work type request:", error);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       const response = await rejectWorkTypeRequest(id);
//       setShiftRequests((prevRequests) =>
//         prevRequests.map((req) => (req._id === id ? response.data : req))
//       );
//     } catch (error) {
//       console.error("Error rejecting work type request:", error);
//     }
//   };

//   const resetFormData = () => {
//     // Reset form but keep the user's information
//     if (currentUserProfile) {
//       setFormData({
//         employee: `${currentUserProfile.personalInfo?.firstName || ""} ${
//           currentUserProfile.personalInfo?.lastName || ""
//         }`,
//         employeeCode: currentUserProfile.Emp_ID || "",
//         requestWorktype: "",
//         requestedDate: "",
//         requestedTill: "",
//         description: "",
//       });
//     } else {
//       setFormData({
//         employee: "",
//         employeeCode: "",
//         requestWorktype: "",
//         requestedDate: "",
//         requestedTill: "",
//         description: "",
//       });
//     }
//     setIsPermanentRequest(false);
//   };

//   const handleCreateShift = async () => {
//     try {
//       if (!currentUserProfile) {
//         showSnackbar("User profile not loaded. Please try again.", "error");
//         return;
//       }

//       const requestData = {
//         employee: formData.employee,
//         employeeCode: formData.employeeCode,
//         requestedShift: formData.requestWorktype,
//         currentWorktype:
//           currentUserProfile.joiningDetails?.workType || "Full Time",
//         requestedDate: formData.requestedDate,
//         requestedTill: formData.requestedTill,
//         description: formData.description,
//         isPermanentRequest,
//         status: "Pending",
//       };

//       const response = await createWorkTypeRequest(requestData);
//       setShiftRequests((prev) => [...prev, response.data]);
//       setCreateDialogOpen(false);
//       resetFormData();
//       showSnackbar("Work type request created successfully");
//     } catch (error) {
//       console.error("Error creating work type request:", error);
//       showSnackbar("Error creating work type request", "error");
//     }
//   };

//   const handleEdit = (shift) => {
//     setEditingShift(shift);
//     setFormData({
//       employee: shift.employee,
//       employeeCode: shift.employeeCode || "",
//       requestShift: shift.requestedShift,
//       requestedDate: shift.requestedDate
//         ? new Date(shift.requestedDate).toISOString().split("T")[0]
//         : "",
//       requestedTill: shift.requestedTill
//         ? new Date(shift.requestedTill).toISOString().split("T")[0]
//         : "",
//       description: shift.description || "",
//     });
//     setEditDialogOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const updatedData = {
//         employee: formData.employee,
//         employeeCode: formData.employeeCode,
//         requestedShift: formData.requestShift,
//         requestedDate: formData.requestedDate,
//         requestedTill: formData.requestedTill,
//         description: formData.description,
//       };

//       const response = await updateWorkTypeRequest(
//         editingShift._id,
//         updatedData
//       );
//       setShiftRequests((prevRequests) =>
//         prevRequests.map((req) =>
//           req._id === editingShift._id ? response.data : req
//         )
//       );
//       setEditDialogOpen(false);
//       setEditingShift(null);
//       resetFormData();
//       showSnackbar("Work type request updated successfully");
//     } catch (error) {
//       console.error("Error updating work type request:", error);
//       showSnackbar("Error updating work type request", "error");
//     }
//   };

//   const loadWorkTypeRequests = async () => {
//     try {
//       if (isAdmin) {
//         // Admin sees all requests
//         const response = await fetchWorkTypeRequests();
//         setShiftRequests(response.data);
//       } else {
//         // Regular user sees only their requests
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const profileResponse = await axios.get(
//           `${USER_PROFILE_API_URL}/${userId}`
//         );
//         if (!profileResponse.data.success) return;

//         const employeeCode = profileResponse.data.data.Emp_ID;

//         const response = await fetchWorkTypeRequests();
//         const filteredRequests = response.data.filter(
//           (request) => request.employeeCode === employeeCode
//         );
//         setShiftRequests(filteredRequests);
//       }
//     } catch (error) {
//       console.error("Error loading work type requests:", error);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p: { xs: 2, sm: 3, md: 4 },
//         backgroundColor: "#f5f5f5",
//         minHeight: "100vh",
//       }}
//     >
//       <Box>
//         <Typography
//           variant="h4"
//           sx={{
//             mb: { xs: 2, sm: 3, md: 4 },
//             color: theme.palette.primary.main,
//             fontWeight: 600,
//             letterSpacing: 0.5,
//             fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
//           }}
//         >
//           Work Type Requests
//         </Typography>

//         <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
//           <Box
//             display="flex"
//             flexDirection={{ xs: "column", sm: "row" }}
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             gap={2}
//             sx={{
//               width: "100%",
//               justifyContent: "space-between",
//             }}
//           >
//             <SearchTextField
//               placeholder="Search Employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               size="small"
//               sx={{
//                 width: { xs: "100%", sm: "300px" },
//                 marginRight: { xs: 0, sm: "auto" },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 gap: { xs: 1, sm: 1 },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//             >
//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={() => setCreateDialogOpen(true)}
//                 sx={{
//                   height: { xs: "auto", sm: 50 },
//                   padding: { xs: "8px 16px", sm: "6px 16px" },
//                   width: { xs: "100%", sm: "auto" },
//                   background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//                   color: "white",
//                   "&:hover": {
//                     background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
//                   },
//                 }}
//               >
//                 Create Request
//               </Button>
//             </Box>
//           </Box>
//         </StyledPaper>
//       </Box>

//       {/* Selection Buttons */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 2,
//           mb: 2,
//           mt: { xs: 2, sm: 2 },
//         }}
//       >
//         <Button
//           variant="outlined"
//           sx={{
//             color: "green",
//             borderColor: "green",
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={handleSelectAll}
//         >
//           Select All Requests
//         </Button>
//         {showSelectionButtons && (
//           <>
//             <Button
//               variant="outlined"
//               sx={{
//                 color: "grey.500",
//                 borderColor: "grey.500",
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={handleUnselectAll}
//             >
//               Unselect All
//             </Button>
//             <Button
//               variant="outlined"
//               sx={{
//                 color: "maroon",
//                 borderColor: "maroon",
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={(e) => setAnchorEl(e.currentTarget)}
//             >
//               {selectedAllocations.length} Selected
//             </Button>
//           </>
//         )}
//       </Box>

//       {/* Actions Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//         PaperProps={{
//           sx: {
//             width: { xs: 200, sm: 250 },
//             borderRadius: 2,
//             boxShadow: 3,
//           },
//         }}
//       >
//         <MenuItem onClick={handleBulkApprove} sx={{ py: 1.5 }}>
//           Approve Selected
//         </MenuItem>
//         <MenuItem onClick={handleBulkReject} sx={{ py: 1.5 }}>
//           Reject Selected
//         </MenuItem>
//         <MenuItem onClick={handleBulkDeleteClick} sx={{ py: 1.5 }}>
//           Delete Selected
//         </MenuItem>
//       </Menu>

//       {/* Status Filter Buttons */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 1,
//           mb: 2,
//         }}
//       >
//         <Button
//           sx={{
//             color: "green",
//             justifyContent: { xs: "flex-start", sm: "center" },
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => setFilterStatus("Approved")}
//         >
//           ● Approved
//         </Button>
//         <Button
//           sx={{
//             color: "red",
//             justifyContent: { xs: "flex-start", sm: "center" },
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => setFilterStatus("Rejected")}
//         >
//           ● Rejected
//         </Button>
//         <Button
//           sx={{
//             color: "orange",
//             justifyContent: { xs: "flex-start", sm: "center" },
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => setFilterStatus("Pending")}
//         >
//           ● Pending
//         </Button>
//         <Button
//           sx={{
//             color: "gray",
//             justifyContent: { xs: "flex-start", sm: "center" },
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => setFilterStatus("all")}
//         >
//           ● All
//         </Button>
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       {/* Main Table */}
//       <TableContainer
//         component={Paper}
//         sx={{
//           maxHeight: { xs: 350, sm: 400, md: 450 },
//           overflowY: "auto",
//           overflowX: "auto",
//           mx: 0,
//           borderRadius: 2,
//           boxShadow:
//             "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//           mb: 4,
//           "& .MuiTableContainer-root": {
//             scrollbarWidth: "thin",
//             "&::-webkit-scrollbar": {
//               width: 8,
//               height: 8,
//             },
//             "&::-webkit-scrollbar-track": {
//               backgroundColor: alpha(theme.palette.primary.light, 0.1),
//               borderRadius: 8,
//             },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: alpha(theme.palette.primary.main, 0.2),
//               borderRadius: 8,
//               "&:hover": {
//                 backgroundColor: alpha(theme.palette.primary.main, 0.3),
//               },
//             },
//           },
//         }}
//       >
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell
//                 padding="checkbox"
//                 sx={{ position: "sticky", left: 0, zIndex: 3 }}
//               >
//                 <Checkbox
//                   sx={{
//                     color: "white",
//                     "&.Mui-checked": {
//                       color: "white",
//                     },
//                   }}
//                   onChange={(e) => {
//                     if (e.target.checked) handleSelectAll();
//                     else handleUnselectAll();
//                   }}
//                   checked={
//                     selectedAllocations.length === shiftRequests.length &&
//                     shiftRequests.length > 0
//                   }
//                 />
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 180 }}>Employee</StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 150 }}>
//                 Requested Work Type
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 150 }}>
//                 Current Work Type
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 130 }}>
//                 Requested Date
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 130 }}>
//                 Requested Till
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 100 }}>Status</StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 150 }}>
//                 Description
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 120, textAlign: "center" }}>
//                 Confirmation
//               </StyledTableCell>
//               <StyledTableCell sx={{ minWidth: 100, textAlign: "center" }}>
//                 Actions
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {shiftRequests
//               .filter((request) => {
//                 const employeeName = request?.employee || "";
//                 return (
//                   employeeName
//                     .toLowerCase()
//                     .includes(searchTerm.toLowerCase()) &&
//                   (filterStatus === "all" || request.status === filterStatus)
//                 );
//               })
//               .map((request) => (
//                 <StyledTableRow
//                   key={request._id}
//                   hover
//                   onClick={() => {
//                     const newSelected = selectedAllocations.includes(
//                       request._id
//                     )
//                       ? selectedAllocations.filter((id) => id !== request._id)
//                       : [...selectedAllocations, request._id];
//                     setSelectedAllocations(newSelected);
//                     setShowSelectionButtons(newSelected.length > 0);
//                   }}
//                   selected={selectedAllocations.includes(request._id)}
//                   sx={{
//                     cursor: "pointer",
//                     ...(selectedAllocations.includes(request._id) && {
//                       backgroundColor: alpha(theme.palette.primary.light, 0.15),
//                       "&:hover": {
//                         backgroundColor: alpha(
//                           theme.palette.primary.light,
//                           0.2
//                         ),
//                       },
//                     }),
//                   }}
//                 >
//                   <TableCell
//                     padding="checkbox"
//                     sx={{
//                       position: "sticky",
//                       left: 0,
//                       backgroundColor: selectedAllocations.includes(request._id)
//                         ? alpha(theme.palette.primary.light, 0.15)
//                         : request._id % 2 === 0
//                         ? alpha(theme.palette.primary.light, 0.05)
//                         : "inherit",
//                       "&:hover": {
//                         backgroundColor: alpha(
//                           theme.palette.primary.light,
//                           0.2
//                         ),
//                       },
//                     }}
//                   >
//                     <Checkbox
//                       checked={selectedAllocations.includes(request._id)}
//                       onChange={() => {
//                         const newSelected = selectedAllocations.includes(
//                           request._id
//                         )
//                           ? selectedAllocations.filter(
//                               (id) => id !== request._id
//                             )
//                           : [...selectedAllocations, request._id];
//                         setSelectedAllocations(newSelected);
//                         setShowSelectionButtons(newSelected.length > 0);
//                       }}
//                       sx={{
//                         "&.Mui-checked": {
//                           color: theme.palette.primary.main,
//                         },
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <Box
//                         sx={{
//                           width: 32,
//                           height: 32,
//                           borderRadius: "50%",
//                           bgcolor:
//                             request._id % 2 === 0
//                               ? alpha(theme.palette.primary.main, 0.8)
//                               : alpha(theme.palette.secondary.main, 0.8),
//                           color: "white",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontWeight: "bold",
//                           fontSize: "0.875rem",
//                           flexShrink: 0,
//                         }}
//                       >
//                         {request.employee?.[0] || "U"}
//                       </Box>
//                       <Box sx={{ display: "flex", flexDirection: "column" }}>
//                         <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                           {request.employee}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {request.employeeCode}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {request.requestedShift}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {request.currentWorktype || "Full Time"}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(request.requestedDate).toLocaleDateString(
//                         undefined,
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         }
//                       )}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(request.requestedTill).toLocaleDateString(
//                         undefined,
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         }
//                       )}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box
//                       sx={{
//                         display: "inline-block",
//                         px: 1.5,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.75rem",
//                         fontWeight: "medium",
//                         backgroundColor:
//                           request.status === "Approved"
//                             ? alpha("#4caf50", 0.1)
//                             : request.status === "Rejected"
//                             ? alpha("#f44336", 0.1)
//                             : alpha("#ff9800", 0.1),
//                         color:
//                           request.status === "Approved"
//                             ? "#2e7d32"
//                             : request.status === "Rejected"
//                             ? "#d32f2f"
//                             : "#e65100",
//                       }}
//                     >
//                       {request.status}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         maxWidth: 200,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {request.description}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", gap: 1 }}
//                     >
//                       <IconButton
//                         size="small"
//                         color="success"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleApprove(request._id);
//                         }}
//                         disabled={request.status === "Approved"}
//                         sx={{
//                           backgroundColor: alpha("#4caf50", 0.1),
//                           "&:hover": {
//                             backgroundColor: alpha("#4caf50", 0.2),
//                           },
//                           "&.Mui-disabled": {
//                             backgroundColor: alpha("#e0e0e0", 0.3),
//                           },
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                           ✓
//                         </Typography>
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleReject(request._id);
//                         }}
//                         disabled={request.status === "Rejected"}
//                         sx={{
//                           backgroundColor: alpha("#f44336", 0.1),
//                           "&:hover": {
//                             backgroundColor: alpha("#f44336", 0.2),
//                           },
//                           "&.Mui-disabled": {
//                             backgroundColor: alpha("#e0e0e0", 0.3),
//                           },
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                           ✕
//                         </Typography>
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", gap: 1 }}
//                     >
//                       <IconButton
//                         size="small"
//                         color="primary"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEdit(request);
//                         }}
//                         sx={{
//                           backgroundColor: alpha(
//                             theme.palette.primary.main,
//                             0.1
//                           ),
//                           "&:hover": {
//                             backgroundColor: alpha(
//                               theme.palette.primary.main,
//                               0.2
//                             ),
//                           },
//                         }}
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteClick(request, e);
//                         }}
//                         sx={{
//                           backgroundColor: alpha(theme.palette.error.main, 0.1),
//                           "&:hover": {
//                             backgroundColor: alpha(
//                               theme.palette.error.main,
//                               0.2
//                             ),
//                           },
//                         }}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </StyledTableRow>
//               ))}
//             {shiftRequests.filter((request) => {
//               const employeeName = request?.employee || "";
//               return (
//                 employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
//                 (filterStatus === "all" || request.status === filterStatus)
//               );
//             }).length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
//                   <Typography variant="body1" color="text.secondary">
//                     No work type requests found matching your filters.
//                   </Typography>
//                   <Button
//                     variant="text"
//                     color="primary"
//                     onClick={() => {
//                       setSearchTerm("");
//                       setFilterStatus("all");
//                     }}
//                     sx={{ mt: 1 }}
//                   >
//                     Clear filters
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Delete confirmation dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleCloseDeleteDialog}
//         PaperProps={{
//           sx: {
//             width: { xs: "95%", sm: "500px" },
//             maxWidth: "500px",
//             borderRadius: "20px",
//             overflow: "hidden",
//             margin: { xs: "8px", sm: "32px" },
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(45deg, #f44336, #ff7961)",
//             fontSize: { xs: "1.25rem", sm: "1.5rem" },
//             fontWeight: 600,
//             padding: { xs: "16px 24px", sm: "24px 32px" },
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <Delete />
//           Confirm Deletion
//         </DialogTitle>
//         <DialogContent
//           sx={{
//             padding: { xs: "24px", sm: "32px" },
//             backgroundColor: "#f8fafc",
//             paddingTop: { xs: "24px", sm: "32px" },
//           }}
//         >
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             {deleteType === "bulk"
//               ? `Are you sure you want to delete ${itemToDelete?.count} selected requests?`
//               : "Are you sure you want to delete this work type request?"}
//           </Alert>
//           {itemToDelete && (
//             <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
//               {deleteType === "bulk" ? (
//                 <>
//                   <Typography variant="body1" fontWeight={600} color="#2c3e50">
//                     Bulk Deletion
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 1 }}
//                   >
//                     You are about to delete {itemToDelete.count} requests. This
//                     action cannot be undone.
//                   </Typography>
//                 </>
//               ) : (
//                 <>
//                   <Typography variant="body1" fontWeight={600} color="#2c3e50">
//                     Work Type Request Details:
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       mt: 1,
//                       p: 1,
//                       bgcolor: "#fff",
//                       borderRadius: 1,
//                       border: "1px solid #e2e8f0",
//                     }}
//                   >
//                     <strong>Employee:</strong> {itemToDelete.employee} (
//                     {itemToDelete.employeeCode})<br />
//                     <strong>Requested Work Type:</strong>{" "}
//                     {itemToDelete.requestedShift}
//                     <br />
//                     <strong>Date Range:</strong>{" "}
//                     {new Date(itemToDelete.requestedDate).toLocaleDateString()}{" "}
//                     -{" "}
//                     {new Date(itemToDelete.requestedTill).toLocaleDateString()}
//                     <br />
//                     <strong>Status:</strong> {itemToDelete.status}
//                   </Typography>
//                 </>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions
//           sx={{
//             padding: { xs: "16px 24px", sm: "24px 32px" },
//             backgroundColor: "#f8fafc",
//             borderTop: "1px solid #e0e0e0",
//             gap: 2,
//           }}
//         >
//           <Button
//             onClick={handleCloseDeleteDialog}
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
//             onClick={handleConfirmDelete}
//             variant="contained"
//             color="error"
//             disabled={loading}
//             startIcon={
//               loading ? <CircularProgress size={20} color="inherit" /> : null
//             }
//             sx={{
//               background: "linear-gradient(45deg, #f44336, #ff7961)",
//               fontSize: "0.95rem",
//               textTransform: "none",
//               padding: "8px 32px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
//               color: "white",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #d32f2f, #f44336)",
//               },
//             }}
//           >
//             {loading ? "Deleting..." : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create Dialog */}
//       <Dialog
//         open={createDialogOpen}
//         onClose={() => setCreateDialogOpen(false)}
//         fullScreen={window.innerWidth < 600}
//         PaperProps={{
//           sx: {
//             width: { xs: "100%", sm: "600px" },
//             maxWidth: "100%",
//             borderRadius: { xs: 0, sm: "20px" },
//             margin: { xs: 0, sm: 2 },
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
//           Create Work Type Request
//         </DialogTitle>

//         <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
//           {loadingProfile ? (
//             <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : profileError ? (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {profileError}
//             </Alert>
//           ) : (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               {/* Display current user's profile info */}
//               {currentUserProfile && (
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     backgroundColor: alpha(theme.palette.primary.light, 0.1),
//                     borderRadius: 2,
//                     border: `1px solid ${alpha(
//                       theme.palette.primary.main,
//                       0.2
//                     )}`,
//                   }}
//                 >
//                   <Typography variant="subtitle2" color="primary" gutterBottom>
//                     Your Employee Details
//                   </Typography>
//                   <Box
//                     sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
//                   >
//                     <Typography variant="body2">
//                       <strong>Name:</strong> {formData.employee}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Employee Code:</strong> {formData.employeeCode}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Department:</strong>{" "}
//                       {currentUserProfile.joiningDetails?.department ||
//                         "Not Assigned"}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Current Work Type:</strong>{" "}
//                       {currentUserProfile.joiningDetails?.workType ||
//                         "Full Time"}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               )}

//               <TextField
//                 label="Request Work Type"
//                 name="requestWorktype"
//                 value={formData.requestWorktype}
//                 onChange={handleFormChange}
//                 fullWidth
//                 select
//                 required
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="Full Time">Full Time</MenuItem>
//                 <MenuItem value="Part Time">Part Time</MenuItem>
//                 <MenuItem value="Contract">Contract</MenuItem>
//                 <MenuItem value="Freelance">Freelance</MenuItem>
//                 <MenuItem value="Remote">Remote</MenuItem>
//               </TextField>

//               <TextField
//                 label="Requested Date"
//                 name="requestedDate"
//                 type="date"
//                 value={formData.requestedDate}
//                 onChange={handleFormChange}
//                 fullWidth
//                 required
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               />

//               <TextField
//                 label="Requested Till"
//                 name="requestedTill"
//                 type="date"
//                 value={formData.requestedTill}
//                 onChange={handleFormChange}
//                 fullWidth
//                 required
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               />

//               <TextField
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleFormChange}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                 }}
//               />

//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={isPermanentRequest}
//                     onChange={(e) => setIsPermanentRequest(e.target.checked)}
//                   />
//                 }
//                 label="Permanent Request"
//               />
//             </Box>
//           )}
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
//             onClick={() => {
//               setCreateDialogOpen(false);
//               resetFormData();
//             }}
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
//             onClick={handleCreateShift}
//             variant="contained"
//             disabled={
//               loadingProfile ||
//               !!profileError ||
//               !formData.requestWorktype ||
//               !formData.requestedDate ||
//               !formData.requestWorktype ||
//               !formData.requestedDate ||
//               !formData.requestedTill
//             }
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
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
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
//           Edit Work Type Request
//         </DialogTitle>

//         <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 gap: 2,
//               }}
//             >
//               <TextField
//                 label="Employee Name"
//                 name="employee"
//                 fullWidth
//                 value={formData.employee}
//                 onChange={handleFormChange}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#1976d2",
//                   },
//                 }}
//               />
//               <TextField
//                 label="Employee ID"
//                 name="employeeCode"
//                 fullWidth
//                 value={formData.employeeCode || ""}
//                 onChange={handleFormChange}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     "&:hover fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#1976d2",
//                   },
//                 }}
//               />
//             </Box>

//             <TextField
//               label="Request Work Type"
//               name="requestShift"
//               value={formData.requestShift}
//               onChange={handleFormChange}
//               fullWidth
//               select
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//               }}
//             >
//               <MenuItem value="Full Time">Full Time</MenuItem>
//               <MenuItem value="Part Time">Part Time</MenuItem>
//               <MenuItem value="Contract">Contract</MenuItem>
//               <MenuItem value="Freelance">Freelance</MenuItem>
//               <MenuItem value="Remote">Remote</MenuItem>
//             </TextField>

//             <TextField
//               label="Requested Date"
//               name="requestedDate"
//               type="date"
//               value={formData.requestedDate}
//               onChange={handleFormChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
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
//               label="Requested Till"
//               name="requestedTill"
//               type="date"
//               value={formData.requestedTill}
//               onChange={handleFormChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
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
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleFormChange}
//               fullWidth
//               multiline
//               rows={4}
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
//             onClick={() => setEditDialogOpen(false)}
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
//             onClick={handleSaveEdit}
//             variant="contained"
//             disabled={
//               !formData.employee ||
//               !formData.requestShift ||
//               !formData.requestedDate
//             }
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
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default WorkTypeRequest;





import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  Checkbox,
  Typography,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";

import { Search, Add, Edit, Delete } from "@mui/icons-material";
import {
  fetchWorkTypeRequests,
  createWorkTypeRequest,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest,
  bulkApproveRequests,
  bulkRejectRequests,
} from "../api/workTypeRequestApi";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
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
  whiteSpace: "nowrap",
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
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
  // Hide last border
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

// API URL for current user's employee profile
const USER_PROFILE_API_URL = "http://localhost:5000/api/employees/by-user";

const WorkTypeRequest = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0); // Add tab state
  const [selectedAllocations, setSelectedAllocations] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isPermanentRequest, setIsPermanentRequest] = useState(false);
  const [showSelectionButtons, setShowSelectionButtons] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftRequests, setShiftRequests] = useState([]);
  const [allocatedShifts, setAllocatedShifts] = useState([]); // Add state for review tab
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({
    employee: "",
    employeeCode: "",
    requestWorktype: "",
    requestedDate: "",
    requestedTill: "",
    description: "",
  });

  // Add these state variables for user profile
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Add these state variables for delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Add snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to fetch the current user's profile
  const fetchCurrentUserProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      
      // Get the current user ID from localStorage
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setProfileError("User not logged in");
        return;
      }
      
      const response = await axios.get(`${USER_PROFILE_API_URL}/${userId}`);
      
      if (response.data.success) {
        setCurrentUserProfile(response.data.data);
        
        // Pre-fill the form with user data
        const employeeData = response.data.data;
        setFormData({
          employee: `${employeeData.personalInfo?.firstName || ""} ${employeeData.personalInfo?.lastName || ""}`,
          employeeCode: employeeData.Emp_ID || "",
          requestWorktype: "",
          currentWorktype: employeeData.joiningDetails?.workType || "Full Time",
          requestedDate: "",
          requestedTill: "",
          description: "",
        });
      } else {
        setProfileError("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError("Error loading profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // useEffect(() => {
  //   const checkUserRole = async () => {
  //     try {
  //       const userId = localStorage.getItem("userId");
  //       if (!userId) return;

  //       // Fetch user role from your authentication API
  //       const response = await axios.get(
  //         `http://localhost:5000/api/users/${userId}`
  //       );
  //       setIsAdmin(response.data.role === "admin");
  //     } catch (error) {
  //       console.error("Error checking user role:", error);
  //     }
  //   };

  //   checkUserRole();
  //   loadWorkTypeRequests();
  //   fetchCurrentUserProfile();
  // }, [tabValue]); // Add tabValue as dependency to reload data when tab changes


  // 1. Add console logs to debug the role check

//   useEffect(() => {
//   const checkUserRole = async () => {
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         console.log("No userId found in localStorage");
//         return;
//       }

//       console.log("Checking role for userId:", userId);
      
//       // Fetch user role from your authentication API
//       const response = await axios.get(
//         `http://localhost:5000/api/users/${userId}`
//       );
      
//       console.log("User data:", response.data);
      
//       // Check for different possible role formats
//       const userRole = response.data.role || response.data.userRole;
//       const isAdminUser = 
//         userRole === "admin" || 
//         userRole === "Admin" || 
//         userRole === "HR" ||
//         userRole === "hr";
      
//       console.log("User role:", userRole, "Is admin:", isAdminUser);
      
//       setIsAdmin(isAdminUser);
//     } catch (error) {
//       console.error("Error checking user role:", error);
//     }
//   };

//   checkUserRole();
//   loadWorkTypeRequests();
//   fetchCurrentUserProfile();
// }, []);  // Remove tabValue dependency to avoid multiple role checks



// Change the isAdmin initialization to false


// Update the useEffect for role checking
useEffect(() => {
  const checkUserRole = async () => {
    try {
      // For development purposes, set isAdmin to true
      setIsAdmin(true);
      
      // Comment out the actual role check for now
      /*
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("No userId found in localStorage");
        return;
      }

      console.log("Checking role for userId:", userId);
      
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );
      
      console.log("User data:", response.data);
      
      const userRole = response.data.role || response.data.userRole;
      const isAdminUser = 
        userRole === "admin" || 
        userRole === "Admin" || 
        userRole === "HR" ||
        userRole === "hr";
      
      console.log("User role:", userRole, "Is admin:", isAdminUser);
      
      setIsAdmin(isAdminUser);
      */
    } catch (error) {
      console.error("Error checking user role:", error);
      // For development, set isAdmin to true if there's an error
      setIsAdmin(true);
    }
  };

  checkUserRole();
  loadWorkTypeRequests();
  fetchCurrentUserProfile();
}, []);


// Add this after the useEffect for role checking
useEffect(() => {
  // For testing - uncomment to force admin mode
  // setIsAdmin(true);
  console.log("Current admin status:", isAdmin);
}, [isAdmin]);


const loadWorkTypeRequests = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showSnackbar("User ID not found. Please log in again.", "error");
      return;
    }

    if (tabValue === 0) {
      // My Requests tab - only show the current user's requests
      const profileResponse = await axios.get(`${USER_PROFILE_API_URL}/${userId}`);
      
      if (!profileResponse.data.success) {
        showSnackbar("Failed to load user profile", "error");
        return;
      }
      
      const employeeCode = profileResponse.data.data.Emp_ID;
      
      const response = await fetchWorkTypeRequests();
      const filteredRequests = response.data.filter(
        (request) => request.employeeCode === employeeCode
      );
      
      setShiftRequests(filteredRequests);
    } else {
      // Review tab - show all requests
      const response = await fetchWorkTypeRequests();
      setAllocatedShifts(response.data);
    }
  } catch (error) {
    console.error("Error loading work type requests:", error);
    showSnackbar("Error loading work type requests: " + error.message, "error");
  }
};


  const handleDeleteClick = (shift, e) => {
    if (e) e.stopPropagation();
    setDeleteType("single");
    setItemToDelete(shift);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setDeleteType("bulk");
    setItemToDelete({
      count: selectedAllocations.length,
      ids: [...selectedAllocations],
    });
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      if (deleteType === "single" && itemToDelete) {
        await deleteWorkTypeRequest(itemToDelete._id);
        
        if (tabValue === 0) {
          setShiftRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== itemToDelete._id)
          );
        } else {
          setAllocatedShifts((prevRequests) =>
            prevRequests.filter((req) => req._id !== itemToDelete._id)
          );
        }
        
        showSnackbar("Work type request deleted successfully");
      } else if (
        deleteType === "bulk" &&
        itemToDelete &&
        itemToDelete.ids.length > 0
      ) {
        const promises = itemToDelete.ids.map((id) =>
          deleteWorkTypeRequest(id)
        );
        await Promise.all(promises);
        
        if (tabValue === 0) {
          setShiftRequests((prevRequests) =>
            prevRequests.filter((req) => !itemToDelete.ids.includes(req._id))
          );
        } else {
          setAllocatedShifts((prevRequests) =>
            prevRequests.filter((req) => !itemToDelete.ids.includes(req._id))
          );
        }
        
        setSelectedAllocations([]);
        setShowSelectionButtons(false);
        showSnackbar(`${itemToDelete.count} requests deleted successfully`);
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      showSnackbar(
        `Error deleting ${deleteType === "single" ? "request" : "requests"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await bulkApproveRequests(selectedAllocations);
      await loadWorkTypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
      showSnackbar("Work type requests approved successfully");
    } catch (error) {
      console.error("Error bulk approving requests:", error);
      showSnackbar("Error approving requests: " + error.message, "error");
    }
  };

  const handleBulkReject = async () => {
    try {
      await bulkRejectRequests(selectedAllocations);
      await loadWorkTypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
      showSnackbar("Work type requests rejected successfully");
    } catch (error) {
      console.error("Error bulk rejecting requests:", error);
      showSnackbar("Error rejecting requests: " + error.message, "error");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowClick = (id) => {
    const newSelected = selectedAllocations.includes(id)
      ? selectedAllocations.filter((item) => item !== id)
      : [...selectedAllocations, id];
    setSelectedAllocations(newSelected);
    setShowSelectionButtons(newSelected.length > 0);
  };

  const handleSelectAll = () => {
    const currentData = tabValue === 0 ? shiftRequests : allocatedShifts;
    const allIds = currentData.map((req) => req._id);
    setSelectedAllocations(allIds);
    setShowSelectionButtons(true);
  };

  const handleUnselectAll = () => {
    setSelectedAllocations([]);
    setShowSelectionButtons(false);
  };

  const handleApprove = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await approveWorkTypeRequest(id);
      await loadWorkTypeRequests();
      showSnackbar("Work type request approved successfully");
    } catch (error) {
      console.error("Error approving work type request:", error);
      showSnackbar("Error approving request: " + error.message, "error");
    }
  };

  const handleReject = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await rejectWorkTypeRequest(id);
      await loadWorkTypeRequests();
      showSnackbar("Work type request rejected successfully");
    } catch (error) {
      console.error("Error rejecting work type request:", error);
      showSnackbar("Error rejecting request: " + error.message, "error");
    }
  };

  const resetFormData = () => {
    // Reset form but keep the user's information
    if (currentUserProfile) {
      setFormData({
        employee: `${currentUserProfile.personalInfo?.firstName || ""} ${currentUserProfile.personalInfo?.lastName || ""}`,
        employeeCode: currentUserProfile.Emp_ID || "",
        requestWorktype: "",
        requestedDate: "",
        requestedTill: "",
        description: "",
      });
    } else {
      setFormData({
        employee: "",
        employeeCode: "",
        requestWorktype: "",
        requestedDate: "",
        requestedTill: "",
        description: "",
      });
    }
    setIsPermanentRequest(false);
  };

  const handleCreateShift = async () => {
    try {
      if (!currentUserProfile) {
        showSnackbar("User profile not loaded. Please try again.", "error");
        return;
      }

      const requestData = {
        employee: formData.employee,
        employeeCode: formData.employeeCode,
        requestedShift: formData.requestWorktype,
        currentWorktype: currentUserProfile.joiningDetails?.workType || "Full Time",
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isPermanentRequest,
        status: "Pending",
      };

      const response = await createWorkTypeRequest(requestData);
      setShiftRequests((prev) => [...prev, response.data]);
      setCreateDialogOpen(false);
      resetFormData();
      showSnackbar("Work type request created successfully");
    } catch (error) {
      console.error("Error creating work type request:", error);
      showSnackbar("Error creating work type request", "error");
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      employee: shift.employee,
      employeeCode: shift.employeeCode || "",
      requestShift: shift.requestedShift,
      requestedDate: shift.requestedDate
        ? new Date(shift.requestedDate).toISOString().split("T")[0]
        : "",
      requestedTill: shift.requestedTill
        ? new Date(shift.requestedTill).toISOString().split("T")[0]
        : "",
      description: shift.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {
        employee: formData.employee,
        employeeCode: formData.employeeCode,
        requestedShift: formData.requestShift,
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
      };

      const response = await updateWorkTypeRequest(
        editingShift._id,
        updatedData
      );
      
      if (tabValue === 0) {
        setShiftRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === editingShift._id ? response.data : req
          )
        );
      } else {
        setAllocatedShifts((prevRequests) =>
          prevRequests.map((req) =>
            req._id === editingShift._id ? response.data : req
          )
        );
      }
      
      setEditDialogOpen(false);
      setEditingShift(null);
      resetFormData();
      showSnackbar("Work type request updated successfully");
    } catch (error) {
      console.error("Error updating work type request:", error);
      showSnackbar("Error updating work type request", "error");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedAllocations([]);
    setShowSelectionButtons(false);
    setFilterStatus("all");
    setSearchTerm("");
  };

  // Function to render the table based on current tab
  const renderTable = (data) => (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: { xs: 350, sm: 400, md: 450 },
        overflowY: "auto",
        overflowX: "auto",
        mx: 0,
        borderRadius: 2,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        mb: 4,
        "& .MuiTableContainer-root": {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: 8,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
            },
          },
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell
              padding="checkbox"
              sx={{ position: "sticky", left: 0, zIndex: 3 }}
            >
              <Checkbox
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white",
                  },
                }}
                onChange={(e) => {
                  if (e.target.checked) handleSelectAll();
                  else handleUnselectAll();
                }}
                checked={
                  selectedAllocations.length === data.length &&
                  data.length > 0
                }
              />
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 180 }}>Employee</StyledTableCell>
            <StyledTableCell sx={{ minWidth: 150 }}>
              Requested Work Type
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 150 }}>
              Current Work Type
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 130 }}>
              Requested Date
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 130 }}>
              Requested Till
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 100 }}>Status</StyledTableCell>
            <StyledTableCell sx={{ minWidth: 150 }}>
              Description
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 120, textAlign: "center" }}>
              Confirmation
            </StyledTableCell>
            <StyledTableCell sx={{ minWidth: 100, textAlign: "center" }}>
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .filter((request) => {
              const employeeName = request?.employee || "";
              return (
                employeeName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                (filterStatus === "all" || request.status === filterStatus)
              );
            })
            .map((request) => (
              <StyledTableRow
                key={request._id}
                hover
                onClick={() => handleRowClick(request._id)}
                selected={selectedAllocations.includes(request._id)}
                sx={{
                  cursor: "pointer",
                  ...(selectedAllocations.includes(request._id) && {
                    backgroundColor: alpha(theme.palette.primary.light, 0.15),
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.primary.light,
                        0.2
                      ),
                    },
                  }),
                }}
              >
                <TableCell
                  padding="checkbox"
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: selectedAllocations.includes(request._id)
                      ? alpha(theme.palette.primary.light, 0.15)
                      : request._id % 2 === 0
                      ? alpha(theme.palette.primary.light, 0.05)
                      : "inherit",
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.primary.light,
                        0.2
                      ),
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedAllocations.includes(request._id)}
                    onChange={() => handleRowClick(request._id)}
                    sx={{
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor:
                          request._id % 2 === 0
                            ? alpha(theme.palette.primary.main, 0.8)
                            : alpha(theme.palette.secondary.main, 0.8),
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        flexShrink: 0,
                      }}
                    >
                      {request.employee?.[0] || "U"}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {request.employee}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.employeeCode}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {request.requestedShift}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {request.currentWorktype || "Full Time"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(request.requestedDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(request.requestedTill).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                      backgroundColor:
                        request.status === "Approved"
                          ? alpha("#4caf50", 0.1)
                          : request.status === "Rejected"
                          ? alpha("#f44336", 0.1)
                          : alpha("#ff9800", 0.1),
                      color:
                        request.status === "Approved"
                          ? "#2e7d32"
                          : request.status === "Rejected"
                          ? "#d32f2f"
                          : "#e65100",
                    }}
                  >
                    {request.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {request.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      color="success"
                      onClick={(e) => handleApprove(request._id, e)}
                      disabled={request.status === "Approved" || (tabValue === 0 && !isAdmin)}
                      sx={{
                        backgroundColor: alpha("#4caf50", 0.1),
                        "&:hover": {
                          backgroundColor: alpha("#4caf50", 0.2),
                        },
                        "&.Mui-disabled": {
                          backgroundColor: alpha("#e0e0e0", 0.3),
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        ✓
                      </Typography>
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => handleReject(request._id, e)}
                      disabled={request.status === "Rejected" || (tabValue === 0 && !isAdmin)}
                      sx={{
                        backgroundColor: alpha("#f44336", 0.1),
                        "&:hover": {
                          backgroundColor: alpha("#f44336", 0.2),
                        },
                        "&.Mui-disabled": {
                          backgroundColor: alpha("#e0e0e0", 0.3),
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        ✕
                      </Typography>
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(request);
                      }}
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.1
                        ),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                        },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(request, e);
                      }}
                      sx={{
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.error.main,
                            0.2
                          ),
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          {data.filter((request) => {
            const employeeName = request?.employee || "";
            return (
              employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (filterStatus === "all" || request.status === filterStatus)
            );
          }).length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No work type requests found matching your filters.
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  sx={{ mt: 1 }}
                >
                  Clear filters
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
    sx={{
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    }}
  >
    <Box>
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
        Work Type Requests
      </Typography>

  




      <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <SearchTextField
            placeholder="Search Employee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: { xs: 0, sm: "auto" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {tabValue === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  height: { xs: "auto", sm: 50 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  },
                }}
              >
                Create Request
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Box>

    {/* Selection Buttons */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 2,
        mt: { xs: 2, sm: 2 },
      }}
    >
      <Button
        variant="outlined"
        sx={{
          color: "green",
          borderColor: "green",
          width: { xs: "100%", sm: "auto" },
        }}
        onClick={handleSelectAll}
      >
        Select All Requests
      </Button>
      {showSelectionButtons && (
        <>
          <Button
            variant="outlined"
            sx={{
              color: "grey.500",
              borderColor: "grey.500",
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={handleUnselectAll}
          >
            Unselect All
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "maroon",
              borderColor: "maroon",
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {selectedAllocations.length} Selected
          </Button>
        </>
      )}
    </Box>

    {/* Actions Menu */}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      PaperProps={{
        sx: {
          width: { xs: 200, sm: 250 },
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      {(tabValue === 1 || isAdmin) && (
        <>
          <MenuItem onClick={handleBulkApprove} sx={{ py: 1.5 }}>
            Approve Selected
          </MenuItem>
          <MenuItem onClick={handleBulkReject} sx={{ py: 1.5 }}>
            Reject Selected
          </MenuItem>
        </>
      )}
      <MenuItem onClick={handleBulkDeleteClick} sx={{ py: 1.5 }}>
        Delete Selected
      </MenuItem>
    </Menu>

    {/* Status Filter Buttons */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        mb: 2,
      }}
    >
      <Button
        sx={{
          color: "green",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: { xs: "100%", sm: "auto" },
        }}
        onClick={() => setFilterStatus("Approved")}
      >
        ● Approved
      </Button>
      <Button
        sx={{
          color: "red",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: { xs: "100%", sm: "auto" },
        }}
        onClick={() => setFilterStatus("Rejected")}
      >
        ● Rejected
      </Button>
      <Button
        sx={{
          color: "orange",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: { xs: "100%", sm: "auto" },
        }}
        onClick={() => setFilterStatus("Pending")}
      >
        ● Pending
      </Button>
      <Button
        sx={{
          color: "gray",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: { xs: "100%", sm: "auto" },
        }}
        onClick={() => setFilterStatus("all")}
      >
        ● All
      </Button>
    </Box>

    <Divider sx={{ mb: 2 }} />


   


<Tabs
  value={tabValue}
  onChange={handleTabChange}
  sx={{
    mb: 3,
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main,
      height: 3,
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      minWidth: 100,
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
  }}
>
  <Tab label="My Requests" />
  <Tab label="Review" />
</Tabs>


{tabValue === 0 && renderTable(shiftRequests)}
{tabValue === 1 && renderTable(allocatedShifts)}



    {/* Delete confirmation dialog */}
    <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
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
        <Delete />
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
          {deleteType === "bulk"
            ? `Are you sure you want to delete ${itemToDelete?.count} selected requests?`
            : "Are you sure you want to delete this work type request?"}
        </Alert>
        {itemToDelete && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            {deleteType === "bulk" ? (
              <>
                <Typography variant="body1" fontWeight={600} color="#2c3e50">
                  Bulk Deletion
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  You are about to delete {itemToDelete.count} requests. This
                  action cannot be undone.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body1" fontWeight={600} color="#2c3e50">
                  Work Type Request Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: "#fff",
                    borderRadius: 1,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <strong>Employee:</strong> {itemToDelete.employee} (
                  {itemToDelete.employeeCode})<br />
                  <strong>Requested Work Type:</strong>{" "}
                  {itemToDelete.requestedShift}
                  <br />
                  <strong>Date Range:</strong>{" "}
                  {new Date(itemToDelete.requestedDate).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(itemToDelete.requestedTill).toLocaleDateString()}
                  <br />
                  <strong>Status:</strong> {itemToDelete.status}
                </Typography>
              </>
            )}
          </Box>
        )}
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
          onClick={handleCloseDeleteDialog}
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
          onClick={handleConfirmDelete}
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

    {/* Create Dialog */}
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      fullScreen={window.innerWidth < 600}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "600px" },
          maxWidth: "100%",
          borderRadius: { xs: 0, sm: "20px" },
          margin: { xs: 0, sm: 2 },
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
        Create Work Type Request
      </DialogTitle>

      <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
        {loadingProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : profileError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {profileError}
          </Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Display current user's profile info */}
            {currentUserProfile && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Your Employee Details
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography variant="body2">
                    <strong>Name:</strong> {formData.employee}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Employee Code:</strong> {formData.employeeCode}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Department:</strong>{" "}
                    {currentUserProfile.joiningDetails?.department ||
                      "Not Assigned"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Current Work Type:</strong>{" "}
                    {currentUserProfile.joiningDetails?.workType ||
                      "Full Time"}
                  </Typography>
                </Box>
                </Paper>
              )}

              <TextField
                label="Request Work Type"
                name="requestWorktype"
                value={formData.requestWorktype}
                onChange={handleFormChange}
                fullWidth
                select
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
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
              </TextField>

              <TextField
                label="Requested Date"
                name="requestedDate"
                type="date"
                value={formData.requestedDate}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
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
                label="Requested Till"
                name="requestedTill"
                type="date"
                value={formData.requestedTill}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
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
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
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

              <FormControlLabel
                control={
                  <Switch
                    checked={isPermanentRequest}
                    onChange={(e) => setIsPermanentRequest(e.target.checked)}
                  />
                }
                label="Permanent Request"
              />
            </Box>
          )}
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
            onClick={() => {
              setCreateDialogOpen(false);
              resetFormData();
            }}
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
            onClick={handleCreateShift}
            variant="contained"
            disabled={
              loadingProfile ||
              !!profileError ||
              !formData.requestWorktype ||
              !formData.requestedDate ||
              !formData.requestedTill
            }
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
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
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
          Edit Work Type Request
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                label="Employee Name"
                name="employee"
                fullWidth
                value={formData.employee}
                onChange={handleFormChange}
                sx={{
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
                label="Employee ID"
                name="employeeCode"
                fullWidth
                value={formData.employeeCode || ""}
                onChange={handleFormChange}
                sx={{
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
            </Box>

            <TextField
              label="Request Work Type"
              name="requestShift"
              value={formData.requestShift}
              onChange={handleFormChange}
              fullWidth
              select
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </TextField>

            <TextField
              label="Requested Date"
              name="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={4}
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
            onClick={() => setEditDialogOpen(false)}
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
            onClick={handleSaveEdit}
            variant="contained"
            disabled={
              !formData.employee ||
              !formData.requestShift ||
              !formData.requestedDate
            }
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
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorkTypeRequest;



