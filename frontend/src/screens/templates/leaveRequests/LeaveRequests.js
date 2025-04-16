import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  FilterList,
  Search,
  CheckCircle,
  Cancel,
  ChatBubbleOutline,
  Info,
  DeleteOutline,
  CalendarToday,
  Person,
  Description,
} from "@mui/icons-material";
import "./LeaveRequests.css";
import Popover from "@mui/material/Popover";
import { Stack } from "@mui/material";

// Use the new API endpoint for leave requests
const API_URL = "http://localhost:5000/api/leave-requests";

const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'earned', label: 'Earned Leave' }
];

const LeaveRequests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [filters, setFilters] = useState({
    type: "",
    status: "",
    dateRange: { start: "", end: "" },
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);

      // Get current date
      const currentDate = new Date();

      // Filter out leave requests that are older than 30 days after their end date
      // and have been either approved or rejected
      const filteredLeaveData = response.data.filter((leave) => {
        const endDate = new Date(leave.endDate);
        const daysSinceEnd = Math.floor(
          (currentDate - endDate) / (1000 * 60 * 60 * 24)
        );

        // Keep requests if they are:
        // 1. Still pending, OR
        // 2. Less than 30 days old after end date
        return leave.status === "pending" || daysSinceEnd < 30;
      });

      setLeaveData(filteredLeaveData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      showSnackbar("Error fetching leave requests", "error");
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${id}/approve`);

      // Update the local state with the updated leave request
      setLeaveData(
        leaveData.map((leave) => (leave._id === id ? response.data : leave))
      );

      showSnackbar("Leave request approved successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error approving leave request:", error);
      showSnackbar("Error approving leave request", "error");
      setLoading(false);
    }
  };

  const handleOpenRejectDialog = (id) => {
    setSelectedLeaveId(id);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      showSnackbar("Rejection reason is required", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${selectedLeaveId}/reject`, {
        rejectionReason,
      });

      // Update the local state with the updated leave request
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === selectedLeaveId ? response.data : leave
        )
      );

      setIsRejectDialogOpen(false);
      showSnackbar("Leave request rejected successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      showSnackbar("Error rejecting leave request", "error");
      setLoading(false);
    }
  };

  const handleOpenCommentDialog = (leaveId) => {
    const leave = leaveData.find((l) => l._id === leaveId);
    setSelectedLeaveId(leaveId);
    setNewComment(leave.comment || "");
    setIsCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsCommentDialogOpen(false);
    setSelectedLeaveId(null);
    setNewComment("");
  };

  const handleSaveComment = async () => {
    try {
      setLoading(true);
      // Add a comment endpoint to your backend if needed
      const response = await axios.put(`${API_URL}/${selectedLeaveId}`, {
        comment: newComment,
      });

      // Update the local state with the updated leave request
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === selectedLeaveId ? response.data : leave
        )
      );

      handleCloseCommentDialog();
      showSnackbar("Comment updated successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      showSnackbar("Error updating comment", "error");
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setLeaveToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRequest = async (id) => {
    try {
      setLoading(true);
      // Instead of deleting, update the status to "cancelled" or similar
      await axios.put(`${API_URL}/${id}`, {
        status: "cancelled",
        comment: "Cancelled by HR",
      });

      // Update the local state
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === id ? { ...leave, status: "cancelled" } : leave
        )
      );

      showSnackbar("Leave request cancelled successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error cancelling leave request:", error);
      showSnackbar("Error cancelling leave request", "error");
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!leaveToDelete) return;

    await handleDeleteRequest(leaveToDelete);
    setIsDeleteDialogOpen(false);
    setLeaveToDelete(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-badge status-approved";
      case "rejected":
        return "status-badge status-rejected";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge status-pending";
    }
  };

  const getLeaveTypeName = (typeValue) => {
    const leaveType = LEAVE_TYPES.find((type) => type.value === typeValue);
    return leaveType ? leaveType.label : typeValue;
  };

  const calculateDays = (startDate, endDate, isHalfDay) => {
    if (isHalfDay) return 0.5;

    // Use the numberOfDays field if available
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
    );
  };

  const filteredLeaveData = leaveData.filter((leave) => {
    const matchesType = !filters.type || leave.leaveType === filters.type;
    const matchesStatus = !filters.status || leave.status === filters.status;

    // Date range filtering
    let matchesDateRange = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      const leaveStartDate = new Date(leave.startDate);

      matchesDateRange =
        leaveStartDate >= startDate && leaveStartDate <= endDate;
    }

    const matchesSearch =
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leave.reason &&
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (leave.employeeName &&
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (leave.employeeCode &&
        leave.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesStatus && matchesSearch && matchesDateRange;
  });

  // Render mobile card view for each leave request
  const renderMobileCard = (leave) => (
    <Card className="mobile-leave-card" key={leave._id}>
      <CardContent>
        <Box className="mobile-card-header">
          <Typography variant="h6" className="mobile-card-title">
            {leave.employeeName}
          </Typography>
          <Chip 
            label={leave.status} 
            className={getStatusBadgeClass(leave.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" className="employee-code">
          {leave.employeeCode}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box className="mobile-card-row">
          <Typography variant="body2" className="mobile-card-label">
            <Person fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Leave Type:
          </Typography>
          <Typography variant="body2" className="mobile-card-value">
            {getLeaveTypeName(leave.leaveType)}
          </Typography>
        </Box>
        
        <Box className="mobile-card-row">
          <Typography variant="body2" className="mobile-card-label">
            <CalendarToday fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Duration:
          </Typography>
          <Typography variant="body2" className="mobile-card-value">
            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
            <span className="leave-days">
              {leave.halfDay ? "Half Day" : `${leave.numberOfDays || calculateDays(leave.startDate, leave.endDate, leave.halfDay)} days`}
              {leave.halfDay && ` (${leave.halfDayType})`}
            </span>
          </Typography>
        </Box>
        
        <Box className="mobile-card-row">
          <Typography variant="body2" className="mobile-card-label">
            <Description fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Reason:
          </Typography>
          <Typography variant="body2" className="mobile-card-value leave-reason">
            {leave.reason}
          </Typography>
        </Box>
        
        {leave.status === "rejected" && leave.rejectionReason && (
          <Box className="mobile-card-row">
            <Typography variant="body2" className="mobile-card-label">
              <Info fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Rejection Reason:
            </Typography>
            <Typography variant="body2" className="mobile-card-value">
              {leave.rejectionReason}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box className="mobile-card-actions">
          {leave.status === "pending" && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  onClick={() => handleApproveRequest(leave._id)}
                  color="success"
                  disabled={loading}
                  size="small"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  onClick={() => handleOpenRejectDialog(leave._id)}
                  color="error"
                  disabled={loading}
                  size="small"
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="View/Add Comment">
            <IconButton
              onClick={() => handleOpenCommentDialog(leave._id)}
              disabled={loading}
              size="small"
            >
              <ChatBubbleOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel Request">
            <IconButton
              onClick={() => handleOpenDeleteDialog(leave._id)}
              color="error"
              disabled={loading}
              className="delete-button"
              size="small"
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className="leave-requests-container">
      <div className="leave-requests-header">
        <Typography variant="h5" className="leave-requests-title">
          Leave Requests Management
          </Typography>
        <div className="leave-requests-controls">
          <TextField
            className="leave-requests-search"
            placeholder="Search by employee, type, status or reason..."
            variant="outlined"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <div className="leave-requests-actions">
            <Button
              variant="outlined"
              onClick={(event) => setFilterAnchorEl(event.currentTarget)}
              startIcon={<FilterList />}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="leave-requests-table-container">
        {loading && !leaveData.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress className="loading-spinner" />
          </Box>
        ) : !filteredLeaveData.length ? (
          <Box sx={{ p: 4, textAlign: "center" }} className="empty-state">
            <Typography variant="body1" color="textSecondary" className="empty-state-text">
              No leave requests found
            </Typography>
          </Box>
        ) : isMobile ? (
          // Mobile view - card layout
          <div className="mobile-cards-container">
            {filteredLeaveData.map(leave => renderMobileCard(leave))}
          </div>
        ) : (
          // Desktop/Tablet view - table layout
          <table className="leave-requests-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveData.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <div>
                      <strong>{leave.employeeName}</strong>
                      <div className="employee-code">{leave.employeeCode}</div>
                    </div>
                  </td>
                  <td>{getLeaveTypeName(leave.leaveType)}</td>
                  <td>
                    <div>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      <div className="leave-days">
                        {leave.halfDay ? "Half Day" : `${leave.numberOfDays || calculateDays(leave.startDate, leave.endDate, leave.halfDay)} days`}
                        {leave.halfDay && ` (${leave.halfDayType})`}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="leave-reason">{leave.reason}</div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(leave.status)}>
                      {leave.status}
                    </span>
                    {leave.status === "rejected" && leave.rejectionReason && (
                      <Tooltip title={leave.rejectionReason}>
                        <IconButton size="small">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    <div className="confirmation-actions">
                      {leave.status === "pending" && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton
                              onClick={() => handleApproveRequest(leave._id)}
                              color="success"
                              disabled={loading}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              onClick={() => handleOpenRejectDialog(leave._id)}
                              color="error"
                              disabled={loading}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="View/Add Comment">
                        <IconButton
                          onClick={() => handleOpenCommentDialog(leave._id)}
                          disabled={loading}
                        >
                          <ChatBubbleOutline />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel Request">
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(leave._id)}
                          color="error"
                          disabled={loading}
                          className="delete-button"
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog
        open={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#fef2f2", color: "#dc2626" }}>
          Reject Leave Request
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this leave request:
          </Typography>
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
            error={!rejectionReason.trim()}
            helperText={!rejectionReason.trim() ? "Rejection reason is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectRequest} 
            color="error"
            disabled={!rejectionReason.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog
        open={isCommentDialogOpen}
        onClose={handleCloseCommentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add/Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommentDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveComment} 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#fef2f2", color: "#dc2626" }}>
          Cancel Leave Request
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel this leave request?
          </Typography>
          <Typography variant="body2" color="error">
            Warning: Cancelling a leave request will mark it as cancelled in the system. This should only be done for administrative purposes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>No, Keep It</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Yes, Cancel It"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="filter-popover"
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Filter Leave Requests
          </Typography>
          <Stack spacing={2}>
            <TextField
              select
              label="Leave Type"
              fullWidth
              size="small"
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
            >
              <MenuItem value="">All Types</MenuItem>
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>

            <TextField
              label="From Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.dateRange.start}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              }
            />

            <TextField
              label="To Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.dateRange.end}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              }
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  setFilters({
                    type: "",
                    status: "",
                    dateRange: { start: "", end: "" },
                  })
                }
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={() => setFilterAnchorEl(null)}
              >
                Apply Filters
              </Button>
            </Box>
          </Stack>
        </Box>
      </Popover>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LeaveRequests;

