import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
  InputLabel,
  Autocomplete,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const OrganizationChart = () => {
  const [treeData, setTreeData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newPosition, setNewPosition] = useState({
    name: "",
    designation: "",
    parentId: "",
    department: "",
    employeeId: "",
    email: "",
    status: "active",
  });
  const [editingPosition, setEditingPosition] = useState(null);
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [nodeDetails, setNodeDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchOrganizationChart();
    fetchRegisteredEmployees();
  }, []);

  const fetchOrganizationChart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/organization-chart`);
      setTreeData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching organization chart:", error);
      setIsLoading(false);
      setAlert({
        open: true,
        message: "Error loading organization chart",
        severity: "error",
      });
    }
  };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(`${API_URL}/employees/registered`);
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      setAlert({
        open: true,
        message: "Error loading employees",
        severity: "error",
      });
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the position form with employee data
      const fullName = `${employee.personalInfo?.firstName || ""} ${
        employee.personalInfo?.lastName || ""
      }`.trim();
      const department = employee.joiningDetails?.department || "";

      setNewPosition({
        ...newPosition,
        name: fullName,
        employeeId: employee.Emp_ID || "",
        email: employee.personalInfo?.email || "",
        department: department, // Make sure department is set correctly
        designation: employee.joiningDetails?.initialDesignation || "",
      });

      // Log to verify the department is being set
      console.log("Setting department:", department);
    } else {
      // Reset employee-related fields if selection is cleared
      setNewPosition({
        ...newPosition,
        employeeId: "",
        email: "",
        department: "",
        designation: "",
      });
    }
  };

  const handleAddPosition = async () => {
    try {
      // Rename designation to title for API compatibility
      const positionData = {
        ...newPosition,
        title: newPosition.designation,
      };
      delete positionData.designation;

      const response = await axios.post(`${API_URL}/positions`, positionData);

      await fetchOrganizationChart();
      setIsDialogOpen(false);
      resetForm();
      setAlert({
        open: true,
        message: "Position added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding position:", error);
      setAlert({
        open: true,
        message: "Error adding position",
        severity: "error",
      });
    }
  };

  const handleUpdatePosition = async () => {
    try {
      if (!editingPosition) return;

      // Rename designation to title for API compatibility
      const positionData = {
        ...newPosition,
        title: newPosition.designation,
      };
      delete positionData.designation;

      await axios.put(
        `${API_URL}/positions/${editingPosition._id}`,
        positionData
      );
      await fetchOrganizationChart();
      setIsEditDialogOpen(false);
      resetForm();
      setAlert({
        open: true,
        message: "Position updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating position:", error);
      setAlert({
        open: true,
        message: "Error updating position",
        severity: "error",
      });
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await axios.delete(`${API_URL}/positions/${id}`);
      await fetchOrganizationChart();
      setAlert({
        open: true,
        message: "Position deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting position:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Error deleting position",
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setNewPosition({
      name: "",
      designation: "",
      parentId: "",
      department: "",
      employeeId: "",
      email: "",
      status: "active",
    });
    setSelectedEmployee(null);
    setEditingPosition(null);
  };

  const openEditDialog = (node) => {
    setEditingPosition(node);

    // Find the employee if there's an employeeId
    const employee = node.employeeId
      ? registeredEmployees.find((emp) => emp.Emp_ID === node.employeeId)
      : null;

    setSelectedEmployee(employee);

    // If we have an employee, use their department, otherwise use the node's department
    const department =
      employee?.joiningDetails?.department || node.department || "";

    setNewPosition({
      name: node.name,
      designation: node.title, // Use title as designation
      parentId: node.parentId,
      department: department, // Make sure department is set correctly
      employeeId: node.employeeId || "",
      email: node.email || "",
      status: node.status || "active",
    });

    setIsEditDialogOpen(true);
  };

  const showNodeDetails = (node) => {
    setNodeDetails(node);
    setIsDetailsOpen(true);
  };

  const getAllNodes = useCallback((node, nodes = []) => {
    if (!node) return nodes;
    nodes.push({
      _id: node._id,
      name: node.name,
      title: node.title,
      department: node.department,
      employeeId: node.employeeId,
    });
    if (node.children) {
      node.children.forEach((child) => getAllNodes(child, nodes));
    }
    return nodes;
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const renderTreeNode = (node, level = 0) => {
    if (!node) return null;

    // Determine background color based on department or level
    const getBgColor = () => {
      if (level === 0) return "rgba(33, 150, 243, 0.95)";

      // If node has a department, use a color based on department
      if (node.department) {
        const deptColors = {
          HR: "rgba(156, 39, 176, 0.9)",
          IT: "rgba(0, 150, 136, 0.9)",
          Finance: "rgba(255, 152, 0, 0.9)",
          Marketing: "rgba(233, 30, 99, 0.9)",
          Operations: "rgba(63, 81, 181, 0.9)",
          Sales: "rgba(76, 175, 80, 0.9)",
        };
        return deptColors[node.department] || "rgba(25, 118, 210, 0.95)";
      }

      return "rgba(25, 118, 210, 0.95)";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: level * 0.2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getBgColor()} 0%, ${
              level === 0
                ? "rgba(30, 136, 229, 0.90)"
                : "rgba(30, 136, 229, 0.90)"
            } 100%)`,
            padding: "24px",
            borderRadius: "16px",
            color: "white",
            minWidth: "280px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 2,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
            },
          }}
          onClick={() => showNodeDetails(node)}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {node.name}
            {node.employeeId && (
              <Chip
                size="small"
                label={node.employeeId}
                sx={{
                  ml: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                }}
              />
            )}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {node.title} {/* This is the designation */}
          </Typography>
          {node.department && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, opacity: 0.8 }}
            >
              {node.department}
            </Typography>
          )}
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(node);
              }}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            {level !== 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePosition(node._id);
                }}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {node.children && node.children.length > 0 && (
          <>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "50px" }}
              transition={{ duration: 0.4 }}
              style={{
                width: "3px",
                background:
                  "linear-gradient(to bottom, #1976d2 30%, rgba(25, 118, 210, 0.2))",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                display: "flex",
                gap: "40px",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "5%",
                  width: "90%",
                  height: "3px",
                  background:
                    "linear-gradient(to right, rgba(25, 118, 210, 0.2), #1976d2, rgba(25, 118, 210, 0.2))",
                  zIndex: 1,
                },
              }}
            >
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </Box>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(25, 118, 210, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 118, 210, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: 2,
              textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <AccountTreeIcon sx={{ fontSize: 40 }} />
            Organization Chart
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "4px 8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Tooltip title="Zoom Out">
                <IconButton
                  onClick={handleZoomOut}
                  size="small"
                  color="primary"
                >
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, minWidth: "40px", textAlign: "center" }}
              >
                {Math.round(zoom * 100)}%
              </Typography>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn} size="small" color="primary">
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset Zoom">
                <IconButton
                  onClick={handleResetZoom}
                  size="small"
                  color="primary"
                >
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              onClick={() => setIsDialogOpen(true)}
              startIcon={<PersonAddIcon />}
              sx={{
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                padding: "12px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Position
            </Button>
          </Box>
        </Box>
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "30px 50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                borderRadius: "16px",
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                Loading organization chart...
              </Typography>
            </Paper>
          </Box>
        ) : treeData ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
              padding: "40px 20px",
              minHeight: "70vh",
              position: "relative",
              zIndex: 1,
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "4px",
              },
            }}
          >
            <motion.div
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                transformOrigin: "top center",
                padding: "40px 20px",
                minWidth: "max-content",
              }}
            >
              {renderTreeNode(treeData)}
            </motion.div>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                borderRadius: "16px",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <BusinessIcon sx={{ fontSize: 80, color: "#bdbdbd" }} />
              <Typography
                variant="h6"
                color="text.secondary"
                textAlign="center"
              >
                No organization structure found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 2 }}
              >
                Start by creating the root position of your organization chart
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsDialogOpen(true)}
                startIcon={<PersonAddIcon />}
                sx={{
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Add Root Position
              </Button>
            </Paper>
          </Box>
        )}
      </AnimatePresence>

      {/* Add Position Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            color: "white",
            fontWeight: 600,
            p: 3,
          }}
        >
          Add New Position
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
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
                    label="Select Employee (Optional)"
                    variant="outlined"
                    fullWidth
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
                    helperText="Link this position to an onboarded employee"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={newPosition.name}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, name: e.target.value })
                }
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Designation"
                value={newPosition.designation}
                onChange={(e) =>
                  setNewPosition({
                    ...newPosition,
                    designation: e.target.value,
                  })
                }
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                value={newPosition.department}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, department: e.target.value })
                }
                fullWidth
                select
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                {/* Add this condition to handle custom department values */}
                {newPosition.department &&
                  ![
                    "HR",
                    "IT",
                    "Finance",
                    "Marketing",
                    "Operations",
                    "Sales",
                    "",
                  ].includes(newPosition.department) && (
                    <MenuItem value={newPosition.department}>
                      {newPosition.department}
                    </MenuItem>
                  )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                value={newPosition.email}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, email: e.target.value })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reports To</InputLabel>
                <Select
                  value={newPosition.parentId}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, parentId: e.target.value })
                  }
                  label="Reports To"
                >
                  <MenuItem value="">
                    <em>None (Root Position)</em>
                  </MenuItem>
                  {treeData &&
                    getAllNodes(treeData).map((node) => (
                      <MenuItem key={node._id} value={node._id}>
                        {node.name} - {node.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPosition.status}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="vacant">Vacant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPosition}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              borderRadius: "8px",
            }}
          >
            Add Position
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Position Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            color: "white",
            fontWeight: 600,
            p: 3,
          }}
        >
          Edit Position
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            {/* Employee Selection Autocomplete */}
            <Grid item xs={12}>
              <Autocomplete
                id="employee-select-edit"
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
                    label="Select Employee (Optional)"
                    variant="outlined"
                    fullWidth
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
                    helperText="Link this position to an onboarded employee"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={newPosition.name}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, name: e.target.value })
                }
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Designation"
                value={newPosition.designation}
                onChange={(e) =>
                  setNewPosition({
                    ...newPosition,
                    designation: e.target.value,
                  })
                }
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                value={newPosition.department}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, department: e.target.value })
                }
                fullWidth
                select
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                {/* Add this condition to handle custom department values */}
                {newPosition.department &&
                  ![
                    "HR",
                    "IT",
                    "Finance",
                    "Marketing",
                    "Operations",
                    "Sales",
                    "",
                  ].includes(newPosition.department) && (
                    <MenuItem value={newPosition.department}>
                      {newPosition.department}
                    </MenuItem>
                  )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                value={newPosition.email}
                onChange={(e) =>
                  setNewPosition({ ...newPosition, email: e.target.value })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reports To</InputLabel>
                <Select
                  value={newPosition.parentId}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, parentId: e.target.value })
                  }
                  label="Reports To"
                  disabled={
                    editingPosition &&
                    editingPosition._id === (treeData && treeData._id)
                  }
                >
                  <MenuItem value="">
                    <em>None (Root Position)</em>
                  </MenuItem>
                  {treeData &&
                    getAllNodes(treeData)
                      .filter(
                        (node) =>
                          node._id !== (editingPosition && editingPosition._id)
                      )
                      .map((node) => (
                        <MenuItem key={node._id} value={node._id}>
                          {node.name} - {node.title}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPosition.status}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="vacant">Vacant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePosition}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              borderRadius: "8px",
            }}
          >
            Update Position
          </Button>
        </DialogActions>
      </Dialog>

      {/* Node Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          },
        }}
      >
        {nodeDetails && (
          <>
            <DialogTitle
              sx={{
                background: `linear-gradient(45deg, ${
                  nodeDetails.department
                    ? {
                        HR: "rgba(156, 39, 176, 0.9)",
                        IT: "rgba(0, 150, 136, 0.9)",
                        Finance: "rgba(255, 152, 0, 0.9)",
                        Marketing: "rgba(233, 30, 99, 0.9)",
                        Operations: "rgba(63, 81, 181, 0.9)",
                        Sales: "rgba(76, 175, 80, 0.9)",
                      }[nodeDetails.department] || "rgba(25, 118, 210, 0.95)"
                    : "rgba(25, 118, 210, 0.95)"
                } 30%, rgba(30, 136, 229, 0.90) 90%)`,
                color: "white",
                fontWeight: 600,
                p: 3,
              }}
            >
              Position Details
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pt: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {nodeDetails.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {nodeDetails.title} {/* This is the designation */}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {nodeDetails.employeeId && (
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <BadgeIcon color="primary" />
                        <Typography variant="body1" fontWeight={500}>
                          Employee ID: {nodeDetails.employeeId}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {nodeDetails.department && (
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <WorkIcon color="primary" />
                        <Typography variant="body1">
                          Department: {nodeDetails.department}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {nodeDetails.email && (
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon color="primary" />
                        <Typography variant="body1">
                          Email: {nodeDetails.email}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <InfoIcon color="primary" />
                      <Typography variant="body1">
                        Status:{" "}
                        <Chip
                          label={nodeDetails.status || "active"}
                          size="small"
                          color={
                            nodeDetails.status === "active"
                              ? "success"
                              : nodeDetails.status === "inactive"
                              ? "error"
                              : "warning"
                          }
                        />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Show direct reports if any */}
              {nodeDetails.children && nodeDetails.children.length > 0 && (
                <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Direct Reports ({nodeDetails.children.length})
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {nodeDetails.children.map((child) => (
                      <Chip
                        key={child._id}
                        label={`${child.name} - ${child.title}`}
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setIsDetailsOpen(false)}
                variant="outlined"
                sx={{ borderRadius: "8px" }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsDetailsOpen(false);
                  openEditDialog(nodeDetails);
                }}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                  borderRadius: "8px",
                }}
              >
                Edit Position
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrganizationChart;
