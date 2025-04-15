// import React, { useState, useEffect } from "react";
// import { FaList, FaTh, FaEnvelope } from "react-icons/fa";
// import ReactQuill from "react-quill";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import {
//   Box,
//   Stack,
//   TextField,
//   ButtonGroup,
//   IconButton,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Grid,
//   Card,
//   CardHeader,
//   CardContent,
//   CardActions,
//   Chip,
//   Select,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   FormControl,
//   InputLabel,
//   Popover,
//   Avatar,
// } from "@mui/material";
// import {
//   Search,
//   FilterList,
//   Add,
//   Edit,
//   Delete,
//   Email,
//   WorkOutline,
//   EmailOutlined,
//   Visibility,
// } from "@mui/icons-material";

// import { LoadingButton } from "@mui/lab";
// import { Close } from "@mui/icons-material";

// import "./ResignationPage.css";

// const ResignationPage = () => {
//   const [isSaving, setIsSaving] = useState(false);
//   const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewData, setPreviewData] = useState(null);

//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchResignations();
//   }, []);

//   const fetchResignations = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "http://localhost:5000/api/resignations"
//       );
//       setData(response.data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch resignations");
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [showCreatePopup, setShowCreatePopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentId, setCurrentId] = useState(null);
//   const [newResignation, setNewResignation] = useState({
//     name: "",
//     email: "",
//     title: "",
//     status: "Requested",
//     description: "",
//   });

//   const handleEditClick = (res) => {
//     setShowCreatePopup(true);
//     setIsEditing(true);
//     setCurrentId(res._id);
//     setNewResignation({
//       name: res.name,
//       email: res.email,
//       title: res.position,
//       status: res.status,
//       description: res.description,
//     });
//   };

//   const handleDeleteClick = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/resignations/${id}`);
//       await fetchResignations();
//     } catch (error) {
//       console.error("Error deleting resignation:", error);
//       setError("Failed to delete resignation");
//     }
//   };

