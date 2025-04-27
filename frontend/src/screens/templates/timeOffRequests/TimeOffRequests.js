// import React, { useState, useEffect } from "react";
// import { styled } from "@mui/material/styles";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputAdornment,
//   MenuItem,
//   Grid,
//   Chip,
//   Divider,
//   Tooltip,
//   Alert,
//   Snackbar,
//   Container,
//   Card,
//   CardContent,
//   Stack,
//   useMediaQuery,
//   useTheme,
//   Fade,
//   CircularProgress,
// } from "@mui/material";
// import {
  
//   Search,
//   Visibility,
//   Close,
//   Edit,
//   Delete,
//   Add,
//   AccessTime,
// } from "@mui/icons-material";

// // Add this near the top of your file, after the imports
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   borderRadius: theme.spacing(1),
//   boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
//   [theme.breakpoints.down("sm")]: {
//     padding: theme.spacing(2),
//   },
// }));

// const TimeOffRequests = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   // Add these state variables for delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const statusOptions = ["Pending", "Approved", "Rejected", "All"];
//   const shiftOptions = ["Morning", "Evening", "Night"];
//   const workTypeOptions = ["On-Site", "Remote", "Hybrid"];

//   const initialFormState = {
//     name: "",
//     empId: "",
//     date: "",
//     day: "",
//     checkIn: "",
//     checkOut: "",
//     shift: "",
//     workType: "",
//     minHour: "",
//     atWork: "",
//     overtime: "",
//     comment: "",
//     status: "Pending",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   useEffect(() => {
//     fetchRequests();
//   }, [searchTerm, filterStatus]);

//   const fetchRequests = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/time-off-requests?searchTerm=${searchTerm}&status=${filterStatus}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch requests");
//       const data = await response.json();
//       setRequests(data);
//     } catch (error) {
//       showSnackbar("Error fetching requests", "error");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // const handleFilterChange = (e) => {
//   //   const value = e.target.value;
//   //   setFilterStatus(value);
//   // };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCreateNew = () => {
//     setFormData(initialFormState);
//     setEditMode(false);
//     setCreateOpen(true);
//   };
//   const handleSave = async () => {
//     try {
//       const requiredFields = [
//         "name",
//         "empId",
//         "date",
//         "day",
//         "checkIn",
//         "checkOut",
//         "shift",
//         "workType",
//         "minHour",
//         "atWork",
//       ];
//       const missingFields = requiredFields.filter((field) => !formData[field]);

//       if (missingFields.length > 0) {
//         throw new Error(`Required fields missing: ${missingFields.join(", ")}`);
//       }

//       const formattedData = {
//         ...formData,
//         minHour: Number(formData.minHour),
//         atWork: Number(formData.atWork),
//         overtime: Number(formData.overtime) || 0,
//         date: new Date(formData.date).toISOString(),
//       };

//       const url = editMode
//         ? `http://localhost:5000/api/time-off-requests/${selectedRequest._id}`
//         : "http://localhost:5000/api/time-off-requests";

//       const response = await fetch(url, {
//         method: editMode ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formattedData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       showSnackbar(
//         editMode
//           ? "Request updated successfully"
//           : "Request created successfully"
//       );
//       fetchRequests();
//       setCreateOpen(false);
//       setFormData(initialFormState);
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };

//   const handleEdit = (request) => {
//     setSelectedRequest(request);
//     setFormData(request);
//     setEditMode(true);
//     setCreateOpen(true);
//   };

//   // Replace the existing handleDelete function with these functions
//   const handleDeleteClick = (request) => {
//     setItemToDelete(request);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/time-off-requests/${itemToDelete._id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete request");

//       showSnackbar("Request deleted successfully");
//       fetchRequests();
//       setDeleteDialogOpen(false);
//       setItemToDelete(null);
//     } catch (error) {
//       showSnackbar("Error deleting request", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handlePreview = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/time-off-requests/${id}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch request details");
//       const data = await response.json();
//       setSelectedRequest(data);
//       setPreviewOpen(true);
//     } catch (error) {
//       showSnackbar("Error fetching request details", "error");
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       Pending: "warning",
//       Approved: "success",
//       Rejected: "error",
//     };
//     return colors[status] || "default";
//   };

