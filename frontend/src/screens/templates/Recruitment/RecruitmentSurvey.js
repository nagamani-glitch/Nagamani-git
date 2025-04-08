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
//   Avatar,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   MenuItem,
//   Chip,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   Autocomplete,
// } from "@mui/material";
// import {
//   ExpandMore,
//   Add,
//   Edit,
//   Delete,
//   QuestionAnswer,
//   Person,
// } from "@mui/icons-material";
// import axios from "axios";

// const RecruitmentSurvey = () => {
//   const [templates, setTemplates] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
//   const [newTemplateName, setNewTemplateName] = useState("");
//   const [newQuestion, setNewQuestion] = useState("");
//   const [newType, setNewType] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [currentTemplateId, setCurrentTemplateId] = useState(null);
//   const [currentQuestionId, setCurrentQuestionId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [registeredEmployees, setRegisteredEmployees] = useState([]);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/recruitment-survey"
//         );
//         setTemplates(response.data);
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//         showSnackbar("Error fetching templates", "error");
//       }
//     };
    
//     fetchTemplates();
//     fetchRegisteredEmployees();
//   }, []);

//   const fetchRegisteredEmployees = async () => {
//     try {
//       setLoadingEmployees(true);
//       const response = await axios.get("http://localhost:5000/api/employees/registered");
//       setRegisteredEmployees(response.data);
//       setLoadingEmployees(false);
//     } catch (error) {
//       console.error("Error fetching registered employees:", error);
//       setLoadingEmployees(false);
//     }
//   };

//   const handleEmployeeSelect = (event, employee) => {
//     setSelectedEmployee(employee);
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
//     setNewTemplateName("");
//     setNewQuestion("");
//     setNewType("");
//     setCurrentTemplateId(null);
//     setCurrentQuestionId(null);
//     setSelectedEmployee(null);
//   };
  
//   const handleAddTemplate = async () => {
//     if (newTemplateName && newQuestion && newType) {
//       // Prepare employee data if an employee is selected
//       const employeeData = selectedEmployee ? {
//         employeeId: selectedEmployee.Emp_ID,
//         employeeName: `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim(),
//         employeeDepartment: selectedEmployee.joiningDetails?.department || '',
//         employeeDesignation: selectedEmployee.joiningDetails?.initialDesignation || '',
//       } : {};

//       const newTemplate = {
//         name: newTemplateName,
//         questions: [
//           {
//             avatar: newTemplateName.charAt(0).toUpperCase(),
//             question: newQuestion,
//             type: newType,
//             ...employeeData
//           },
//         ],
//       };
//       try {
//         setLoading(true);
//         const { data } = await axios.post(
//           "http://localhost:5000/api/recruitment-survey/add",
//           newTemplate
//         );
//         setTemplates([...templates, data]);
//         handleClose();
//         showSnackbar("Template added successfully");
//       } catch (error) {
//         console.error("Error adding template:", error);
//         showSnackbar("Error adding template", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleOpenAddQuestionDialog = (templateId) => {
//     setCurrentTemplateId(templateId);
//     setNewQuestion("");
//     setNewType("");
//     setSelectedEmployee(null);
//     setAddQuestionDialogOpen(true);
//   };

//   const handleCloseAddQuestionDialog = () => {
//     setAddQuestionDialogOpen(false);
//     setCurrentTemplateId(null);
//     setNewQuestion("");
//     setNewType("");
//     setSelectedEmployee(null);
//   };

//   const handleAddQuestionToTemplate = async () => {
//     if (!newQuestion || !newType || !currentTemplateId) return;

//     // Prepare employee data if an employee is selected
//     const employeeData = selectedEmployee ? {
//       employeeId: selectedEmployee.Emp_ID,
//       employeeName: `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim(),
//       employeeDepartment: selectedEmployee.joiningDetails?.department || '',
//       employeeDesignation: selectedEmployee.joiningDetails?.initialDesignation || '',
//     } : {};