//   const handleCreateClick = () => {
//     setShowCreatePopup(true);
//     setIsEditing(false);
//     setNewResignation({
//       name: "",
//       email: "",
//       title: "",
//       status: "Requested",
//       description: "",
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewResignation((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDescriptionChange = (content) => {
//     setNewResignation((prev) => ({ ...prev, description: content }));
//   };

//   const handleClosePopup = () => {
//     setShowCreatePopup(false);
//     setIsEditing(false);
//     setCurrentId(null);
//     setNewResignation({
//       name: "",
//       email: "",
//       title: "",
//       status: "Requested",
//       description: "",
//     });
//   };


//   const handleSendEmail = async (employee) => {
//     try {
//       await axios.post("http://localhost:5000/api/resignations/email", {
//         name: employee.name,
//         email: employee.email,
//         position: employee.position,
//         status: employee.status,
//         description: employee.description,
//       });
//       alert(`Resignation email sent successfully to ${employee.email}`);
//     } catch (error) {
//       console.error("Error sending email:", error);
//       setError("Failed to send email");
//     }
//   };
  

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleViewChange = (mode) => {
//     setViewMode(mode);
//   };

//   const applyFilter = (status) => {
//     setSelectedStatus(status);
//     setFilterOpen(false);
//   };

//   const filteredData = data.filter((item) => {
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = selectedStatus
//       ? item.status === selectedStatus
//       : true;
//     return matchesSearch && matchesStatus;
//   });

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   const handleSave = async () => {
//     if (isSaving) return;

//     try {
//       setIsSaving(true);
//       const resignationData = {
//         name: newResignation.name,
//         email: newResignation.email,
//         position: newResignation.title,
//         status: newResignation.status,
//         description: newResignation.description,
//       };

//       if (isEditing) {
//         await axios.put(
//           `http://localhost:5000/api/resignations/${currentId}`,
//           resignationData
//         );
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/resignations",
//           resignationData
//         );
//       }

//       await fetchResignations();
//       handleClosePopup();
//     } catch (error) {
//       console.error("Error saving resignation:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const toggleFilter = (event) => {
//     setFilterAnchorEl(event.currentTarget);
//     setFilterOpen(!filterOpen);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchorEl(null);
//     setFilterOpen(false);
//   };

//   const handlePreview = (item) => {
//     setPreviewData(item);
//     setPreviewOpen(true);
//   };

//   return (
//     <div className="resignation-letters">
//       <Box
//         sx={{
//           backgroundColor: "white",
//           borderRadius: "12px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           padding: "24px 32px",
//           marginBottom: "24px",
//         }}
//       >
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 600,
//               // background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
//               background: "#1976d2",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Resignations
//           </Typography>

//           <Stack direction="row" spacing={2} alignItems="center">
//             <TextField
//               placeholder="Search by name or email"
//               value={searchTerm}
//               onChange={handleSearch}
//               size="small"
//               sx={{
//                 width: "300px",
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "#f8fafc",
//                   borderRadius: "8px",
//                   "&:hover fieldset": {
//                     borderColor: "#1976d2",
//                   },
//                 },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <Search sx={{ color: "action.active", mr: 1 }} />
//                 ),
//               }}
//             />

//             <ButtonGroup variant="outlined" sx={{ height: "40px" }}>
//               <IconButton
//                 onClick={() => handleViewChange("list")}
//                 sx={{
//                   color: viewMode === "list" ? "#1976d2" : "#64748b",
//                   borderColor: "#1976d2",
//                   "&:hover": { backgroundColor: "#e3f2fd" },
//                 }}
//               >
//                 <FaList />
//               </IconButton>
//               <IconButton
//                 onClick={() => handleViewChange("grid")}
//                 sx={{
//                   color: viewMode === "grid" ? "#1976d2" : "#64748b",
//                   borderColor: "#1976d2",
//                   "&:hover": { backgroundColor: "#e3f2fd" },
//                 }}
//               >
//                 <FaTh />
//               </IconButton>
//             </ButtonGroup>

//             <Button
//               onClick={toggleFilter}
//               startIcon={<FilterList />}
//               sx={{
//                 borderColor: "#1976d2",
//                 color: "#1976d2",
//                 "&:hover": {
//                   borderColor: "#1565c0",
//                   backgroundColor: "#e3f2fd",
//                 },
//                 textTransform: "none",
//                 borderRadius: "8px",
//                 height: "40px",
//               }}
//               variant="outlined"
//             >
//               Filter
//             </Button>

//             <Button
//               onClick={handleCreateClick}
//               startIcon={<Add />}
//               sx={{
//                 background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//                 color: "white",
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #1565c0, #42a5f5)",
//                 },
//                 textTransform: "none",
//                 borderRadius: "8px",
//                 height: "40px",
//                 boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
//               }}
//               variant="contained"
//             >
//               Create
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>

//       {/*** Filter Popup ***/}

//       <Popover
//         open={filterOpen}
//         anchorEl={filterAnchorEl}
//         onClose={handleFilterClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         PaperProps={{
//           sx: {
//             width: "400px",
//             borderRadius: "16px",
//             mt: 1,
//             overflow: "hidden",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//             p: 3,
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
//             Filter Resignations
//           </Typography>
//         </Box>

//         <Box sx={{ p: 3 }}>
//           <Stack spacing={2}>
//             <Button
//               onClick={() => applyFilter("")}
//               variant={selectedStatus === "" ? "contained" : "outlined"}
//               fullWidth
//               sx={{
//                 borderRadius: "8px",
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               All
//             </Button>
//             <Button
//               onClick={() => applyFilter("Approved")}
//               variant={selectedStatus === "Approved" ? "contained" : "outlined"}
//               fullWidth
//               sx={{
//                 borderRadius: "8px",
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               Approved
//             </Button>
//             <Button
//               onClick={() => applyFilter("Requested")}
//               variant={
//                 selectedStatus === "Requested" ? "contained" : "outlined"
//               }
//               fullWidth
//               sx={{
//                 borderRadius: "8px",
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               Requested
//             </Button>
//             <Button
//               onClick={() => applyFilter("Rejected")}
//               variant={selectedStatus === "Rejected" ? "contained" : "outlined"}
//               fullWidth
//               sx={{
//                 borderRadius: "8px",
//                 textTransform: "none",
//                 fontWeight: 500,
//               }}
//             >
//               Rejected
//             </Button>
//           </Stack>
//         </Box>
//       </Popover>

//       {/* Create Resignation Popup */}

//       <Dialog
//         open={showCreatePopup}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             width: "700px",
//             maxWidth: "90vw",
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
//             position: "relative",
//           }}
//         >
//           {isEditing ? "Edit Resignation" : "Create Resignation"}
//           <IconButton
//             onClick={handleClosePopup}
//             sx={{
//               position: "absolute",
//               right: 16,
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "white",
//             }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ padding: "32px" }}>
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             <TextField
//               label="Name"
//               name="name"
//               value={newResignation.name}
//               onChange={handleInputChange}
//               required
//               fullWidth
//             />

//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={newResignation.email}
//               onChange={handleInputChange}
//               required
//               fullWidth
//             />

//             <TextField
//               label="Position"
//               name="title"
//               value={newResignation.title}
//               onChange={handleInputChange}
//               required
//               fullWidth
//             />

//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 name="status"
//                 value={newResignation.status}
//                 onChange={handleInputChange}
//                 label="Status"
//               >
//                 <MenuItem value="Requested">Requested</MenuItem>
//                 <MenuItem value="Approved">Approved</MenuItem>
//                 <MenuItem value="Rejected">Rejected</MenuItem>
//               </Select>
//             </FormControl>

//             <Box
//               sx={{
//                 "& .quill": {
//                   height: "200px",
//                   marginBottom: "60px", // Add margin to create space for buttons
//                 },
//                 "& .ql-container": {
//                   minHeight: "150px",
//                 },
//               }}
//             >
//               <Typography sx={{ mb: 1, color: "#475569" }}>
//                 Resignation Letter
//               </Typography>
//               <ReactQuill
//                 theme="snow"
//                 value={newResignation.description}
//                 onChange={handleDescriptionChange}
//                 modules={modules}
//                 placeholder="Write your resignation letter..."
//               />
//             </Box>

//             <Stack
//               direction="row"
//               spacing={2}
//               justifyContent="flex-end"
//               sx={{
//                 mt: 2, // Reduced top margin
//                 position: "relative",
//                 zIndex: 1,
//               }}
//             >
//               <Button
//                 onClick={handleClosePopup}
//                 sx={{
//                   border: "2px solid #1976d2",
//                   color: "#1976d2",
//                   "&:hover": {
//                     border: "2px solid #64b5f6",
//                     backgroundColor: "#e3f2fd",
//                   },
//                   borderRadius: "8px",
//                   px: 4,
//                   py: 1,
//                   fontWeight: 600,
//                 }}
//               >
//                 Cancel
//               </Button>

//               <LoadingButton
//                 onClick={handleSave}
//                 loading={isSaving}
//                 variant="contained"
//                 sx={{
//                   background: "linear-gradient(45deg, #1976d2, #64b5f6)",
//                   color: "white",
//                   "&:hover": {
//                     background: "linear-gradient(45deg, #1565c0, #42a5f5)",
//                   },
//                   borderRadius: "8px",
//                   px: 4,
//                   py: 1,
//                   fontWeight: 600,
//                 }}
//               >
//                 {isEditing ? "Update" : "Save"}
//               </LoadingButton>
//             </Stack>
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/** List and card view **/}

//       {viewMode === "list" ? (
//         <Box
//           sx={{
//             backgroundColor: "white",
//             borderRadius: "12px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//             overflow: "hidden",
//             margin: "24px 0",
//           }}
//         >
//           <Table sx={{ minWidth: 650 }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f8fafc" }}>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Name
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Email
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Position
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Status
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Description
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredData.map((item) => (
//                 <TableRow
//                   key={item._id}
//                   sx={{
//                     "&:hover": { backgroundColor: "#f8fafc" },
//                     transition: "background-color 0.2s ease",
//                   }}
//                 >
//                   <TableCell sx={{ py: 2 }}>
//                     <Typography sx={{ fontWeight: 550, color: "#d013d1" }}>
//                       {item.name}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <EmailOutlined sx={{ fontSize: 16, color: "#2563eb" }} />
//                       <Typography sx={{ color: "#2563eb" }}>
//                         {item.email}
//                       </Typography>
//                     </Stack>
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <WorkOutline sx={{ fontSize: 16, color: "#64748b" }} />
//                       <Typography sx={{ color: "#64748b" }}>
//                         {item.position}
//                       </Typography>
//                     </Stack>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={item.status}
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         fontWeight: 600,
//                         borderColor:
//                           item.status === "Approved"
//                             ? "#22c55e"
//                             : item.status === "Rejected"
//                             ? "#ef4444"
//                             : item.status === "Requested"
//                             ? "#f59e0b"
//                             : "#e2e8f0",
//                         color:
//                           item.status === "Approved"
//                             ? "#16a34a"
//                             : item.status === "Rejected"
//                             ? "#dc2626"
//                             : item.status === "Requested"
//                             ? "#d97706"
//                             : "#64748b",
//                         backgroundColor:
//                           item.status === "Approved"
//                             ? "#f0fdf4"
//                             : item.status === "Rejected"
//                             ? "#fef2f2"
//                             : item.status === "Requested"
//                             ? "#fefce8"
//                             : "#f8fafc",
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       maxWidth: "300px",
//                       "& div": {
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         display: "-webkit-box",
//                         WebkitLineClamp: 2,
//                         WebkitBoxOrient: "vertical",
//                         color: "#64748b",
//                         fontSize: "0.875rem",
//                       },
//                     }}
//                   >
//                     <div
//                       dangerouslySetInnerHTML={{ __html: item.description }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" spacing={1}>
//                       <IconButton
//                         onClick={() => handleEditClick(item)}
//                         size="small"
//                         sx={{
//                           color: "#1976d2",
//                           "&:hover": {
//                             backgroundColor: "#e3f2fd",
//                             transform: "translateY(-1px)",
//                           },
//                           transition: "all 0.2s ease",
//                         }}
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>

//                       <IconButton
//                         onClick={() => handleSendEmail(item)}
//                         size="small"
//                         sx={{
//                           color: "#0ea5e9",
//                           "&:hover": {
//                             backgroundColor: "#e0f2fe",
//                             transform: "translateY(-1px)",
//                           },
//                           transition: "all 0.2s ease",
//                         }}
//                       >
//                         <Email fontSize="small" />
//                       </IconButton>

//                       <IconButton
//                         onClick={() => handlePreview(item)}
//                         size="small"
//                         sx={{
//                           color: "#0ea5e9",
//                           "&:hover": {
//                             backgroundColor: "#e0f2fe",
//                             transform: "translateY(-1px)",
//                           },
//                           transition: "all 0.2s ease",
//                         }}
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>

//                       <IconButton
//                         onClick={() => handleDeleteClick(item._id)}
//                         size="small"
//                         sx={{
//                           color: "#ef4444",
//                           "&:hover": {
//                             backgroundColor: "#fee2e2",
//                             transform: "translateY(-1px)",
//                           },
//                           transition: "all 0.2s ease",
//                         }}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//       ) : (
//         <Grid container spacing={3} sx={{ padding: "24px" }}>
//           {filteredData.map((item) => (
//             <Grid item xs={12} sm={6} md={4} key={item._id}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   borderRadius: "16px",
//                   boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//                   },
//                 }}
//               >
//                 <CardHeader
//                   sx={{
//                     p: 3,
//                     pb: 2,
//                     "& .MuiCardHeader-title": {
//                       fontSize: "1.25rem",
//                       fontWeight: 600,
//                       color: "#d013d1",
//                     },
//                   }}
//                   title={
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{ color: "#d013d1", fontWeight: 600 }}
//                       >
//                         {item.name}
//                       </Typography>
//                       <Typography
//                         variant="subtitle2"
//                         sx={{
//                           color: "#2563eb",
//                           fontSize: "0.875rem",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                           mt: 1,
//                         }}
//                       >
//                         <EmailOutlined sx={{ fontSize: 16 }} />
//                         {item.email}
//                       </Typography>
//                     </Box>
//                   }
//                   action={
//                     <Chip
//                       label={item.status}
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         fontWeight: 600,
//                         borderColor:
//                           item.status === "Approved"
//                             ? "#22c55e"
//                             : item.status === "Rejected"
//                             ? "#ef4444"
//                             : item.status === "Requested"
//                             ? "#f59e0b"
//                             : "#e2e8f0",
//                         color:
//                           item.status === "Approved"
//                             ? "#16a34a"
//                             : item.status === "Rejected"
//                             ? "#dc2626"
//                             : item.status === "Requested"
//                             ? "#d97706"
//                             : "#64748b",
//                         backgroundColor:
//                           item.status === "Approved"
//                             ? "#f0fdf4"
//                             : item.status === "Rejected"
//                             ? "#fef2f2"
//                             : item.status === "Requested"
//                             ? "#fefce8"
//                             : "#f8fafc",
//                       }}
//                     />
//                   }
//                 />

//                 <CardContent
//                   sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     pt: 0,
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "#0f172a",
//                       fontSize: "0.875rem",
//                       fontWeight: 500,
//                       mb: 2,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >
//                     <WorkOutline sx={{ fontSize: 18, color: "#64748b" }} />
//                     {item.position}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     component="div"
//                     sx={{
//                       color: "#475569",
//                       fontSize: "0.875rem",
//                       lineHeight: 1.6,
//                       "& > div": {
//                         display: "-webkit-box",
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                       },
//                     }}
//                   >
//                     <div
//                       dangerouslySetInnerHTML={{ __html: item.description }}
//                     />
//                   </Typography>
//                 </CardContent>
//                 <CardActions
//                   sx={{
//                     justifyContent: "space-between",
//                     p: 3,
//                     pt: 2,
//                     borderTop: "1px solid #f1f5f9",
//                   }}
//                 >
//                   <Button
//                     startIcon={<Email sx={{ fontSize: 18 }} />}
//                     onClick={() => handleSendEmail(item)}
//                     size="small"
//                     sx={{
//                       color: "#0ea5e9",
//                       fontSize: "0.875rem",
//                       fontWeight: 600,
//                       "&:hover": {
//                         backgroundColor: "#e0f2fe",
//                         transform: "translateY(-1px)",
//                       },
//                       transition: "all 0.2s ease",
//                     }}
//                   >
//                     Send Email
//                   </Button>
//                   <Stack direction="row" spacing={1}>
//                     <IconButton
//                       onClick={() => handleEditClick(item)}
//                       size="small"
//                       sx={{
//                         color: "#1976d2",
//                         "&:hover": {
//                           backgroundColor: "#e3f2fd",
//                           transform: "translateY(-1px)",
//                         },
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       <Edit sx={{ fontSize: 18 }} />
//                     </IconButton>

//                     <IconButton
//                       onClick={() => handlePreview(item)}
//                       size="small"
//                       sx={{
//                         color: "#0ea5e9",
//                         "&:hover": {
//                           backgroundColor: "#e0f2fe",
//                           transform: "translateY(-1px)",
//                         },
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       <Visibility fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteClick(item._id)}
//                       size="small"
//                       sx={{
//                         color: "#ef4444",
//                         "&:hover": {
//                           backgroundColor: "#fee2e2",
//                           transform: "translateY(-1px)",
//                         },
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       <Delete sx={{ fontSize: 18 }} />
//                     </IconButton>
//                   </Stack>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/**pREVIEW PAGE */}
//       <Dialog
//         open={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             width: "700px",
//             maxWidth: "90vw",
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
//             position: "relative",
//             marginBottom: 5,
//           }}
//         >
//           Resignation Letter Preview
//           <IconButton
//             onClick={() => setPreviewOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 16,
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "white",
//             }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 4 }}>
//           {previewData && (
//             <Stack spacing={3}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <Avatar
//                   sx={{
//                     width: 56,
//                     height: 56,
//                     bgcolor: "primary.main",
//                     fontSize: "1.5rem",
//                   }}
//                 >
//                   {previewData.name.charAt(0)}
//                 </Avatar>
//                 <Box>
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       color: "#d013d1",
//                       fontWeight: 600,
//                       mb: 0.5,
//                     }}
//                   >
//                     {previewData.name}
//                   </Typography>
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <EmailOutlined sx={{ fontSize: 16, color: "#2563eb" }} />
//                       <Typography
//                         sx={{ color: "#2563eb", fontSize: "0.875rem" }}
//                       >
//                         {previewData.email}
//                       </Typography>
//                     </Stack>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <WorkOutline sx={{ fontSize: 16, color: "#64748b" }} />
//                       <Typography
//                         sx={{ color: "#64748b", fontSize: "0.875rem" }}
//                       >
//                         {previewData.position}
//                       </Typography>
//                     </Stack>
//                   </Stack>
//                 </Box>
//               </Box>

//               <Chip
//                 label={previewData.status}
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   alignSelf: "flex-start",
//                   fontWeight: 600,
//                   borderColor:
//                     previewData.status === "Approved"
//                       ? "#22c55e"
//                       : previewData.status === "Rejected"
//                       ? "#ef4444"
//                       : previewData.status === "Requested"
//                       ? "#f59e0b"
//                       : "#e2e8f0",
//                   color:
//                     previewData.status === "Approved"
//                       ? "#16a34a"
//                       : previewData.status === "Rejected"
//                       ? "#dc2626"
//                       : previewData.status === "Requested"
//                       ? "#d97706"
//                       : "#64748b",
//                   backgroundColor:
//                     previewData.status === "Approved"
//                       ? "#f0fdf4"
//                       : previewData.status === "Rejected"
//                       ? "#fef2f2"
//                       : previewData.status === "Requested"
//                       ? "#fefce8"
//                       : "#f8fafc",
//                 }}
//               />

//               <Box
//                 sx={{
//                   p: 3,
//                   backgroundColor: "#f8fafc",
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   "& > div": {
//                     color: "#475569",
//                     fontSize: "0.875rem",
//                     lineHeight: 1.8,
//                   },
//                 }}
//               >
//                 <div
//                   dangerouslySetInnerHTML={{ __html: previewData.description }}
//                 />
//               </Box>
//             </Stack>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };


// export default ResignationPage;

import React, { useState, useEffect } from "react";
import { FaList, FaTh, FaEnvelope } from "react-icons/fa";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  Stack,
  TextField,
  ButtonGroup,
  IconButton,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Popover,
  Avatar,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Email,
  WorkOutline,
  EmailOutlined,
  Visibility,
  Close,
  CheckCircle,
  Cancel,
  AccessTime,
  Send,
  GetApp,
  Save,
} from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";

import "./ResignationPage.css";

const ResignationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [isSaving, setIsSaving] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [viewMode, setViewMode] = useState(isMobile ? "grid" : "list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResignations();
  }, []);

  // Set view mode based on screen size when it changes
  useEffect(() => {
    if (isMobile) {
      setViewMode("grid");
    }
  }, [isMobile]);

  const fetchResignations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/resignations"
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch resignations");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newResignation, setNewResignation] = useState({
    name: "",
    email: "",
    title: "",
    status: "Requested",
    description: "",
  });

  const handleEditClick = (res) => {
    setShowCreatePopup(true);
    setIsEditing(true);
    setCurrentId(res._id);
    setNewResignation({
      name: res.name,
      email: res.email,
      title: res.position,
      status: res.status,
      description: res.description,
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resignations/${id}`);
      await fetchResignations();
      setSnackbar({
        open: true,
        message: "Resignation letter deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting resignation:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete resignation letter",
        severity: "error",
      });
    }
  };

  const handleCreateClick = () => {
    setShowCreatePopup(true);
    setIsEditing(false);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setNewResignation((prev) => ({ ...prev, description: content }));
  };

  const handleClosePopup = () => {
    setShowCreatePopup(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: "",
    });
  };

  const handleSendEmail = async (employee) => {
    try {
      await axios.post("http://localhost:5000/api/resignations/email", {
        name: employee.name,
        email: employee.email,
        position: employee.position,
        status: employee.status,
        description: employee.description,
      });
      setSnackbar({
        open: true,
        message: `Resignation email sent successfully to ${employee.email}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSnackbar({
        open: true,
        message: "Failed to send email",
        severity: "error",
      });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const applyFilter = (status) => {
    setSelectedStatus(status);
    setFilterOpen(false);
    setFilterAnchorEl(null);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return {
          bg: "#e6f7ff",
          color: "#1890ff",
          icon: <CheckCircle fontSize="small" />,
        };
      case "Rejected":
        return {
          bg: "#fff1f0",
          color: "#ff4d4f",
          icon: <Cancel fontSize="small" />,
        };
      case "Pending":
        return {
          bg: "#fff7e6",
          color: "#fa8c16",
          icon: <AccessTime fontSize="small" />,
        };
      default:
        return {
          bg: "#f0f5ff",
          color: "#2f54eb",
          icon: <Email fontSize="small" />,
        };
    }
  };

  if (loading) return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Loading resignations...
      </Typography>
    </Box>
  );

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const resignationData = {
        name: newResignation.name,
        email: newResignation.email,
        position: newResignation.title,
        status: newResignation.status,
        description: newResignation.description,
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/resignations/${currentId}`,
          resignationData
        );
        setSnackbar({
          open: true,
          message: "Resignation letter updated successfully",
          severity: "success",
        });
      } else {
        await axios.post(
          "http://localhost:5000/api/resignations",
          resignationData
        );
        setSnackbar({
          open: true,
          message: "Resignation letter created successfully",
          severity: "success",
        });
      }

      await fetchResignations();
      handleClosePopup();
    } catch (error) {
      console.error("Error saving resignation:", error);
      setSnackbar({
        open: true,
        message: "Error saving resignation letter",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterOpen(!filterOpen);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterOpen(false);
  };

  const handlePreview = (item) => {
    setPreviewData(item);
    setPreviewOpen(true);
  };

  return (
    <div className="resignation-letters">
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: isMobile ? "16px 20px" : isTablet ? "20px 24px" : "24px 32px",
          marginBottom: "24px",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Stack
          direction={isMobile || isTablet ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile || isTablet ? "flex-start" : "center"}
          spacing={isMobile || isTablet ? 2 : 0}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: isMobile || isTablet ? 1 : 0,
              letterSpacing: "-0.5px",
            }}
          >
            Resignations
          </Typography>

          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={isMobile ? 1.5 : 2} 
            alignItems={isMobile ? "stretch" : "center"}
            width={isMobile || isTablet ? "100%" : "auto"}
          >
            <TextField
              placeholder="Search by name, email or position"
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{
                width: isMobile || isTablet ? "100%" : "300px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                    borderWidth: "2px",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
            />

            <Stack 
              direction="row" 
              spacing={1} 
              width={isMobile ? "100%" : "auto"}
              justifyContent={isMobile ? "space-between" : "flex-start"}
            >
              <ButtonGroup 
                variant="outlined" 
                sx={{ 
                  height: "40px",
                  flexGrow: isMobile ? 1 : 0,
                  "& .MuiButtonGroup-grouped": {
                    flex: isMobile ? 1 : "auto",
                    borderColor: "#1976d2",
                  }
                }}
              >
                <Tooltip title="List View">
                  <IconButton
                    onClick={() => handleViewChange("list")}
                    sx={{
                      color: viewMode === "list" ? "white" : "#64748b",
                      backgroundColor: viewMode === "list" ? "#1976d2" : "transparent",
                      borderColor: "#1976d2",
                      "&:hover": { 
                        backgroundColor: viewMode === "list" ? "#1565c0" : "#e3f2fd",
                      },
                    }}
                  >
                    <FaList />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => handleViewChange("grid")}
                    sx={{
                      color: viewMode === "grid" ? "white" : "#64748b",
                      backgroundColor: viewMode === "grid" ? "#1976d2" : "transparent",
                      borderColor: "#1976d2",
                      "&:hover": { 
                        backgroundColor: viewMode === "grid" ? "#1565c0" : "#e3f2fd",
                      },
                    }}
                  >
                    <FaTh />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>

              <Tooltip title="Filter Resignations">
                <Button
                  onClick={toggleFilter}
                  startIcon={<FilterList />}
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "#e3f2fd",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    height: "40px",
                    display: isMobile ? "none" : "flex", // Hide on mobile to save space
                    fontWeight: 500,
                  }}
                  variant="outlined"
                >
                  {selectedStatus ? `Filter: ${selectedStatus}` : "Filter"}
                </Button>
              </Tooltip>

              <Tooltip title="Create New Resignation">
                <Button
                  onClick={handleCreateClick}
                  startIcon={<Add />}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                      transform: "translateY(-2px)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                    width: isMobile ? "100%" : "auto",
                    flexGrow: isMobile ? 1 : 0,
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                  }}
                  variant="contained"
                >
                  Create
                </Button>
              </Tooltip>
            </Stack>
            
            {isMobile && (
              <Button
                onClick={toggleFilter}
                startIcon={<FilterList />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1565c0",
                    backgroundColor: "#e3f2fd",
                  },
                  textTransform: "none",
                  borderRadius: "8px",
                  height: "40px",
                  width: "100%",
                  fontWeight: 500,
                }}
                variant="outlined"
              >
                {selectedStatus ? `Filter: ${selectedStatus}` : "Filter"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Status summary cards */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#e6f7ff',
            border: '1px solid #91d5ff',
            flex: 1,
            minWidth: isMobile ? '100%' : isTablet ? '45%' : '200px',
          }}
        >
          <CheckCircle sx={{ color: '#1890ff', mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#1890ff" fontWeight={500}>Approved</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter(item => item.status === 'Approved').length}
            </Typography>
          </Box>
        </Paper>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#fff7e6',
            border: '1px solid #ffd591',
            flex: 1,
            minWidth: isMobile ? '100%' : isTablet ? '45%' : '200px',
          }}
        >
          <AccessTime sx={{ color: '#fa8c16', mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#fa8c16" fontWeight={500}>Pending</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter(item => item.status === 'Pending').length}
            </Typography>
          </Box>
        </Paper>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f0f5ff',
            border: '1px solid #adc6ff',
            flex: 1,
            minWidth: isMobile ? '100%' : isTablet ? '45%' : '200px',
          }}
        >
          <Email sx={{ color: '#2f54eb', mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#2f54eb" fontWeight={500}>Requested</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter(item => item.status === 'Requested').length}
            </Typography>
          </Box>
        </Paper>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#fff1f0',
            border: '1px solid #ffa39e',
            flex: 1,
            minWidth: isMobile ? '100%' : isTablet ? '45%' : '200px',
          }}
        >
          <Cancel sx={{ color: '#ff4d4f', mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#ff4d4f" fontWeight={500}>Rejected</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter(item => item.status === 'Rejected').length}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/*** Filter Popup ***/}
      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: isMobile ? "90%" : "400px",
            borderRadius: "16px",
            mt: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            p: isMobile ? 2 : 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            Filter Resignations
          </Typography>
        </Box>

        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Stack spacing={2}>
            <Button
              onClick={() => applyFilter("")}
              variant={selectedStatus === "" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              All
            </Button>
            <Button
              onClick={() => applyFilter("Requested")}
              variant={selectedStatus === "Requested" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<Email fontSize="small" />}
            >
              Requested
            </Button>
            <Button
              onClick={() => applyFilter("Approved")}
              variant={selectedStatus === "Approved" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<CheckCircle fontSize="small" />}
            >
              Approved
            </Button>
            <Button
              onClick={() => applyFilter("Rejected")}
              variant={selectedStatus === "Rejected" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<Cancel fontSize="small" />}
            >
              Rejected
            </Button>
            <Button
              onClick={() => applyFilter("Pending")}
              variant={selectedStatus === "Pending" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<AccessTime fontSize="small" />}
            >
              Pending
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/* Empty state */}
      {filteredData.length === 0 && !loading && (
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 3
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Email sx={{ fontSize: 60, color: '#1976d2', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" gutterBottom>No resignation letters found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || selectedStatus ? 
              "Try adjusting your search or filter criteria" : 
              "Create your first resignation letter to get started"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateClick}
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Create Resignation Letter
          </Button>
        </Paper>
      )}

      {/* List View */}
      {viewMode === "list" && filteredData.length > 0 && (
        <Paper
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            mb: 3
          }}
          elevation={0}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    width: isMobile || isTablet ? "40%" : "25%",
                    borderBottom: "2px solid #e2e8f0",
                    py: 2
                  }}
                >
                  Employee
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: "#475569",
                    borderBottom: "2px solid #e2e8f0",
                    py: 2
                  }}>
                    Position
                  </TableCell>
                )}
                {!isMobile && !isTablet && (
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: "#475569",
                    borderBottom: "2px solid #e2e8f0",
                    py: 2
                  }}>
                    Email
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    width: isMobile ? "30%" : "15%",
                    borderBottom: "2px solid #e2e8f0",
                    py: 2
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    width: isMobile ? "30%" : "20%",
                    borderBottom: "2px solid #e2e8f0",
                    py: 2
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={item._id}
                  sx={{ 
                    "&:hover": { backgroundColor: "#f8fafc" },
                    transition: "background-color 0.2s ease"
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: getStatusColor(item.status).color,
                          width: 40,
                          height: 40,
                          mr: 1.5,
                          fontWeight: "bold",
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        {isMobile && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b" }}
                          >
                            {item.position}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ py: 2 }}>{item.position}</TableCell>
                  )}
                  {!isMobile && !isTablet && (
                    <TableCell sx={{ py: 2 }}>{item.email}</TableCell>
                  )}
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      icon={getStatusColor(item.status).icon}
                      label={item.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(item.status).bg,
                        color: getStatusColor(item.status).color,
                        fontWeight: 600,
                        borderRadius: "6px",
                        py: 0.5,
                        border: `1px solid ${getStatusColor(item.status).color}20`,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(item)}
                          sx={{
                            color: "#1976d2",
                            "&:hover": { 
                              backgroundColor: "#e3f2fd",
                              transform: "translateY(-2px)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                                                    <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item)}
                          sx={{
                            color: "#1976d2",
                            "&:hover": { 
                              backgroundColor: "#e3f2fd",
                              transform: "translateY(-2px)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item._id)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { 
                              backgroundColor: "#fee2e2",
                              transform: "translateY(-2px)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton
                          size="small"
                          onClick={() => handleSendEmail(item)}
                          sx={{
                            color: "#1976d2",
                            "&:hover": { 
                              backgroundColor: "#e3f2fd",
                              transform: "translateY(-2px)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <EmailOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredData.length > 0 && (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredData.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item._id}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar 
                      sx={{ 
                        bgcolor: getStatusColor(item.status).color,
                        fontWeight: "bold",
                        width: 45,
                        height: 45,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      {item.name.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                      {item.name}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {item.position}
                    </Typography>
                  }
                  action={
                    <Chip
                      icon={getStatusColor(item.status).icon}
                      label={item.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(item.status).bg,
                        color: getStatusColor(item.status).color,
                        fontWeight: 600,
                        borderRadius: "6px",
                        py: 0.5,
                        border: `1px solid ${getStatusColor(item.status).color}20`,
                      }}
                    />
                  }
                  sx={{
                    pb: 1,
                    "& .MuiCardHeader-content": {
                      overflow: "hidden"
                    }
                  }}
                />
                <Divider sx={{ mx: 2 }} />
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 2,
                      lineHeight: 1.6,
                      height: "4.8em", // Fixed height for 3 lines
                    }}
                  >
                    {item.description.replace(/<[^>]*>?/gm, "")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      color: "#64748b",
                    }}
                  >
                    <EmailOutlined fontSize="small" sx={{ mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.email}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider sx={{ mx: 2 }} />
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(item)}
                    sx={{
                      color: "#1976d2",
                      "&:hover": { 
                        backgroundColor: "#e3f2fd",
                      },
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    View
                  </Button>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(item)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { backgroundColor: "#e3f2fd" },
                          mr: 0.5,
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(item._id)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { backgroundColor: "#fee2e2" },
                          mr: 0.5,
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton
                        size="small"
                        onClick={() => handleSendEmail(item)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                      >
                        <EmailOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreatePopup}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            width: isMobile ? "95%" : "800px",
            maxWidth: "95vw",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: 600,
            padding: isMobile ? "16px 20px" : "20px 24px",
            position: "relative",
          }}
        >
          {isEditing ? "Edit Resignation Letter" : "Create Resignation Letter"}
          <IconButton
            onClick={handleClosePopup}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: isMobile ? "16px" : "24px" }}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee Name"
                name="name"
                value={newResignation.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={newResignation.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Position/Title"
                name="title"
                value={newResignation.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={newResignation.status}
                  onChange={handleInputChange}
                  label="Status"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#1976d2",
                      },
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  }}
                >
                  <MenuItem value="Requested">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email fontSize="small" sx={{ mr: 1, color: "#2f54eb" }} />
                      Requested
                    </Box>
                  </MenuItem>
                  <MenuItem value="Approved">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircle fontSize="small" sx={{ mr: 1, color: "#1890ff" }} />
                      Approved
                    </Box>
                  </MenuItem>
                  <MenuItem value="Rejected">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Cancel fontSize="small" sx={{ mr: 1, color: "#ff4d4f" }} />
                      Rejected
                    </Box>
                  </MenuItem>
                  <MenuItem value="Pending">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime fontSize="small" sx={{ mr: 1, color: "#fa8c16" }} />
                      Pending
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, mt: 1, fontWeight: 500 }}
              >
                Resignation Letter
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div className="quill-container">
                  <ReactQuill
                    theme="snow"
                    value={newResignation.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    style={{ 
                      height: isMobile ? "180px" : "250px", 
                      marginBottom: "40px",
                      borderRadius: "0"
                    }}
                    placeholder="Write your resignation letter here..."
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: isMobile ? 6 : 4,
            }}
          >
            <Button
              onClick={handleClosePopup}
              variant="outlined"
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "#e3f2fd",
                },
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <LoadingButton
                            onClick={handleSave}
                            loading={isSaving}
                            loadingPosition="start"
                            startIcon={<Save />}
                            variant="contained"
                            sx={{
                              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                              },
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 3,
                              py: 1,
                              fontWeight: 500,
                              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                            }}
                          >
                            {isEditing ? "Update" : "Save"}
                          </LoadingButton>
                        </Box>
                      </DialogContent>
                    </Dialog>
              
                    {/* Preview Dialog */}
                    <Dialog
                      open={previewOpen}
                      onClose={() => setPreviewOpen(false)}
                      maxWidth="md"
                      fullWidth
                      TransitionComponent={Fade}
                      PaperProps={{
                        sx: {
                          width: isMobile ? "95%" : "800px",
                          maxWidth: "95vw",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      {previewData && (
                        <>
                          <DialogTitle
                            sx={{
                              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                              color: "white",
                              fontSize: isMobile ? "1.25rem" : "1.5rem",
                              fontWeight: 600,
                              padding: isMobile ? "16px 20px" : "20px 24px",
                              position: "relative",
                            }}
                          >
                            Resignation Letter
                            <IconButton
                              onClick={() => setPreviewOpen(false)}
                              sx={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.1)",
                                },
                              }}
                            >
                              <Close />
                            </IconButton>
                          </DialogTitle>
              
                          <DialogContent sx={{ padding: isMobile ? "16px" : "24px" }}>
                            <Grid container spacing={isMobile ? 2 : 3}>
                              <Grid item xs={12} md={8}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 3,
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: getStatusColor(previewData.status).color,
                                      width: 48,
                                      height: 48,
                                      mr: 2,
                                      fontWeight: "bold",
                                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {previewData.name.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                      {previewData.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                                      {previewData.position}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                                <Chip
                                  icon={getStatusColor(previewData.status).icon}
                                  label={previewData.status}
                                  sx={{
                                    backgroundColor: getStatusColor(previewData.status).bg,
                                    color: getStatusColor(previewData.status).color,
                                    fontWeight: 500,
                                    borderRadius: "6px",
                                    py: 0.5,
                                    border: `1px solid ${getStatusColor(previewData.status).color}20`,
                                    mb: 1,
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                  {previewData.email}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    p: 3,
                                    mt: 2,
                                    backgroundColor: "#f8fafc",
                                  }}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: previewData.description,
                                    }}
                                    className="resignation-content"
                                  />
                                </Paper>
                              </Grid>
                            </Grid>
              
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 3,
                              }}
                            >
                              <Button
                                onClick={() => handleEditClick(previewData)}
                                startIcon={<Edit />}
                                variant="outlined"
                                sx={{
                                  borderColor: "#1976d2",
                                  color: "#1976d2",
                                  "&:hover": {
                                    borderColor: "#1565c0",
                                    backgroundColor: "#e3f2fd",
                                  },
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  fontWeight: 500,
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleSendEmail(previewData)}
                                startIcon={<Send />}
                                variant="contained"
                                sx={{
                                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                                  color: "white",
                                  "&:hover": {
                                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                                  },
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  fontWeight: 500,
                                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                                }}
                              >
                                Send Email
                              </Button>
                            </Box>
                          </DialogContent>
                        </>
                      )}
                    </Dialog>
              
                    {/* Snackbar for notifications */}
                    <Snackbar
                      open={snackbar.open}
                      autoHideDuration={5000}
                      onClose={() => setSnackbar({ ...snackbar, open: false })}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      TransitionComponent={Fade}
                    >
                      <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ 
                          width: "100%",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          alignItems: "center"
                        }}
                      >
                        {snackbar.message}
                      </Alert>
                    </Snackbar>
                  </div>
                );
              };
              
              export default ResignationPage;
              


