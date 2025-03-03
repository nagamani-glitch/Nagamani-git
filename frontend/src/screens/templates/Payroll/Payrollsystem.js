// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   AppBar, Tabs, Tab, Box, Typography, Container, Button,
//   Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, Paper, TextField, Dialog, DialogActions,
//   DialogContent, DialogTitle, Select, MenuItem, IconButton,
//   Stack, Divider, Chip, Tooltip, Grid, Snackbar, Alert,
//   InputAdornment, FormControl, InputLabel
// } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import DescriptionIcon from '@mui/icons-material/Description';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import './Payrollsystem.css';

// const API_URL = "http://localhost:5000/api/payroll";

// const TabPanel = ({ children, value, index }) => {
//   return (
//     <div hidden={value !== index}>
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

// const PayrollSystem = () => {
//   // State declarations
//   const [tabIndex, setTabIndex] = useState(0);
//   const [employeeData, setEmployeeData] = useState([]);
//   const [allowanceData, setAllowanceData] = useState([]);
//   const [deductions, setDeductions] = useState([]);
//   const [payslips, setPayslips] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openDeductionDialog, setOpenDeductionDialog] = useState(false);
//   const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
//   const [newEmployee, setNewEmployee] = useState({
//     empId: "",
//     empName: "",
//     basicPay: "",
//     bankName: "",
//     bankAccountNo: "",
//     pfNo: "",
//     uanNo: "",
//     panNo: "",
//     payableDays: 30,
//     lop: 0,
//     department: "",
//     designation: "",
//     email: "",
//     status: "Active"
//   });

//   const [newAllowance, setNewAllowance] = useState({
//     empId: "",
//     name: "",
//     amount: "",
//     percentage: 0,
//     category: "Regular",
//     status: "Active",
//     description: "",
//     isRecurring: true
//   });

//   const [newDeduction, setNewDeduction] = useState({
//     empId: "",
//     name: "",
//     amount: "",
//     percentage: 0,
//     category: "Tax",
//     status: "Active",
//     description: "",
//     isRecurring: true
//   });

//   useEffect(() => {
//     fetchEmployees();
//     fetchAllowances();
//     fetchDeductions();
//     fetchPayslips();
//   }, []);

//   const showAlert = (message, severity = 'success') => {
//     setAlert({ open: true, message, severity });
//   };

//   const handleCloseEmployeeDialog = () => {
//     setOpenEmployeeDialog(false);
//     setEditMode(false);
//     setSelectedItem(null);
//     setNewEmployee({
//       empId: "",
//       empName: "",
//       basicPay: "",
//       bankName: "",
//       bankAccountNo: "",
//       pfNo: "",
//       uanNo: "",
//       panNo: "",
//       payableDays: 30,
//       lop: 0,
//       department: "",
//       designation: "",
//       email: "",
//       status: "Active"
//     });
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditMode(false);
//     setSelectedItem(null);
//     setNewAllowance({
//       empId: "",
//       name: "",
//       amount: "",
//       percentage: 0,
//       category: "Regular",
//       status: "Active",
//       description: "",
//       isRecurring: true
//     });
//   };

//   const handleCloseDeductionDialog = () => {
//     setOpenDeductionDialog(false);
//     setEditMode(false);
//     setSelectedItem(null);
//     setNewDeduction({
//       empId: "",
//       name: "",
//       amount: "",
//       percentage: 0,
//       category: "Tax",
//       status: "Active",
//       description: "",
//       isRecurring: true
//     });
//   };

//   const calculatePerDayPay = (basicPay, payableDays) => {
//     const pay = parseFloat(basicPay) || 0;
//     const days = parseInt(payableDays) || 30;
//     return pay / days;
//   };

//   const calculateAttendanceBasedPay = (basicPay, payableDays, lop) => {
//     const perDayPay = calculatePerDayPay(basicPay, payableDays);
//     const actualPayableDays = (parseInt(payableDays) || 30) - (parseInt(lop) || 0);
//     return perDayPay * actualPayableDays;
//   };

//   const calculateAllowanceAmount = (basicPay, percentage) => {
//     const pay = parseFloat(basicPay) || 0;
//     const pct = parseFloat(percentage) || 0;
//     return (pay * pct) / 100;
//   };

//   const calculateDeductionAmount = (basicPay, percentage) => {
//     const pay = parseFloat(basicPay) || 0;
//     const pct = parseFloat(percentage) || 0;
//     return (pay * pct) / 100;
//   };
//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/employees`);
//       setEmployeeData(response.data.data);
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error fetching employees', 'error');
//     }
//   };

//   const fetchAllowances = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/allowances`);
//       setAllowanceData(response.data.data);
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error fetching allowances', 'error');
//     }
//   };

//   const fetchDeductions = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/deductions`);
//       setDeductions(response.data.data);
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error fetching deductions', 'error');
//     }
//   };

//   const fetchPayslips = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/payslips`);
//       setPayslips(response.data.data);
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error fetching payslips', 'error');
//     }
//   };

//   const handleAddEmployee = async () => {
//     try {
//       if (!newEmployee.empId || !newEmployee.empName || !newEmployee.basicPay) {
//         showAlert('Please fill all required fields', 'error');
//         return;
//       }

//       if (editMode && selectedItem) {
//         await axios.put(`${API_URL}/employees/${selectedItem.empId}`, newEmployee);
//         showAlert('Employee updated successfully');
//       } else {
//         await axios.post(`${API_URL}/employees`, newEmployee);
//         showAlert('Employee added successfully');
//       }
//       fetchEmployees();
//       handleCloseEmployeeDialog();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error saving employee', 'error');
//     }
//   };

//   const handleAddAllowance = async () => {
//     try {
//       if (!newAllowance.empId || !newAllowance.name || !newAllowance.percentage) {
//         showAlert('Please fill all required fields', 'error');
//         return;
//       }

//       const employee = employeeData.find(e => e.empId === newAllowance.empId);
//       if (!employee) {
//         showAlert('Invalid employee selected', 'error');
//         return;
//       }

//       const calculatedAmount = calculateAllowanceAmount(
//         calculateAttendanceBasedPay(
//           employee.basicPay,
//           employee.payableDays,
//           employee.lop
//         ),
//         newAllowance.percentage
//       );

//       const allowanceData = {
//         ...newAllowance,
//         amount: calculatedAmount.toString()
//       };

//       if (editMode && selectedItem) {
//         await axios.put(`${API_URL}/allowances/${selectedItem._id}`, allowanceData);
//         showAlert('Allowance updated successfully');
//       } else {
//         await axios.post(`${API_URL}/allowances`, allowanceData);
//         showAlert('Allowance added successfully');
//       }
//       fetchAllowances();
//       handleCloseDialog();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error saving allowance', 'error');
//     }
//   };

//   const handleAddDeduction = async () => {
//     try {
//       if (!newDeduction.empId || !newDeduction.name || !newDeduction.percentage) {
//         showAlert('Please fill all required fields', 'error');
//         return;
//       }

//       const employee = employeeData.find(e => e.empId === newDeduction.empId);
//       if (!employee) {
//         showAlert('Invalid employee selected', 'error');
//         return;
//       }

//       const calculatedAmount = calculateDeductionAmount(
//         calculateAttendanceBasedPay(
//           employee.basicPay,
//           employee.payableDays,
//           employee.lop
//         ),
//         newDeduction.percentage
//       );

//       const deductionData = {
//         ...newDeduction,
//         amount: calculatedAmount.toString()
//       };

