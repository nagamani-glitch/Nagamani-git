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
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";
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

  // Add these state variables near your other state declarations
  const [selectedAllowances, setSelectedAllowances] = useState([]);
  const [bulkEmployeeId, setBulkEmployeeId] = useState("");
  // const [bulkAllowancePercentage, setBulkAllowancePercentage] = useState(0);
  const [allowancePercentages, setAllowancePercentages] = useState({});

  // for the add deduction
  // Add these state variables for deductions similar to allowances
  const [selectedDeductions, setSelectedDeductions] = useState([]);
  const [deductionPercentages, setDeductionPercentages] = useState({});
  const [bulkDeductionEmployeeId, setBulkDeductionEmployeeId] = useState("");

  // Add this function to handle multiple deduction selection
  const handleDeductionSelection = (deductionType, isChecked) => {
    if (isChecked) {
      setSelectedDeductions([...selectedDeductions, deductionType]);
      // Initialize with default percentage if not already set
      if (!deductionPercentages[deductionType]) {
        setDeductionPercentages({
          ...deductionPercentages,
          [deductionType]: 0,
        });
      }
    } else {
      setSelectedDeductions(
        selectedDeductions.filter((item) => item !== deductionType)
      );
    }
  };

  // Add a handler for deduction percentage changes
  const handleDeductionPercentageChange = (deductionType, value) => {
    const percentage = Math.max(0, Math.min(100, Number(value)));
    setDeductionPercentages({
      ...deductionPercentages,
      [deductionType]: percentage,
    });
  };

  // Add this function to handle bulk deduction creation
  // const handleAddMultipleDeductions = async () => {
  //   try {
  //     if (!bulkDeductionEmployeeId || selectedDeductions.length === 0) {
  //       showAlert("Please select an employee and at least one deduction", "error");
  //       return;
  //     }

  //     const employee = employeeData.find((e) => e.empId === bulkDeductionEmployeeId);
  //     if (!employee) {
  //       showAlert("Invalid employee selected", "error");
  //       return;
  //     }

  //     // Create an array of deduction objects with individual percentages
  //     const deductionsToAdd = selectedDeductions.map(deductionName => ({
  //       empId: bulkDeductionEmployeeId,
  //       name: deductionName,
  //       percentage: parseFloat(deductionPercentages[deductionName] || 0),
  //       amount: calculateDeductionAmount(
  //         employee.basicPay,
  //         deductionPercentages[deductionName] || 0
  //       ).toString(),
  //       category: "Tax",
  //       status: "Active",
  //       isRecurring: true
  //     }));

  //     // Create all deductions in sequence
  //     for (const deduction of deductionsToAdd) {
  //       await axios.post(`${API_URL}/deductions`, deduction);
  //     }

  //     showAlert(`Successfully added ${deductionsToAdd.length} deductions`);
  //     await fetchDeductions();
  //     handleCloseDeductionDialog();
  //   } catch (error) {
  //     showAlert(
  //       error.response?.data?.message || "Error saving deductions",
  //       "error"
  //     );
  //   }
  // };

  // This is for the Add employee preview dialog
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
const [previewEmployee, setPreviewEmployee] = useState(null);


const handleOpenPreview = (empId) => {
  // First close the dialog if it's already open to ensure fresh data
  if (previewDialogOpen) {
    setPreviewDialogOpen(false);
  }

  // Fetch the latest data
  Promise.all([fetchAllowances(), fetchDeductions()]).then(() => {
    // Now set the employee and open the dialog with fresh data
    const employee = employeeData.find((emp) => emp.empId === empId);
    if (employee) {
      setPreviewEmployee(employee);
      setPreviewDialogOpen(true);
    }
  });
};