//   // Render mobile card view for requests
//   const renderRequestCard = (request) => (
//     <Card
//       sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
//       key={request._id}
//     >
//       <CardContent sx={{ p: 2 }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 1,
//           }}
//         >
//           <Box>
//             <Typography variant="subtitle1" fontWeight={600}>
//               {request.name}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {request.empId}
//             </Typography>
//           </Box>
//           <Chip
//             label={request.status}
//             color={getStatusColor(request.status)}
//             size="small"
//             sx={{ fontWeight: 500 }}
//           />
//         </Box>

//         <Divider sx={{ my: 1.5 }} />

//         <Stack spacing={1.5}>
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2" color="text.secondary">
//               Date:
//             </Typography>
//             <Typography variant="body2" fontWeight={500}>
//               {new Date(request.date).toLocaleDateString()} ({request.day})
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2" color="text.secondary">
//               Check In/Out:
//             </Typography>
//             <Typography variant="body2" fontWeight={500}>
//               {request.checkIn} - {request.checkOut}
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2" color="text.secondary">
//               Shift:
//             </Typography>
//             <Chip
//               label={request.shift}
//               size="small"
//               sx={{
//                 backgroundColor: "grey.100",
//                 color: "grey.800",
//                 fontWeight: 500,
//                 height: "22px",
//               }}
//             />
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2" color="text.secondary">
//               Work Type:
//             </Typography>
//             <Chip
//               label={request.workType}
//               size="small"
//               sx={{
//                 backgroundColor: "grey.50",
//                 color: "grey.700",
//                 fontWeight: 500,
//                 height: "22px",
//               }}
//             />
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2" color="text.secondary">
//               Hours:
//             </Typography>
//             <Typography variant="body2" fontWeight={500}>
//               Min: {request.minHour}h | At Work: {request.atWork}h | OT: +
//               {request.overtime}h
//             </Typography>
//           </Box>
//         </Stack>

//         <Box
//           sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
//         >
//           <Tooltip title="View Details" arrow>
//             <IconButton
//               color="primary"
//               onClick={() => handlePreview(request._id)}
//               size="small"
//               sx={{
//                 backgroundColor: "primary.lighter",
//                 "&:hover": { backgroundColor: "primary.light" },
//               }}
//             >
//               <Visibility fontSize="small" />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Edit" arrow>
//             <IconButton
//               color="info"
//               onClick={() => handleEdit(request)}
//               size="small"
//               sx={{
//                 backgroundColor: "info.lighter",
//                 "&:hover": { backgroundColor: "info.light" },
//               }}
//             >
//               <Edit fontSize="small" />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Delete" arrow>
//             <IconButton
//               color="error"
//               onClick={() => handleDeleteClick(request)}
//               size="small"
//             >
//               <Delete fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
//       <Box
//         sx={{
//           p: { xs: 2, sm: 3, md: 4 },
//           backgroundColor: "#f5f5f5",
//           minHeight: "100vh",
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h4"
//             sx={{
//               mb: { xs: 2, sm: 3, md: 4 },
//               color: theme.palette.primary.main,
//               fontWeight: 600,
//               letterSpacing: 0.5,
//               fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
//             }}
//           >
//             Time Off Requests
//           </Typography>

//           <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
//             <Box
//               display="flex"
//               flexDirection={{ xs: "column", sm: "row" }}
//               alignItems={{ xs: "flex-start", sm: "center" }}
//               gap={2}
//               sx={{
//                 width: "100%",
//                 justifyContent: "space-between",
//               }}
//             >
//               <TextField
//                 placeholder="Search by name or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 size="small"
//                 sx={{
//                   width: { xs: "100%", sm: "300px" },
//                   marginRight: { xs: 0, sm: "auto" },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search color="primary" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   gap: { xs: 1, sm: 1 },
//                   width: { xs: "100%", sm: "auto" },
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   startIcon={<Add />}
//                   onClick={handleCreateNew}
//                   sx={{
//                     height: { xs: "auto", sm: 50 },
//                     padding: { xs: "8px 16px", sm: "6px 16px" },
//                     width: { xs: "100%", sm: "auto" },
//                     background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//                     color: "white",
//                     "&:hover": {
//                       background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
//                     },
//                   }}
//                 >
//                   Create Request
//                 </Button>
//               </Box>
//             </Box>
//           </StyledPaper>