//       if (editMode && selectedItem) {
//         await axios.put(`${API_URL}/deductions/${selectedItem._id}`, deductionData);
//         showAlert('Deduction updated successfully');
//       } else {
//         await axios.post(`${API_URL}/deductions`, deductionData);
//         showAlert('Deduction added successfully');
//       }
//       fetchDeductions();
//       handleCloseDeductionDialog();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error saving deduction', 'error');
//     }
//   };
//   const handleDeleteEmployee = async (empId) => {
//     try {
//       await axios.delete(`${API_URL}/employees/${empId}`);
//       showAlert('Employee deleted successfully');
//       fetchEmployees();
//       // Also fetch allowances and deductions as they might be affected
//       fetchAllowances();
//       fetchDeductions();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error deleting employee', 'error');
//     }
//   };

//   const handleDeleteAllowance = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/allowances/${id}`);
//       showAlert('Allowance deleted successfully');
//       fetchAllowances();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error deleting allowance', 'error');
//     }
//   };

//   const handleDeleteDeduction = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/deductions/${id}`);
//       showAlert('Deduction deleted successfully');
//       fetchDeductions();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error deleting deduction', 'error');
//     }
//   };

//   const calculateGrossSalary = (empId) => {
//     const employee = employeeData.find(e => e.empId === empId);
//     if (!employee) return 0;

//     const attendanceAdjustedBasicPay = calculateAttendanceBasedPay(
//       employee.basicPay,
//       employee.payableDays,
//       employee.lop
//     );

//     const totalAllowances = allowanceData
//       .filter(a => a.empId === empId && a.status === 'Active')
//       .reduce((sum, item) => {
//         const allowanceAmount = calculateAllowanceAmount(attendanceAdjustedBasicPay, item.percentage);
//         return sum + allowanceAmount;
//       }, 0);

//     return attendanceAdjustedBasicPay + totalAllowances;
//   };

//   const calculateTotalDeductions = (empId) => {
//     const employee = employeeData.find(e => e.empId === empId);
//     if (!employee) return 0;

//     const attendanceAdjustedBasicPay = calculateAttendanceBasedPay(
//       employee.basicPay,
//       employee.payableDays,
//       employee.lop
//     );

//     return deductions
//       .filter(d => d.empId === empId && d.status === 'Active')
//       .reduce((sum, item) => {
//         const deductionAmount = calculateDeductionAmount(attendanceAdjustedBasicPay, item.percentage);
//         return sum + deductionAmount;
//       }, 0);
//   };

//   const calculateNetSalary = (empId) => {
//     const grossSalary = calculateGrossSalary(empId);
//     const totalDeductions = calculateTotalDeductions(empId);
//     return grossSalary - totalDeductions;
//   };

//   const generatePayslip = async (empId) => {
//     try {
//       const employee = employeeData.find(e => e.empId === empId);
//       if (!employee) {
//         showAlert('Employee not found', 'error');
//         return null;
//       }

//       const payslipData = {
//         empId,
//         empName: employee.empName,
//         month: new Date().getMonth() + 1,
//         year: new Date().getFullYear(),
//         basicPay: employee.basicPay,
//         payableDays: employee.payableDays,
//         lopDays: employee.lop,
//         grossSalary: calculateGrossSalary(empId),
//         totalDeductions: calculateTotalDeductions(empId),
//         netSalary: calculateNetSalary(empId),
//         bankDetails: {
//           bankName: employee.bankName,
//           accountNo: employee.bankAccountNo
//         },
//         allowances: allowanceData.filter(a => a.empId === empId && a.status === 'Active'),
//         deductions: deductions.filter(d => d.empId === empId && d.status === 'Active')
//       };

//       const response = await axios.post(`${API_URL}/payslips/generate`, payslipData);
//       showAlert('Payslip generated successfully');
//       return response.data.data;
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error generating payslip', 'error');
//       return null;
//     }
//   };

