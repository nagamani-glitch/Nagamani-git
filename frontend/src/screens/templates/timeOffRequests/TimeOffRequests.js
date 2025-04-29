import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  Container,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Search,
  Visibility,
  Close,
  Edit,
  Delete,
  Add,
  AccessTime,
} from "@mui/icons-material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useNotifications } from "../../../context/NotificationContext";
import { io } from 'socket.io-client';

const TimeOffRequests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  // Current user state
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const employeeId = localStorage.getItem('employeeId');
  const { addTimeOffNotification } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const initialFormState = {
    name: "",
    empId: "",
    userId: userId,
    date: new Date(),
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    checkIn: "09:00",
    checkOut: "18:00",
    shift: "Morning",
    workType: "On-Site",
    minHour: "8",
    atWork: "8",
    overtime: "0",
    comment: "",
    status: "Pending",
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const { addNotification } = useNotifications();

  const shiftOptions = ["Morning", "Evening", "Night"];
  const workTypeOptions = ["On-Site", "Remote", "Hybrid"];
  const statusOptions = ["Pending", "Approved", "Rejected", "All"];

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5002/api/employees/by-user/${userId}`);
        if (response.data.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showSnackbar('Error fetching user data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, filterStatus, userId]);

  const fetchRequests = async () => {
    try {
      if (!userId) {
        setRequests([]);
        return;
      }
      
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5002/api/time-off-requests/by-user/${userId}?searchTerm=${searchTerm}&status=${filterStatus}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showSnackbar("Error fetching requests", "error");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!userId) return;

  //   // Connect to WebSocket
  //   const socket = io('http://localhost:5002');
    
  //   // Join a room specific to this user
  //   socket.emit('join', { userId });
    
  //   // Listen for new notifications related to time off requests
  //   socket.on('new-notification', (notification) => {
  //     // If the notification is about a time off request, refresh the requests
  //     if (notification.type === 'timesheet' && notification.userId === userId) {
  //       console.log('Received time off request notification:', notification);
  //       fetchRequests();
        
  //       // Show a snackbar with the notification message
  //       showSnackbar(notification.message, 'info');
  //     }
  //   });
    
  //   // Clean up on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [userId]);



// Inside the component, update the socket connection useEffect


useEffect(() => {
  if (!userId) return;

  console.log('Setting up WebSocket connection for time off requests:', userId);

  // Connect to WebSocket
  const socket = io('http://localhost:5002', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  // Handle connection events for debugging
  socket.on('connect', () => {
    console.log('Socket connected successfully in TimeOffRequests');
    
    // Join a room specific to this user
    socket.emit('join', { userId });
    console.log('Joined room:', userId);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error in TimeOffRequests:', error);
  });
  
  // Listen for new notifications related to time off requests
  socket.on('new-notification', (notification) => {
    // If the notification is about a time off request, refresh the requests
    if (notification.type === 'timesheet' && notification.userId === userId) {
      console.log('Received time off request notification:', notification);
      fetchRequests();
      
      // Show a snackbar with the notification message
      showSnackbar(notification.message, notification.status === 'approved' ? 'success' : 'error');
    }
  });
  
  // Clean up on unmount
  return () => {
    console.log('Cleaning up socket connection in TimeOffRequests');
    socket.disconnect();
  };
}, [userId]);

// The rest of the component remains the same

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    setFormData({
      ...formData,
      date,
      day,
    });
  };

  const handlePreview = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/api/time-off-requests/${id}`
      );
      setSelectedRequest(response.data);
      setPreviewOpen(true);
    } catch (error) {
      showSnackbar("Error fetching request details", "error");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/api/time-off-requests/${id}`
      );
      const requestData = response.data;
      
      setFormData({
        ...requestData,
        date: new Date(requestData.date),
      });
      
      setEditMode(true);
      setSelectedRequest(requestData);
      setCreateOpen(true);
    } catch (error) {
      showSnackbar("Error fetching request details", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5002/api/time-off-requests/${selectedRequest._id}`
      );
      showSnackbar("Request deleted successfully");
      fetchRequests();
      setDeleteOpen(false);
    } catch (error) {
      showSnackbar("Error deleting request", "error");
    }
  };

  const handleCreateNew = () => {
    // Pre-fill the form with current user data if available
    if (currentUser && currentUser.personalInfo) {
      setFormData({
        ...initialFormState,
        name: `${currentUser.personalInfo.firstName || ''} ${currentUser.personalInfo.lastName || ''}`.trim(),
        empId: currentUser.Emp_ID || employeeId || '',
        userId: userId
      });
    } else {
      setFormData({
        ...initialFormState,
        userId: userId
      });
    }
    setEditMode(false);
    setCreateOpen(true);
  };

  const handleSave = async () => {
    try {
      const requiredFields = [
        "name",
        "empId",
        "date",
        "day",
        "checkIn",
        "checkOut",
        "shift",
        "workType",
        "minHour",
        "atWork",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(", ")}`);
      }

      // Add userId to the form data
      const formattedData = {
        ...formData,
        userId: userId, // Add the current user's ID
        minHour: Number(formData.minHour),
        atWork: Number(formData.atWork),
        overtime: Number(formData.overtime) || 0,
        date: new Date(formData.date).toISOString(),
      };

      const url = editMode
        ? `http://localhost:5002/api/time-off-requests/${selectedRequest._id}`
        : "http://localhost:5002/api/time-off-requests";

      const response = await axios({
        method: editMode ? "PUT" : "POST",
        url,
        data: formattedData
      });

      showSnackbar(
        editMode
          ? "Request updated successfully"
          : "Request created successfully"
      );
      fetchRequests();
      setCreateOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Approved: "success",
      Rejected: "error",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Time Off Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your time off requests and view their status
        </Typography>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchRequests}
                  startIcon={<AccessTime />}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateNew}
                  startIcon={<Add />}
                >
                  New Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {requests.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Shift</TableCell>
                    <TableCell sx={{ color: 'white' }}>Work Type</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(request.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.day}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatTime(request.checkIn)} - {formatTime(request.checkOut)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.shift}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.workType}
                          size="small"
                          sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(request._id)}
                              color="info"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {request.status === "Pending" && (
                            <>
                              <Tooltip title="Edit Request">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(request._id)}
                                  color="primary"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Request">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setDeleteOpen(true);
                                  }}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
            </TableContainer>
          ) : (
            <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No time off requests found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You haven't created any time off requests yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateNew}
                  startIcon={<Add />}
                  sx={{ mt: 3 }}
                >
                  Create New Request
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editMode ? "Edit Time Off Request" : "Create New Time Off Request"}
          </Typography>
          <IconButton onClick={() => setCreateOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={!!currentUser} // Disable if current user data is available
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                required
                disabled={!!currentUser} // Disable if current user data is available
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Day"
                name="day"
                value={formData.day}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check In Time"
                name="checkIn"
                type="time"
                value={formData.checkIn}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check Out Time"
                name="checkOut"
                type="time"
                value={formData.checkOut}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Shift</InputLabel>
                <Select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  label="Shift"
                  required
                >
                  {shiftOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Work Type</InputLabel>
                <Select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  label="Work Type"
                  required
                >
                  {workTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Minimum Hours"
                name="minHour"
                type="number"
                value={formData.minHour}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="At Work Hours"
                name="atWork"
                type="number"
                value={formData.atWork}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Overtime Hours"
                name="overtime"
                type="number"
                value={formData.overtime}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Add any additional information about your time off request"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editMode ? "Update Request" : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Time Off Request Details</Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Employee Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">{selectedRequest.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Employee ID
                        </Typography>
                        <Typography variant="body1">{selectedRequest.empId}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedRequest.status}
                          color={getStatusColor(selectedRequest.status)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Time Off Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedRequest.date)} ({selectedRequest.day})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1">
                          {formatTime(selectedRequest.checkIn)} - {formatTime(selectedRequest.checkOut)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Shift & Work Type
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={selectedRequest.shift}
                            size="small"
                            sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                          />
                          <Chip
                            label={selectedRequest.workType}
                            size="small"
                            sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Additional Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Minimum Hours
                        </Typography>
                        <Typography variant="body1">{selectedRequest.minHour} hours</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          At Work
                        </Typography>
                        <Typography variant="body1">{selectedRequest.atWork} hours</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Overtime
                        </Typography>
                        <Typography variant="body1">{selectedRequest.overtime || 0} hours</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Comment
                        </Typography>
                        <Typography variant="body1">
                          {selectedRequest.comment || "No comment provided"}
                        </Typography>
                      </Grid>
                      {selectedRequest.reviewComment && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Review Comment
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.reviewComment}
                          </Typography>
                        </Grid>
                      )}
                      {selectedRequest.reviewedBy && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Reviewed By
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.reviewedBy}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {selectedRequest && selectedRequest.status === "Pending" && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setPreviewOpen(false);
                handleEdit(selectedRequest._id);
              }}
            >
              Edit Request
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this time off request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </Container>
  );
};

export default TimeOffRequests;