//           {/* Status Filter Buttons */}
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               gap: 1,
//               mb: 2,
//               mt: 2,
//             }}
//           >
//             <Button
//               sx={{
//                 color: "green",
//                 justifyContent: { xs: "flex-start", sm: "center" },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={() => setFilterStatus("Approved")}
//             >
//               ● Approved
//             </Button>
//             <Button
//               sx={{
//                 color: "red",
//                 justifyContent: { xs: "flex-start", sm: "center" },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={() => setFilterStatus("Rejected")}
//             >
//               ● Rejected
//             </Button>
//             <Button
//               sx={{
//                 color: "orange",
//                 justifyContent: { xs: "flex-start", sm: "center" },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={() => setFilterStatus("Pending")}
//             >
//               ● Pending
//             </Button>
//             <Button
//               sx={{
//                 color: "gray",
//                 justifyContent: { xs: "flex-start", sm: "center" },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//               onClick={() => setFilterStatus("all")}
//             >
//               ● All
//             </Button>
//           </Box>

//           <Divider sx={{ mb: 2 }} />
//         </Box>

//         <Box
//           sx={{ p: isMobile ? 2 : 3, backgroundColor: "background.default" }}
//         >
//           {isMobile ? (
//             // Mobile view - card layout
//             <Stack spacing={2}>
//               {requests.length > 0 ? (
//                 requests.map((request) => renderRequestCard(request))
//               ) : (
//                 <Box sx={{ textAlign: "center", py: 4 }}>
//                   <Typography variant="body1" color="text.secondary">
//                     No requests found
//                   </Typography>
//                 </Box>
//               )}
//             </Stack>
//           ) : (
//             // Desktop/Tablet view - table layout
//             <TableContainer
//               component={Paper}
//               elevation={3}
//               sx={{
//                 maxHeight: "65vh",
//                 borderRadius: 2,
//                 "& .MuiTableCell-root": {
//                   borderColor: "divider",
//                 },
//               }}
//             >
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Employee
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Date
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Check In/Out
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Shift
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Work Type
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Hours
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Status
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontWeight: 600,
//                         backgroundColor: "#1976d2",
//                         color: "white",
//                       }}
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {requests.length > 0 ? (
//                     requests.map((request) => (
//                       <TableRow key={request._id}>
//                         <TableCell>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500}>
//                               {request.name}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                             >
//                               {request.empId}
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Box>
//                             <Typography variant="body2">
//                               {new Date(request.date).toLocaleDateString()}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                             >
//                               {request.day}
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           {request.checkIn} - {request.checkOut}
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={request.shift}
//                             size="small"
//                             sx={{
//                               backgroundColor: "grey.100",
//                               color: "grey.800",
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={request.workType}
//                             size="small"
//                             sx={{
//                               backgroundColor: "grey.50",
//                               color: "grey.700",
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Box>
//                             <Typography variant="body2">
//                               Min: {request.minHour}h | At Work:{" "}
//                               {request.atWork}h
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                             >
//                               Overtime: +{request.overtime}h
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={request.status}
//                             color={getStatusColor(request.status)}
//                             size="small"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ display: "flex", gap: 1 }}>
//                             <Tooltip title="View Details" arrow>
//                               <IconButton
//                                 color="primary"
//                                 onClick={() => handlePreview(request._id)}
//                                 size="small"
//                               >
//                                 <Visibility fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Edit" arrow>
//                               <IconButton
//                                 color="info"
//                                 onClick={() => handleEdit(request)}
//                                 size="small"
//                               >
//                                 <Edit fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                             {/* <Tooltip title="Delete" arrow>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleDelete(request._id)}
//                                 size="small"
//                               >
//                                 <Delete fontSize="small" />
//                               </IconButton>
//                             </Tooltip> */}
//                             <Tooltip title="Delete" arrow>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleDeleteClick(request)}
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: "error.lighter",
//                                   "&:hover": { backgroundColor: "error.light" },
//                                 }}
//                               >
//                                 <Delete fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
//                         <Typography variant="body1" color="text.secondary">
//                           No requests found
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Box>
//       </Box>

//       {/* Preview Dialog */}
//       <Dialog
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         fullScreen={isMobile}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6">Time Off Request Details</Typography>
//           <IconButton
//             onClick={() => setPreviewOpen(false)}
//             sx={{ color: "white" }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
//           {selectedRequest && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Employee Name
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.name}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Employee ID
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.empId}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Date
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {new Date(selectedRequest.date).toLocaleDateString()}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Day
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.day}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Check In
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.checkIn}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Check Out
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.checkOut}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Shift
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.shift}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Work Type
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.workType}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Minimum Hours
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.minHour} hours
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   At Work
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.atWork} hours
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Overtime
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   {selectedRequest.overtime} hours
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Status
//                 </Typography>
//                 <Chip
//                   label={selectedRequest.status}
//                   color={getStatusColor(selectedRequest.status)}
//                   sx={{ mt: 1 }}
//                 />
//               </Grid>
//               {selectedRequest.comment && (
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Comment
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     {selectedRequest.comment}
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>
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
//             onClick={() => setPreviewOpen(false)}
//             variant="outlined"
//             color="primary"
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
//             Close
//           </Button>
//           {selectedRequest && (
//             <Button
//               onClick={() => {
//                 setPreviewOpen(false);
//                 handleEdit(selectedRequest);
//               }}
//               variant="contained"
//               color="primary"
//               sx={{
//                 background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//                 fontSize: "0.95rem",
//                 textTransform: "none",
//                 padding: "8px 32px",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
//                 color: "white",
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #1565c0, #42a5f5)",
//                 },
//               }}
//               startIcon={<Edit />}
//             >
//               Edit
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* Create/Edit Dialog */}

