import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  DialogActions,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import {
  UploadFile,
  Close,
  Search,
  Edit,
  Delete,
  FilterList,
  Sort,
  Download,
} from "@mui/icons-material";
import GavelIcon from "@mui/icons-material/Gavel";
import axios from "axios";

const DisciplinaryActions = () => {
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingAction, setEditingAction] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const actionStatuses = [
    "Warning",
    "Suspension",
    "Termination",
    "Written Notice",
  ];

  const initialFormState = {
    employee: "",
    action: "",
    description: "",
    startDate: "",
    status: "",
    attachments: null,
    employeeId: "",
    email: "",
    department: "",
    designation: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchActions();
    fetchRegisteredEmployees();
  }, [searchQuery, filterStatus]);

  const fetchActions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/disciplinary-actions?searchQuery=${searchQuery}&status=${filterStatus}`
      );
      if (!response.ok) throw new Error("Failed to fetch actions");
      const data = await response.json();
      setActions(data);
    } catch (error) {
      showSnackbar("Error fetching actions", "error");
    }
  };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(
        "http://localhost:5000/api/employees/registered"
      );
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      showSnackbar("Error fetching employees", "error");
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the form with employee data
      const fullName = `${employee.personalInfo?.firstName || ""} ${
        employee.personalInfo?.lastName || ""
      }`.trim();
      setFormData({
        ...formData,
        employee: fullName,
        employeeId: employee.Emp_ID || "",
        email: employee.personalInfo?.email || "",
        department: employee.joiningDetails?.department || "",
        designation: employee.joiningDetails?.initialDesignation || "",
      });
    } else {
      // Reset employee-related fields if selection is cleared
      setFormData({
        ...formData,
        employee: "",
        employeeId: "",
        email: "",
        department: "",
        designation: "",
      });
    }
  };

  const handleClickOpen = () => {
    setEditingAction(null);
    setFormData(initialFormState);
    setSelectedEmployee(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAction(null);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachments: e.target.files[0],
    }));
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "attachments") {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.attachments) {
        formDataToSend.append("attachments", formData.attachments);
      }

      const method = editingAction ? "PUT" : "POST";
      const url = editingAction
        ? `http://localhost:5000/api/disciplinary-actions/${editingAction._id}`
        : "http://localhost:5000/api/disciplinary-actions";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save action");

      showSnackbar(
        editingAction
          ? "Action updated successfully"
          : "Action created successfully"
      );
      fetchActions();
      handleClose();
    } catch (error) {
      showSnackbar("Error saving action", "error");
    }
  };

  const handleEdit = (action) => {
    setEditingAction(action);

    // Find the employee if there's an employeeId
    const employee = action.employeeId
      ? registeredEmployees.find((emp) => emp.Emp_ID === action.employeeId)
      : null;

    setSelectedEmployee(employee);

    setFormData({
      ...action,
      attachments: null, // Reset file input
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/disciplinary-actions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete action");

      showSnackbar("Action deleted successfully");
      fetchActions();
    } catch (error) {
      showSnackbar("Error deleting action", "error");
    }
  };

  const downloadFile = async (filename, originalName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/disciplinary-actions/download/${filename}`
      );
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showSnackbar("Error downloading file", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Warning: "warning",
      Suspension: "error",
      Termination: "error",
      "Written Notice": "info",
    };
    return colors[status] || "default";
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight="800" fontSize="1.5rem">
          Disciplinary Actions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<span style={{ fontSize: "1.5rem" }}>+</span>}
        >
          Take An Action
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ width: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          {actionStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Employee</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Attachments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.length > 0 ? (
              actions.map((action) => (
                <TableRow key={action._id} hover>
                  <TableCell>{action.employee}</TableCell>
                  <TableCell>
                    {action.employeeId ? (
                      <Chip
                        label={action.employeeId}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{action.department || "-"}</TableCell>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{action.description}</TableCell>
                  <TableCell>
                    {new Date(action.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={action.status}
                      color={getStatusColor(action.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {action.attachments && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          downloadFile(
                            action.attachments.filename,
                            action.attachments.originalName
                          )
                        }
                      >
                        <Download />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(action)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(action._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box sx={{ py: 3, textAlign: "center" }}>
                    <GavelIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                    <Typography color="textSecondary">
                      No disciplinary actions found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          {editingAction ? "Edit Action" : "Take An Action"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Employee Selection Autocomplete */}
            <Grid item xs={12}>
              <Autocomplete
                id="employee-select"
                options={registeredEmployees}
                getOptionLabel={(option) =>
                  `${option.Emp_ID} - ${option.personalInfo?.firstName || ""} ${
                    option.personalInfo?.lastName || ""
                  }`
                }
                value={selectedEmployee}
                onChange={handleEmployeeSelect}
                loading={loadingEmployees}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingEmployees ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
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
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="employee"
                label="Employee Name"
                fullWidth
                required
                value={formData.employee}
                onChange={handleInputChange}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="department"
                label="Department"
                fullWidth
                value={formData.department}
                onChange={handleInputChange}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="designation"
                label="Designation"
                fullWidth
                value={formData.designation}
                onChange={handleInputChange}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="action"
                label="Action Type"
                select
                fullWidth
                required
                value={formData.action}
                onChange={handleInputChange}
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
                <MenuItem value="Verbal Warning">Verbal Warning</MenuItem>
                <MenuItem value="Written Warning">Written Warning</MenuItem>
                <MenuItem value="Suspension">Suspension</MenuItem>
                <MenuItem value="Termination">Termination</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                required
                value={formData.startDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="status"
                label="Status"
                select
                fullWidth
                required
                value={formData.status}
                onChange={handleInputChange}
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
                {actionStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.description}
                onChange={handleInputChange}
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
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                sx={{
                  borderRadius: "12px",
                  padding: "10px 16px",
                  textTransform: "none",
                }}
              >
                Upload Attachment
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              {formData.attachments && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  File selected: {formData.attachments.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ padding: "24px 32px", backgroundColor: "#f8fafc" }}
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
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #1976d2)",
              },
            }}
          >
            {editingAction ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DisciplinaryActions;
