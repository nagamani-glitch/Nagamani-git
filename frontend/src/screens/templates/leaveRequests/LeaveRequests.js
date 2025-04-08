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
} from "@mui/material";
import {
  FilterList,
  Search,
  CheckCircle,
  Cancel,
  ChatBubbleOutline,
  Info,
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
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
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
      setLeaveData(response.data);
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
        leaveData.map((leave) =>
          leave._id === id ? response.data : leave
        )
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
      const response = await axios.put(
        `${API_URL}/${selectedLeaveId}/reject`,
        { rejectionReason }
      );
      
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
      const response = await axios.put(
        `${API_URL}/${selectedLeaveId}`,
        { comment: newComment }
      );
      
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
      default:
        return "status-badge status-pending";
    }
  };

  const getLeaveTypeName = (typeValue) => {
    const leaveType = LEAVE_TYPES.find(type => type.value === typeValue);
    return leaveType ? leaveType.label : typeValue;
  };

  const calculateDays = (startDate, endDate, isHalfDay) => {
    if (isHalfDay) return 0.5;
    
    // Use the numberOfDays field if available
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24) + 1
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
      
      matchesDateRange = leaveStartDate >= startDate && leaveStartDate <= endDate;
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
            <CircularProgress />
          </Box>
        ) : !filteredLeaveData.length ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              No leave requests found
            </Typography>
          </Box>
        ) : (
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