//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         `http://localhost:5000/api/recruitment-survey/${currentTemplateId}/questions`,
//         {
//           question: newQuestion,
//           type: newType,
//           ...employeeData
//         }
//       );

//       // Update templates state with the new question
//       setTemplates(prevTemplates =>
//         prevTemplates.map(template =>
//           template._id === currentTemplateId ? data : template
//         )
//       );

//       handleCloseAddQuestionDialog();
//       showSnackbar("Question added to template successfully");
//     } catch (error) {
//       console.error("Error adding question to template:", error);
//       showSnackbar("Error adding question to template", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditQuestion = (templateId, questionId) => {
//     const template = templates.find((t) => t._id === templateId);
//     const question = template.questions.find((q) => q._id === questionId);
//     setNewTemplateName(template.name);
//     setNewQuestion(question.question);
//     setNewType(question.type);
//     setCurrentTemplateId(templateId);
//     setCurrentQuestionId(questionId);
    
//     // If the question has employee data, find and set the corresponding employee
//     if (question.employeeId) {
//       const employee = registeredEmployees.find(emp => emp.Emp_ID === question.employeeId);
//       setSelectedEmployee(employee || null);
//     } else {
//       setSelectedEmployee(null);
//     }
    
//     setEditing(true);
//     setOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     // Prepare employee data if an employee is selected
//     const employeeData = selectedEmployee ? {
//       employeeId: selectedEmployee.Emp_ID,
//       employeeName: `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim(),
//       employeeDepartment: selectedEmployee.joiningDetails?.department || '',
//       employeeDesignation: selectedEmployee.joiningDetails?.initialDesignation || '',
//     } : {};

//     try {
//       setLoading(true);
//       const { data } = await axios.put(
//         `http://localhost:5000/api/recruitment-survey/${currentTemplateId}/questions/${currentQuestionId}`,
//         {
//           question: newQuestion,
//           type: newType,
//           ...employeeData
//         }
//       );

//       // Update templates state with the edited question
//       setTemplates(prevTemplates =>
//         prevTemplates.map(template =>
//           template._id === currentTemplateId ? data : template
//         )
//       );

//       handleClose();
//       showSnackbar("Question updated successfully");
//     } catch (error) {
//       console.error("Error updating question:", error);
//       showSnackbar("Error updating question", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleDeleteQuestion = async (templateId, questionId) => {
//     try {
//       setLoading(true);
//       await axios.delete(
//         `http://localhost:5000/api/recruitment-survey/${templateId}/questions/${questionId}`
//       );
//       setTemplates((prevTemplates) =>
//         prevTemplates.map((template) =>
//           template._id === templateId
//             ? {
//                 ...template,
//                 questions: template.questions.filter(
//                   (question) => question._id !== questionId
//                 ),
//               }
//             : template
//         )
//       );
//       showSnackbar("Question deleted successfully");
//     } catch (error) {
//       console.error("Error deleting question:", error);
//       showSnackbar("Error deleting question", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTemplate = async (templateId) => {
//     try {
//       setLoading(true);
//       await axios.delete(
//         `http://localhost:5000/api/recruitment-survey/${templateId}`
//       );
//       setTemplates((prevTemplates) =>
//         prevTemplates.filter((template) => template._id !== templateId)
//       );
//       showSnackbar("Template deleted successfully");
//     } catch (error) {
//       console.error("Error deleting template:", error);
//       showSnackbar("Error deleting template", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box p={4} sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{ color: "#2c3e50", fontWeight: 600, mb: 3 }}
//         >
//           Survey Templates
//         </Typography>