//   const downloadPayslip = async (payslipId) => {
//     try {
//       const response = await axios.get(`${API_URL}/payslips/download/${payslipId}`, {
//         responseType: 'blob'
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `payslip_${payslipId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       showAlert(error.response?.data?.message || 'Error downloading payslip', 'error');
//     }
//   };
//   return (
//     <Container className="payroll-container">
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={() => setAlert({...alert, open: false})}
//       >
//         <Alert severity={alert.severity} onClose={() => setAlert({...alert, open: false})}>
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       <Paper className="main-paper">
//         <AppBar position="static" className="payroll-appbar">
//           <Tabs
//             value={tabIndex}
//             onChange={(e, newIndex) => setTabIndex(newIndex)}
//             variant="fullWidth"
//             className="payroll-tabs"
//           >
//             <Tab label="Employees" icon={<AddCircleIcon />} iconPosition="start" />
//             <Tab label="Allowances" icon={<AttachMoneyIcon />} iconPosition="start" />
//             <Tab label="Deductions" icon={<AttachMoneyIcon />} iconPosition="start" />
//             <Tab label="Payslips" icon={<DescriptionIcon />} iconPosition="start" />
//           </Tabs>
//         </AppBar>

//         {/* Employees Tab */}
//         <TabPanel value={tabIndex} index={0}>
//           <Box className="header-container">
//             <Typography variant="h5" className="section-title">
//               Employee Management
//               <span className="title-badge">{employeeData.length} Total</span>
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setEditMode(false);
//                 setNewEmployee({
//                   empId: "",
//                   empName: "",
//                   basicPay: "",
//                   bankName: "",
//                   bankAccountNo: "",
//                   pfNo: "",
//                   uanNo: "",
//                   panNo: "",
//                   payableDays: 30,
//                   lop: 0,
//                   status: "Active"
//                 });
//                 setOpenEmployeeDialog(true);
//               }}
//               startIcon={<AddCircleIcon />}
//               className="create-button"
//             >
//               Add Employee
//             </Button>
//           </Box>

//           <TableContainer component={Paper} className="table-container">
//             <Table>
//               <TableHead>
//                 <TableRow className="table-header">
//                   <TableCell>Emp ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Basic Pay</TableCell>
//                   <TableCell>Bank Details</TableCell>
//                   <TableCell>PF/UAN</TableCell>
//                   <TableCell>Payable Days</TableCell>
//                   <TableCell>LOP Days</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {employeeData.map(item => (
//                   <TableRow key={item.empId} className="table-row">
//                     <TableCell>{item.empId}</TableCell>
//                     <TableCell>{item.empName}</TableCell>
//                     <TableCell className="amount-cell">₹{item.basicPay}</TableCell>
//                     <TableCell>
//                       <Typography variant="body2">{item.bankName}</Typography>
//                       <Typography variant="caption">{item.bankAccountNo}</Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">PF: {item.pfNo}</Typography>
//                       <Typography variant="caption">UAN: {item.uanNo}</Typography>
//                     </TableCell>
//                     <TableCell>{item.payableDays}</TableCell>
//                     <TableCell>{item.lop}</TableCell>
//                     <TableCell className="action-cell">
//                       <Tooltip title="Edit">
//                         <IconButton
//                           className="edit-button"
//                           onClick={() => {
//                             setEditMode(true);
//                             setSelectedItem(item);
//                             setNewEmployee({...item});
//                             setOpenEmployeeDialog(true);
//                           }}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Delete">
//                         <IconButton
//                           className="delete-button"
//                           onClick={() => handleDeleteEmployee(item.empId)}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </TabPanel>
//                 {/* Allowances Tab */}
//                 <TabPanel value={tabIndex} index={1}>
//           <Box className="header-container">
//             <Typography variant="h5" className="section-title">
//               Allowance Management
//               <span className="title-badge">{allowanceData.length} Total</span>
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setEditMode(false);
//                 setNewAllowance({
//                   empId: "",
//                   name: "",
//                   percentage: 0,
//                   category: "Regular",
//                   status: "Active"
//                 });
//                 setOpenDialog(true);
//               }}
//               startIcon={<AddCircleIcon />}
//               className="create-button"
//             >
//               Add Allowance
//             </Button>
//           </Box>

//           <TableContainer component={Paper} className="table-container">
//             <Table>
//               <TableHead>
//                 <TableRow className="table-header">
//                   <TableCell>Employee</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Percentage</TableCell>
//                   <TableCell>Amount</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {allowanceData.map(item => {
//                   const employee = employeeData.find(e => e.empId === item.empId);
//                   const amount = calculateAllowanceAmount(
//                     calculateAttendanceBasedPay(
//                       employee?.basicPay || 0,
//                       employee?.payableDays || 30,
//                       employee?.lop || 0
//                     ),
//                     item.percentage
//                   );

//                   return (
//                     <TableRow key={item._id} className="table-row">
//                       <TableCell>{employee?.empName || 'N/A'}</TableCell>
//                       <TableCell>{item.name}</TableCell>
//                       <TableCell>{item.percentage}%</TableCell>
//                       <TableCell className="amount-cell">₹{amount.toFixed(2)}</TableCell>
//                       <TableCell>
//                         <Chip label={item.category} className={`category-chip ${item.category.toLowerCase()}`} />
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={item.status} className={`status-chip ${item.status.toLowerCase()}`} />
//                       </TableCell>
//                       <TableCell className="action-cell">
//                         <IconButton onClick={() => {
//                           setEditMode(true);
//                           setSelectedItem(item);
//                           setNewAllowance({...item});
//                           setOpenDialog(true);
//                         }}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDeleteAllowance(item._id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </TabPanel>

//         {/* Deductions Tab */}
//         <TabPanel value={tabIndex} index={2}>
//           <Box className="header-container">
//             <Typography variant="h5" className="section-title">
//               Deduction Management
//               <span className="title-badge">{deductions.length} Total</span>
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setEditMode(false);
//                 setNewDeduction({
//                   empId: "",
//                   name: "",
//                   percentage: 0,
//                   category: "Tax",
//                   status: "Active"
//                 });
//                 setOpenDeductionDialog(true);
//               }}
//               startIcon={<AddCircleIcon />}
//               className="create-button"
//             >
//               Add Deduction
//             </Button>
//           </Box>

//           <TableContainer component={Paper} className="table-container">
//             <Table>
//               <TableHead>
//                 <TableRow className="table-header">
//                   <TableCell>Employee</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Percentage</TableCell>
//                   <TableCell>Amount</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {deductions.map(item => {
//                   const employee = employeeData.find(e => e.empId === item.empId);
//                   const amount = calculateDeductionAmount(
//                     calculateAttendanceBasedPay(
//                       employee?.basicPay || 0,
//                       employee?.payableDays || 30,
//                       employee?.lop || 0
//                     ),
//                     item.percentage
//                   );

//                   return (
//                     <TableRow key={item._id} className="table-row">
//                       <TableCell>{employee?.empName || 'N/A'}</TableCell>
//                       <TableCell>{item.name}</TableCell>
//                       <TableCell>{item.percentage}%</TableCell>
//                       <TableCell className="amount-cell">₹{amount.toFixed(2)}</TableCell>
//                       <TableCell>
//                         <Chip label={item.category} className={`category-chip ${item.category.toLowerCase()}`} />
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={item.status} className={`status-chip ${item.status.toLowerCase()}`} />
//                       </TableCell>
//                       <TableCell className="action-cell">
//                         <IconButton onClick={() => {
//                           setEditMode(true);
//                           setSelectedItem(item);
//                           setNewDeduction({...item});
//                           setOpenDeductionDialog(true);
//                         }}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDeleteDeduction(item._id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </TabPanel>

//         {/* Payslips Tab */}
//         <TabPanel value={tabIndex} index={3}>
//           {employeeData.map(emp => (
//             <Paper key={emp.empId} className="payslip-card">
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" className="payslip-title">
//                     {emp.empName}
//                     <Chip label={emp.empId} className="emp-id-chip" />
//                   </Typography>

//                   <Box className="payslip-details">
//                     <Typography><strong>Basic Pay:</strong> ₹{emp.basicPay}</Typography>
//                     <Typography><strong>Payable Days:</strong> {emp.payableDays}</Typography>
//                     <Typography><strong>LOP Days:</strong> {emp.lop}</Typography>
//                     <Typography><strong>Actual Working Days:</strong> {emp.payableDays - emp.lop}</Typography>
//                     <Divider className="payslip-divider" />

//                     <Box className="allowances-section">
//                       <Typography variant="subtitle1"><strong>Allowances:</strong></Typography>
//                       {allowanceData
//                         .filter(a => a.empId === emp.empId && a.status === 'Active')
//                         .map(allowance => (
//                           <Typography key={allowance._id}>
//                             {allowance.name}: ₹{calculateAllowanceAmount(
//                               calculateAttendanceBasedPay(emp.basicPay, emp.payableDays, emp.lop),
//                               allowance.percentage
//                             ).toFixed(2)}
//                           </Typography>
//                         ))
//                       }
//                     </Box>

//                     <Box className="deductions-section">
//                       <Typography variant="subtitle1"><strong>Deductions:</strong></Typography>
//                       {deductions
//                         .filter(d => d.empId === emp.empId && d.status === 'Active')
//                         .map(deduction => (
//                           <Typography key={deduction._id}>
//                             {deduction.name}: ₹{calculateDeductionAmount(
//                               calculateAttendanceBasedPay(emp.basicPay, emp.payableDays, emp.lop),
//                               deduction.percentage
//                             ).toFixed(2)}
//                           </Typography>
//                         ))
//                       }
//                     </Box>

//                     <Divider className="payslip-divider" />
//                     <Typography><strong>Gross Salary:</strong> ₹{calculateGrossSalary(emp.empId).toFixed(2)}</Typography>
//                     <Typography><strong>Total Deductions:</strong> ₹{calculateTotalDeductions(emp.empId).toFixed(2)}</Typography>
//                     <Typography variant="h6" className="net-salary">
//                       <strong>Net Salary:</strong> ₹{calculateNetSalary(emp.empId).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6} className="payslip-actions">
//                   <Button
//                     variant="contained"
//                     onClick={async () => {
//                       const payslip = await generatePayslip(emp.empId);
//                       if (payslip) {
//                         downloadPayslip(payslip._id);
//                       }
//                     }}
//                     startIcon={<FileDownloadIcon />}
//                     className="download-button"
//                   >
//                     Generate & Download Payslip
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//           ))}
//         </TabPanel>
//       </Paper>

//       {/* Employee Dialog */}
//       <Dialog open={openEmployeeDialog} onClose={handleCloseEmployeeDialog} maxWidth="md" fullWidth>
//         <DialogTitle>{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Employee ID"
//                 fullWidth
//                 value={newEmployee.empId}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, empId: e.target.value })}
//                 disabled={editMode}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Employee Name"
//                 fullWidth
//                 value={newEmployee.empName}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, empName: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Basic Pay"
//                 type="number"
//                 fullWidth
//                 value={newEmployee.basicPay}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, basicPay: e.target.value })}
//                 required
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Bank Name"
//                 fullWidth
//                 value={newEmployee.bankName}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, bankName: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Bank Account No"
//                 fullWidth
//                 value={newEmployee.bankAccountNo}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, bankAccountNo: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="PF Number"
//                 fullWidth
//                 value={newEmployee.pfNo}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, pfNo: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="UAN Number"
//                 fullWidth
//                 value={newEmployee.uanNo}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, uanNo: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="PAN Number"
//                 fullWidth
//                 value={newEmployee.panNo}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, panNo: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Payable Days"
//                 type="number"
//                 fullWidth
//                 value={newEmployee.payableDays}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, payableDays: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="LOP Days"
//                 type="number"
//                 fullWidth
//                 value={newEmployee.lop}
//                 onChange={(e) => setNewEmployee({ ...newEmployee, lop: e.target.value })}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEmployeeDialog} color="error" variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleAddEmployee} color="primary" variant="contained">
//             {editMode ? 'Update' : 'Add'} Employee
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Allowance Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editMode ? 'Edit Allowance' : 'Add New Allowance'}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Employee</InputLabel>
//                 <Select
//                   value={newAllowance.empId}
//                   onChange={(e) => setNewAllowance({ ...newAllowance, empId: e.target.value })}
//                   label="Employee"
//                 >
//                   {employeeData.map(emp => (
//                     <MenuItem key={emp.empId} value={emp.empId}>
//                       {emp.empId} - {emp.empName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Allowance Name"
//                 fullWidth
//                 value={newAllowance.name}
//                 onChange={(e) => setNewAllowance({ ...newAllowance, name: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Percentage"
//                 type="number"
//                 fullWidth
//                 value={newAllowance.percentage}
//                 onChange={(e) => setNewAllowance({
//                   ...newAllowance,
//                   percentage: Math.max(0, Math.min(100, Number(e.target.value)))
//                 })}
//                 required
//                 InputProps={{
//                   inputProps: { min: 0, max: 100 },
//                   endAdornment: <InputAdornment position="end">%</InputAdornment>,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Category</InputLabel>
//                 <Select
//                   value={newAllowance.category}
//                   onChange={(e) => setNewAllowance({ ...newAllowance, category: e.target.value })}
//                   label="Category"
//                 >
//                   <MenuItem value="Regular">Regular</MenuItem>
//                   <MenuItem value="Travel">Travel</MenuItem>
//                   <MenuItem value="Special">Special</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={newAllowance.status}
//                   onChange={(e) => setNewAllowance({ ...newAllowance, status: e.target.value })}
//                   label="Status"
//                 >
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="error" variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleAddAllowance} color="primary" variant="contained">
//             {editMode ? 'Update' : 'Add'} Allowance
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Deduction Dialog */}
//       <Dialog open={openDeductionDialog} onClose={handleCloseDeductionDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editMode ? 'Edit Deduction' : 'Add New Deduction'}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Employee</InputLabel>
//                 <Select
//                   value={newDeduction.empId}
//                   onChange={(e) => setNewDeduction({ ...newDeduction, empId: e.target.value })}
//                   label="Employee"
//                 >
//                   {employeeData.map(emp => (
//                     <MenuItem key={emp.empId} value={emp.empId}>
//                       {emp.empId} - {emp.empName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Deduction Name"
//                 fullWidth
//                 value={newDeduction.name}
//                 onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Percentage"
//                 type="number"
//                 fullWidth
//                 value={newDeduction.percentage}
//                 onChange={(e) => setNewDeduction({
//                   ...newDeduction,
//                   percentage: Math.max(0, Math.min(100, Number(e.target.value)))
//                 })}
//                 required
//                 InputProps={{
//                   inputProps: { min: 0, max: 100 },
//                   endAdornment: <InputAdornment position="end">%</InputAdornment>,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Category</InputLabel>
//                 <Select
//                   value={newDeduction.category}
//                   onChange={(e) => setNewDeduction({ ...newDeduction, category: e.target.value })}
//                   label="Category"
//                 >
//                   <MenuItem value="Tax">Tax</MenuItem>
//                   <MenuItem value="Insurance">Insurance</MenuItem>
//                   <MenuItem value="Loan">Loan</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={newDeduction.status}
//                   onChange={(e) => setNewDeduction({ ...newDeduction, status: e.target.value })}
//                   label="Status"
//                 >
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeductionDialog} color="error" variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleAddDeduction} color="primary" variant="contained">
//             {editMode ? 'Update' : 'Add'} Deduction
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default PayrollSystem;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "./Payrollsystem.css";

const API_URL = "http://localhost:5000/api/payroll";

const TabPanel = ({ children, value, index }) => (
  <div
    hidden={value !== index}
    style={{
      animation: value === index ? "fadeIn 0.5s ease-in-out" : "none",
      padding: "24px",
    }}
  >
    {value === index && (
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "all 0.5s ease-in-out",
          }}
        >
          {children}
        </Box>
      </Fade>
    )}
  </div>
);
const PayrollSystem = () => {
  // State declarations with enhanced initial values
  const [tabIndex, setTabIndex] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);
  const [allowanceData, setAllowanceData] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeductionDialog, setOpenDeductionDialog] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
    transition: Fade,
  });

  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    empName: "",
    basicPay: "",
    bankName: "",
    bankAccountNo: "",
    pfNo: "",
    uanNo: "",
    panNo: "",
    payableDays: 30,
    lop: 0.0,
    department: "",
    designation: "",
    email: "",
    status: "Active",
  });

  const [newAllowance, setNewAllowance] = useState({
    empId: "",
    name: "",
    amount: "",
    percentage: 0,
    category: "Regular",
    status: "Active",
    description: "",
    isRecurring: true,
  });

  const [newDeduction, setNewDeduction] = useState({
    empId: "",
    name: "",
    amount: "",
    percentage: 0,
    category: "Tax",
    status: "Active",
    description: "",
    isRecurring: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchEmployees(),
        fetchAllowances(),
        fetchDeductions(),
        fetchPayslips(),
      ]);
    };
    fetchData();
  }, []);

  const showAlert = (message, severity = "success") => {
    setAlert({
      open: true,
      message,
      severity,
      transition: Fade,
    });
  };
  const handleCloseEmployeeDialog = () => {
    setOpenEmployeeDialog(false);
    setEditMode(false);
    setSelectedItem(null);
    setNewEmployee({
      empId: "",
      empName: "",
      basicPay: "",
      bankName: "",
      bankAccountNo: "",
      pfNo: "",
      uanNo: "",
      panNo: "",
      payableDays: 30,
      lop: 0,
      department: "",
      designation: "",
      email: "",
      status: "Active",
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedItem(null);
    setNewAllowance({
      empId: "",
      name: "",
      amount: "",
      percentage: 0,
      category: "Regular",
      status: "Active",
      description: "",
      isRecurring: true,
    });
  };

  const handleCloseDeductionDialog = () => {
    setOpenDeductionDialog(false);
    setEditMode(false);
    setSelectedItem(null);
    setNewDeduction({
      empId: "",
      name: "",
      amount: "",
      percentage: 0,
      category: "Tax",
      status: "Active",
      description: "",
      isRecurring: true,
    });
  };


  const calculatePerDayPay = (basicPay, payableDays) => {
    const pay = parseFloat(basicPay) || 0;
    const days = parseFloat(payableDays) || 30;
    return Number((pay / days).toFixed(2));
  };
  
  const calculateAttendanceBasedPay = (basicPay, payableDays, lop) => {
    const perDayPay = calculatePerDayPay(basicPay, payableDays);
    const actualPayableDays = (parseFloat(payableDays) || 30) - (parseFloat(lop) || 0);
    return Number((perDayPay * actualPayableDays).toFixed(2));
  };


  const handleLOPChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setNewEmployee({ ...newEmployee, lop: 0 });
      return;
    }
    
    const roundedValue = Math.round(value * 2) / 2;
    setNewEmployee({ ...newEmployee, lop: roundedValue });
  };


  const calculateAllowanceAmount = (basicPay, percentage) => {
    const pay = parseFloat(basicPay) || 0;
    const pct = parseFloat(percentage) || 0;
    return (pay * pct) / 100;
  };

  const calculateDeductionAmount = (basicPay, percentage) => {
    const pay = parseFloat(basicPay) || 0;
    const pct = parseFloat(percentage) || 0;
    return (pay * pct) / 100;
  };

  const calculateGrossSalary = (empId) => {
    const employee = employeeData.find((e) => e.empId === empId);
    if (!employee) return 0;

    const attendanceAdjustedBasicPay = calculateAttendanceBasedPay(
      employee.basicPay,
      employee.payableDays,
      employee.lop
    );

    const totalAllowances = allowanceData
      .filter((a) => a.empId === empId && a.status === "Active")
      .reduce((sum, item) => {
        const allowanceAmount = calculateAllowanceAmount(
          attendanceAdjustedBasicPay,
          item.percentage
        );
        return sum + allowanceAmount;
      }, 0);

    return attendanceAdjustedBasicPay + totalAllowances;
  };

  const calculateTotalDeductions = (empId) => {
    const employee = employeeData.find((e) => e.empId === empId);
    if (!employee) return 0;

    const attendanceAdjustedBasicPay = calculateAttendanceBasedPay(
      employee.basicPay,
      employee.payableDays,
      employee.lop
    );

    return deductions
      .filter((d) => d.empId === empId && d.status === "Active")
      .reduce((sum, item) => {
        const deductionAmount = calculateDeductionAmount(
          attendanceAdjustedBasicPay,
          item.percentage
        );
        return sum + deductionAmount;
      }, 0);
  };

  const calculateNetSalary = (empId) => {
    const grossSalary = calculateGrossSalary(empId);
    const totalDeductions = calculateTotalDeductions(empId);
    return grossSalary - totalDeductions;
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployeeData(response.data.data);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error fetching employees",
        "error"
      );
    }
  };

  const fetchAllowances = async () => {
    try {
      const response = await axios.get(`${API_URL}/allowances`);
      setAllowanceData(response.data.data);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error fetching allowances",
        "error"
      );
    }
  };

  const fetchDeductions = async () => {
    try {
      const response = await axios.get(`${API_URL}/deductions`);
      setDeductions(response.data.data);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error fetching deductions",
        "error"
      );
    }
  };

  const fetchPayslips = async () => {
    try {
      const response = await axios.get(`${API_URL}/payslips`);
      setPayslips(response.data.data);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error fetching payslips",
        "error"
      );
    }
  };

  const handleAddEmployee = async () => {
    try {
      if (!newEmployee.empId || !newEmployee.empName || !newEmployee.basicPay) {
        showAlert("Please fill all required fields", "error");
        return;
      }

      const payload = {
        ...newEmployee,
        basicPay: parseFloat(newEmployee.basicPay),
        payableDays: parseInt(newEmployee.payableDays),
        lop: parseInt(newEmployee.lop),
      };

      if (editMode && selectedItem) {
        await axios.put(`${API_URL}/employees/${selectedItem.empId}`, payload);
        showAlert("Employee updated successfully");
      } else {
        await axios.post(`${API_URL}/employees`, payload);
        showAlert("Employee added successfully");
      }
      await fetchEmployees();
      handleCloseEmployeeDialog();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error saving employee",
        "error"
      );
    }
  };

  const handleAddAllowance = async () => {
    try {
      if (
        !newAllowance.empId ||
        !newAllowance.name ||
        !newAllowance.percentage
      ) {
        showAlert("Please fill all required fields", "error");
        return;
      }

      const employee = employeeData.find((e) => e.empId === newAllowance.empId);
      if (!employee) {
        showAlert("Invalid employee selected", "error");
        return;
      }

      const calculatedAmount = calculateAllowanceAmount(
        calculateAttendanceBasedPay(
          employee.basicPay,
          employee.payableDays,
          employee.lop
        ),
        newAllowance.percentage
      );

      const payload = {
        ...newAllowance,
        amount: calculatedAmount.toString(),
        percentage: parseFloat(newAllowance.percentage),
      };

      if (editMode && selectedItem) {
        await axios.put(`${API_URL}/allowances/${selectedItem._id}`, payload);
        showAlert("Allowance updated successfully");
      } else {
        await axios.post(`${API_URL}/allowances`, payload);
        showAlert("Allowance added successfully");
      }
      await fetchAllowances();
      handleCloseDialog();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error saving allowance",
        "error"
      );
    }
  };

  const handleAddDeduction = async () => {
    try {
      if (
        !newDeduction.empId ||
        !newDeduction.name ||
        !newDeduction.percentage
      ) {
        showAlert("Please fill all required fields", "error");
        return;
      }

      const employee = employeeData.find((e) => e.empId === newDeduction.empId);
      if (!employee) {
        showAlert("Invalid employee selected", "error");
        return;
      }

      const calculatedAmount = calculateDeductionAmount(
        calculateAttendanceBasedPay(
          employee.basicPay,
          employee.payableDays,
          employee.lop
        ),
        newDeduction.percentage
      );

      const payload = {
        ...newDeduction,
        amount: calculatedAmount.toString(),
        percentage: parseFloat(newDeduction.percentage),
      };

      if (editMode && selectedItem) {
        await axios.put(`${API_URL}/deductions/${selectedItem._id}`, payload);
        showAlert("Deduction updated successfully");
      } else {
        await axios.post(`${API_URL}/deductions`, payload);
        showAlert("Deduction added successfully");
      }
      await fetchDeductions();
      handleCloseDeductionDialog();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error saving deduction",
        "error"
      );
    }
  };
  const handleDeleteEmployee = async (empId) => {
    try {
      await axios.delete(`${API_URL}/employees/${empId}`);
      showAlert("Employee deleted successfully");
      await Promise.all([
        fetchEmployees(),
        fetchAllowances(),
        fetchDeductions(),
      ]);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error deleting employee",
        "error"
      );
    }
  };

  const handleDeleteAllowance = async (id) => {
    try {
      await axios.delete(`${API_URL}/allowances/${id}`);
      showAlert("Allowance deleted successfully");
      await fetchAllowances();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error deleting allowance",
        "error"
      );
    }
  };

  const handleDeleteDeduction = async (id) => {
    try {
      await axios.delete(`${API_URL}/deductions/${id}`);
      showAlert("Deduction deleted successfully");
      await fetchDeductions();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error deleting deduction",
        "error"
      );
    }
  };

  const generatePayslip = async (empId) => {
    try {
      const employee = employeeData.find((e) => e.empId === empId);
      if (!employee) {
        showAlert("Employee not found", "error");
        return null;
      }

      const payslipData = {
        empId,
        empName: employee.empName,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicPay: employee.basicPay,
        payableDays: employee.payableDays,
        lopDays: employee.lop,
        grossSalary: calculateGrossSalary(empId),
        totalDeductions: calculateTotalDeductions(empId),
        netSalary: calculateNetSalary(empId),
        bankDetails: {
          bankName: employee.bankName,
          accountNo: employee.bankAccountNo,
        },
        allowances: allowanceData
          .filter((a) => a.empId === empId && a.status === "Active")
          .map((allowance) => ({
            ...allowance,
            amount: calculateAllowanceAmount(
              calculateAttendanceBasedPay(
                employee.basicPay,
                employee.payableDays,
                employee.lop
              ),
              allowance.percentage
            ).toString(),
          })),
        deductions: deductions
          .filter((d) => d.empId === empId && d.status === "Active")
          .map((deduction) => ({
            ...deduction,
            amount: calculateDeductionAmount(
              calculateAttendanceBasedPay(
                employee.basicPay,
                employee.payableDays,
                employee.lop
              ),
              deduction.percentage
            ).toString(),
          })),
      };

      const response = await axios.post(
        `${API_URL}/payslips/generate`,
        payslipData
      );
      showAlert("Payslip generated successfully");
      await fetchPayslips();
      return response.data.data;
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error generating payslip",
        "error"
      );
      return null;
    }
  };

  const downloadPayslip = async (payslipId) => {
    try {
      const response = await axios.get(
        `${API_URL}/payslips/download/${payslipId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip_${payslipId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error downloading payslip",
        "error"
      );
    }
  };
  return (

    <Container className="payroll-container">
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        TransitionComponent={alert.transition}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Paper className="main-paper" elevation={0}>
        <AppBar position="static" className="payroll-appbar" elevation={0}>
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            className="payroll-tabs"
            TabIndicatorProps={{
              style: {
                backgroundColor: "white",
                height: "3px",
              },
            }}
          >
            <Tab
              label="Employees"
              icon={<AddCircleIcon />}
              iconPosition="start"
              className="tab-item"
            />
            <Tab
              label="Allowances"
              icon={<AttachMoneyIcon />}
              iconPosition="start"
              className="tab-item"
            />
            <Tab
              label="Deductions"
              icon={<AttachMoneyIcon />}
              iconPosition="start"
              className="tab-item"
            />
            <Tab
              label="Payslips"
              icon={<DescriptionIcon />}
              iconPosition="start"
              className="tab-item"
            />
          </Tabs>
        </AppBar>



        {/* Employees Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Box className="header-container">
            <Typography variant="h5" className="section-title">
              Employee Management
              <span className="title-badge">{employeeData.length} Total</span>
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(false);
                setNewEmployee({
                  empId: "",
                  empName: "",
                  basicPay: "",
                  bankName: "",
                  bankAccountNo: "",
                  pfNo: "",
                  uanNo: "",
                  panNo: "",
                  payableDays: 30,
                  lop: 0,
                  status: "Active",
                });
                setOpenEmployeeDialog(true);
              }}
              startIcon={<AddCircleIcon />}
              className="create-button"
            >
              Add Employee
            </Button>
          </Box>

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Emp ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>  
  <TableCell>Designation</TableCell>
                  <TableCell>Basic Pay</TableCell>
                  <TableCell>Bank Details</TableCell>
                  <TableCell>PF/UAN</TableCell>
                  <TableCell>Payable Days</TableCell>
                  <TableCell>LOP Days</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employeeData.map((item) => (
                  <TableRow key={item.empId} className="table-row">
                    <TableCell>{item.empId}</TableCell>
                    <TableCell>{item.empName}</TableCell>
                    <TableCell>{item.department}</TableCell>  {/* New cell */}
  <TableCell>{item.designation}</TableCell>
                    <TableCell className="amount-cell">
                      ₹{item.basicPay}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.bankName}</Typography>
                      <Typography variant="caption">
                        {item.bankAccountNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">PF: {item.pfNo}</Typography>
                      <Typography variant="caption">
                        UAN: {item.uanNo}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.payableDays}</TableCell>
                    <TableCell>{item.lop}</TableCell>
                    <TableCell className="action-cell">
                      <Tooltip title="Edit">
                        <IconButton
                          className="edit-button"
                          onClick={() => {
                            setEditMode(true);
                            setSelectedItem(item);
                            setNewEmployee({ ...item });
                            setOpenEmployeeDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          className="delete-button"
                          onClick={() => handleDeleteEmployee(item.empId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>


        {/* Allowances Tab */}
        <TabPanel value={tabIndex} index={1}>
          <Box className="header-container">
            <Typography variant="h5" className="section-title">
              Allowance Management
              <span className="title-badge">{allowanceData.length} Total</span>
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(false);
                setNewAllowance({
                  empId: "",
                  name: "",
                  percentage: 0,
                  category: "Regular",
                  status: "Active",
                });
                setOpenDialog(true);
              }}
              startIcon={<AddCircleIcon />}
              className="create-button"
            >
              Add Allowance
            </Button>
          </Box>

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Employee</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allowanceData.map((item) => {
                  const employee = employeeData.find(
                    (e) => e.empId === item.empId
                  );
                  const amount = calculateAllowanceAmount(
                    calculateAttendanceBasedPay(
                      employee?.basicPay || 0,
                      employee?.payableDays || 30,
                      employee?.lop || 0
                    ),
                    item.percentage
                  );

                  return (
                    <TableRow key={item._id} className="table-row">
                      <TableCell>{employee?.empName || "N/A"}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.percentage}%</TableCell>
                      <TableCell className="amount-cell">
                        ₹{amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.category}
                          className={`category-chip ${item.category.toLowerCase()}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          className={`status-chip ${item.status.toLowerCase()}`}
                        />
                      </TableCell>
                      <TableCell className="action-cell">
                        <IconButton
                          onClick={() => {
                            setEditMode(true);
                            setSelectedItem(item);
                            setNewAllowance({ ...item });
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAllowance(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Deductions Tab */}
        <TabPanel value={tabIndex} index={2}>
          <Box className="header-container">
            <Typography variant="h5" className="section-title">
              Deduction Management
              <span className="title-badge">{deductions.length} Total</span>
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(false);
                setNewDeduction({
                  empId: "",
                  name: "",
                  percentage: 0,
                  category: "Tax",
                  status: "Active",
                });
                setOpenDeductionDialog(true);
              }}
              startIcon={<AddCircleIcon />}
              className="create-button"
            >
              Add Deduction
            </Button>
          </Box>

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Employee</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deductions.map((item) => {
                  const employee = employeeData.find(
                    (e) => e.empId === item.empId
                  );
                  const amount = calculateDeductionAmount(
                    calculateAttendanceBasedPay(
                      employee?.basicPay || 0,
                      employee?.payableDays || 30,
                      employee?.lop || 0
                    ),
                    item.percentage
                  );

                  return (
                    <TableRow key={item._id} className="table-row">
                      <TableCell>{employee?.empName || "N/A"}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.percentage}%</TableCell>
                      <TableCell className="amount-cell">
                        ₹{amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.category}
                          className={`category-chip ${item.category.toLowerCase()}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          className={`status-chip ${item.status.toLowerCase()}`}
                        />
                      </TableCell>
                      <TableCell className="action-cell">
                        <IconButton
                          onClick={() => {
                            setEditMode(true);
                            setSelectedItem(item);
                            setNewDeduction({ ...item });
                            setOpenDeductionDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteDeduction(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Payslips Tab
        <TabPanel value={tabIndex} index={3}>
          {employeeData.map(emp => (
            <Paper key={emp.empId} className="payslip-card">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className="payslip-title">
                    {emp.empName}
                    <Chip label={emp.empId} className="emp-id-chip" />
                  </Typography>
                  
                  <Box className="payslip-details">
                    <Typography><strong>Basic Pay:</strong> ₹{emp.basicPay}</Typography>
                    <Typography><strong>Payable Days:</strong> {emp.payableDays}</Typography>
                    <Typography><strong>LOP Days:</strong> {emp.lop}</Typography>
                    <Typography><strong>Actual Working Days:</strong> {emp.payableDays - emp.lop}</Typography>
                    <Divider className="payslip-divider" />
                    
                    <Box className="allowances-section">
                      <Typography variant="subtitle1"><strong>Allowances:</strong></Typography>
                      {allowanceData
                        .filter(a => a.empId === emp.empId && a.status === 'Active')
                        .map(allowance => (
                          <Typography key={allowance._id}>
                            {allowance.name}: ₹{calculateAllowanceAmount(
                              calculateAttendanceBasedPay(emp.basicPay, emp.payableDays, emp.lop),
                              allowance.percentage
                            ).toFixed(2)}
                          </Typography>
                        ))
                      }
                    </Box>
                    
                    <Box className="deductions-section">
                      <Typography variant="subtitle1"><strong>Deductions:</strong></Typography>
                      {deductions
                        .filter(d => d.empId === emp.empId && d.status === 'Active')
                        .map(deduction => (
                          <Typography key={deduction._id}>
                            {deduction.name}: ₹{calculateDeductionAmount(
                              calculateAttendanceBasedPay(emp.basicPay, emp.payableDays, emp.lop),
                              deduction.percentage
                            ).toFixed(2)}
                          </Typography>
                        ))
                      }
                    </Box>
                    
                    <Divider className="payslip-divider" />
                    <Typography><strong>Gross Salary:</strong> ₹{calculateGrossSalary(emp.empId).toFixed(2)}</Typography>
                    <Typography><strong>Total Deductions:</strong> ₹{calculateTotalDeductions(emp.empId).toFixed(2)}</Typography>
                    <Typography variant="h6" className="net-salary">
                      <strong>Net Salary:</strong> ₹{calculateNetSalary(emp.empId).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} className="payslip-actions">
                  <Button
                    variant="contained"
                    onClick={async () => {
                      const payslip = await generatePayslip(emp.empId);
                      if (payslip) {
                        downloadPayslip(payslip._id);
                      }
                    }}
                    startIcon={<FileDownloadIcon />}
                    className="download-button"
                  >
                    Generate & Download Payslip
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </TabPanel> */}



        {/* Payslips Tab */}
        <TabPanel value={tabIndex} index={3}>
          {employeeData.map((emp) => (
            <Paper key={emp.empId} className="payslip-card"
            sx={{ 
              marginBottom: '2rem',  // Adds space between payslip cards
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            >
              <Grid container spacing={3}>
                {/* Employee Details Section */}
                <Grid item xs={12}>
                  <Typography variant="h5" className="payslip-header">
                    Employee Details
                    <Chip label={`ID: ${emp.empId}`} className="emp-id-chip" />
                  </Typography>
                  <Box className="details-grid">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography>
                          <strong>Name:</strong> {emp.empName}
                        </Typography>
                        <Typography>
                          <strong>Department:</strong> {emp.department}
                        </Typography>
                        <Typography>
                          <strong>Designation:</strong> {emp.designation}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography>
                          <strong>Bank Name:</strong> {emp.bankName}
                        </Typography>
                        <Typography>
                          <strong>Account No:</strong> {emp.bankAccountNo}
                        </Typography>
                        <Typography>
                          <strong>PAN No:</strong> {emp.panNo}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography>
                          <strong>PF No:</strong> {emp.pfNo}
                        </Typography>
                        <Typography>
                          <strong>UAN No:</strong> {emp.uanNo}
                        </Typography>
                        <Typography>
                          <strong>Status:</strong> {emp.status}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Attendance Details Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" className="section-header">
                    Attendance Details
                  </Typography>
                  <Box className="attendance-grid">
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Paper className="stat-card">
                          <Typography variant="subtitle2">
                            Total Days
                          </Typography>
                          <Typography variant="h6">
                            {emp.payableDays}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper className="stat-card">
                          <Typography variant="subtitle2">LOP Days</Typography>
                          <Typography variant="h6">{emp.lop}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper className="stat-card">
                          <Typography variant="subtitle2">
                            Working Days
                          </Typography>
                          <Typography variant="h6">
                            {emp.payableDays - emp.lop}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper className="stat-card">
                          <Typography variant="subtitle2">
                            Per Day Pay
                          </Typography>
                          <Typography variant="h6">
                            ₹
                            {calculatePerDayPay(
                              emp.basicPay,
                              emp.payableDays
                            ).toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Earnings Section */}
                {/* <Grid item xs={12} md={6}>
                  <Paper className="earnings-section">
                    <Typography variant="h6" className="section-header">
                      Earnings
                    </Typography>
                    <Box className="amount-list">
                      <Box className="amount-row">
                        <Typography>Basic Pay</Typography>
                        <Typography>₹{emp.basicPay}</Typography>
                      </Box>
                      {allowanceData
                        .filter(
                          (a) => a.empId === emp.empId && a.status === "Active"
                        )
                        .map((allowance) => (
                          <Box key={allowance._id} className="amount-row">
                            <Typography>
                              {allowance.name} ({allowance.percentage}%)
                            </Typography>
                            <Typography>
                              ₹
                              {calculateAllowanceAmount(
                                calculateAttendanceBasedPay(
                                  emp.basicPay,
                                  emp.payableDays,
                                  emp.lop
                                ),
                                allowance.percentage
                              ).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      <Box className="amount-row total">
                        <Typography>
                          <strong>Gross Earnings</strong>
                        </Typography>
                        <Typography>
                          <strong>
                            ₹{calculateGrossSalary(emp.empId).toFixed(2)}
                          </strong>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid> */}

                {/* Deductions Section */}
                {/* <Grid item xs={12} md={6}>
                  <Paper className="deductions-section">
                    <Typography variant="h6" className="section-header">
                      Deductions
                    </Typography>
                    <Box className="amount-list">
                      {deductions
                        .filter(
                          (d) => d.empId === emp.empId && d.status === "Active"
                        )
                        .map((deduction) => (
                          <Box key={deduction._id} className="amount-row">
                            <Typography>
                              {deduction.name} ({deduction.percentage}%)
                            </Typography>
                            <Typography>
                              ₹
                              {calculateDeductionAmount(
                                calculateAttendanceBasedPay(
                                  emp.basicPay,
                                  emp.payableDays,
                                  emp.lop
                                ),
                                deduction.percentage
                              ).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      <Box className="amount-row total">
                        <Typography>
                          <strong>Total Deductions</strong>
                        </Typography>
                        <Typography>
                          <strong>
                            ₹{calculateTotalDeductions(emp.empId).toFixed(2)}
                          </strong>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid> */}



<Grid container spacing={3}>
  {/* Left Column - Earnings */}
  <Grid item xs={12} md={6}>
    <Paper className="earnings-section">
      <Typography variant="h6" className="section-header">
        Earnings
      </Typography>
      <Box className="amount-list">
        <Box className="amount-row">
          <Typography>Basic Pay</Typography>
          <Typography>Rs. {emp.basicPay}</Typography>
        </Box>
        {allowanceData
          .filter(a => a.empId === emp.empId && a.status === "Active")
          .map(allowance => (
            <Box key={allowance._id} className="amount-row">
              <Typography>{allowance.name}</Typography>
              <Typography>
                Rs. {calculateAllowanceAmount(
                  calculateAttendanceBasedPay(
                    emp.basicPay,
                    emp.payableDays,
                    emp.lop
                  ),
                  allowance.percentage
                ).toFixed(2)}
              </Typography>
            </Box>
          ))}
        <Box className="amount-row total">
          <Typography><strong>Total Earnings</strong></Typography>
          <Typography>
            <strong>Rs. {calculateGrossSalary(emp.empId).toFixed(2)}</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Grid>

  {/* Right Column - Deductions */}
  <Grid item xs={12} md={6}>
    <Paper className="deductions-section">
      <Typography variant="h6" className="section-header">
        Deductions
      </Typography>
      <Box className="amount-list">
        {deductions
          .filter(d => d.empId === emp.empId && d.status === "Active")
          .map(deduction => (
            <Box key={deduction._id} className="amount-row">
              <Typography>{deduction.name}</Typography>
              <Typography>
                Rs. {calculateDeductionAmount(
                  calculateAttendanceBasedPay(
                    emp.basicPay,
                    emp.payableDays,
                    emp.lop
                  ),
                  deduction.percentage
                ).toFixed(2)}
              </Typography>
            </Box>
          ))}
        <Box className="amount-row total">
          <Typography><strong>Total Deductions</strong></Typography>
          <Typography>
            <strong>Rs. {calculateTotalDeductions(emp.empId).toFixed(2)}</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Grid>
</Grid>


                {/* Net Salary Section */}
                <Grid item xs={12}>
                  <Paper className="net-salary-section">
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="h5">
                          Net Salary: ₹
                          {calculateNetSalary(emp.empId).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={async () => {
                            const payslip = await generatePayslip(emp.empId);
                            if (payslip) {
                              downloadPayslip(payslip._id);
                            }
                          }}
                          startIcon={<FileDownloadIcon />}
                          className="download-button"
                        >
                          Generate & Download Payslip
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </TabPanel>



        {/* Create Employee Dialog */}
        <Dialog
          open={openEmployeeDialog}
          onClose={handleCloseEmployeeDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            elevation: 0,
            className: "dialog-paper",
          }}
        >
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee ID"
                  fullWidth
                  value={newEmployee.empId}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, empId: e.target.value })
                  }
                  disabled={editMode}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee Name"
                  fullWidth
                  value={newEmployee.empName}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, empName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
  <TextField
    label="Department"
    fullWidth
    value={newEmployee.department}
    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
    required
  />
</Grid>
<Grid item xs={12} md={6}>
  <TextField
    label="Designation" 
    fullWidth
    value={newEmployee.designation}
    onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
    required
  />
</Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Basic Pay"
                  type="number"
                  fullWidth
                  value={newEmployee.basicPay}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, basicPay: e.target.value })
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bank Name"
                  fullWidth
                  value={newEmployee.bankName}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, bankName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bank Account No"
                  fullWidth
                  value={newEmployee.bankAccountNo}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      bankAccountNo: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="PF Number"
                  fullWidth
                  value={newEmployee.pfNo}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, pfNo: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="UAN Number"
                  fullWidth
                  value={newEmployee.uanNo}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, uanNo: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="PAN Number"
                  fullWidth
                  value={newEmployee.panNo}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, panNo: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payable Days"
                  type="number"
                  fullWidth
                  value={newEmployee.payableDays}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      payableDays: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  label="LOP Days"
                  type="number"
                  fullWidth
                  value={newEmployee.lop}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, lop: e.target.value })
                  }
                />
              </Grid> */}
           <Grid item xs={12} md={6}>
  <TextField
  label="LOP Days"
  type="number"
  fullWidth
  value={newEmployee.lop}
  onChange={handleLOPChange}
  inputProps={{
    step: 0.5,
    min: 0
  }}
  helperText="Enter values in 0.5 day increments"
/>
  
</Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              onClick={handleCloseEmployeeDialog}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              color="primary"
              variant="contained"
            >
              {editMode ? "Update" : "Add"} Employee
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Allowance Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            className: "dialog-paper",
          }}
        >
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Allowance" : "Add New Allowance"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={newAllowance.empId}
                    onChange={(e) =>
                      setNewAllowance({
                        ...newAllowance,
                        empId: e.target.value,
                      })
                    }
                    label="Employee"
                  >
                    {employeeData.map((emp) => (
                      <MenuItem key={emp.empId} value={emp.empId}>
                        {emp.empId} - {emp.empName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Allowance Name"
                  fullWidth
                  value={newAllowance.name}
                  onChange={(e) =>
                    setNewAllowance({ ...newAllowance, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Percentage"
                  type="number"
                  fullWidth
                  value={newAllowance.percentage}
                  onChange={(e) =>
                    setNewAllowance({
                      ...newAllowance,
                      percentage: Math.max(
                        0,
                        Math.min(100, Number(e.target.value))
                      ),
                    })
                  }
                  required
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newAllowance.category}
                    onChange={(e) =>
                      setNewAllowance({
                        ...newAllowance,
                        category: e.target.value,
                      })
                    }
                    label="Category"
                  >
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Special">Special</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newAllowance.status}
                    onChange={(e) =>
                      setNewAllowance({
                        ...newAllowance,
                        status: e.target.value,
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              onClick={handleCloseDialog}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAllowance}
              color="primary"
              variant="contained"
            >
              {editMode ? "Update" : "Add"} Allowance
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Deduction Dialog */}
        <Dialog
          open={openDeductionDialog}
          onClose={handleCloseDeductionDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            className: "dialog-paper",
          }}
        >
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Deduction" : "Add New Deduction"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={newDeduction.empId}
                    onChange={(e) =>
                      setNewDeduction({
                        ...newDeduction,
                        empId: e.target.value,
                      })
                    }
                    label="Employee"
                  >
                    {employeeData.map((emp) => (
                      <MenuItem key={emp.empId} value={emp.empId}>
                        {emp.empId} - {emp.empName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Deduction Name"
                  fullWidth
                  value={newDeduction.name}
                  onChange={(e) =>
                    setNewDeduction({ ...newDeduction, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Percentage"
                  type="number"
                  fullWidth
                  value={newDeduction.percentage}
                  onChange={(e) =>
                    setNewDeduction({
                      ...newDeduction,
                      percentage: Math.max(
                        0,
                        Math.min(100, Number(e.target.value))
                      ),
                    })
                  }
                  required
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newDeduction.category}
                    onChange={(e) =>
                      setNewDeduction({
                        ...newDeduction,
                        category: e.target.value,
                      })
                    }
                    label="Category"
                  >
                    <MenuItem value="Tax">Tax</MenuItem>
                    <MenuItem value="Insurance">Insurance</MenuItem>
                    <MenuItem value="Loan">Loan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newDeduction.status}
                    onChange={(e) =>
                      setNewDeduction({
                        ...newDeduction,
                        status: e.target.value,
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              onClick={handleCloseDeductionDialog}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDeduction}
              color="primary"
              variant="contained"
            >
              {editMode ? "Update" : "Add"} Deduction
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PayrollSystem;