//       {/* Create/Edit Dialog */}
//       <Dialog
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         fullScreen={window.innerWidth < 600} // Full screen on mobile
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
//           {editMode ? "Edit Time Off Request" : "Create Time Off Request"}
//         </DialogTitle>

//         <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Employee Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#1976d2",
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Employee ID"
//                   name="empId"
//                   value={formData.empId}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Date"
//                   name="date"
//                   type="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   InputLabelProps={{ shrink: true }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Day"
//                   name="day"
//                   value={formData.day}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   placeholder="e.g. Monday"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Check In"
//                   name="checkIn"
//                   value={formData.checkIn}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   placeholder="e.g. 09:00 AM"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <AccessTime fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Check Out"
//                   name="checkOut"
//                   value={formData.checkOut}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   placeholder="e.g. 05:00 PM"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <AccessTime fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Shift"
//                   name="shift"
//                   value={formData.shift}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 >
//                   {shiftOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Work Type"
//                   name="workType"
//                   value={formData.workType}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 >
//                   {workTypeOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Minimum Hours"
//                   name="minHour"
//                   type="number"
//                   value={formData.minHour}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">hours</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="At Work"
//                   name="atWork"
//                   type="number"
//                   value={formData.atWork}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">hours</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Overtime"
//                   name="overtime"
//                   type="number"
//                   value={formData.overtime}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">hours</InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Comment"
//                   name="comment"
//                   value={formData.comment}
//                   onChange={handleInputChange}
//                   fullWidth
//                   multiline
//                   rows={4}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#1976d2",
//                       },
//                     },
//                   }}
//                 />
//               </Grid>
//               {editMode && (
//                 <Grid item xs={12}>
//                   <TextField
//                     select
//                     label="Status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     fullWidth
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         backgroundColor: "white",
//                         borderRadius: "12px",
//                         "&:hover fieldset": {
//                           borderColor: "#1976d2",
//                         },
//                       },
//                     }}
//                   >
//                     {statusOptions
//                       .filter((option) => option !== "All")
//                       .map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                   </TextField>
//                 </Grid>
//               )}
//             </Grid>
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
//             onClick={() => setCreateOpen(false)}
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
//             onClick={handleSave}
//             variant="contained"
//             disabled={
//               !formData.name ||
//               !formData.empId ||
//               !formData.date ||
//               !formData.checkIn
//             }
//             sx={{
//               background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//               fontSize: "0.95rem",
//               textTransform: "none",
//               padding: "8px 32px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
//               color: "white",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #1565c0, #42a5f5)",
//               },
//             }}
//           >
//             {editMode ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
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
//         TransitionComponent={Fade}
//         TransitionProps={{
//           timeout: 300,
//         }}
//         sx={{
//           "& .MuiDialog-container": {
//             justifyContent: "center",
//             alignItems: "center",
//             "& .MuiPaper-root": {
//               margin: { xs: "16px", sm: "32px" },
//               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
//             },
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
//           <Delete color="white" />
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
//             Are you sure you want to delete this time off request? This action
//             cannot be undone.
//           </Alert>
//           {itemToDelete && (
//             <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
//               <Typography variant="body1" fontWeight={600} color="#2c3e50">
//                 Employee: {itemToDelete.name}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Employee ID: {itemToDelete.empId}
//               </Typography>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   Date: {new Date(itemToDelete.date).toLocaleDateString()}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Day: {itemToDelete.day}
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   Check In: {itemToDelete.checkIn}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Check Out: {itemToDelete.checkOut}
//                 </Typography>
//               </Box>
//               <Box sx={{ mt: 1 }}>
//                 <Chip
//                   label={itemToDelete.status}
//                   color={getStatusColor(itemToDelete.status)}
//                   size="small"
//                   sx={{ mr: 1 }}
//                 />
//                 <Chip
//                   label={itemToDelete.shift}
//                   size="small"
//                   sx={{
//                     backgroundColor: "grey.100",
//                     color: "grey.800",
//                     mr: 1,
//                   }}
//                 />
//                 <Chip
//                   label={itemToDelete.workType}
//                   size="small"
//                   sx={{
//                     backgroundColor: "grey.50",
//                     color: "grey.700",
//                   }}
//                 />
//               </Box>
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

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default TimeOffRequests;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  Container,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Search,
  Visibility,
  Close,
  Edit,
  Delete,
  Add,
  AccessTime,
} from "@mui/icons-material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useNotifications } from "../../../context/NotificationContext";

