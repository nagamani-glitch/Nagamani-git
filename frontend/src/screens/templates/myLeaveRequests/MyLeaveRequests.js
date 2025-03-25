import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Close,
} from "@mui/icons-material";
import { format } from "date-fns";

const API_URL = "http://localhost:5000/api/my-leave-requests";

const leaveTypes = [
  { id: "annual", label: "Annual Leave" },
  { id: "sick", label: "Sick Leave" },
  { id: "personal", label: "Personal Leave" },
  { id: "maternity", label: "Maternity Leave" },
  { id: "paternity", label: "Paternity Leave" },
];

const statsCards = [
  {
    id: "total",
    label: "Total Requests",
    color: "#2196f3",
    getValue: (leaves) => leaves.length,
  },
  {
    id: "pending",
    label: "Pending",
    color: "#ff9800",
    getValue: (leaves) => leaves.filter((l) => l.status === "pending").length,
  },
  {
    id: "approved",
    label: "Approved",
    color: "#4caf50",
    getValue: (leaves) => leaves.filter((l) => l.status === "approved").length,
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "#f44336",
    getValue: (leaves) => leaves.filter((l) => l.status === "rejected").length,
  },
];

const styles = {
  mainContainer: {
    p: 4,
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 4,
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#1a237e",
  },
  newRequestButton: {
    background: "linear-gradient(45deg, #2196f3, #1976d2)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
    "&:hover": {
      background: "linear-gradient(45deg, #1976d2, #1565c0)",
      boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
    },
  },
  statsCard: {
    p: 3,
    borderRadius: 2,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
    },
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    "& .MuiTableCell-head": {
      color: "#475569",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
  },
  statusChip: (status) => ({
    borderRadius: "20px",
    fontWeight: 500,
    textTransform: "capitalize",
    ...(status === "pending" && {
      backgroundColor: "#fff7ed",
      color: "#c2410c",
    }),
    ...(status === "approved" && {
      backgroundColor: "#f0fdf4",
      color: "#15803d",
    }),
    ...(status === "rejected" && {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
    }),
  }),
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
};

const MyLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [rejectionReasonDialogOpen, setRejectionReasonDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
  });
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    leaveType: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    halfDay: false,
    halfDayType: "morning",
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setLeaves(response.data);
    } catch (err) {
      setError("Failed to fetch leave requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeave = async () => {
    try {
      setLoading(true);
      const leaveData = {
        employeeName: formData.employeeName,
        employeeCode: formData.employeeCode,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        halfDay: formData.halfDay,
        halfDayType: formData.halfDayType,
        // Status will be set to 'pending' by the backend
      };
      const response = await axios.post(API_URL, leaveData);
      setLeaves([...leaves, response.data]);
      setSuccess("Leave request created successfully");
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError("Failed to create leave request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeave = async () => {
    try {
      setLoading(true);
      // Only allow updating if status is pending
      if (selectedLeave.status !== "pending") {
        setError("Cannot edit a request that has already been processed");
        setLoading(false);
        return;
      }
      
      const response = await axios.put(
        `${API_URL}/${selectedLeave._id}`,
        formData
      );
      setLeaves(
        leaves.map((leave) =>
          leave._id === selectedLeave._id ? response.data : leave
        )
      );
      setSuccess("Leave request updated successfully");
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError("Failed to update leave request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeave = async (id) => {
    // Find the leave to check its status
    const leaveToDelete = leaves.find(leave => leave._id === id);
    
    if (leaveToDelete.status !== "pending") {
      setError("Cannot delete a request that has already been processed");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setLeaves(leaves.filter((leave) => leave._id !== id));
      setSuccess("Leave request deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete leave request");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (startDate, endDate, isHalfDay) => {
    if (isHalfDay) return 0.5;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleEdit = (leave) => {
    // Only allow editing if status is pending
    if (leave.status !== "pending") {
      setError("Cannot edit a request that has already been processed");
      return;
    }
    
    setSelectedLeave(leave);
    setFormData({
      employeeName: leave.employeeName,
      employeeCode: leave.employeeCode,
      leaveType: leave.leaveType,
      startDate: format(new Date(leave.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(leave.endDate), "yyyy-MM-dd"),
      reason: leave.reason,
      halfDay: leave.halfDay || false,
      halfDayType: leave.halfDayType || "morning",
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeCode: "",
      leaveType: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      reason: "",
      halfDay: false,
      halfDayType: "morning",
    });
    setSelectedLeave(null);
    setEditMode(false);
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch =
        leave.reason?.toLowerCase().includes(filters.search.toLowerCase()) ||
        leave.employeeName?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" || leave.status === filters.status;
      const matchesType =
        filters.type === "all" || leave.leaveType === filters.type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaves, filters]);

  const viewRejectionReason = (leave) => {
    if (leave.status === "rejected" && leave.rejectionReason) {
      setSelectedLeave(leave);
      setRejectionReasonDialogOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={styles.mainContainer}>
      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box sx={styles.headerSection}>
        <Typography sx={styles.pageTitle}>My Leave Requests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
          sx={styles.newRequestButton}
        >
          New Leave Request
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Paper
              sx={{
                ...styles.statsCard,
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: stat.color }}>
                {stat.getValue(leaves)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: '12px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
          <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                  <TextField 
                      fullWidth
                      size="small"
                      placeholder="Search by name or reason"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                              </InputAdornment>
                          ),
                      }}
                  />
              </Grid>
              <Grid item xs={12} sm={4}>
                  <TextField
                      select
                      fullWidth
                      size="small"
                      label="Status"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                  </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                  <TextField
                      select
                      fullWidth
                      size="small"
                      label="Leave Type"
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                      <MenuItem value="all">All Types</MenuItem>
                      {leaveTypes.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                              {type.label}
                          </MenuItem>
                      ))}
                  </TextField>
              </Grid>
          </Grid>
      </Paper>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !filteredLeaves.length ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : !filteredLeaves.length ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    No leave requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaves.map((leave) => (
                <TableRow key={leave._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {leave.employeeName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {leave.employeeCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {leaveTypes.find(t => t.id === leave.leaveType)?.label || leave.leaveType}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {leave.halfDay ? "Half Day" : `${calculateDays(leave.startDate, leave.endDate, leave.halfDay)} days`}
                        {leave.halfDay && ` (${leave.halfDayType})`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {leave.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={leave.status}
                      sx={styles.statusChip(leave.status)}
                      size="small"
                    />
                    {leave.status === "rejected" && leave.rejectionReason && (
                      <Tooltip title="View rejection reason">
                        <IconButton
                          size="small"
                          onClick={() => viewRejectionReason(leave)}
                          sx={{ ml: 1 }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(leave)}
                        disabled={leave.status !== "pending"}
                        sx={styles.actionButton}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteLeave(leave._id)}
                        disabled={leave.status !== "pending"}
                        sx={styles.actionButton}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Leave Request Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #2196f3, #1976d2)",
            color: "white",
            py: 2,
          }}
        >
          {editMode ? "Edit Leave Request" : "Create New Leave Request"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                fullWidth
                value={formData.employeeName}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Code"
                fullWidth
                value={formData.employeeCode}
                onChange={(e) =>
                  setFormData({ ...formData, employeeCode: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Leave Type"
                fullWidth
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                required
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.halfDay}
                    onChange={(e) =>
                      setFormData({ ...formData, halfDay: e.target.checked })
                    }
                  />
                }
                label="Half Day"
              />
              {formData.halfDay && (
                <TextField
                  select
                  label="Half Day Type"
                  fullWidth
                  value={formData.halfDayType}
                  onChange={(e) =>
                    setFormData({ ...formData, halfDayType: e.target.value })
                  }
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                </TextField>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                required
                disabled={formData.halfDay}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                fullWidth
                multiline
                rows={4}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={editMode ? handleUpdateLeave : handleCreateLeave}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #2196f3, #1976d2)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976d2, #1565c0)",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : editMode ? (
              "Update Request"
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionReasonDialogOpen}
        onClose={() => setRejectionReasonDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #e53935)",
            color: "white",
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1 }} />
            Rejection Reason
          </Box>
          <IconButton
            size="small"
            onClick={() => setRejectionReasonDialogOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedLeave && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Your leave request was rejected for the following reason:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  mt: 1,
                  backgroundColor: "#fef2f2",
                  borderLeft: "4px solid #dc2626",
                }}
              >
                <Typography variant="body1">{selectedLeave.rejectionReason}</Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setRejectionReasonDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyLeaveRequests;

