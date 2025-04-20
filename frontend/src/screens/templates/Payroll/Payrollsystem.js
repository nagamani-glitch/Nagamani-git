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
  FormHelperText,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Add these state variables near your other state declarations
  const [deleteAllowanceDialogOpen, setDeleteAllowanceDialogOpen] =
    useState(false);
  const [employeeToDeleteAllowances, setEmployeeToDeleteAllowances] =
    useState(null);

  // Add these state variables near your other state declarations
  const [selectedAllowances, setSelectedAllowances] = useState([]);
  const [bulkEmployeeId, setBulkEmployeeId] = useState("");
  const [allowancePercentages, setAllowancePercentages] = useState({});

  // Add these state variables for deductions similar to allowances
  const [selectedDeductions, setSelectedDeductions] = useState([]);
  const [deductionPercentages, setDeductionPercentages] = useState({});
  const [bulkDeductionEmployeeId, setBulkDeductionEmployeeId] = useState("");

  // Add state for registered employees
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [selectedRegisteredEmployee, setSelectedRegisteredEmployee] =
    useState("");

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

  // Separate state variables for employee preview and allowance/deduction preview
  const [employeePreviewDialogOpen, setEmployeePreviewDialogOpen] =
    useState(false);
  const [allowancePreviewDialogOpen, setAllowancePreviewDialogOpen] =
    useState(false);
  const [previewEmployee, setPreviewEmployee] = useState(null);

  // Handler for opening employee preview
  const handleOpenEmployeePreview = (empId) => {
    const employee = employeeData.find((emp) => emp.empId === empId);
    if (employee) {
      setPreviewEmployee(employee);
      setEmployeePreviewDialogOpen(true);
    }
  };

  // Handler for closing employee preview
  const handleCloseEmployeePreview = () => {
    setEmployeePreviewDialogOpen(false);
    setPreviewEmployee(null);
  };

  // Handler for opening allowance/deduction preview
  const handleOpenAllowancePreview = (empId) => {
    // First close the dialog if it's already open to ensure fresh data
    if (allowancePreviewDialogOpen) {
      setAllowancePreviewDialogOpen(false);
    }

    // Fetch the latest data
    Promise.all([fetchAllowances(), fetchDeductions()]).then(() => {
      // Now set the employee and open the dialog with fresh data
      const employee = employeeData.find((emp) => emp.empId === empId);
      if (employee) {
        setPreviewEmployee(employee);
        setAllowancePreviewDialogOpen(true);
      }
    });
  };

  // Handler for closing allowance/deduction preview
  const handleCloseAllowancePreview = () => {
    setAllowancePreviewDialogOpen(false);
    setPreviewEmployee(null);
  };

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

  // Add this function to handle registered employee selection
  const handleRegisteredEmployeeSelect = (empId) => {
    if (!empId) {
      setSelectedRegisteredEmployee("");
      return;
    }

    setSelectedRegisteredEmployee(empId);

    // Find the selected employee
    const selectedEmp = registeredEmployees.find((emp) => emp.Emp_ID === empId);

    if (selectedEmp) {
      // Map the fields from registered employee to payroll employee
      setNewEmployee({
        ...newEmployee,
        empId: selectedEmp.Emp_ID || "",
        empName: `${selectedEmp.personalInfo?.firstName || ""} ${
          selectedEmp.personalInfo?.lastName || ""
        }`,
        department: selectedEmp.joiningDetails?.department || "",
        designation: selectedEmp.joiningDetails?.initialDesignation || "",
        email: selectedEmp.personalInfo?.email || "",
        // Keep other fields as they are since they might not have direct mappings
      });

      showAlert("Employee data loaded successfully", "success");
    }
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

  const confirmDeleteAllowancesAndDeductions = async () => {
    try {
      if (!employeeToDeleteAllowances) return;

      // First delete all allowances for this employee
      const employeeAllowances = allowanceData.filter(
        (a) => a.empId === employeeToDeleteAllowances.empId
      );

      for (const allowance of employeeAllowances) {
        const id = `${allowance.empId}_${allowance.name}`;
        await axios.delete(`${API_URL}/allowances/${id}`);
      }

      // Then delete all deductions for this employee
      const employeeDeductions = deductions.filter(
        (d) => d.empId === employeeToDeleteAllowances.empId
      );

      for (const deduction of employeeDeductions) {
        const id = `${deduction.empId}_${deduction.name}`;
        await axios.delete(`${API_URL}/deductions/${id}`);
      }

      showAlert("Allowances and deductions deleted successfully");
      await Promise.all([fetchAllowances(), fetchDeductions()]);
      setDeleteAllowanceDialogOpen(false);
      setEmployeeToDeleteAllowances(null);
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          "Error deleting allowances and deductions",
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
      if (!file) {
        showAlert("No file selected", "error");
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
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
              basicPay: parseFloat(row["Basic Pay"]) || 0,
              bankName: String(row["Bank Name"] || "").trim(),
              bankAccountNo: String(row["Bank Account No"] || "").trim(),
              pfNo: String(row["PF Number"] || "").trim(),
              uanNo: String(row["UAN Number"] || "").trim(),
              panNo: String(row["PAN Number"] || "").trim(),
              payableDays: parseInt(row["Payable Days"]) || 30,
              lop: parseFloat(row["LOP Days"]) || 0,
              status: "Active",
              email: row["Email"] || "", // Add email field if it exists in Excel
            }))
            .filter((emp) => emp.empId && emp.empName && emp.basicPay > 0);

          if (validEmployees.length === 0) {
            showAlert("No valid employee data found in Excel file", "error");
            return;
          }

          // Show loading message
          showAlert(`Importing ${validEmployees.length} employees...`, "info");

          // Try individual employee creation instead of bulk
          let successCount = 0;
          for (const employee of validEmployees) {
            try {
              // Use the single employee creation endpoint instead of bulk
              await axios.post(`${API_URL}/employees`, employee);
              successCount++;
            } catch (err) {
              console.error(
                `Failed to import employee ${employee.empId}:`,
                err
              );
              // Continue with the next employee
            }
          }

          // Clear the file input
          event.target.value = "";

          // Refresh all data
          await fetchEmployees();

          if (successCount > 0) {
            showAlert(
              `Successfully imported ${successCount} out of ${validEmployees.length} employees`
            );
          } else {
            showAlert("Failed to import any employees", "error");
          }
        } catch (error) {
          console.error("Error processing Excel file:", error);
          showAlert(
            error.response?.data?.message || "Error processing Excel file",
            "error"
          );
          // Clear the file input
          event.target.value = "";
        }
      };

      reader.onerror = () => {
        showAlert("Error reading file", "error");
        event.target.value = "";
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Import error:", error);
      showAlert(
        "Import failed: " + (error.response?.data?.message || error.message),
        "error"
      );
      // Clear the file input
      if (event.target) {
        event.target.value = "";
      }
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
        fetchRegisteredEmployees(), // Added this line to fetch registered employees
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

  // Add function to fetch registered employees
  const fetchRegisteredEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees/registered"
      );
      setRegisteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      // Don't show an error alert to avoid confusing users if this is optional
      setRegisteredEmployees([]);
    }
  };

  const confirmDeleteEmployee = async () => {
    try {
      if (!employeeToDelete) return;

      await axios.delete(`${API_URL}/employees/${employeeToDelete.empId}`);
      showAlert("Employee deleted successfully");
      await Promise.all([
        fetchEmployees(),
        fetchAllowances(),
        fetchDeductions(),
      ]);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error deleting employee",
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

  const handleCloseEmployeeDialog = () => {
    setOpenEmployeeDialog(false);
    setEditMode(false);
    setSelectedItem(null);
    setSelectedRegisteredEmployee(""); // Reset the selected registered employee
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
        return (
          sum + calculateAllowanceAmount(employee.basicPay, item.percentage)
        );
      }, 0);

    // Calculate total deductions
    const totalDeductions = deductions
      .filter((d) => d.empId === empId && d.status === "Active")
      .reduce((sum, item) => {
        return (
          sum + calculateDeductionAmount(employee.basicPay, item.percentage)
        );
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
            centered
          >
            <Tab
              label={<span className="tab-label">Employees</span>}
              icon={<AddCircleIcon className="tab-icon" />}
              className="tab-item"
              aria-label="Employees Tab"
            />

            <Tab
              label={
                <span className="tab-label">
                  <span className="full-label">Allowances-Deductions</span>
                  <span className="short-label">Allowances</span>
                </span>
              }
              icon={<AttachMoneyIcon className="tab-icon" />}
              className="tab-item"
              aria-label="Allowances and Deductions Tab"
            />
            <Tab
              label={<span className="tab-label">Payslips</span>}
              icon={<DescriptionIcon className="tab-icon" />}
              className="tab-item"
              aria-label="Payslips Tab"
            />
          </Tabs>
        </AppBar>

        {/* Employees Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Box className="header-container employee-header">
            <Box className="title-wrapper">
              <Typography variant="h5" className="section-title">
                Employee Management
                <span className="title-badge">{employeeData.length} Total</span>
              </Typography>
            </Box>
            <Box className="header-actions">
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
                  className="import-button blue-button"
                  size="medium"
                >
                  <span className="button-text">Import</span>
                </Button>
              </label>
              <Button
                variant="contained"
                onClick={exportToExcel}
                startIcon={<CloudDownloadIcon />}
                className="export-button blue-button"
                size="medium"
              >
                <span className="button-text">Export</span>
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
                className="create-button blue-button"
                size="medium"
              >
                <span className="button-text">Add</span>
              </Button>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            className="table-container employee-table-container mobile-scroll-table"
            sx={{ overflowX: "auto" }}
          >
            <Table
              className="responsive-table employee-table non-responsive-mobile"
              sx={{ minWidth: 650 }}
            >
              <TableHead>
                <TableRow className="table-header">
                  <TableCell className="table-cell">Emp ID</TableCell>
                  <TableCell className="table-cell">Name</TableCell>
                  <TableCell className="table-cell">Department</TableCell>
                  <TableCell className="table-cell">Designation</TableCell>
                  <TableCell className="table-cell">Basic Pay</TableCell>
                  <TableCell className="table-cell">Bank Details</TableCell>
                  <TableCell className="table-cell">PF/UAN</TableCell>
                  <TableCell className="table-cell">Payable Days</TableCell>
                  <TableCell className="table-cell">LOP Days</TableCell>
                  <TableCell className="table-cell action-column">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employeeData.map((item) => (
                  <TableRow key={item.empId} className="table-row employee-row">
                    <TableCell className="table-cell">{item.empId}</TableCell>
                    <TableCell className="table-cell">{item.empName}</TableCell>
                    <TableCell className="table-cell">
                      {item.department}
                    </TableCell>
                    <TableCell className="table-cell">
                      {item.designation}
                    </TableCell>
                    <TableCell className="table-cell amount-cell">
                      Rs. {parseFloat(item.basicPay).toFixed(2)}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Typography variant="body2">{item.bankName}</Typography>
                      <Typography variant="caption">
                        {item.bankAccountNo}
                      </Typography>
                    </TableCell>
                    <TableCell className="table-cell">
                      <Typography variant="body2">PF: {item.pfNo}</Typography>
                      <Typography variant="caption">
                        UAN: {item.uanNo}
                      </Typography>
                    </TableCell>
                    <TableCell className="table-cell">
                      {item.payableDays}
                    </TableCell>
                    <TableCell className="table-cell">{item.lop}</TableCell>
                    <TableCell className="table-cell action-cell">
                      <Tooltip title="Preview">
                        <IconButton
                          className="preview-button"
                          onClick={() => handleOpenEmployeePreview(item.empId)}
                        >
                          <PreviewIcon className="action-icon preview-icon" />
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
                          <EditIcon className="action-icon edit-icon" />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Delete">
              <IconButton
                className="delete-button"
                onClick={() => handleDeleteEmployee(item.empId)}
              >
                <DeleteIcon className="action-icon delete-icon" />
              </IconButton>
            </Tooltip> */}
                      <Tooltip title="Delete">
                        <IconButton
                          className="delete-button"
                          onClick={() => {
                            setEmployeeToDelete(item);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon className="action-icon delete-icon" />
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
            <Box className="title-container">
              <Typography variant="h5" className="section-title">
                Allowances & Deductions
              </Typography>
              <span className="title-badge">Management</span>
            </Box>
            <Box className="header-actions">
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
                className="create-button allowance-create-button"
              >
                <span className="button-text">Create</span>
              </Button>
            </Box>
          </Box>

          {/* Combined Employee-based Table */}

          <TableContainer component={Paper} className="table-container">
            <Table className="responsive-table">
              <TableHead>
                <TableRow className="table-header">
                  <TableCell className="table-cell" data-priority="1">
                    Employee
                  </TableCell>
                  <TableCell className="table-cell" data-priority="1">
                    Department
                  </TableCell>
                  <TableCell className="table-cell" data-priority="1">
                    Basic Pay
                  </TableCell>
                  <TableCell className="table-cell" data-priority="1">
                    Net Impact
                  </TableCell>
                  <TableCell
                    className="table-cell action-column"
                    data-priority="1"
                    align="center"
                  >
                    Actions
                  </TableCell>
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
                            onClick={() =>
                              handleOpenAllowancePreview(employee.empId)
                            }
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

                        {/* <Tooltip title="Delete">
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
                        </Tooltip> */}
                        <Tooltip title="Delete">
                          <IconButton
                            className="delete-button"
                            onClick={() => {
                              setEmployeeToDeleteAllowances(employee);
                              setDeleteAllowanceDialogOpen(true);
                            }}
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

        {/* Payslips Tab */}

        <TabPanel value={tabIndex} index={2}>
          <Box className="payslip-header-container">
            <Typography variant="h5" className="payslip-section-title">
              Payslip Management
            </Typography>
            <Chip
              label={`${employeeData.length} Employees`}
              className="payslip-title-badge"
              size="small"
            />
          </Box>

          {employeeData.length === 0 ? (
            <Paper className="payslip-no-data-paper">
              <Typography variant="h6" align="center" sx={{ py: 4 }}>
                No employee data available. Please add employees first.
              </Typography>
            </Paper>
          ) : (
            <Box className="payslip-container">
              {employeeData.map((emp) => (
                <Paper key={emp.empId} className="payslip-employee-card">
                  {/* Employee Details Section */}
                  <Box className="payslip-section">
                    <Box className="payslip-employee-header">
                      <Typography variant="h5" className="payslip-header-title">
                        Employee Details
                      </Typography>
                      <Chip
                        label={`ID: ${emp.empId}`}
                        className="payslip-emp-id-chip"
                        size="small"
                      />
                    </Box>

                    <Grid
                      container
                      spacing={2}
                      className="payslip-details-grid"
                    >
                      <Grid item xs={12} sm={4}>
                        <Box className="payslip-detail-group">
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Name
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.empName}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Department
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.department}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Designation
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.designation}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box className="payslip-detail-group">
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Bank Name
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.bankName}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Account No
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.bankAccountNo}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              PAN No
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.panNo}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box className="payslip-detail-group">
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              PF No
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.pfNo}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              UAN No
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.uanNo}
                            </Typography>
                          </Box>
                          <Box className="payslip-detail-item">
                            <Typography
                              variant="subtitle2"
                              className="payslip-detail-label"
                            >
                              Status
                            </Typography>
                            <Typography
                              variant="body1"
                              className="payslip-detail-value"
                            >
                              {emp.status}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Attendance Details Section */}
                  <Box className="payslip-section">
                    <Typography variant="h6" className="payslip-section-header">
                      Attendance Details
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      className="payslip-attendance-grid"
                    >
                      <Grid item xs={6} sm={3}>
                        <Paper className="payslip-stat-card">
                          <Typography
                            variant="subtitle2"
                            className="payslip-stat-label"
                          >
                            Total Days
                          </Typography>
                          <Typography
                            variant="h6"
                            className="payslip-stat-value"
                          >
                            {emp.payableDays}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Paper className="payslip-stat-card">
                          <Typography
                            variant="subtitle2"
                            className="payslip-stat-label"
                          >
                            LOP Days
                          </Typography>
                          <Typography
                            variant="h6"
                            className="payslip-stat-value"
                          >
                            {emp.lop}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Paper className="payslip-stat-card">
                          <Typography
                            variant="subtitle2"
                            className="payslip-stat-label"
                          >
                            Working Days
                          </Typography>
                          <Typography
                            variant="h6"
                            className="payslip-stat-value"
                          >
                            {emp.payableDays - emp.lop}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Paper className="payslip-stat-card">
                          <Typography
                            variant="subtitle2"
                            className="payslip-stat-label"
                          >
                            Per Day Pay
                          </Typography>
                          <Typography
                            variant="h6"
                            className="payslip-stat-value"
                          >
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

                  {/* Earnings & Deductions Section */}
                  <Box className="payslip-section">
                    <Grid
                      container
                      spacing={2}
                      className="payslip-calculations-grid"
                    >
                      {/* Earnings Column */}
                      <Grid item xs={12} sm={6}>
                        <Paper className="payslip-earnings-section">
                          <Typography
                            variant="h6"
                            className="payslip-section-header"
                          >
                            Earnings
                          </Typography>

                          <Box className="payslip-amount-list">
                            <Box className="payslip-amount-row">
                              <Typography
                                variant="body1"
                                className="payslip-amount-label"
                              >
                                Basic Pay
                              </Typography>
                              <Typography
                                variant="body1"
                                className="payslip-amount-value"
                              >
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
                                <Box
                                  key={
                                    allowance._id ||
                                    `${allowance.empId}_${allowance.name}`
                                  }
                                  className="payslip-amount-row"
                                >
                                  <Typography
                                    variant="body1"
                                    className="payslip-amount-label"
                                  >
                                    {allowance.name}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    className="payslip-amount-value"
                                  >
                                    Rs.{" "}
                                    {calculateAllowanceAmount(
                                      emp.basicPay,
                                      allowance.percentage
                                    ).toFixed(2)}
                                  </Typography>
                                </Box>
                              ))}

                            {allowanceData.filter(
                              (a) =>
                                a.empId === emp.empId && a.status === "Active"
                            ).length === 0 && (
                              <Box className="payslip-amount-row payslip-empty-row">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  align="center"
                                  sx={{ width: "100%" }}
                                >
                                  No active allowances
                                </Typography>
                              </Box>
                            )}

                            <Box className="payslip-amount-row payslip-total-row">
                              <Typography
                                variant="body1"
                                className="payslip-total-label"
                              >
                                Total Earnings
                              </Typography>
                              <Typography
                                variant="body1"
                                className="payslip-total-value"
                              >
                                Rs. {calculateGrossSalary(emp.empId).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Deductions Column */}
                      <Grid item xs={12} sm={6}>
                        <Paper className="payslip-deductions-section">
                          <Typography
                            variant="h6"
                            className="payslip-section-header"
                          >
                            Deductions
                          </Typography>

                          <Box className="payslip-amount-list">
                            {deductions
                              .filter(
                                (d) =>
                                  d.empId === emp.empId && d.status === "Active"
                              )
                              .map((deduction) => (
                                <Box
                                  key={
                                    deduction._id ||
                                    `${deduction.empId}_${deduction.name}`
                                  }
                                  className="payslip-amount-row"
                                >
                                  <Typography
                                    variant="body1"
                                    className="payslip-amount-label"
                                  >
                                    {deduction.name}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    className="payslip-amount-value"
                                  >
                                    Rs.{" "}
                                    {calculateDeductionAmount(
                                      emp.basicPay,
                                      deduction.percentage
                                    ).toFixed(2)}
                                  </Typography>
                                </Box>
                              ))}

                            {deductions.filter(
                              (d) =>
                                d.empId === emp.empId && d.status === "Active"
                            ).length === 0 && (
                              <Box className="payslip-amount-row payslip-empty-row">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  align="center"
                                  sx={{ width: "100%" }}
                                >
                                  No active deductions
                                </Typography>
                              </Box>
                            )}

                            <Box className="payslip-amount-row payslip-total-row">
                              <Typography
                                variant="body1"
                                className="payslip-total-label"
                              >
                                Total Deductions
                              </Typography>
                              <Typography
                                variant="body1"
                                className="payslip-total-value"
                              >
                                Rs.{" "}
                                {calculateTotalDeductions(emp.empId).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Net Salary Section */}
                  <Box className="payslip-section">
                    <Paper className="payslip-net-salary-section">
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        className="payslip-net-salary-grid"
                      >
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          className="payslip-net-salary-amount"
                        >
                          <Typography
                            variant="h5"
                            className="payslip-net-salary-label"
                          >
                            Net Salary: Rs.{" "}
                            {calculateNetSalary(emp.empId).toFixed(2)}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          className="payslip-download-container"
                        >
                          <Button
                            variant="contained"
                            onClick={async () => {
                              const payslip = await generatePayslip(emp.empId);
                              if (payslip) {
                                downloadPayslip(payslip._id);
                              }
                            }}
                            startIcon={<FileDownloadIcon />}
                            className="payslip-download-button"
                          >
                            Generate & Download Payslip
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Employee Preview Dialog */}
        <Dialog
          open={employeePreviewDialogOpen}
          onClose={handleCloseEmployeePreview}
          maxWidth="md"
          fullWidth
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
              bgcolor: "#1976d2",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Employee Details Preview</Typography>
            <IconButton
              onClick={handleCloseEmployeePreview}
              sx={{ color: "white" }}
            >
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

                    {/* <Grid container spacing={2}>
                      <Grid item xs={12} md={4}> */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
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
            <Button onClick={handleCloseEmployeePreview} variant="outlined">
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleCloseEmployeePreview();
                setEditMode(true);
                setSelectedItem(previewEmployee);
                setNewEmployee({ ...previewEmployee });
                setOpenEmployeeDialog(true);
              }}
              sx={{ mr: 1 }}
            >
              Edit Employee
            </Button>
          </DialogActions>
        </Dialog>
        {/* Allowances & Deductions Preview Dialog */}
        <Dialog
          open={allowancePreviewDialogOpen}
          onClose={handleCloseAllowancePreview}
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
            <IconButton
              onClick={handleCloseAllowancePreview}
              sx={{ color: "white" }}
            >
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
                        color: "#4caf50",
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
                                <TableRow
                                  key={
                                    allowance._id ||
                                    `${allowance.empId}_${allowance.name}`
                                  }
                                >
                                  <TableCell>{allowance.name}</TableCell>
                                  <TableCell>{allowance.percentage}%</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={allowance.category}
                                      size="small"
                                      sx={{
                                        bgcolor:
                                          allowance.category === "Regular"
                                            ? "#e3f2fd"
                                            : allowance.category === "Travel"
                                            ? "#e8f5e9"
                                            : "#fff8e1",
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
                        color: "#f44336",
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
                                <TableRow
                                  key={
                                    deduction._id ||
                                    `${deduction.empId}_${deduction.name}`
                                  }
                                >
                                  <TableCell>{deduction.name}</TableCell>
                                  <TableCell>{deduction.percentage}%</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={deduction.category}
                                      size="small"
                                      sx={{
                                        bgcolor:
                                          deduction.category === "Tax"
                                            ? "#ffebee"
                                            : deduction.category === "Insurance"
                                            ? "#e8eaf6"
                                            : "#fce4ec",
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
                          color:
                            calculateNetImpact(previewEmployee.empId) >= 0
                              ? "#4caf50"
                              : "#f44336",
                        }}
                      >
                        {calculateNetImpact(previewEmployee.empId) >= 0
                          ? "+"
                          : ""}
                        Rs.{" "}
                        {calculateNetImpact(previewEmployee.empId).toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
          )}

          <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Button onClick={handleCloseAllowancePreview} variant="outlined">
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleCloseAllowancePreview();
                setEditMode(false);
                setBulkEmployeeId(previewEmployee.empId);
                setOpenDialog(true);
              }}
            >
              Manage Allowances & Deductions
            </Button>
          </DialogActions>
        </Dialog>
        {/* Create Employee Dialog */}
        <Dialog
          open={openEmployeeDialog}
          onClose={handleCloseEmployeeDialog}
          maxWidth="md"
          fullWidth
          // PaperProps={{
          //   elevation: 0,
          //   className: "dialog-paper",
          // }}
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
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogContent className="dialog-content">
            {/* Add this section at the top of the dialog content */}
            {!editMode && (
              <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Select from Onboarded Employees
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Onboarded Employee</InputLabel>
                  <Select
                    value={selectedRegisteredEmployee}
                    onChange={(e) =>
                      handleRegisteredEmployeeSelect(e.target.value)
                    }
                    label="Select Onboarded Employee"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {registeredEmployees.map((emp) => (
                      <MenuItem key={emp.Emp_ID} value={emp.Emp_ID}>
                        {emp.Emp_ID} - {emp.personalInfo?.firstName || ""}{" "}
                        {emp.personalInfo?.lastName || ""}
                        {emp.joiningDetails?.department
                          ? ` (${emp.joiningDetails.department})`
                          : ""}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select an employee to auto-fill available information
                  </FormHelperText>
                </FormControl>
              </Box>
            )}

            {/* <Grid container spacing={2}>
              <Grid item xs={12} md={6}> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      email: e.target.value,
                    })
                  }
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
        {/* Create Allowance Dialog - Fixed for iPad View */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: "16px" },
              margin: { xs: 0, sm: "16px", md: "24px" },
              width: { xs: "100%", sm: "90%", md: "800px" },
              maxWidth: "100%",
              maxHeight: { xs: "100%", sm: "90vh" },
              overflow: "hidden",
            },
          }}
          className="allowance-dialog"
        >
          <DialogTitle className="dialog-title">
            {editMode ? "Edit Allowance" : "Add Allowances & Deductions"}
          </DialogTitle>
          <DialogContent className="allowance-dialog-content">
            {/* Employee Selection - Keep this outside the scrollable area */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
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

            {/* Scrollable content area */}
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: { xs: "60vh", sm: "50vh", md: "60vh" },
              }}
            >
              <Grid container spacing={2}>
                {editMode ? (
                  <>
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
                ) : (
                  <>
                    {/* Allowances Section */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className="dialog-section-title"
                      >
                        Select Allowances to Add
                      </Typography>
                      <TableContainer
                        component={Paper}
                        className="dialog-table-container"
                      >
                        <Table
                          stickyHeader
                          size="small"
                          className="dialog-table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                padding="checkbox"
                                className="dialog-table-cell"
                              >
                                Select
                              </TableCell>
                              <TableCell className="dialog-table-cell">
                                Allowance Type
                              </TableCell>
                              <TableCell className="dialog-table-cell dialog-hide-sm">
                                Description
                              </TableCell>
                              <TableCell className="dialog-table-cell">
                                Percentage (%)
                              </TableCell>
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
                              <TableRow
                                key={allowance.name}
                                className="dialog-table-row"
                              >
                                <TableCell
                                  padding="checkbox"
                                  className="dialog-table-cell"
                                >
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
                                <TableCell className="dialog-table-cell">
                                  {allowance.name}
                                </TableCell>
                                <TableCell className="dialog-table-cell dialog-hide-sm">
                                  {allowance.desc}
                                </TableCell>
                                <TableCell className="dialog-table-cell">
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
                                      !selectedAllowances.includes(
                                        allowance.name
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
                                    className="percentage-input"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Custom allowance input - restructured for better iPad layout */}
                      <Box className="custom-allowance-container">
                        <Typography className="selected-count">
                          {selectedAllowances.length} allowance(s) selected
                        </Typography>
                        <Box className="custom-input-group">
                          <TextField
                            label="Custom Allowance"
                            size="small"
                            id="custom-allowance"
                            className="custom-allowance-input"
                          />
                          <TextField
                            label="%"
                            type="number"
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                              inputProps: { min: 0, max: 100 },
                            }}
                            className="custom-percentage-input"
                            id="custom-percentage"
                          />
                          <Button
                            size="small"
                            variant="contained"
                            className="custom-add-button"
                            onClick={() => {
                              const customName =
                                document.getElementById(
                                  "custom-allowance"
                                ).value;
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
                                  [customName]:
                                    parseFloat(customPercentage) || 0,
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
                        <Paper className="selected-items-preview">
                          <Typography variant="subtitle2" gutterBottom>
                            Preview of Allowances to Add:
                          </Typography>
                          <TableContainer className="preview-table-container">
                            <Table size="small" className="preview-table">
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

                    {/* Deductions Section */}
                    <Grid item xs={12} className="deductions-section">
                      <Typography
                        variant="subtitle1"
                        className="dialog-section-title deduction-title"
                      >
                        Add Deductions (Optional)
                      </Typography>
                      <TableContainer
                        component={Paper}
                        className="dialog-table-container"
                      >
                        <Table
                          stickyHeader
                          size="small"
                          className="dialog-table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                padding="checkbox"
                                className="dialog-table-cell"
                              >
                                Select
                              </TableCell>
                              <TableCell className="dialog-table-cell">
                                Deduction Type
                              </TableCell>
                              <TableCell className="dialog-table-cell dialog-hide-sm">
                                Description
                              </TableCell>
                              <TableCell className="dialog-table-cell">
                                Percentage (%)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
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
                              <TableRow
                                key={deduction.name}
                                className="dialog-table-row"
                              >
                                <TableCell
                                  padding="checkbox"
                                  className="dialog-table-cell"
                                >
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
                                </TableCell>
                                <TableCell className="dialog-table-cell">
                                  {deduction.name}
                                </TableCell>
                                <TableCell className="dialog-table-cell dialog-hide-sm">
                                  {deduction.desc}
                                </TableCell>
                                <TableCell className="dialog-table-cell">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={
                                      deductionPercentages[deduction.name] || 0
                                    }
                                    onChange={(e) =>
                                      handleDeductionPercentageChange(
                                        deduction.name,
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      !selectedDeductions.includes(
                                        deduction.name
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
                                    className="percentage-input"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {selectedDeductions.length > 0 && (
                      <Grid item xs={12}>
                        <Paper className="selected-items-preview deduction-preview">
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            className="deduction-preview-title"
                          >
                            Selected Deductions:
                          </Typography>
                          <TableContainer className="preview-table-container">
                            <Table size="small" className="preview-table">
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
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              onClick={handleCloseDialog}
              color="error"
              variant="outlined"
              className="dialog-button cancel-button"
            >
              Cancel
            </Button>
            {editMode ? (
              <Button
                onClick={handleAddAllowance}
                color="primary"
                variant="contained"
                className="dialog-button submit-button"
              >
                Update Allowance
              </Button>
            ) : (
              <Button
                onClick={handleAddMultipleAllowances}
                color="primary"
                variant="contained"
                disabled={selectedAllowances.length === 0 || !bulkEmployeeId}
                className="dialog-button submit-button"
              >
                Add {selectedAllowances.length} Allowance(s)
                {selectedDeductions.length > 0 &&
                  ` & ${selectedDeductions.length} Deduction(s)`}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "16px" },
            width: { xs: "100%", sm: "450px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #ff7961)",
            color: "white",
            fontWeight: 600,
            padding: "16px 24px",
          }}
        >
          Delete Employee
        </DialogTitle>
        <DialogContent sx={{ padding: "24px", paddingTop: "24px" }}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>{employeeToDelete?.empName}</strong>? This action cannot be
            undone and will also remove all associated allowances and
            deductions.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
              padding: "6px 16px",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteEmployee}
            variant="contained"
            color="error"
            sx={{
              background: "linear-gradient(45deg, #f44336, #ff7961)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 24px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Allowances & Deductions Delete Confirmation Dialog */}
      <Dialog
        open={deleteAllowanceDialogOpen}
        onClose={() => setDeleteAllowanceDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "16px" },
            width: { xs: "100%", sm: "450px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #ff7961)",
            color: "white",
            fontWeight: 600,
            padding: "16px 24px",
          }}
        >
          Delete Allowances & Deductions
        </DialogTitle>
        <DialogContent sx={{ padding: "24px", paddingTop: "24px" }}>
          <Typography variant="body1">
            Are you sure you want to delete all allowances and deductions for{" "}
            <strong>{employeeToDeleteAllowances?.empName}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setDeleteAllowanceDialogOpen(false)}
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
              padding: "6px 16px",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteAllowancesAndDeductions}
            variant="contained"
            color="error"
            sx={{
              background: "linear-gradient(45deg, #f44336, #ff7961)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 24px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PayrollSystem;