const TimeOffRequests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  // Current user state
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const employeeId = localStorage.getItem('employeeId');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const initialFormState = {
    name: "",
    empId: "",
    userId: userId,
    date: new Date(),
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    checkIn: "09:00",
    checkOut: "18:00",
    shift: "Morning",
    workType: "On-Site",
    minHour: "8",
    atWork: "8",
    overtime: "0",
    comment: "",
    status: "Pending",
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const { addNotification } = useNotifications();

  const shiftOptions = ["Morning", "Evening", "Night"];
  const workTypeOptions = ["On-Site", "Remote", "Hybrid"];
  const statusOptions = ["Pending", "Approved", "Rejected", "All"];

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/employees/by-user/${userId}`);
        if (response.data.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showSnackbar('Error fetching user data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, filterStatus, userId]);

  const fetchRequests = async () => {
    try {
      if (!userId) {
        setRequests([]);
        return;
      }
      
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/time-off-requests/by-user/${userId}?searchTerm=${searchTerm}&status=${filterStatus}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showSnackbar("Error fetching requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    setFormData({
      ...formData,
      date,
      day,
    });
  };

  const handlePreview = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/time-off-requests/${id}`
      );
      setSelectedRequest(response.data);
      setPreviewOpen(true);
    } catch (error) {
      showSnackbar("Error fetching request details", "error");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/time-off-requests/${id}`
      );
      const requestData = response.data;
      
      setFormData({
        ...requestData,
        date: new Date(requestData.date),
      });
      
      setEditMode(true);
      setSelectedRequest(requestData);
      setCreateOpen(true);
    } catch (error) {
      showSnackbar("Error fetching request details", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/time-off-requests/${selectedRequest._id}`
      );
      showSnackbar("Request deleted successfully");
      fetchRequests();
      setDeleteOpen(false);
    } catch (error) {
      showSnackbar("Error deleting request", "error");
    }
  };

  const handleCreateNew = () => {
    // Pre-fill the form with current user data if available
    if (currentUser && currentUser.personalInfo) {
      setFormData({
        ...initialFormState,
        name: `${currentUser.personalInfo.firstName || ''} ${currentUser.personalInfo.lastName || ''}`.trim(),
        empId: currentUser.Emp_ID || employeeId || '',
        userId: userId
      });
    } else {
      setFormData({
        ...initialFormState,
        userId: userId
      });
    }
    setEditMode(false);
    setCreateOpen(true);
  };

  const handleSave = async () => {
    try {
      const requiredFields = [
        "name",
        "empId",
        "date",
        "day",
        "checkIn",
        "checkOut",
        "shift",
        "workType",
        "minHour",
        "atWork",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(", ")}`);
      }

      // Add userId to the form data
      const formattedData = {
        ...formData,
        userId: userId, // Add the current user's ID
        minHour: Number(formData.minHour),
        atWork: Number(formData.atWork),
        overtime: Number(formData.overtime) || 0,
        date: new Date(formData.date).toISOString(),
      };

      const url = editMode
        ? `http://localhost:5000/api/time-off-requests/${selectedRequest._id}`
        : "http://localhost:5000/api/time-off-requests";

      const response = await axios({
        method: editMode ? "PUT" : "POST",
        url,
        data: formattedData
      });

      showSnackbar(
        editMode
          ? "Request updated successfully"
          : "Request created successfully"
      );
      fetchRequests();
      setCreateOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Approved: "success",
      Rejected: "error",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Time Off Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your time off requests and view their status
        </Typography>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchRequests}
                  startIcon={<AccessTime />}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateNew}
                  startIcon={<Add />}
                >
                  New Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {requests.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Shift</TableCell>
                    <TableCell sx={{ color: 'white' }}>Work Type</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(request.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.day}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatTime(request.checkIn)} - {formatTime(request.checkOut)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.shift}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.workType}
                          size="small"
                          sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(request._id)}
                              color="info"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {request.status === "Pending" && (
                            <>
                              <Tooltip title="Edit Request">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(request._id)}
                                  color="primary"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Request">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setDeleteOpen(true);
                                  }}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
            </TableContainer>
          ) : (
            <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No time off requests found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You haven't created any time off requests yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateNew}
                  startIcon={<Add />}
                  sx={{ mt: 3 }}
                >
                  Create New Request
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editMode ? "Edit Time Off Request" : "Create New Time Off Request"}
          </Typography>
          <IconButton onClick={() => setCreateOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={!!currentUser} // Disable if current user data is available
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                required
                disabled={!!currentUser} // Disable if current user data is available
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Day"
                name="day"
                value={formData.day}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check In Time"
                name="checkIn"
                type="time"
                value={formData.checkIn}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check Out Time"
                name="checkOut"
                type="time"
                value={formData.checkOut}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Shift</InputLabel>
                <Select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  label="Shift"
                  required
                >
                  {shiftOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Work Type</InputLabel>
                <Select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  label="Work Type"
                  required
                >
                  {workTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Minimum Hours"
                name="minHour"
                type="number"
                value={formData.minHour}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="At Work Hours"
                name="atWork"
                type="number"
                value={formData.atWork}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Overtime Hours"
                name="overtime"
                type="number"
                value={formData.overtime}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Add any additional information about your time off request"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editMode ? "Update Request" : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Time Off Request Details</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Employee Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">{selectedRequest.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Employee ID
                        </Typography>
                        <Typography variant="body1">{selectedRequest.empId}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedRequest.status}
                          color={getStatusColor(selectedRequest.status)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Time Off Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedRequest.date)} ({selectedRequest.day})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1">
                          {formatTime(selectedRequest.checkIn)} - {formatTime(selectedRequest.checkOut)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Shift & Work Type
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={selectedRequest.shift}
                            size="small"
                            sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                          />
                          <Chip
                            label={selectedRequest.workType}
                            size="small"
                            sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Additional Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Minimum Hours
                        </Typography>
                        <Typography variant="body1">{selectedRequest.minHour} hours</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          At Work
                        </Typography>
                        <Typography variant="body1">{selectedRequest.atWork} hours</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Overtime
                        </Typography>
                        <Typography variant="body1">{selectedRequest.overtime || 0} hours</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Comment
                        </Typography>
                        <Typography variant="body1">
                          {selectedRequest.comment || "No comment provided"}
                        </Typography>
                      </Grid>
                      {selectedRequest.reviewComment && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Review Comment
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.reviewComment}
                          </Typography>
                        </Grid>
                      )}
                      {selectedRequest.reviewedBy && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Reviewed By
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.reviewedBy}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {selectedRequest && selectedRequest.status === "Pending" && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setPreviewOpen(false);
                handleEdit(selectedRequest._id);
              }}
            >
              Edit Request
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this time off request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeOffRequests;

