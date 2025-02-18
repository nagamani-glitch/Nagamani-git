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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const API_URL = "http://localhost:5000/api/my-leave-requests";

const leaveTypes = [
  { id: "annual", label: "Annual Leave" },
  { id: "sick", label: "Sick Leave" },
  { id: "personal", label: "Personal Leave" },
  // { id: 'maternity', label: 'Maternity Leave' },
  // { id: 'paternity', label: 'Paternity Leave' }
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
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
        status: "pending",
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

  // const handleDeleteLeave = async (id) => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`${API_URL}/${id}`);
  //     setLeaves(leaves.filter(leave => leave._id !== id));
  //     setSuccess('Leave request deleted successfully');
  //   } catch (err) {
  //     setError('Failed to delete leave request');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDeleteLeave = async (id) => {
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

  const handleApproveLeave = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${id}/approve`);
      setLeaves(
        leaves.map((leave) => (leave._id === id ? response.data : leave))
      );
      setSuccess("Leave request approved successfully");
    } catch (err) {
      setError("Failed to approve leave request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${id}/reject`, {
        rejectionReason,
      });
      setLeaves(
        leaves.map((leave) => (leave._id === id ? response.data : leave))
      );
      setSuccess("Leave request rejected successfully");
      setRejectDialogOpen(false);
      setRejectionReason("");
    } catch (err) {
      setError("Failed to reject leave request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setFormData({
      employeeName: leave.employeeName,
      employeeCode: leave.employeeCode,
      leaveType: leave.leaveType,
      startDate: format(new Date(leave.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(leave.endDate), "yyyy-MM-dd"),
      reason: leave.reason,
      halfDay: leave.halfDay || false,
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
    });
    setSelectedLeave(null);
    setEditMode(false);
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch =
        leave.reason?.toLowerCase().includes(filters.search.toLowerCase()) ||
        leave.employeeName
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" || leave.status === filters.status;
      const matchesType =
        filters.type === "all" || leave.leaveType === filters.type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaves, filters]);
  return (
    <Box sx={styles.mainContainer}>
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
              <Typography sx={styles.statsLabel}>{stat.label}</Typography>
              <Typography sx={styles.statsValue}>
                {stat.getValue(leaves)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by reason or employee..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
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
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <MenuItem value="all">All Status</MenuItem>
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
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center">Approve</TableCell>
              <TableCell align="center">Reject</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.map((leave) => (
              <TableRow key={leave._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>{leave.employeeName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      ({leave.employeeCode})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {
                    leaveTypes.find((type) => type.id === leave.leaveType)
                      ?.label
                  }
                </TableCell>
                <TableCell>
                  {format(new Date(leave.startDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(leave.endDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={leave.status}
                    sx={styles.statusChip(leave.status)}
                  />
                </TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell align="center">
                  {leave.status === "pending" && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleApproveLeave(leave._id)}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="center">
                  {leave.status === "pending" && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setRejectDialogOpen(true);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {leave.status === "pending" && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(leave)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteLeave(leave._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
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
          {editMode ? "Edit Leave Request" : "New Leave Request"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",

            marginTop: "20px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Employee Name"
              value={formData.employeeName}
              onChange={(e) =>
                setFormData({ ...formData, employeeName: e.target.value })
              }
              fullWidth
              required
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

            <TextField
              label="Employee Code"
              value={formData.employeeCode}
              onChange={(e) =>
                setFormData({ ...formData, employeeCode: e.target.value })
              }
              fullWidth
              required
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

            <TextField
              select
              label="Leave Type"
              value={formData.leaveType}
              onChange={(e) =>
                setFormData({ ...formData, leaveType: e.target.value })
              }
              fullWidth
              required
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
              {leaveTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
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

            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
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

            <TextField
              label="Reason"
              multiline
              rows={4}
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              fullWidth
              required
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

            <Box sx={{ mt: 2 }}>
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
                  value={formData.halfDayType || "morning"}
                  onChange={(e) =>
                    setFormData({ ...formData, halfDayType: e.target.value })
                  }
                  fullWidth
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                >
                  <MenuItem value="morning">
                    Forenoon(9:00 AM - 1:00 PM)
                  </MenuItem>
                  <MenuItem value="afternoon">
                    Afternoon(2:00 PM - 6:00 PM){" "}
                  </MenuItem>
                </TextField>
              )}
            </Box>
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
            onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}
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
            variant="contained"
            onClick={editMode ? handleUpdateLeave : handleCreateLeave}
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRejectLeave(selectedLeave._id)}
            disabled={!rejectionReason.trim() || loading}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(null);
          setError(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={success ? "success" : "error"}
          variant="filled"
          onClose={() => {
            setSuccess(null);
            setError(null);
          }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyLeaveRequests;
