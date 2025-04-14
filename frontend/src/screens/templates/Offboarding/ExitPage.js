import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Grid,
  Divider,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  Autocomplete,
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
  Visibility,
  AssignmentTurnedIn,
  CalendarToday,
  SupervisorAccount,
  CheckCircle,
  CloudUpload,
  InsertDriveFile,
  ListAlt,
  Timeline,
} from "@mui/icons-material";

import "./ExitPage.css";

const ExitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null,
    action: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedExistingEmployee, setSelectedExistingEmployee] = useState(null);

  // Asset management state
  const [assetType, setAssetType] = useState("");
  const [assetId, setAssetId] = useState("");
  const [assetStatus, setAssetStatus] = useState("");

  const [offboardingStages, setOffboardingStages] = useState([
    {
      stageName: "Notice Period",
      employees: [],
      expanded: false,
      color: "#1976d2",
      icon: "N",
      description:
        "Employee has submitted resignation and is serving notice period",
    },
    {
      stageName: "Exit Interview",
      employees: [],
      expanded: false,
      color: "#ff9800",
      icon: "I",
      description: "Conducting exit interviews to gather feedback",
    },
    {
      stageName: "Work Handover",
      employees: [],
      expanded: false,
      color: "#4caf50",
      icon: "H",
      description:
        "Transferring responsibilities and knowledge to other team members",
    },
    {
      stageName: "Clearance Process",
      employees: [],
      expanded: false,
      color: "#f44336",
      icon: "C",
      description: "Completing clearance from all departments",
    },
  ]);

  const [newData, setNewData] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    position: "",
    joiningDate: "",
    noticePeriod: "",
    startDate: "",
    endDate: "",
    stage: "Notice Period",
    taskStatus: "0/0",
    description: "",
    manager: "",
    reason: "",
    otherReason: "",
    interviewDate: "",
    interviewer: "",
    feedback: "",
    handoverTo: "",
    handoverEmail: "",
    projectDocuments: "",
    pendingTasks: "",
    assets: [],
    clearanceStatus: {
      hr: false,
      it: false,
      finance: false,
      admin: false,
    },
    exitChecklistCompleted: false,
    officiallyOffboarded: false,
  });

  // Helper functions
  const calculateCompletionPercentage = (employee) => {
    if (!employee.taskStatus) return 0;
    const [completed, total] = employee.taskStatus.split("/").map(Number);
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getStageColor = (stageName) => {
    const stage = offboardingStages.find((s) => s.stageName === stageName);
    return stage ? stage.color : "#1976d2";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Returned":
        return "#4caf50";
      case "Pending":
        return "#ff9800";
      case "Lost/Damaged":
        return "#f44336";
      default:
        return "#1976d2";
    }
  };

  const handleAddAsset = (asset) => {
    if (editMode) {
      const updatedAssets = [...(editData.assets || []), asset];
      setEditData({
        ...editData,
        assets: updatedAssets,
      });
    } else {
      const updatedAssets = [...(newData.assets || []), asset];
      setNewData({
        ...newData,
        assets: updatedAssets,
      });
    }
  };

  const handleRemoveAsset = (index) => {
    if (editMode) {
      const updatedAssets = [...editData.assets];
      updatedAssets.splice(index, 1);
      setEditData({
        ...editData,
        assets: updatedAssets,
      });
    } else {
      const updatedAssets = [...newData.assets];
      updatedAssets.splice(index, 1);
      setNewData({
        ...newData,
        assets: updatedAssets,
      });
    }
  };

  const handleAssetStatusChange = (employee, assetIndex, newStatus) => {
    const updatedEmployee = { ...employee };
    updatedEmployee.assets[assetIndex].status = newStatus;

    axios
      .put(
        `http://localhost:5000/api/offboarding/${employee._id}`,
        updatedEmployee
      )
      .then(() => {
        setSnackbar({
          open: true,
          message: "Asset status updated successfully",
          severity: "success",
        });
        fetchOffboardings();
      })
      .catch((error) => {
        console.error("Error updating asset status:", error);
        setSnackbar({
          open: true,
          message: "Failed to update asset status",
          severity: "error",
        });
      });
  };

  const handleClearanceStatusChange = (employee, department, status) => {
    const updatedEmployee = { ...employee };
    if (!updatedEmployee.clearanceStatus) {
      updatedEmployee.clearanceStatus = {};
    }
    updatedEmployee.clearanceStatus[department] = status;

    // Check if all clearances are completed
    const allCleared = Object.values(updatedEmployee.clearanceStatus).every(
      (val) => val === true
    );
    updatedEmployee.exitChecklistCompleted = allCleared;

    axios
      .put(
        `http://localhost:5000/api/offboarding/${employee._id}`,
        updatedEmployee
      )
      .then(() => {
        setSnackbar({
          open: true,
          message: `${department} clearance ${status ? "approved" : "pending"}`,
          severity: "success",
        });
        
        // If all clearances are completed, show a special notification
        if (allCleared) {
          setSnackbar({
            open: true,
            message: "All clearances completed. Employee is ready for final offboarding.",
            severity: "success",
          });
        }
        
        setSelectedEmployee(updatedEmployee);
        fetchOffboardings();
      })
      .catch((error) => {
        console.error("Error updating clearance status:", error);
        setSnackbar({
          open: true,
          message: "Failed to update clearance status",
          severity: "error",
        });
      });
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setViewDetailsOpen(true);
  };

  const handleMoveToNextStage = (employee) => {
    const currentStageIndex = offboardingStages.findIndex(
      (stage) => stage.stageName === employee.stage
    );

    if (currentStageIndex < offboardingStages.length - 1) {
      const nextStage = offboardingStages[currentStageIndex + 1].stageName;
      const updatedEmployee = { ...employee, stage: nextStage };

      axios
        .put(
          `http://localhost:5000/api/offboarding/${employee._id}`,
          updatedEmployee
        )
        .then(() => {
          setSnackbar({
            open: true,
            message: `Employee moved to ${nextStage} stage`,
            severity: "success",
          });
          fetchOffboardings();
        })
        .catch((error) => {
          console.error("Error moving employee to next stage:", error);
          setSnackbar({
            open: true,
            message: "Failed to move employee to next stage",
            severity: "error",
          });
        });
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile || !documentType) return;

    setLoading(true);

    // Create form data for file upload
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentType", documentType);
    formData.append("employeeId", selectedEmployee?._id || "");

    axios
      .post("http://localhost:5000/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Document uploaded successfully",
          severity: "success",
        });
        setUploadOpen(false);
        setSelectedFile(null);
        setDocumentType("");
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
        setSnackbar({
          open: true,
          message: "Failed to upload document",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/registered");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    if (!employee) {
      setSelectedExistingEmployee(null);
      return;
    }
    
    setSelectedExistingEmployee(employee);
    
    // Format date for form fields
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    // Autofill form fields based on selected employee
    if (editMode) {
      setEditData({
        ...editData,
        employeeName: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
        employeeId: employee.Emp_ID,
        department: employee.joiningDetails?.department || '',
        position: employee.joiningDetails?.initialDesignation || '',
        joiningDate: formatDate(employee.joiningDetails?.dateOfJoining),
        manager: employee.joiningDetails?.reportingManager || '',
      });
    } else {
      setNewData({
        ...newData,
        employeeName: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
        employeeId: employee.Emp_ID,
        department: employee.joiningDetails?.department || '',
        position: employee.joiningDetails?.initialDesignation || '',
        joiningDate: formatDate(employee.joiningDetails?.dateOfJoining),
        manager: employee.joiningDetails?.reportingManager || '',
      });
    }
  };

  const finalizeOffboarding = (employeeId) => {
    const employee = offboardingStages
      .flatMap(stage => stage.employees)
      .find(emp => emp._id === employeeId);
    
    if (!employee || !employee.exitChecklistCompleted) {
      setSnackbar({
        open: true,
        message: "Cannot finalize offboarding. Complete all clearances first.",
        severity: "warning",
      });
      return;
    }
    
    const updatedEmployee = { 
      ...employee, 
      officiallyOffboarded: true,
      officiallyOffboardedDate: new Date()
    };
    
    setLoading(true);
    
    axios
      .put(`http://localhost:5000/api/offboarding/${employeeId}`, updatedEmployee)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Employee has been officially offboarded",
          severity: "success",
        });
        fetchOffboardings();
        if (selectedEmployee && selectedEmployee._id === employeeId) {
          setSelectedEmployee(updatedEmployee);
        }
      })
      .catch(error => {
        console.error("Error finalizing offboarding:", error);
        setSnackbar({
          open: true,
          message: "Failed to finalize offboarding",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFinalizeOffboarding = (employee) => {
    if (!employee.exitChecklistCompleted) {
      setSnackbar({
        open: true,
        message: "Cannot finalize offboarding. Complete all clearances first.",
        severity: "warning",
      });
      return;
    }

    setConfirmDialog({
      open: true,
      id: employee._id,
      action: "finalize",
    });
  };

  const fetchOffboardings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offboarding");
      const offboardings = response.data;
      const updatedStages = offboardingStages.map((stage) => ({
        ...stage,
        employees: offboardings.filter((emp) => emp.stage === stage.stageName),
      }));
      setOffboardingStages(updatedStages);
    } catch (error) {
      console.error("Error fetching offboardings:", error);
    }
  };

  useEffect(() => {
    fetchOffboardings();
    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setEditMode(true);
    setEditData(employee);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/offboarding/${editData._id}`,
          editData
        );
      } else {
        await axios.post("http://localhost:5000/api/offboarding", newData);
      }
      await fetchOffboardings();
      setCreateOpen(false);
      setEditMode(false);
      setEditData(null);
      setSelectedExistingEmployee(null);
      setNewData({
        employeeName: "",
        employeeId: "",
        department: "",
        position: "",
        joiningDate: "",
        noticePeriod: "",
        startDate: "",
        endDate: "",
        stage: "Notice Period",
        taskStatus: "0/0",
        description: "",
        manager: "",
        reason: "",
        otherReason: "",
        interviewDate: "",
        interviewer: "",
        feedback: "",
        handoverTo: "",
        handoverEmail: "",
        projectDocuments: "",
        pendingTasks: "",
        assets: [],
        clearanceStatus: {
          hr: false,
          it: false,
          finance: false,
          admin: false,
        },
        exitChecklistCompleted: false,
        officiallyOffboarded: false,
      });
      setSnackbar({
        open: true,
        message: editMode
          ? "Offboarding updated successfully"
          : "Offboarding created successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving offboarding:", error);
      setSnackbar({
        open: true,
        message: "Error saving offboarding data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/offboarding/${id}`);
      await fetchOffboardings();
      setSnackbar({
        open: true,
        message: "Offboarding record deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting offboarding:", error);
      setSnackbar({
        open: true,
        message: "Error deleting offboarding record",
        severity: "error",
      });
    }
  };

  const handleExpand = (index) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === index ? { ...stage, expanded: !stage.expanded } : stage
      )
    );
  };

  const filteredStages = offboardingStages.map((stage) => ({
    ...stage,
    employees: stage.employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="home-page">
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "24px 32px",
          marginBottom: "24px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              background: "#1976d2",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Offboarding
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
            />

            <Button
              onClick={() => {
                setCreateOpen(true);
                setEditMode(false);
                setEditData(null);
                setSelectedExistingEmployee(null);
              }}
              startIcon={<Add />}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
              variant="contained"
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* View Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          <Tab
            icon={<ListAlt />}
            label="List View"
            iconPosition="start"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              minHeight: "48px",
              "&.Mui-selected": {
                color: "#1976d2",
                fontWeight: 600,
              },
            }}
          />
          <Tab
            icon={<Timeline />}
            label="Pipeline View"
            iconPosition="start"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              minHeight: "48px",
              "&.Mui-selected": {
                color: "#1976d2",
                fontWeight: 600,
              },
            }}
          />
        </Tabs>
      </Box>

      {/* List View */}
      {tabValue === 0 && (
        <div className="offboarding-list">
          <Box sx={{ padding: "0 32px" }}>
            {filteredStages.map((stage, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  mb: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  onClick={() => handleExpand(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    cursor: "pointer",
                    borderBottom: stage.expanded ? "1px solid #e2e8f0" : "none",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: `${stage.color}20`,
                        color: stage.color,
                        width: 36,
                        height: 36,
                        mr: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {stage.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: stage.color }}
                      >
                        {stage.stageName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {stage.employees.length} employee
                        {stage.employees.length !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      label={`${stage.employees.length} employee${
                        stage.employees.length !== 1 ? "s" : ""
                      }`}
                      size="small"
                      sx={{
                        backgroundColor: `${stage.color}10`,
                        color: stage.color,
                        fontWeight: 500,
                        mr: 2,
                      }}
                    />
                    <IconButton size="small">
                      {stage.expanded ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {stage.expanded && (
                  <Box sx={{ p: 3 }}>
                    {stage.employees.length > 0 ? (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Employee
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Notice Period
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Start Date
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                End Date
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Task Status
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Manager
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#475569" }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {stage.employees.map((emp) => (
                              <TableRow
                                key={emp._id}
                                sx={{
                                  "&:hover": { backgroundColor: "#f8fafc" },
                                  backgroundColor: emp.officiallyOffboarded ? "#e8f5e9" : "inherit",
                                }}
                              >
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: stage.color,
                                        fontSize: "14px",
                                        mr: 1,
                                      }}
                                    >
                                      {emp.employeeName.charAt(0)}
                                    </Avatar>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                      >
                                        {emp.employeeName}
                                        {emp.officiallyOffboarded && (
                                          <CheckCircle 
                                            sx={{ 
                                              color: "#4caf50", 
                                              fontSize: 14, 
                                              ml: 0.5,
                                              verticalAlign: "middle"
                                            }} 
                                          />
                                        )}
                                      </Typography>
                                      {emp.position && (
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#64748b" }}
                                        >
                                          {emp.position}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>{emp.noticePeriod}</TableCell>
                                <TableCell>
                                  {new Date(emp.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(emp.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box sx={{ width: 60, mr: 1 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={calculateCompletionPercentage(
                                          emp
                                        )}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          backgroundColor: "#e2e8f0",
                                          "& .MuiLinearProgress-bar": {
                                            backgroundColor: stage.color,
                                            borderRadius: 3,
                                          },
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {emp.taskStatus}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>{emp.manager}</TableCell>
                                <TableCell>
                                  <Stack direction="row" spacing={1}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        onClick={() => handleViewDetails(emp)}
                                        size="small"
                                        sx={{
                                          color: "#1976d2",
                                          "&:hover": {
                                            backgroundColor: "#e3f2fd",
                                          },
                                        }}
                                      >
                                        <Visibility fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        onClick={() => handleEditClick(emp)}
                                        size="small"
                                        sx={{
                                          color: "#1976d2",
                                          "&:hover": {
                                            backgroundColor: "#e3f2fd",
                                          },
                                        }}
                                        disabled={emp.officiallyOffboarded}
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        onClick={() =>
                                          setConfirmDialog({
                                            open: true,
                                            id: emp._id,
                                            action: "delete",
                                          })
                                        }
                                        size="small"
                                        sx={{
                                          color: "#ef4444",
                                          "&:hover": {
                                            backgroundColor: "#fee2e2",
                                          },
                                        }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    {index < offboardingStages.length - 1 && !emp.officiallyOffboarded && (
                                      <Tooltip
                                        title={`Move to ${
                                          offboardingStages[index + 1].stageName
                                        }`}
                                      >
                                        <IconButton
                                          onClick={() =>
                                            handleMoveToNextStage(emp)
                                          }
                                          size="small"
                                          sx={{
                                            color: "#4caf50",
                                            "&:hover": {
                                              backgroundColor: "#e8f5e9",
                                            },
                                          }}
                                        >
                                          <AssignmentTurnedIn fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {stage.stageName === "Clearance Process" && 
                                     emp.exitChecklistCompleted && 
                                     !emp.officiallyOffboarded && (
                                      <Tooltip title="Finalize Offboarding">
                                        <IconButton
                                          onClick={() => handleFinalizeOffboarding(emp)}
                                          size="small"
                                          sx={{
                                            color: "#4caf50",
                                            "&:hover": {
                                              backgroundColor: "#e8f5e9",
                                            },
                                          }}
                                        >
                                          <CheckCircle fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography
                        sx={{
                          textAlign: "center",
                          color: "#64748b",
                          py: 4,
                        }}
                      >
                        No employees in this stage.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </div>
      )}

      {/* Pipeline View */}
      {tabValue === 1 && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            p: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Stepper orientation="vertical">
            {offboardingStages.map((stage, index) => (
              <Step key={index} active={true} expanded={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        bgcolor: `${stage.color}20`,
                        color: stage.color,
                        width: 36,
                        height: 36,
                        fontWeight: "bold",
                      }}
                    >
                      {stage.icon}
                    </Avatar>
                  )}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: stage.color }}
                    >
                      {stage.stageName}
                    </Typography>
                    <Chip
                      label={`${stage.employees.length} employee${
                        stage.employees.length !== 1 ? "s" : ""
                      }`}
                      size="small"
                      sx={{
                        backgroundColor: `${stage.color}10`,
                        color: stage.color,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                    {stage.description}
                  </Typography>

                  {stage.employees.length > 0 ? (
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
                    >
                      {stage.employees.map((emp) => (
                        <Paper
                          key={emp._id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            width: 280,
                            border: `1px solid ${stage.color}30`,
                            "&:hover": {
                              boxShadow: `0 4px 12px ${stage.color}20`,
                              borderColor: `${stage.color}50`,
                            },
                            transition: "all 0.3s ease",
                            backgroundColor: emp.officiallyOffboarded ? "#e8f5e9" : "inherit",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: stage.color,
                                width: 40,
                                height: 40,
                                mr: 1.5,
                              }}
                            >
                              {emp.employeeName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                {emp.employeeName}
                                {emp.officiallyOffboarded && (
                                  <CheckCircle 
                                    sx={{ 
                                      color: "#4caf50", 
                                      fontSize: 14, 
                                      ml: 0.5,
                                      verticalAlign: "middle"
                                    }} 
                                  />
                                )}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                              >
                                {emp.position || "Position not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CalendarToday
                              sx={{ fontSize: 16, color: "#64748b", mr: 1 }}
                            />
                            <Typography variant="body2">
                              {new Date(emp.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <SupervisorAccount
                              sx={{ fontSize: 16, color: "#64748b", mr: 1 }}
                            />
                            <Typography variant="body2">
                              {emp.manager}
                            </Typography>
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              Completion
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <Box sx={{ flex: 1, mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateCompletionPercentage(emp)}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "#e2e8f0",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: stage.color,
                                      borderRadius: 3,
                                    },
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 500 }}
                              >
                                {emp.taskStatus}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 2,
                            }}
                          >
                            <Button
                              size="small"
                              startIcon={<Visibility fontSize="small" />}
                              onClick={() => handleViewDetails(emp)}
                              sx={{
                                color: stage.color,
                                borderColor: stage.color,
                                "&:hover": {
                                  backgroundColor: `${stage.color}10`,
                                  borderColor: stage.color,
                                },
                                textTransform: "none",
                              }}
                              variant="outlined"
                            >
                              Details
                            </Button>

                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(emp)}
                                sx={{
                                  color: "#1976d2",
                                  "&:hover": { backgroundColor: "#e3f2fd" },
                                  mr: 0.5,
                                }}
                                disabled={emp.officiallyOffboarded}
                              >
                                <Edit fontSize="small" />
                              </IconButton>

                              {index < offboardingStages.length - 1 && !emp.officiallyOffboarded && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleMoveToNextStage(emp)}
                                  sx={{
                                    color: "#4caf50",
                                    "&:hover": { backgroundColor: "#e8f5e9" },
                                  }}
                                >
                                  <AssignmentTurnedIn fontSize="small" />
                                </IconButton>
                              )}
                              
                              {stage.stageName === "Clearance Process" && 
                               emp.exitChecklistCompleted && 
                               !emp.officiallyOffboarded && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleFinalizeOffboarding(emp)}
                                  sx={{
                                    color: "#4caf50",
                                    "&:hover": { backgroundColor: "#e8f5e9" },
                                  }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: "#64748b",
                        py: 2,
                        px: 3,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      No employees in this stage.
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {createOpen && (
        <Dialog
          open={createOpen}
          onClose={() => {
            setCreateOpen(false);
            setEditMode(false);
            setEditData(null);
            setSelectedExistingEmployee(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: "700px",
              maxWidth: "90vw",
              borderRadius: "20px",
              overflow: "hidden",
              margin: "16px",
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
              position: "relative",
            }}
          >
                        {editMode ? "Edit Offboarding" : "New Offboarding"}
            <IconButton
              onClick={() => {
                setCreateOpen(false);
                setEditMode(false);
                setEditData(null);
                setSelectedExistingEmployee(null);
              }}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: "32px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <Grid container spacing={3}>
                {!editMode && (
                  <Grid item xs={12}>
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => 
                        `${option.Emp_ID} - ${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`
                      }
                      value={selectedExistingEmployee}
                      onChange={handleEmployeeSelect}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Existing Employee (Optional)"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                    <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
                      Select an existing employee to auto-fill details or manually enter information below
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Employee Name"
                    value={
                      editMode ? editData.employeeName : newData.employeeName
                    }
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            employeeName: e.target.value,
                          })
                        : setNewData({
                            ...newData,
                            employeeName: e.target.value,
                          })
                    }
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Employee ID"
                    value={editMode ? editData.employeeId : newData.employeeId}
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            employeeId: e.target.value,
                          })
                        : setNewData({ ...newData, employeeId: e.target.value })
                    }
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={
                        editMode ? editData.department : newData.department
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              department: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              department: e.target.value,
                            })
                      }
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Position</InputLabel>
                    <Select
                      value={editMode ? editData.position : newData.position}
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              position: e.target.value,
                            })
                          : setNewData({ ...newData, position: e.target.value })
                      }
                      label="Position"
                      disabled={!editMode && !newData.department}
                    >
                      {(editMode
                        ? positions[editData.department] || []
                        : positions[newData.department] || []
                      ).map((pos) => (
                        <MenuItem key={pos} value={pos}>
                          {pos}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Joining Date"
                    value={
                      editMode
                        ? editData.joiningDate?.split("T")[0]
                        : newData.joiningDate
                    }
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            joiningDate: e.target.value,
                          })
                        : setNewData({
                            ...newData,
                            joiningDate: e.target.value,
                          })
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Stage</InputLabel>
                    <Select
                      value={editMode ? editData.stage : newData.stage}
                      onChange={(e) =>
                        editMode
                          ? setEditData({ ...editData, stage: e.target.value })
                          : setNewData({ ...newData, stage: e.target.value })
                      }
                      label="Stage"
                    >
                      {offboardingStages.map((stage) => (
                        <MenuItem key={stage.stageName} value={stage.stageName}>
                          {stage.stageName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Notice Period Duration"
                    value={
                      editMode ? editData.noticePeriod : newData.noticePeriod
                    }
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            noticePeriod: e.target.value,
                          })
                        : setNewData({
                            ...newData,
                            noticePeriod: e.target.value,
                          })
                    }
                    required
                    fullWidth
                    placeholder="e.g. 30 days, 2 months"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Manager"
                    value={editMode ? editData.manager : newData.manager}
                    onChange={(e) =>
                      editMode
                        ? setEditData({ ...editData, manager: e.target.value })
                        : setNewData({ ...newData, manager: e.target.value })
                    }
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={
                      editMode
                        ? editData.startDate?.split("T")[0]
                        : newData.startDate
                    }
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            startDate: e.target.value,
                          })
                        : setNewData({
                            ...newData,
                            startDate: e.target.value,
                          })
                    }
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="End Date"
                    value={
                      editMode
                        ? editData.endDate?.split("T")[0]
                        : newData.endDate
                    }
                    onChange={(e) =>
                      editMode
                        ? setEditData({
                            ...editData,
                            endDate: e.target.value,
                          })
                        : setNewData({ ...newData, endDate: e.target.value })
                    }
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Reason for Leaving</InputLabel>
                    <Select
                      value={editMode ? editData.reason : newData.reason}
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              reason: e.target.value,
                            })
                          : setNewData({ ...newData, reason: e.target.value })
                      }
                      label="Reason for Leaving"
                    >
                      <MenuItem value="Better Opportunity">Better Opportunity</MenuItem>
                      <MenuItem value="Relocation">Relocation</MenuItem>
                      <MenuItem value="Work-Life Balance">Work-Life Balance</MenuItem>
                      <MenuItem value="Career Change">Career Change</MenuItem>
                      <MenuItem value="Retirement">Retirement</MenuItem>
                      <MenuItem value="Health Reasons">Health Reasons</MenuItem>
                      <MenuItem value="Company Culture">Company Culture</MenuItem>
                      <MenuItem value="Compensation">Compensation</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {(editMode ? editData.reason : newData.reason) === "Other" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Specify Other Reason"
                      value={editMode ? editData.otherReason : newData.otherReason}
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              otherReason: e.target.value,
                            })
                          : setNewData({ ...newData, otherReason: e.target.value })
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                )}

                {(editMode ? editData.stage : newData.stage) ===
                  "Exit Interview" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="date"
                        label="Interview Date"
                        value={
                          editMode
                            ? editData.interviewDate?.split("T")[0]
                            : newData.interviewDate
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                interviewDate: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                interviewDate: e.target.value,
                              })
                        }
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Interviewer"
                        value={
                          editMode ? editData.interviewer : newData.interviewer
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                interviewer: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                interviewer: e.target.value,
                              })
                        }
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Feedback"
                        value={editMode ? editData.feedback : newData.feedback}
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                feedback: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                feedback: e.target.value,
                              })
                        }
                        multiline
                        rows={3}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {(editMode ? editData.stage : newData.stage) ===
                  "Work Handover" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Handover To"
                        value={
                          editMode ? editData.handoverTo : newData.handoverTo
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                handoverTo: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                handoverTo: e.target.value,
                              })
                        }
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Handover Email"
                        value={
                          editMode
                            ? editData.handoverEmail
                            : newData.handoverEmail
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                handoverEmail: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                handoverEmail: e.target.value,
                              })
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Project Documents"
                        value={
                          editMode
                            ? editData.projectDocuments
                            : newData.projectDocuments
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                projectDocuments: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                projectDocuments: e.target.value,
                              })
                        }
                        multiline
                        rows={3}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Pending Tasks"
                        value={
                          editMode
                            ? editData.pendingTasks
                            : newData.pendingTasks
                        }
                        onChange={(e) =>
                          editMode
                            ? setEditData({
                                ...editData,
                                pendingTasks: e.target.value,
                              })
                            : setNewData({
                                ...newData,
                                pendingTasks: e.target.value,
                              })
                        }
                        multiline
                        rows={3}
                        required
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Asset Management
                  </Typography>

                  <Box
                                        sx={{
                                          mb: 2,
                                          p: 2,
                                          border: "1px solid #e0e0e0",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Grid container spacing={2} alignItems="center">
                                          <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth size="small">
                                              <InputLabel>Asset Type</InputLabel>
                                              <Select
                                                value={assetType}
                                                onChange={(e) => setAssetType(e.target.value)}
                                                label="Asset Type"
                                              >
                                                {assetTypes.map((type) => (
                                                  <MenuItem key={type} value={type}>
                                                    {type}
                                                  </MenuItem>
                                                ))}
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} sm={3}>
                                            <TextField
                                              label="Asset ID"
                                              value={assetId}
                                              onChange={(e) => setAssetId(e.target.value)}
                                              size="small"
                                              fullWidth
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={3}>
                                            <FormControl fullWidth size="small">
                                              <InputLabel>Status</InputLabel>
                                              <Select
                                                value={assetStatus}
                                                onChange={(e) => setAssetStatus(e.target.value)}
                                                label="Status"
                                              >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Returned">Returned</MenuItem>
                                                <MenuItem value="Lost/Damaged">
                                                  Lost/Damaged
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} sm={2}>
                                            <Button
                                              variant="contained"
                                              fullWidth
                                              onClick={() => {
                                                if (assetType && assetId && assetStatus) {
                                                  handleAddAsset({
                                                    type: assetType,
                                                    id: assetId,
                                                    status: assetStatus,
                                                  });
                                                  setAssetType("");
                                                  setAssetId("");
                                                  setAssetStatus("");
                                                }
                                              }}
                                              disabled={!assetType || !assetId || !assetStatus}
                                            >
                                              Add
                                            </Button>
                                          </Grid>
                                        </Grid>
                                      </Box>
                    
                                      {/* Asset List */}
                                      {((editMode ? editData.assets : newData.assets) || [])
                                        .length > 0 ? (
                                        <TableContainer>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Asset Type</TableCell>
                                                <TableCell>Asset ID</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Action</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {(editMode ? editData.assets : newData.assets).map(
                                                (asset, index) => (
                                                  <TableRow key={index}>
                                                    <TableCell>{asset.type}</TableCell>
                                                    <TableCell>{asset.id}</TableCell>
                                                    <TableCell>
                                                      <Chip
                                                        label={asset.status}
                                                        size="small"
                                                        sx={{
                                                          backgroundColor: `${getStatusColor(
                                                            asset.status
                                                          )}20`,
                                                          color: getStatusColor(asset.status),
                                                          fontWeight: 500,
                                                        }}
                                                      />
                                                    </TableCell>
                                                    <TableCell>
                                                      <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveAsset(index)}
                                                      >
                                                        <Delete fontSize="small" />
                                                      </IconButton>
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      ) : (
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "#64748b", textAlign: "center", p: 2 }}
                                        >
                                          No assets added yet.
                                        </Typography>
                                      )}
                                    </Grid>
                    
                                    <Grid item xs={12}>
                                      <TextField
                                        label="Additional Notes"
                                        value={
                                          editMode ? editData.description : newData.description
                                        }
                                        onChange={(e) =>
                                          editMode
                                            ? setEditData({
                                                ...editData,
                                                description: e.target.value,
                                              })
                                            : setNewData({
                                                ...newData,
                                                description: e.target.value,
                                              })
                                        }
                                        multiline
                                        rows={3}
                                        fullWidth
                                      />
                                    </Grid>
                    
                                    <Grid item xs={12}>
                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        justifyContent="flex-end"
                                        sx={{ mt: 2 }}
                                      >
                                        <Button
                                          onClick={() => {
                                            setCreateOpen(false);
                                            setEditMode(false);
                                            setEditData(null);
                                            setSelectedExistingEmployee(null);
                                          }}
                                          sx={{
                                            border: "2px solid #1976d2",
                                            color: "#1976d2",
                                            "&:hover": {
                                              border: "2px solid #64b5f6",
                                              backgroundColor: "#e3f2fd",
                                            },
                                            borderRadius: "8px",
                                            px: 4,
                                            py: 1,
                                            fontWeight: 600,
                                          }}
                                        >
                                          Cancel
                                        </Button>
                    
                                        <Button
                                          type="submit"
                                          disabled={loading}
                                          sx={{
                                            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                                            color: "white",
                                            "&:hover": {
                                              background:
                                                "linear-gradient(45deg, #1565c0, #42a5f5)",
                                            },
                                            borderRadius: "8px",
                                            px: 4,
                                            py: 1,
                                            fontWeight: 600,
                                          }}
                                          startIcon={
                                            loading ? (
                                              <CircularProgress size={20} color="inherit" />
                                            ) : null
                                          }
                                        >
                                          {loading ? "Saving..." : editMode ? "Update" : "Save"}
                                        </Button>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )}
                    
                          {/* View Details Dialog */}
                          {selectedEmployee && (
                            <Dialog
                              open={viewDetailsOpen}
                              onClose={() => {
                                setViewDetailsOpen(false);
                                setSelectedEmployee(null);
                              }}
                              maxWidth="md"
                              fullWidth
                              PaperProps={{
                                sx: {
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                },
                              }}
                            >
                              <DialogTitle
                                sx={{
                                  background: `linear-gradient(45deg, ${getStageColor(
                                    selectedEmployee.stage
                                  )}, ${getStageColor(selectedEmployee.stage)}90)`,
                                  color: "white",
                                  fontSize: "1.5rem",
                                  fontWeight: 600,
                                  padding: "20px 24px",
                                  position: "relative",
                                }}
                              >
                                Employee Offboarding Details
                                <IconButton
                                  onClick={() => {
                                    setViewDetailsOpen(false);
                                    setSelectedEmployee(null);
                                  }}
                                  sx={{
                                    position: "absolute",
                                    right: 16,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "white",
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </DialogTitle>
                    
                              <DialogContent sx={{ padding: "24px" }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={4}>
                                    <Paper
                                      variant="outlined"
                                      sx={{ p: 3, borderRadius: 2, height: "100%" }}
                                    >
                                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar
                                          sx={{
                                            bgcolor: getStageColor(selectedEmployee.stage),
                                            width: 56,
                                            height: 56,
                                            mr: 2,
                                          }}
                                        >
                                          {selectedEmployee.employeeName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {selectedEmployee.employeeName}
                                            {selectedEmployee.officiallyOffboarded && (
                                              <CheckCircle 
                                                sx={{ 
                                                  color: "#4caf50", 
                                                  fontSize: 16, 
                                                  ml: 0.5,
                                                  verticalAlign: "middle"
                                                }} 
                                              />
                                            )}
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            {selectedEmployee.position || "Position not specified"}
                                          </Typography>
                                        </Box>
                                      </Box>
                    
                                      <Divider sx={{ my: 2 }} />
                    
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                          Employee ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {selectedEmployee.employeeId || "Not specified"}
                                        </Typography>
                                      </Box>
                    
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                          Department
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {selectedEmployee.department || "Not specified"}
                                        </Typography>
                                      </Box>
                    
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                          Manager
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                          {selectedEmployee.manager}
                                        </Typography>
                                      </Box>
                    
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                          Current Stage
                                        </Typography>
                                        <Chip
                                          label={selectedEmployee.stage}
                                          sx={{
                                            mt: 0.5,
                                            backgroundColor: `${getStageColor(
                                              selectedEmployee.stage
                                            )}20`,
                                            color: getStageColor(selectedEmployee.stage),
                                            fontWeight: 500,
                                          }}
                                        />
                                      </Box>
                    
                                      {selectedEmployee.officiallyOffboarded && (
                                        <Box sx={{ mb: 2 }}>
                                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            Offboarding Date
                                          </Typography>
                                          <Typography variant="body1" sx={{ fontWeight: 500, color: "#4caf50" }}>
                                            {new Date(selectedEmployee.officiallyOffboardedDate).toLocaleDateString()}
                                          </Typography>
                                        </Box>
                                      )}
                    
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                          Task Status
                                        </Typography>
                                        <Box
                                          sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                                        >
                                          <Box sx={{ flex: 1, mr: 1 }}>
                                            <LinearProgress
                                              variant="determinate"
                                              value={calculateCompletionPercentage(
                                                selectedEmployee
                                              )}
                                              sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: "#e2e8f0",
                                                "& .MuiLinearProgress-bar": {
                                                  backgroundColor: getStageColor(
                                                    selectedEmployee.stage
                                                  ),
                                                  borderRadius: 3,
                                                },
                                              }}
                                            />
                                          </Box>
                                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {selectedEmployee.taskStatus}
                                          </Typography>
                                        </Box>
                                      </Box>
                    
                                      <Divider sx={{ my: 2 }} />
                    
                                      {!selectedEmployee.officiallyOffboarded && (
                                        <Button
                                          fullWidth
                                          variant="outlined"
                                          startIcon={<CloudUpload />}
                                          onClick={() => setUploadOpen(true)}
                                          sx={{
                                            borderColor: getStageColor(selectedEmployee.stage),
                                            color: getStageColor(selectedEmployee.stage),
                                            "&:hover": {
                                              backgroundColor: `${getStageColor(
                                                selectedEmployee.stage
                                              )}10`,
                                              borderColor: getStageColor(selectedEmployee.stage),
                                            },
                                          }}
                                        >
                                          Upload Document
                                        </Button>
                                      )}
                    
                                      {selectedEmployee.stage === "Clearance Process" && 
                                       selectedEmployee.exitChecklistCompleted && 
                                       !selectedEmployee.officiallyOffboarded && (
                                        <Button
                                          fullWidth
                                          variant="contained"
                                          startIcon={<CheckCircle />}
                                          onClick={() => handleFinalizeOffboarding(selectedEmployee)}
                                          sx={{
                                            mt: 2,
                                            backgroundColor: "#4caf50",
                                            "&:hover": {
                                              backgroundColor: "#388e3c",
                                            },
                                          }}
                                        >
                                          Finalize Offboarding
                                        </Button>
                                      )}
                                    </Paper>
                                  </Grid>
                    
                                  <Grid item xs={12} md={8}>
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                      <Typography
                                        variant="h6"
                                        sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
                                      >
                                        Offboarding Details
                                      </Typography>
                    
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            Notice Period
                                          </Typography>
                                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {selectedEmployee.noticePeriod}
                                          </Typography>
                                        </Grid>
                    
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            Joining Date
                                          </Typography>
                                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {selectedEmployee.joiningDate
                                              ? new Date(
                                                  selectedEmployee.joiningDate
                                                ).toLocaleDateString()
                                              : "Not specified"}
                                          </Typography>
                                        </Grid>
                    
                                        <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Start Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(
                          selectedEmployee.startDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        End Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(
                          selectedEmployee.endDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Reason for Leaving
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEmployee.reason === "Other" 
                          ? `${selectedEmployee.reason}: ${selectedEmployee.otherReason || "Not specified"}`
                          : selectedEmployee.reason || "Not specified"}
                      </Typography>
                    </Grid>

                    {selectedEmployee.description && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Additional Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedEmployee.description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                {selectedEmployee.stage === "Exit Interview" && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 2, mb: 3 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#ff9800", fontWeight: 600 }}
                    >
                      Exit Interview Details
                    </Typography>

                    <Grid container spacing={2}>
                      {selectedEmployee.interviewDate && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Interview Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date(
                              selectedEmployee.interviewDate
                            ).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      )}

                      {selectedEmployee.interviewer && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Interviewer
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedEmployee.interviewer}
                          </Typography>
                        </Grid>
                      )}

                      {selectedEmployee.feedback && (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Feedback
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.feedback}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}

                {selectedEmployee.stage === "Work Handover" && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 2, mb: 3 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#4caf50", fontWeight: 600 }}
                    >
                      Work Handover Details
                    </Typography>

                    <Grid container spacing={2}>
                      {selectedEmployee.handoverTo && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Handover To
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedEmployee.handoverTo}
                          </Typography>
                        </Grid>
                      )}

                      {selectedEmployee.handoverEmail && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Handover Email
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedEmployee.handoverEmail}
                          </Typography>
                        </Grid>
                      )}

                      {selectedEmployee.projectDocuments && (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Project Documents
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.projectDocuments}
                          </Typography>
                        </Grid>
                      )}

                      {selectedEmployee.pendingTasks && (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Pending Tasks
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.pendingTasks}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}

                {/* Asset Management Section */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}
                  >
                    Asset Management
                  </Typography>

                  {selectedEmployee.assets &&
                  selectedEmployee.assets.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Asset Type</TableCell>
                            <TableCell>Asset ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedEmployee.assets.map((asset, index) => (
                            <TableRow key={index}>
                              <TableCell>{asset.type}</TableCell>
                              <TableCell>{asset.id}</TableCell>
                              <TableCell>
                                <Chip
                                  label={asset.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getStatusColor(
                                      asset.status
                                    )}20`,
                                    color: getStatusColor(asset.status),
                                    fontWeight: 500,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {!selectedEmployee.officiallyOffboarded && (
                                  <FormControl
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    <Select
                                      value={asset.status}
                                      onChange={(e) =>
                                        handleAssetStatusChange(
                                          selectedEmployee,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      size="small"
                                    >
                                      <MenuItem value="Pending">Pending</MenuItem>
                                      <MenuItem value="Returned">
                                        Returned
                                      </MenuItem>
                                      <MenuItem value="Lost/Damaged">
                                        Lost/Damaged
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", textAlign: "center", p: 2 }}
                    >
                      No assets assigned to this employee.
                    </Typography>
                  )}
                </Paper>

                {/* Clearance Checklist */}
                {selectedEmployee.stage === "Clearance Process" && (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#f44336", fontWeight: 600 }}
                    >
                      Clearance Checklist
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selectedEmployee.clearanceStatus?.hr || false
                              }
                              onChange={(e) =>
                                !selectedEmployee.officiallyOffboarded && 
                                handleClearanceStatusChange(
                                  selectedEmployee,
                                  "hr",
                                  e.target.checked
                                )
                              }
                              disabled={selectedEmployee.officiallyOffboarded}
                              sx={{
                                color: "#f44336",
                                "&.Mui-checked": {
                                  color: "#f44336",
                                },
                              }}
                            />
                          }
                          label="HR Department Clearance"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selectedEmployee.clearanceStatus?.it || false
                              }
                              onChange={(e) =>
                                !selectedEmployee.officiallyOffboarded && 
                                handleClearanceStatusChange(
                                  selectedEmployee,
                                  "it",
                                  e.target.checked
                                )
                              }
                              disabled={selectedEmployee.officiallyOffboarded}
                              sx={{
                                color: "#1976d2",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label="IT Department Clearance"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selectedEmployee.clearanceStatus?.finance ||
                                false
                              }
                              onChange={(e) =>
                                !selectedEmployee.officiallyOffboarded && 
                                handleClearanceStatusChange(
                                  selectedEmployee,
                                  "finance",
                                  e.target.checked
                                )
                              }
                              disabled={selectedEmployee.officiallyOffboarded}
                              sx={{
                                color: "#4caf50",
                                "&.Mui-checked": {
                                  color: "#4caf50",
                                },
                              }}
                            />
                          }
                          label="Finance Department Clearance"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selectedEmployee.clearanceStatus?.admin || false
                              }
                              onChange={(e) =>
                                !selectedEmployee.officiallyOffboarded && 
                                handleClearanceStatusChange(
                                  selectedEmployee,
                                  "admin",
                                  e.target.checked
                                )
                              }
                              disabled={selectedEmployee.officiallyOffboarded}
                              sx={{
                                color: "#ff9800",
                                "&.Mui-checked": {
                                  color: "#ff9800",
                                },
                              }}
                            />
                          }
                          label="Admin Department Clearance"
                        />
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: selectedEmployee.exitChecklistCompleted
                          ? "#e8f5e9"
                          : "#fff3e0",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: selectedEmployee.exitChecklistCompleted
                            ? "#2e7d32"
                            : "#e65100",
                        }}
                      >
                        {selectedEmployee.officiallyOffboarded
                          ? "Employee has been officially offboarded."
                          : selectedEmployee.exitChecklistCompleted
                          ? "All clearances completed. Employee is ready for final exit."
                          : "Pending clearances. Complete all clearances before final exit."}
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Document Dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                label="Document Type"
              >
                <MenuItem value="resignation_letter">
                  Resignation Letter
                </MenuItem>
                <MenuItem value="exit_interview">Exit Interview Form</MenuItem>
                <MenuItem value="handover_document">Handover Document</MenuItem>
                <MenuItem value="clearance_form">Clearance Form</MenuItem>
                <MenuItem value="nda">Non-Disclosure Agreement</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                border: "2px dashed #1976d2",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                backgroundColor: "#f8fafc",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              {selectedFile ? (
                <Box>
                  <InsertDriveFile
                    sx={{ fontSize: 40, color: "#1976d2", mb: 1 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Click to select a file or drag and drop
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                  </Typography>
                </Box>
              )}
                            <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleFileUpload}
            disabled={!selectedFile || !documentType || loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === "delete"
              ? "Are you sure you want to delete this offboarding record? This action cannot be undone."
              : confirmDialog.action === "finalize"
              ? "Are you sure you want to finalize this employee's offboarding? This will mark the employee as officially offboarded and cannot be undone."
              : "Are you sure you want to proceed with this action?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === "delete" ? "error" : "primary"}
            onClick={() => {
              if (confirmDialog.action === "delete") {
                handleDelete(confirmDialog.id);
              } else if (confirmDialog.action === "finalize") {
                finalizeOffboarding(confirmDialog.id);
              }
              setConfirmDialog({ open: false, id: null, action: null });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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
    </div>
  );
};

// Sample data for dropdowns
const departments = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Operations",
  "Administration",
];

const positions = {
  Engineering: [
    "Software Engineer",
    "Senior Software Engineer",
    "Tech Lead",
    "Engineering Manager",
    "QA Engineer",
    "DevOps Engineer",
  ],
  Product: [
    "Product Manager",
    "Product Designer",
    "UX Researcher",
    "UI Designer",
  ],
  Marketing: [
    "Marketing Specialist",
    "Content Writer",
    "SEO Specialist",
    "Social Media Manager",
  ],
  Sales: [
    "Sales Representative",
    "Account Executive",
    "Sales Manager",
    "Business Development",
  ],
  "Customer Support": [
    "Support Specialist",
    "Customer Success Manager",
    "Technical Support",
  ],
  "Human Resources": [
    "HR Specialist",
    "Recruiter",
    "HR Manager",
    "Talent Acquisition",
  ],
  Finance: [
    "Accountant",
    "Financial Analyst",
    "Payroll Specialist",
    "Finance Manager",
  ],
  Operations: ["Operations Manager", "Project Manager", "Business Analyst"],
  Administration: [
    "Office Manager",
    "Administrative Assistant",
    "Receptionist",
  ],
};

const assetTypes = [
  "Laptop",
  "Mobile Phone",
  "Tablet",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Headset",
  "Access Card",
  "ID Card",
  "Software License",
  "Other",
];

// Helper function to format date for form inputs
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default ExitPage;


                    
                      