//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={3}
//           sx={{
//             backgroundColor: "#fff",
//             padding: "15px 25px",
//             borderRadius: 2,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "#34495e" }}>
//             Templates
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleClickOpen}
//             sx={{
//               backgroundColor: "#3498db",
//               "&:hover": { backgroundColor: "#2980b9" },
//             }}
//           >
//             Add Template
//           </Button>
//         </Box>
//         {templates.length === 0 && !loading ? (
//           <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, mb: 2 }}>
//             <Typography variant="h6" color="textSecondary">
//               No templates found. Create your first template!
//             </Typography>
//           </Paper>
//         ) : (
//           templates.map((template) => (
//             <Accordion
//               key={template._id}
//               defaultExpanded
//               sx={{
//                 mb: 2,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                 "&:before": { display: "none" },
//                 borderRadius: "8px !important",
//               }}
//             >
//               <AccordionSummary
//                 expandIcon={<ExpandMore />}
//                 sx={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "8px 8px 0 0",
//                 }}
//               >
//                 <Box display="flex" alignItems="center" width="100%">
//                   <Typography
//                     variant="subtitle1"
//                     sx={{ fontWeight: 600, color: "#2c3e50" }}
//                   >
//                     {template.name}
//                     <span
//                       style={{
//                         color: "#e74c3c",
//                         marginLeft: 12,
//                         backgroundColor: "#fff",
//                         padding: "2px 8px",
//                         borderRadius: 12,
//                         fontSize: "0.8rem",
//                       }}
//                     >
//                       {template.questions.length}
//                     </span>
//                   </Typography>
//                   <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
//                     <Tooltip title="Add Question">
//                       <IconButton
//                         size="small"
//                         color="info"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleOpenAddQuestionDialog(template._id);
//                         }}
//                         sx={{ mr: 1 }}
//                       >
//                         <QuestionAnswer />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete Template">
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteTemplate(template._id);
//                         }}
//                       >
//                         <Delete />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </Box>
//               </AccordionSummary>
//               <AccordionDetails sx={{ p: 0 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
//                       <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
//                         Question
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
//                         Type
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
//                         Raised By
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                   {template.questions.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={4} align="center">
//                           <Typography variant="body2" color="textSecondary">
//                             No questions added yet. Click the "Add Question" button to add questions.
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       template.questions.map((question) => (
//                         <TableRow
//                           key={question._id}
//                           sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
//                         >
//                           <TableCell>
//                             <Box display="flex" alignItems="center" gap={2}>
//                               <Avatar
//                                 sx={{
//                                   bgcolor: "#3498db",
//                                   width: 35,
//                                   height: 35,
//                                   fontSize: "0.9rem",
//                                 }}
//                               >
//                                 {question.avatar}
//                               </Avatar>
//                               <Typography sx={{ color: "#2c3e50" }}>
//                                 {question.question}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell sx={{ color: "#7f8c8d" }}>
//                             <Chip 
//                               label={question.type} 
//                               size="small" 
//                               color={
//                                 question.type === "Text" ? "primary" :
//                                 question.type === "Multiple Choice" ? "secondary" :
//                                 question.type === "Checkbox" ? "success" : "info"
//                               }
//                               variant="outlined"
//                             />
//                           </TableCell>
//                           <TableCell>
//                             {question.employeeId && question.employeeName ? (
//                               <Box display="flex" alignItems="center" gap={1}>
//                                 <Person fontSize="small" color="primary" />
//                                 <Box>
//                                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                     {question.employeeName}
//                                   </Typography>
//                                   <Typography variant="caption" color="text.secondary">
//                                     {question.employeeId}
//                                     {question.employeeDepartment && ` • ${question.employeeDepartment}`}
//                                     {question.employeeDesignation && ` • ${question.employeeDesignation}`}
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                             ) : (
//                               <Typography variant="body2" color="text.secondary">
//                                 Not specified
//                               </Typography>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <IconButton
//                               size="small"
//                               onClick={() =>
//                                 handleEditQuestion(template._id, question._id)
//                               }
//                               sx={{ color: "#3498db", mr: 1 }}
//                             >
//                               <Edit />
//                             </IconButton>
//                             <IconButton
//                               size="small"
//                               onClick={() =>
//                                 handleDeleteQuestion(template._id, question._id)
//                               }
//                               sx={{ color: "#e74c3c" }}
//                             >
//                               <Delete />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//                 </AccordionDetails>
//             </Accordion>
//           ))
//         )}
//       </Paper>

//       {/* Add/Edit Template Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
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
//             background: "linear-gradient(45deg, #3498db, #2980b9)",
//             color: "white",
//             fontSize: "1.5rem",
//             fontWeight: 600,
//             padding: "24px 32px",
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           {editing ? "Edit Question" : "Add Recruitment Template"}
//         </DialogTitle>

//         <DialogContent
//           sx={{
//             padding: "32px",
//             backgroundColor: "#f8fafc",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 3,
//             }}
//           >
//             <TextField
//               label="Template Name"
//               value={newTemplateName}
//               onChange={(e) => setNewTemplateName(e.target.value)}
//               fullWidth
//               disabled={editing}
//               sx={{
//                 mt: 2,
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#3498db",
//                   },
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#3498db",
//                 },
//               }}
//             />

//             {/* Employee Selection Autocomplete */}
//             <Autocomplete
//               id="employee-select"
//               options={registeredEmployees}
//               getOptionLabel={(option) => 
//                 `${option.Emp_ID} - ${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`
//               }
//               value={selectedEmployee}
//               onChange={handleEmployeeSelect}
//               loading={loadingEmployees}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Employee (Who raised this question)"
//                   variant="outlined"
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#3498db",
//                       },
//                     },
//                   }}
//                 />
//               )}
//             />

//             <TextField
//               label="Question"
//               value={newQuestion}
//               onChange={(e) => setNewQuestion(e.target.value)}
//               fullWidth
//               multiline
//               rows={3}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#3498db",
//                   },
//                 },
//               }}
//             />

//             <TextField
//               label="Type"
//               value={newType}
//               onChange={(e) => setNewType(e.target.value)}
//               select
//               fullWidth
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#3498db",
//                   },
//                 },
//               }}
//             >
//               <MenuItem value="Text">Text</MenuItem>
//               <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
//               <MenuItem value="Checkbox">Checkbox</MenuItem>
//               <MenuItem value="Rating">Rating</MenuItem>
//             </TextField>
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
//             onClick={handleClose}
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
//             onClick={editing ? handleSaveEdit : handleAddTemplate}
//             variant="contained"
//             disabled={loading}
//             sx={{
//               background: "linear-gradient(45deg, #3498db, #2980b9)",
//               fontSize: "0.95rem",
//               textTransform: "none",
//               padding: "8px 32px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #2980b9, #3498db)",
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               editing ? "Save Changes" : "Add Template"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Question to Template Dialog */}
//       <Dialog
//         open={addQuestionDialogOpen}
//         onClose={handleCloseAddQuestionDialog}
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
//             background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
//             color: "white",
//             fontSize: "1.5rem",
//             fontWeight: 600,
//             padding: "24px 32px",
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <QuestionAnswer fontSize="large" />
//           Add Question to Template
//         </DialogTitle>

//         <DialogContent
//           sx={{
//             padding: "32px",
//             backgroundColor: "#f8fafc",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 3,
//             }}
//           >
//             {/* Employee Selection Autocomplete */}
//             <Autocomplete
//               id="employee-select-dialog"
//               options={registeredEmployees}
//               getOptionLabel={(option) => 
//                 `${option.Emp_ID} - ${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`
//               }
//               value={selectedEmployee}
//               onChange={handleEmployeeSelect}
//               loading={loadingEmployees}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Employee (Who raised this question)"
//                   variant="outlined"
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       "&:hover fieldset": {
//                         borderColor: "#9b59b6",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#9b59b6",
//                     },
//                   }}
//                 />
//               )}
//             />

//             <TextField
//               label="Question"
//               value={newQuestion}
//               onChange={(e) => setNewQuestion(e.target.value)}
//               fullWidth
//               multiline
//               rows={3}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#9b59b6",
//                   },
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#9b59b6",
//                 },
//               }}
//             />

//             <TextField
//               label="Type"
//               value={newType}
//               onChange={(e) => setNewType(e.target.value)}
//               select
//               fullWidth
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   "&:hover fieldset": {
//                     borderColor: "#9b59b6",
//                   },
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#9b59b6",
//                 },
//               }}
//             >
//               <MenuItem value="Text">Text</MenuItem>
//               <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
//               <MenuItem value="Checkbox">Checkbox</MenuItem>
//               <MenuItem value="Rating">Rating</MenuItem>
//             </TextField>
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
//             onClick={handleCloseAddQuestionDialog}
//             sx={{
//               border: "2px solid #7f8c8d",
//               color: "#7f8c8d",
//               "&:hover": {
//                 border: "2px solid #95a5a6",
//                 backgroundColor: "#ecf0f1",
//                 color: "#7f8c8d",
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
//             onClick={handleAddQuestionToTemplate}
//             variant="contained"
//             disabled={!newQuestion || !newType || loading}
//             sx={{
//               background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
//               fontSize: "0.95rem",
//               textTransform: "none",
//               padding: "8px 32px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(155, 89, 182, 0.2)",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #8e44ad, #9b59b6)",
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "Add Question"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RecruitmentSurvey;

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
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  QuestionAnswer,
  Person,
} from "@mui/icons-material";
import axios from "axios";

const RecruitmentSurvey = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/recruitment-survey"
        );
        console.log("Fetched templates:", response.data);
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        showSnackbar("Error fetching templates", "error");
      }
    };
    
    fetchTemplates();
    fetchRegisteredEmployees();
  }, []);

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get("http://localhost:5000/api/employees/registered");
      console.log("Fetched employees:", response.data);
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    console.log("Selected employee:", employee);
    setSelectedEmployee(employee);
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
    setNewTemplateName("");
    setNewQuestion("");
    setNewType("");
    setCurrentTemplateId(null);
    setCurrentQuestionId(null);
    setSelectedEmployee(null);
  };
  
  const handleAddTemplate = async () => {
    if (newTemplateName && newQuestion && newType) {
      try {
        setLoading(true);
        
        // Create the question object with employee data
        const questionData = {
          avatar: newTemplateName.charAt(0).toUpperCase(),
          question: newQuestion,
          type: newType
        };
        
        // Add employee data if an employee is selected
        if (selectedEmployee) {
          questionData.employeeId = selectedEmployee.Emp_ID;
          questionData.employeeName = `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim();
          questionData.employeeDepartment = selectedEmployee.joiningDetails?.department || '';
          questionData.employeeDesignation = selectedEmployee.joiningDetails?.initialDesignation || '';
        }
        
        const newTemplate = {
          name: newTemplateName,
          questions: [questionData]
        };
        
        console.log("Sending template data:", newTemplate);
        
        const { data } = await axios.post(
          "http://localhost:5000/api/recruitment-survey/add",
          newTemplate
        );
        
        console.log("Template added response:", data);
        setTemplates([...templates, data]);
        handleClose();
        showSnackbar("Template added successfully");
      } catch (error) {
        console.error("Error adding template:", error);
        showSnackbar("Error adding template", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenAddQuestionDialog = (templateId) => {
    setCurrentTemplateId(templateId);
    setNewQuestion("");
    setNewType("");
    setSelectedEmployee(null);
    setAddQuestionDialogOpen(true);
  };

  const handleCloseAddQuestionDialog = () => {
    setAddQuestionDialogOpen(false);
    setCurrentTemplateId(null);
    setNewQuestion("");
    setNewType("");
    setSelectedEmployee(null);
  };

  const handleAddQuestionToTemplate = async () => {
    if (!newQuestion || !newType || !currentTemplateId) return;

    try {
      setLoading(true);
      
      // Create request data with employee fields directly
      const requestData = {
        question: newQuestion,
        type: newType
      };
      
      // Add employee data if an employee is selected
      if (selectedEmployee) {
        requestData.employeeId = selectedEmployee.Emp_ID;
        requestData.employeeName = `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim();
        requestData.employeeDepartment = selectedEmployee.joiningDetails?.department || '';
        requestData.employeeDesignation = selectedEmployee.joiningDetails?.initialDesignation || '';
      }
      
      console.log("Sending question data:", requestData);
      
      const { data } = await axios.post(
        `http://localhost:5000/api/recruitment-survey/${currentTemplateId}/questions`,
        requestData
      );

      console.log("Question added response:", data);

      // Update templates state with the new question
      setTemplates(prevTemplates =>
        prevTemplates.map(template =>
          template._id === currentTemplateId ? data : template
        )
      );

      handleCloseAddQuestionDialog();
      showSnackbar("Question added to template successfully");
    } catch (error) {
      console.error("Error adding question to template:", error);
      showSnackbar("Error adding question to template", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (templateId, questionId) => {
    const template = templates.find((t) => t._id === templateId);
    const question = template.questions.find((q) => q._id === questionId);
    setNewTemplateName(template.name);
    setNewQuestion(question.question);
    setNewType(question.type);
    setCurrentTemplateId(templateId);
    setCurrentQuestionId(questionId);
    
    console.log("Editing question with employee data:", {
      employeeId: question.employeeId,
      employeeName: question.employeeName,
      employeeDepartment: question.employeeDepartment
    });
    
    // If the question has employee data, find and set the corresponding employee
    if (question.employeeId) {
      const employee = registeredEmployees.find(emp => emp.Emp_ID === question.employeeId);
      console.log("Found employee for editing:", employee);
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
    
    setEditing(true);
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      
      // Create request data with employee fields directly
      const requestData = {
        question: newQuestion,
        type: newType
      };
      
      // Add employee data if an employee is selected
      if (selectedEmployee) {
        requestData.employeeId = selectedEmployee.Emp_ID;
        requestData.employeeName = `${selectedEmployee.personalInfo?.firstName || ''} ${selectedEmployee.personalInfo?.lastName || ''}`.trim();
        requestData.employeeDepartment = selectedEmployee.joiningDetails?.department || '';
        requestData.employeeDesignation = selectedEmployee.joiningDetails?.initialDesignation || '';
      }
      
      console.log("Sending edit data:", requestData);
      
      const { data } = await axios.put(
        `http://localhost:5000/api/recruitment-survey/${currentTemplateId}/questions/${currentQuestionId}`,
        requestData
      );

      console.log("Edit saved response:", data);

      // Update templates state with the edited question
      setTemplates(prevTemplates =>
        prevTemplates.map(template =>
          template._id === currentTemplateId ? data : template
        )
      );

      handleClose();
      showSnackbar("Question updated successfully");
    } catch (error) {
      console.error("Error updating question:", error);
      showSnackbar("Error updating question", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteQuestion = async (templateId, questionId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/recruitment-survey/${templateId}/questions/${questionId}`
      );
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === templateId
            ? {
                ...template,
                questions: template.questions.filter(
                  (question) => question._id !== questionId
                ),
              }
            : template
        )
      );
      showSnackbar("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      showSnackbar("Error deleting question", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/recruitment-survey/${templateId}`
      );
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== templateId)
      );
      showSnackbar("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      showSnackbar("Error deleting template", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#2c3e50", fontWeight: 600, mb: 3 }}
        >
          Survey Templates
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            backgroundColor: "#fff",
            padding: "15px 25px",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#34495e" }}>
            Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleClickOpen}
            sx={{
              backgroundColor: "#3498db",
              "&:hover": { backgroundColor: "#2980b9" },
            }}
          >
            Add Template
          </Button>
        </Box>
        {templates.length === 0 && !loading ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" color="textSecondary">
              No templates found. Create your first template!
            </Typography>
          </Paper>
        ) : (
          templates.map((template) => (
            <Accordion
              key={template._id}
              defaultExpanded
              sx={{
                mb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:before": { display: "none" },
                borderRadius: "8px !important",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#2c3e50" }}
                  >
                    {template.name}
                    <span
                      style={{
                        color: "#e74c3c",
                        marginLeft: 12,
                        backgroundColor: "#fff",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: "0.8rem",
                      }}
                    >
                      {template.questions.length}
                    </span>
                  </Typography>
                  <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    <Tooltip title="Add Question">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddQuestionDialog(template._id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <QuestionAnswer />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Template">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template._id);
                        }}
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
                    <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                        Question
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                        Raised By
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {template.questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No questions added yet. Click the "Add Question" button to add questions.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      template.questions.map((question) => (
                        <TableRow
                          key={question._id}
                          sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                sx={{
                                  bgcolor: "#3498db",
                                  width: 35,
                                  height: 35,
                                  fontSize: "0.9rem",
                                }}
                              >
                                {question.avatar}
                              </Avatar>
                              <Typography sx={{ color: "#2c3e50" }}>
                                {question.question}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#7f8c8d" }}>
                            <Chip 
                              label={question.type} 
                              size="small" 
                              color={
                                question.type === "Text" ? "primary" :
                                question.type === "Multiple Choice" ? "secondary" :
                                question.type === "Checkbox" ? "success" : "info"
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {console.log("Question employee data:", {
                              id: question.employeeId,
                              name: question.employeeName,
                              dept: question.employeeDepartment
                            })}
                            {question.employeeId ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Person fontSize="small" color="primary" />
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {question.employeeName || "Unknown"}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {question.employeeId}
                                    {question.employeeDepartment ? ` • ${question.employeeDepartment}` : ''}
                                    {question.employeeDesignation ? ` • ${question.employeeDesignation}` : ''}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Not specified
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEditQuestion(template._id, question._id)
                              }
                              sx={{ color: "#3498db", mr: 1 }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteQuestion(template._id, question._id)
                              }
                              sx={{ color: "#e74c3c" }}
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
          ))
        )}
      </Paper>

      {/* Add/Edit Template Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {editing ? "Edit Question" : "Add Recruitment Template"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Template Name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              fullWidth
              disabled={editing}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#3498db",
                },
              }}
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
                  label="Select Employee (Who raised this question)"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#3498db",
                      },
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            />

            <TextField
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              select
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="Checkbox">Checkbox</MenuItem>
              <MenuItem value="Rating">Rating</MenuItem>
            </TextField>
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
            onClick={handleClose}
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
            onClick={editing ? handleSaveEdit : handleAddTemplate}
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #3498db, #2980b9)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #2980b9, #3498db)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              editing ? "Save Changes" : "Add Template"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Question to Template Dialog */}
      <Dialog
        open={addQuestionDialogOpen}
        onClose={handleCloseAddQuestionDialog}
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
            background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <QuestionAnswer fontSize="large" />
          Add Question to Template
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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
                  label="Select Employee (Who raised this question)"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#9b59b6",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#9b59b6",
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#9b59b6",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#9b59b6",
                },
              }}
            />

            <TextField
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              select
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#9b59b6",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#9b59b6",
                },
              }}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="Checkbox">Checkbox</MenuItem>
              <MenuItem value="Rating">Rating</MenuItem>
            </TextField>
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
            onClick={handleCloseAddQuestionDialog}
            sx={{
              border: "2px solid #7f8c8d",
              color: "#7f8c8d",
              "&:hover": {
                border: "2px solid #95a5a6",
                backgroundColor: "#ecf0f1",
                color: "#7f8c8d",
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
            onClick={handleAddQuestionToTemplate}
            variant="contained"
            disabled={!newQuestion || !newType || loading}
            sx={{
              background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(155, 89, 182, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #8e44ad, #9b59b6)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Question"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentSurvey;

  
                          