// Add this function to handle closing the preview dialog
const handleClosePreview = () => {
  setPreviewDialogOpen(false);
  setPreviewEmployee(null);
};



  // Add these state variables for allowance preview
  const [previewAllowanceDialog, setPreviewAllowanceDialog] = useState(false);
  const [previewAllowance, setPreviewAllowance] = useState(null);

  

  // Add this function to handle multiple allowance selection
  const handleAllowanceSelection = (allowanceType, isChecked) => {
    if (isChecked) {
      setSelectedAllowances([...selectedAllowances, allowanceType]);
      // Initialize with default percentage if not already set
      if (!allowancePercentages[allowanceType]) {
        setAllowancePercentages({
          ...allowancePercentages,
          [allowanceType]: 0,
        });
      }
    } else {
      setSelectedAllowances(
        selectedAllowances.filter((item) => item !== allowanceType)
      );
    }
  };

  // Add a handler for percentage changes
  const handlePercentageChange = (allowanceType, value) => {
    const percentage = Math.max(0, Math.min(100, Number(value)));
    setAllowancePercentages({
      ...allowancePercentages,
      [allowanceType]: percentage,
    });
  };

  // Update the handleAddMultipleAllowances function (if you have one)
  const handleAddMultipleAllowances = async () => {
    try {
      if (!bulkEmployeeId || selectedAllowances.length === 0) {
        showAlert(
          "Please select an employee and at least one allowance",
          "error"
        );
        return;
      }

      const employee = employeeData.find((e) => e.empId === bulkEmployeeId);
      if (!employee) {
        showAlert("Invalid employee selected", "error");
        return;
      }

      // Process allowances
      for (const allowanceName of selectedAllowances) {
        const percentage = parseFloat(allowancePercentages[allowanceName] || 0);
        const amount = calculateAllowanceAmount(
          employee.basicPay,
          percentage
        ).toString();

        await axios.post(`${API_URL}/allowances`, {
          empId: bulkEmployeeId,
          name: allowanceName,
          percentage,
          amount,
          category: "Regular",
          status: "Active",
          isRecurring: true,
        });
      }

      // Process deductions
      if (selectedDeductions.length > 0) {
        for (const deductionName of selectedDeductions) {
          const percentage = parseFloat(
            deductionPercentages[deductionName] || 0
          );
          const amount = calculateDeductionAmount(
            employee.basicPay,
            percentage
          ).toString();

          await axios.post(`${API_URL}/deductions`, {
            empId: bulkEmployeeId,
            name: deductionName,
            percentage,
            amount,
            category: "Tax",
            status: "Active",
            isRecurring: true,
          });
        }
      }

      showAlert(`Successfully added allowances and deductions`);
      await fetchAllowances();
      await fetchDeductions();
      handleCloseDialog();
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          "Error saving allowances and deductions",
        "error"
      );
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      employeeData.map((emp) => ({
        "Employee ID": emp.empId,
        Name: emp.empName,
        Department: emp.department,
        Designation: emp.designation,
        "Basic Pay": emp.basicPay,
        "Bank Name": emp.bankName,
        "Bank Account No": emp.bankAccountNo,
        "PF Number": emp.pfNo,
        "UAN Number": emp.uanNo,
        "PAN Number": emp.panNo,
        "Payable Days": emp.payableDays,
        "LOP Days": emp.lop,
        Status: emp.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "employees.xlsx");
  };

  const importFromExcel = async (event) => {
    try {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and format each row before sending to API
        const validEmployees = jsonData
          .map((row) => ({
            empId: String(row["Employee ID"] || "").trim(),
            empName: String(row["Name"] || "").trim(),
            department: String(row["Department"] || "").trim(),
            designation: String(row["Designation"] || "").trim(),
            basicPay: Number(row["Basic Pay"]) || 0,
            bankName: String(row["Bank Name"] || "").trim(),
            bankAccountNo: String(row["Bank Account No"] || "").trim(),
            pfNo: String(row["PF Number"] || "").trim(),
            uanNo: String(row["UAN Number"] || "").trim(),
            panNo: String(row["PAN Number"] || "").trim(),
            payableDays: Number(row["Payable Days"]) || 30,
            lop: Number(row["LOP Days"]) || 0,
            status: "Active",
          }))
          .filter((emp) => emp.empId && emp.empName && emp.basicPay > 0);

        if (validEmployees.length === 0) {
          showAlert("No valid employee data found in Excel file", "error");
          return;
        }

        // Send all employees in a single API call
        const response = await axios.post(`${API_URL}/employees/bulk`, {
          employees: validEmployees,
        });

        if (response.data.success) {
          await fetchEmployees();
          showAlert(`Successfully imported ${validEmployees.length} employees`);
        }

        event.target.value = "";
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      showAlert(
        "Import failed: " + (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

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

  // Helper functions for calculations
  const calculatePerDayPay = (basicPay, payableDays) => {
    const pay = parseFloat(basicPay) || 0;
    const days = parseFloat(payableDays) || 30;
    return Number((pay / days).toFixed(2));
  };

  const calculateAttendanceBasedPay = (basicPay, payableDays, lop) => {
    const perDayPay = calculatePerDayPay(basicPay, payableDays);
    const actualPayableDays =
      (parseFloat(payableDays) || 30) - (parseFloat(lop) || 0);
    return Number((perDayPay * actualPayableDays).toFixed(2));
  };

  const calculateAllowanceAmount = (basicPay, percentage) => {
    const pay = parseFloat(basicPay) || 0;
    const pct = parseFloat(percentage) || 0;
    return Number(((pay * pct) / 100).toFixed(2));
  };

  const calculateDeductionAmount = (basicPay, percentage) => {
    const pay = parseFloat(basicPay) || 0;
    const pct = parseFloat(percentage) || 0;
    return Number(((pay * pct) / 100).toFixed(2));
  };

  const calculateGrossSalary = (empId) => {
    const employee = employeeData.find((e) => e.empId === empId);
    if (!employee) return 0;

    // Calculate attendance adjusted basic pay
    const attendanceAdjustedBasicPay = calculateAttendanceBasedPay(
      employee.basicPay,
      employee.payableDays,
      employee.lop
    );

    // Calculate allowances from full basic pay
    const totalAllowances = allowanceData
      .filter((a) => a.empId === empId && a.status === "Active")
      .reduce((sum, item) => {
        const allowanceAmount = calculateAllowanceAmount(
          employee.basicPay,
          item.percentage
        );
        return sum + allowanceAmount;
      }, 0);

    return Number((attendanceAdjustedBasicPay + totalAllowances).toFixed(2));
  };

  const calculateTotalDeductions = (empId) => {
    const employee = employeeData.find((e) => e.empId === empId);
    if (!employee) return 0;

    return deductions
      .filter((d) => d.empId === empId && d.status === "Active")
      .reduce((sum, item) => {
        const deductionAmount = calculateDeductionAmount(
          employee.basicPay,
          item.percentage
        );
        return sum + deductionAmount;
      }, 0);
  };

  const calculateNetSalary = (empId) => {
    const grossSalary = calculateGrossSalary(empId);
    const totalDeductions = calculateTotalDeductions(empId);
    return Number((grossSalary - totalDeductions).toFixed(2));
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
  // API Calls and CRUD Operations
  const showAlert = (message, severity = "success") => {
    setAlert({
      open: true,
      message,
      severity,
      transition: Fade,
    });
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
      if (response.data.success) {
        setPayslips(response.data.data);
      } else {
        showAlert("Failed to fetch payslips", "error");
      }
    } catch (error) {
      console.error("Error fetching payslips:", error);
      // If the endpoint doesn't exist yet, don't show an error to the user
      // Just set an empty array
      setPayslips([]);
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
        lop: parseFloat(newEmployee.lop),
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

      // Calculate the amount based on the percentage of basic pay
      const calculatedAmount = calculateAllowanceAmount(
        employee.basicPay,
        newAllowance.percentage
      );

      const payload = {
        empId: newAllowance.empId,
        name: newAllowance.name,
        amount: calculatedAmount.toString(),
        percentage: parseFloat(newAllowance.percentage),
        category: newAllowance.category || "Regular",
        status: newAllowance.status || "Active",
        isRecurring: true,
      };

      if (editMode && selectedItem) {
        // For edit mode, we need to use the virtual ID format: empId_allowanceName
        const id = `${selectedItem.empId}_${selectedItem.name}`;
        await axios.put(`${API_URL}/allowances/${id}`, payload);
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

  // Update the handleAddDeduction function
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
        employee.basicPay,
        newDeduction.percentage
      );

      const payload = {
        empId: newDeduction.empId,
        name: newDeduction.name,
        amount: calculatedAmount.toString(),
        percentage: parseFloat(newDeduction.percentage),
        category: newDeduction.category || "Tax",
        status: newDeduction.status || "Active",
        isRecurring: true,
      };

      if (editMode && selectedItem) {
        // For edit mode, we need to use the virtual ID format: empId_deductionName
        const id = `${selectedItem.empId}_${selectedItem.name}`;
        await axios.put(`${API_URL}/deductions/${id}`, payload);
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
    setSelectedAllowances([]);
    setAllowancePercentages({});
    setBulkEmployeeId("");
    setSelectedDeductions([]); // Reset deduction selections
    setDeductionPercentages({}); // Reset deduction percentages
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
    setSelectedDeductions([]);
    setDeductionPercentages({});
    setBulkDeductionEmployeeId("");
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

  // Payslip Generation and Download
  const generatePayslip = async (empId) => {
    try {
      const employee = employeeData.find((e) => e.empId === empId);
      if (!employee) {
        showAlert("Employee not found", "error");
        return null;
      }

      const payslipData = {
        empId: employee.empId,
        empName: employee.empName,
        department: employee.department,
        designation: employee.designation,
        pfNo: employee.pfNo,
        uanNo: employee.uanNo,
        panNo: employee.panNo,
        email: employee.email,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicPay: employee.basicPay,
        payableDays: employee.payableDays,
        lopDays: employee.lop,
        bankDetails: {
          bankName: employee.bankName,
          accountNo: employee.bankAccountNo,
        },
        allowances: allowanceData
          .filter((a) => a.empId === empId && a.status === "Active")
          .map((allowance) => ({
            name: allowance.name,
            amount: calculateAllowanceAmount(
              employee.basicPay,
              allowance.percentage
            ),
            percentage: allowance.percentage,
          })),
        deductions: deductions
          .filter((d) => d.empId === empId && d.status === "Active")
          .map((deduction) => ({
            name: deduction.name,
            amount: calculateDeductionAmount(
              employee.basicPay,
              deduction.percentage
            ),
            percentage: deduction.percentage,
          })),
        grossSalary: calculateGrossSalary(empId),
        totalDeductions: calculateTotalDeductions(empId),
        netSalary: calculateNetSalary(empId),
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

  
  // Add this function to calculate net impact (total allowances - total deductions)
const calculateNetImpact = (empId) => {
  const employee = employeeData.find((e) => e.empId === empId);
  if (!employee) return 0;

  // Calculate total allowances
  const totalAllowances = allowanceData
    .filter((a) => a.empId === empId && a.status === "Active")
    .reduce((sum, item) => {
      return sum + calculateAllowanceAmount(employee.basicPay, item.percentage);
    }, 0);

  // Calculate total deductions
  const totalDeductions = deductions
    .filter((d) => d.empId === empId && d.status === "Active")
    .reduce((sum, item) => {
      return sum + calculateDeductionAmount(employee.basicPay, item.percentage);
    }, 0);

  // Return the net impact
  return totalAllowances - totalDeductions;
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
              label="Allowances-Deductions"
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <input
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                id="excel-upload"
                onChange={importFromExcel}
              />
              <label htmlFor="excel-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  className="import-button"
                >
                  Import Excel
                </Button>
              </label>
              <Button
                variant="contained"
                onClick={exportToExcel}
                startIcon={<CloudDownloadIcon />}
                className="export-button"
              >
                Export Excel
              </Button>
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
                    department: "",
                    designation: "",
                    email: "",
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
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.designation}</TableCell>
                    <TableCell className="amount-cell">
                      Rs. {item.basicPay}
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
                      <Tooltip title="Preview">
                        <IconButton
                          className="preview-button"
                          onClick={() => handleOpenPreview(item.empId)}
                        >
                          <PreviewIcon
                            sx={{
                              color: "#4caf50",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                color: "#2e7d32",
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
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
                          <EditIcon
                            sx={{
                              color: "#007bff",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                color: "#0056b3",
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          className="delete-button"
                          onClick={() => handleDeleteEmployee(item.empId)}
                        >
                          <DeleteIcon
                            sx={{
                              color: "#d32f2f",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                color: "#ff1744",
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Allowances & Deductions Tab */}

        <TabPanel value={tabIndex} index={1}>
          <Box className="header-container">
            <Typography variant="h5" className="section-title">
              Allowances & Deductions Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
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
                sx={{ bgcolor: "#4caf50" }}
              >
                Create
              </Button>
            </Box>
          </Box>

          {/* Combined Employee-based Table */}

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Basic Pay</TableCell>
                  <TableCell>Net Impact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((employee) => {
                  // Get all allowances for this employee
                  const employeeAllowances = allowanceData.filter(
                    (a) => a.empId === employee.empId && a.status === "Active"
                  );

                  // Get all deductions for this employee
                  const employeeDeductions = deductions.filter(
                    (d) => d.empId === employee.empId && d.status === "Active"
                  );

                  // Skip employees with no allowances or deductions
                  if (
                    employeeAllowances.length === 0 &&
                    employeeDeductions.length === 0
                  ) {
                    return null;
                  }

                  // Calculate total allowance amount
                  const totalAllowanceAmount = employeeAllowances.reduce(
                    (sum, item) => {
                      return (
                        sum +
                        calculateAllowanceAmount(
                          employee.basicPay,
                          item.percentage
                        )
                      );
                    },
                    0
                  );

                  // Calculate total deduction amount
                  const totalDeductionAmount = employeeDeductions.reduce(
                    (sum, item) => {
                      return (
                        sum +
                        calculateDeductionAmount(
                          employee.basicPay,
                          item.percentage
                        )
                      );
                    },
                    0
                  );

                  // Calculate net impact
                  const netImpact = totalAllowanceAmount - totalDeductionAmount;

                  return (
                    <TableRow key={employee.empId} className="table-row">
                      <TableCell>
                        <Typography variant="subtitle2">
                          {employee.empName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {employee.empId}
                        </Typography>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        Rs. {parseFloat(employee.basicPay).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: netImpact >= 0 ? "#4caf50" : "#f44336",
                          }}
                        >
                          {netImpact >= 0 ? "+" : ""}
                          {netImpact.toFixed(2)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Preview">
                          <IconButton
                            className="preview-button"
                            onClick={() => handleOpenPreview(employee.empId)}
                          >
                            <PreviewIcon
                              sx={{
                                color: "#4caf50",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  color: "#2e7d32",
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Allowances/Deductions">
                          <IconButton
                            className="edit-button"
                            onClick={() => {
                              // First fetch the latest data
                              Promise.all([
                                fetchAllowances(),
                                fetchDeductions(),
                              ]).then(() => {
                                // Get existing allowances and deductions for this employee
                                const employeeAllowances = allowanceData.filter(
                                  (a) =>
                                    a.empId === employee.empId &&
                                    a.status === "Active"
                                );
                                const employeeDeductions = deductions.filter(
                                  (d) =>
                                    d.empId === employee.empId &&
                                    d.status === "Active"
                                );

                                // Pre-populate the selected allowances and their percentages
                                const initialAllowancePercentages = {};
                                const allowanceNames = employeeAllowances.map(
                                  (a) => {
                                    initialAllowancePercentages[a.name] =
                                      a.percentage;
                                    return a.name;
                                  }
                                );

                                // Pre-populate the selected deductions and their percentages
                                const initialDeductionPercentages = {};
                                const deductionNames = employeeDeductions.map(
                                  (d) => {
                                    initialDeductionPercentages[d.name] =
                                      d.percentage;
                                    return d.name;
                                  }
                                );

                                // Set the state with existing data
                                setBulkEmployeeId(employee.empId);
                                setSelectedAllowances(allowanceNames);
                                setAllowancePercentages(
                                  initialAllowancePercentages
                                );
                                setSelectedDeductions(deductionNames);
                                setDeductionPercentages(
                                  initialDeductionPercentages
                                );

                                // Open the dialog in edit mode
                                setEditMode(false); // We're still using the bulk add dialog, not editing individual items
                                setOpenDialog(true);
                              });
                            }}
                          >
                            <EditIcon
                              sx={{
                                color: "#007bff",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  color: "#0056b3",
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            className="delete-button"
                            onClick={() => handleDeleteEmployee(employee.empId)}
                          >
                            <DeleteIcon
                              sx={{
                                color: "#d32f2f",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  color: "#ff1744",
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

       
       
{/* Preview Dialog for Allowances and Deductions */}
<Dialog
  open={previewDialogOpen}
  onClose={handleClosePreview}
  maxWidth="md"
  fullWidth
  PaperProps={{
    elevation: 3,
    sx: { borderRadius: 2, overflow: "hidden" },
  }}
>
  <DialogTitle
    sx={{
      bgcolor: "#1976d2",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="h6">
      Allowances & Deductions for {previewEmployee?.empName}
    </Typography>
    <IconButton onClick={handleClosePreview} sx={{ color: "white" }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  {previewEmployee && (
    <DialogContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Allowances */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ 
                mb: 2, 
                borderBottom: "1px solid #eee", 
                pb: 1,
                color: "#4caf50"
              }}
            >
              Allowances
            </Typography>
            {allowanceData.filter(
              (a) =>
                a.empId === previewEmployee.empId &&
                a.status === "Active"
            ).length > 0 ? (
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allowanceData
                      .filter(
                        (a) =>
                          a.empId === previewEmployee.empId &&
                          a.status === "Active"
                      )
                      .map((allowance) => (
                        <TableRow key={allowance._id || `${allowance.empId}_${allowance.name}`}>
                          <TableCell>{allowance.name}</TableCell>
                          <TableCell>{allowance.percentage}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={allowance.category} 
                              size="small"
                              sx={{ 
                                bgcolor: 
                                  allowance.category === "Regular" ? "#e3f2fd" : 
                                  allowance.category === "Travel" ? "#e8f5e9" : 
                                  "#fff8e1"
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            Rs.{" "}
                            {calculateAllowanceAmount(
                              previewEmployee.basicPay,
                              allowance.percentage
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell
                        colSpan={3}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Allowances
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Rs.{" "}
                        {allowanceData
                          .filter(
                            (a) =>
                              a.empId === previewEmployee.empId &&
                              a.status === "Active"
                          )
                          .reduce((sum, item) => {
                            return (
                              sum +
                              calculateAllowanceAmount(
                                previewEmployee.basicPay,
                                item.percentage
                              )
                            );
                          }, 0)
                          .toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                No active allowances found
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Deductions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ 
                mb: 2, 
                borderBottom: "1px solid #eee", 
                pb: 1,
                color: "#f44336"
              }}
            >
              Deductions
            </Typography>
            {deductions.filter(
              (d) =>
                d.empId === previewEmployee.empId &&
                d.status === "Active"
            ).length > 0 ? (
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deductions
                      .filter(
                        (d) =>
                          d.empId === previewEmployee.empId &&
                          d.status === "Active"
                      )
                      .map((deduction) => (
                        <TableRow key={deduction._id || `${deduction.empId}_${deduction.name}`}>
                          <TableCell>{deduction.name}</TableCell>
                          <TableCell>{deduction.percentage}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={deduction.category} 
                              size="small"
                              sx={{ 
                                bgcolor: 
                                  deduction.category === "Tax" ? "#ffebee" : 
                                  deduction.category === "Insurance" ? "#e8eaf6" : 
                                  "#fce4ec"
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            Rs.{" "}
                            {calculateDeductionAmount(
                              previewEmployee.basicPay,
                              deduction.percentage
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell
                        colSpan={3}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Deductions
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Rs.{" "}
                        {calculateTotalDeductions(
                          previewEmployee.empId
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                No active deductions found
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Net Impact */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#f8f9fa" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">
                Net Impact on Salary
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: calculateNetImpact(previewEmployee.empId) >= 0 ? "#4caf50" : "#f44336",
                }}
              >
                {calculateNetImpact(previewEmployee.empId) >= 0 ? "+" : ""}
                Rs. {calculateNetImpact(previewEmployee.empId).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DialogContent>
  )}

  <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5" }}>
    <Button onClick={handleClosePreview} variant="outlined">
      Close
    </Button>
    <Button
      variant="contained"
      startIcon={<EditIcon />}
      onClick={() => {
        handleClosePreview();
        setEditMode(false);
        setBulkEmployeeId(previewEmployee.empId);
        setOpenDialog(true);
      }}
    >
      Manage Allowances & Deductions
    </Button>
  </DialogActions>
</Dialog>


        {/* Payslips Tab */}
        <TabPanel value={tabIndex} index={2}>
          {employeeData.map((emp) => (
            <Paper
              key={emp.empId}
              className="payslip-card"
              sx={{
                marginBottom: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                            Rs.{" "}
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
                          <Typography>
                            Rs.{" "}
                            {calculateAttendanceBasedPay(
                              emp.basicPay,
                              emp.payableDays,
                              emp.lop
                            ).toFixed(2)}
                          </Typography>
                        </Box>
                        {allowanceData
                          .filter(
                            (a) =>
                              a.empId === emp.empId && a.status === "Active"
                          )
                          .map((allowance) => (
                            <Box key={allowance._id} className="amount-row">
                              <Typography>{allowance.name}</Typography>
                              <Typography>
                                Rs.{" "}
                                {calculateAllowanceAmount(
                                  emp.basicPay,
                                  allowance.percentage
                                ).toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        <Box className="amount-row total">
                          <Typography>
                            <strong>Total Earnings</strong>
                          </Typography>
                          <Typography>
                            <strong>
                              Rs. {calculateGrossSalary(emp.empId).toFixed(2)}
                            </strong>
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
                          .filter(
                            (d) =>
                              d.empId === emp.empId && d.status === "Active"
                          )
                          .map((deduction) => (
                            <Box key={deduction._id} className="amount-row">
                              <Typography>{deduction.name}</Typography>
                              <Typography>
                                Rs.{" "}
                                {calculateDeductionAmount(
                                  emp.basicPay,
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
                              Rs.{" "}
                              {calculateTotalDeductions(emp.empId).toFixed(2)}
                            </strong>
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
                          Net Salary: Rs.{" "}
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

        {/* Employee Preview Dialog */}
        {/* Employee Preview Dialog */}
<Dialog
  open={previewDialogOpen}
  onClose={handleClosePreview}
  maxWidth="md"
  fullWidth
  PaperProps={{
    elevation: 3,
    sx: { borderRadius: 2, overflow: "hidden" },
  }}
>
  <DialogTitle
    sx={{
      bgcolor: "#1976d2",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="h6">Employee Details Preview</Typography>
    <IconButton onClick={handleClosePreview} sx={{ color: "white" }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  {previewEmployee && (
    <DialogContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Employee Basic Info */}
        <Grid item xs={12}>
          <Paper
            sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mr: 2 }}
              >
                {previewEmployee.empName}
              </Typography>
              <Chip
                label={`ID: ${previewEmployee.empId}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={previewEmployee.status}
                color={
                  previewEmployee.status === "Active"
                    ? "success"
                    : "error"
                }
                sx={{ ml: 1 }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.department}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Designation
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.designation}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Basic Pay
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Rs. {parseFloat(previewEmployee.basicPay).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bank & ID Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
            >
              Bank & ID Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Bank Name
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.bankName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Account Number
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.bankAccountNo}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  PF Number
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.pfNo}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  UAN Number
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.uanNo}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  PAN Number
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.panNo}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Attendance & Pay Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
            >
              Attendance & Pay Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Payable Days
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.payableDays} days
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  LOP Days
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.lop} days
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Working Days
                </Typography>
                <Typography variant="body1">
                  {previewEmployee.payableDays - previewEmployee.lop}{" "}
                  days
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Per Day Pay
                </Typography>
                <Typography variant="body1">
                  Rs.{" "}
                  {calculatePerDayPay(
                    previewEmployee.basicPay,
                    previewEmployee.payableDays
                  ).toFixed(2)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Attendance Adjusted Pay
                </Typography>
                <Typography variant="body1">
                  Rs.{" "}
                  {calculateAttendanceBasedPay(
                    previewEmployee.basicPay,
                    previewEmployee.payableDays,
                    previewEmployee.lop
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DialogContent>
  )}

  <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5" }}>
    <Button onClick={handleClosePreview} variant="outlined">
      Close
     </Button>

  {/*  <Button
      variant="contained"
      startIcon={<EditIcon />}
      onClick={() => {
        handleClosePreview();
        setEditMode(true);
        setSelectedItem(previewEmployee);
        setNewEmployee({ ...previewEmployee });
        setOpenEmployeeDialog(true);
      }}
      sx={{ mr: 1 }}
    >
      Edit Employee
    </Button>
    <Button
      variant="contained"
      color="primary"
      startIcon={<FileDownloadIcon />}
      onClick={async () => {
        const payslip = await generatePayslip(previewEmployee.empId);
        if (payslip) {
          downloadPayslip(payslip._id);
        }
        handleClosePreview();
      }}
    >
      Generate Payslip
    </Button> */}
  </DialogActions>
</Dialog>

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
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Designation"
                  fullWidth
                  value={newEmployee.designation}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      designation: e.target.value,
                    })
                  }
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
                      <InputAdornment position="start">Rs.</InputAdornment>
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="LOP Days"
                  type="number"
                  fullWidth
                  value={newEmployee.lop}
                  onChange={handleLOPChange}
                  inputProps={{
                    step: 0.5,
                    min: 0,
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
          maxWidth="md"
          fullWidth
          PaperProps={{
            elevation: 0,
            className: "dialog-paper",
          }}
        >
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Allowance" : "Add Allowances"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={editMode ? newAllowance.empId : bulkEmployeeId}
                    onChange={(e) => {
                      if (editMode) {
                        setNewAllowance({
                          ...newAllowance,
                          empId: e.target.value,
                        });
                      } else {
                        setBulkEmployeeId(e.target.value);
                      }
                    }}
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

              {!editMode ? (
                <>
                  {/* Multiple Allowance Selection */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Select Allowances to Add
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: 300, mb: 2 }}
                    >
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">Select</TableCell>
                            <TableCell>Allowance Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Percentage (%)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            {
                              name: "TRAVEL ALLOWANCE",
                              desc: "For travel-related expenses",
                            },
                            {
                              name: "MEDICAL ALLOWANCE",
                              desc: "For healthcare expenses",
                            },
                            {
                              name: "HOUSE RENT ALLOWANCE",
                              desc: "For accommodation expenses",
                            },
                            {
                              name: "DEARNESS ALLOWANCE",
                              desc: "Cost of living adjustment",
                            },
                            {
                              name: "SPECIAL ALLOWANCE",
                              desc: "Additional benefits",
                            },
                            {
                              name: "CONVEYANCE ALLOWANCE",
                              desc: "For daily commute expenses",
                            },
                            {
                              name: "EDUCATION ALLOWANCE",
                              desc: "For educational expenses",
                            },
                            {
                              name: "MEAL ALLOWANCE",
                              desc: "For food expenses",
                            },
                            {
                              name: "TELEPHONE ALLOWANCE",
                              desc: "For communication expenses",
                            },
                            {
                              name: "UNIFORM ALLOWANCE",
                              desc: "For work attire",
                            },
                          ].map((allowance) => (
                            <TableRow key={allowance.name}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedAllowances.includes(
                                    allowance.name
                                  )}
                                  onChange={(e) =>
                                    handleAllowanceSelection(
                                      allowance.name,
                                      e.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>{allowance.name}</TableCell>
                              <TableCell>{allowance.desc}</TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={
                                    allowancePercentages[allowance.name] || 0
                                  }
                                  onChange={(e) =>
                                    handlePercentageChange(
                                      allowance.name,
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    !selectedAllowances.includes(allowance.name)
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        %
                                      </InputAdornment>
                                    ),
                                    inputProps: { min: 0, max: 100, step: 0.5 },
                                  }}
                                  sx={{ width: "100px" }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography>
                        {selectedAllowances.length} allowance(s) selected
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          label="Custom Allowance"
                          size="small"
                          id="custom-allowance"
                        />
                        <TextField
                          label="Percentage"
                          type="number"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                            inputProps: { min: 0, max: 100 },
                          }}
                          sx={{ width: "100px" }}
                          id="custom-percentage"
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            const customName =
                              document.getElementById("custom-allowance").value;
                            const customPercentage =
                              document.getElementById(
                                "custom-percentage"
                              ).value;
                            if (
                              customName &&
                              !selectedAllowances.includes(customName)
                            ) {
                              setSelectedAllowances([
                                ...selectedAllowances,
                                customName,
                              ]);
                              setAllowancePercentages({
                                ...allowancePercentages,
                                [customName]: parseFloat(customPercentage) || 0,
                              });
                              document.getElementById(
                                "custom-allowance"
                              ).value = "";
                              document.getElementById(
                                "custom-percentage"
                              ).value = "";
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                  {selectedAllowances.length > 0 && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Preview of Allowances to Add:
                        </Typography>
                        <TableContainer sx={{ maxHeight: 150 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Allowance Name</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Amount (Est.)</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedAllowances.map((name, index) => {
                                const employee = employeeData.find(
                                  (e) => e.empId === bulkEmployeeId
                                );
                                const estimatedAmount = employee
                                  ? calculateAllowanceAmount(
                                      employee.basicPay,
                                      allowancePercentages[name] || 0
                                    )
                                  : 0;

                                return (
                                  <TableRow key={index}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell>
                                      {allowancePercentages[name] || 0}%
                                    </TableCell>
                                    <TableCell>
                                      Rs. {estimatedAmount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          setSelectedAllowances(
                                            selectedAllowances.filter(
                                              (item) => item !== name
                                            )
                                          )
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  )}

                  {/* Optional Deduction Selection */}
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        borderBottom: "1px solid #eee",
                        pb: 1,
                        color: "#f44336",
                      }}
                    >
                      Add Deductions (Optional)
                    </Typography>
                    <FormControl component="fieldset">
                      <FormGroup>
                        {[
                          {
                            name: "PROFESSIONAL TAX",
                            desc: "State-mandated tax on employment",
                          },
                          {
                            name: "INCOME TAX",
                            desc: "Tax on employee income",
                          },
                          {
                            name: "PROVIDENT FUND",
                            desc: "Retirement savings contribution",
                          },
                          {
                            name: "HEALTH INSURANCE",
                            desc: "Medical insurance premium",
                          },
                        ].map((deduction) => (
                          <FormControlLabel
                            key={deduction.name}
                            control={
                              <Checkbox
                                checked={selectedDeductions.includes(
                                  deduction.name
                                )}
                                onChange={(e) =>
                                  handleDeductionSelection(
                                    deduction.name,
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  {deduction.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ({deduction.desc})
                                </Typography>
                                {selectedDeductions.includes(
                                  deduction.name
                                ) && (
                                  <TextField
                                    size="small"
                                    type="number"
                                    label="Percentage"
                                    value={
                                      deductionPercentages[deduction.name] || 0
                                    }
                                    onChange={(e) =>
                                      handleDeductionPercentageChange(
                                        deduction.name,
                                        e.target.value
                                      )
                                    }
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          %
                                        </InputAdornment>
                                      ),
                                      inputProps: {
                                        min: 0,
                                        max: 100,
                                        step: 0.5,
                                      },
                                    }}
                                    sx={{ width: "120px", ml: 2 }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>

                  {selectedDeductions.length > 0 && (
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "#fff8f8",
                          borderRadius: 2,
                          mt: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#d32f2f" }}
                        >
                          Selected Deductions:
                        </Typography>
                        <TableContainer sx={{ maxHeight: 150 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Deduction Name</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Amount (Est.)</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedDeductions.map((name, index) => {
                                const employee = employeeData.find(
                                  (e) => e.empId === bulkEmployeeId
                                );
                                const estimatedAmount = employee
                                  ? calculateDeductionAmount(
                                      employee.basicPay,
                                      deductionPercentages[name] || 0
                                    )
                                  : 0;

                                return (
                                  <TableRow key={index}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell>
                                      {deductionPercentages[name] || 0}%
                                    </TableCell>
                                    <TableCell>
                                      Rs. {estimatedAmount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          setSelectedDeductions(
                                            selectedDeductions.filter(
                                              (item) => item !== name
                                            )
                                          )
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  {/* Single Allowance Edit Mode */}
                  <Grid item xs={12}>
                    <TextField
                      label="Allowance Name"
                      fullWidth
                      value={newAllowance.name}
                      onChange={(e) =>
                        setNewAllowance({
                          ...newAllowance,
                          name: e.target.value,
                        })
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
                </>
              )}
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
            {editMode ? (
              <Button
                onClick={handleAddAllowance}
                color="primary"
                variant="contained"
              >
                Update Allowance
              </Button>
            ) : (
              <Button
                onClick={handleAddMultipleAllowances}
                color="primary"
                variant="contained"
                disabled={selectedAllowances.length === 0 || !bulkEmployeeId}
              >
                Add {selectedAllowances.length} Allowance(s)
                {selectedDeductions.length > 0 &&
                  ` & ${selectedDeductions.length} Deduction(s)`}
              </Button>
            )}
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
