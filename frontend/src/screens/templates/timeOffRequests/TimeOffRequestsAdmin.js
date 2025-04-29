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
  TextareaAutosize,
} from "@mui/material";
import {
  Search,
  Visibility,
  Close,
  Edit,
  Delete,
  Add,
  AccessTime,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import axios from 'axios';
import { useNotifications } from "../../../context/NotificationContext";

const TimeOffRequestsAdmin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: "Pending",
    reviewComment: ""
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const { addNotification } = useNotifications();
  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName') || 'Admin';

  const statusOptions = ["Pending", "Approved", "Rejected", "All"];

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, filterStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5002/api/time-off-requests?searchTerm=${searchTerm}&status=${filterStatus}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      showSnackbar("Error fetching requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
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

  const handleReviewOpen = (request) => {
    setSelectedRequest(request);
    setReviewData({
      status: request.status,
      reviewComment: request.reviewComment || ""
    });
    setReviewOpen(true);
  };

// const handleReviewSubmit = async () => {
//   try {
//     setLoading(true);
    
//     const response = await axios.put(
//       `http://localhost:5002/api/time-off-requests/${selectedRequest._id}`,
//       {
//         ...reviewData,
//         reviewedBy: currentUserName
//       }
//     );
    
//     if (response.data) {
//       showSnackbar(`Request ${reviewData.status.toLowerCase()} successfully`);
      
//       // Send notification to the user
//       if (selectedRequest.userId && (reviewData.status === "Approved" || reviewData.status === "Rejected")) {
//         try {
//           // First, add the notification to the database
//           const notificationResponse = await addNotification(
//             `Your time off request for ${new Date(selectedRequest.date).toLocaleDateString()} has been ${reviewData.status.toLowerCase()}`,
//             'timesheet',
//             null,
//             selectedRequest.userId
//           );
          
//           // The socket.io server will automatically emit this notification
//           // to the connected client with the matching userId
          
//           console.log(`Notification sent to user ${selectedRequest.userId}`);
//         } catch (notifError) {
//           console.error("Error sending notification:", notifError);
//         }
//       }
      
//       fetchRequests();
//       setReviewOpen(false);
//     }
//   } catch (error) {
//     console.error("Error updating request:", error);
//     showSnackbar("Error updating request", "error");
//   } finally {
//     setLoading(false);
//   }
// };

// Update the handleReviewSubmit function
const handleReviewSubmit = async () => {
  try {
    setLoading(true);
    
    const response = await axios.put(
      `http://localhost:5002/api/time-off-requests/${selectedRequest._id}`,
      {
        ...reviewData,
        reviewedBy: currentUserName
      }
    );
    
    if (response.data) {
      showSnackbar(`Request ${reviewData.status.toLowerCase()} successfully`);
      
      // No need to manually add notification here as the backend will handle it
      // The backend will create the notification and emit the socket event
      
      fetchRequests();
      setReviewOpen(false);
    }
  } catch (error) {
    console.error("Error updating request:", error);
    showSnackbar("Error updating request", "error");
  } finally {
    setLoading(false);
  }
};


  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
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
          Time Off Requests Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Review and manage employee time off requests
        </Typography>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by employee name or ID..."
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
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchRequests}
                fullWidth
                startIcon={<AccessTime />}
              >
                Refresh Requests
              </Button>
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
                    <TableCell sx={{ color: 'white' }}>Employee</TableCell>
                    <TableCell sx={{ color: 'white' }}>Date</TableCell>
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
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {request.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.empId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(request.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.day}
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
                          <Tooltip title="Review Request">
                            <IconButton
                              size="small"
                              onClick={() => handleReviewOpen(request)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
                  There are no requests matching your search criteria.
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}

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
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setPreviewOpen(false);
              handleReviewOpen(selectedRequest);
            }}
          >
            Review Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Review Time Off Request</Typography>
          <IconButton onClick={() => setReviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Reviewing request for {selectedRequest.name} on {formatDate(selectedRequest.date)}
              </Alert>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={reviewData.status}
                  onChange={handleReviewChange}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approve</MenuItem>
                  <MenuItem value="Rejected">Reject</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Review Comment"
                name="reviewComment"
                value={reviewData.reviewComment}
                onChange={handleReviewChange}
                multiline
                rows={4}
                placeholder="Add a comment about your decision (optional)"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color={reviewData.status === "Approved" ? "success" : 
                  reviewData.status === "Rejected" ? "error" : "primary"}
            onClick={handleReviewSubmit}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : 
              reviewData.status === "Approved" ? <CheckCircle /> : 
              reviewData.status === "Rejected" ? <Cancel /> : null
            }
          >
            {loading ? "Submitting..." : 
             reviewData.status === "Approved" ? "Approve" : 
             reviewData.status === "Rejected" ? "Reject" : "Submit"}
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

export default TimeOffRequestsAdmin;


