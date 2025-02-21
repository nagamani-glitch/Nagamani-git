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
} from "@mui/material";
import {
  Add,
  Delete,
  FilterList,
  Search,
  Edit,
  CheckCircle,
  Cancel,
  AddComment,
  ChatBubbleOutline,
} from "@mui/icons-material";
import "./LeaveRequests.css";
import Popover from "@mui/material/Popover";
import { Stack } from "@mui/material";

const API_URL = "http://localhost:5000/api/leave-requests";

const LeaveRequests = () => {
  // Add this state for anchor element
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  // const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [createFormData, setCreateFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [editFormData, setEditFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    id: null,
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
      const response = await axios.get(API_URL);
      setLeaveData(response.data);
    } catch (error) {
      showSnackbar("Error fetching leave requests", "error");
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const leaveRequestData = {
        type: createFormData.type,
        startDate: new Date(createFormData.startDate),
        endDate: new Date(createFormData.endDate),
        comment: createFormData.reason,
        status: "Pending",
        confirmation: "Pending",
        days: calculateDays(createFormData.startDate, createFormData.endDate),
      };

      const response = await axios.post(API_URL, leaveRequestData);
      setLeaveData([...leaveData, response.data]);
      setIsCreateOpen(false);
      setCreateFormData({ type: "", startDate: "", endDate: "", reason: "" });
      showSnackbar("Leave request created successfully");
    } catch (error) {
      showSnackbar("Error creating leave request", "error");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedData = {
        type: editFormData.type,
        startDate: new Date(editFormData.startDate),
        endDate: new Date(editFormData.endDate),
        comment: editFormData.reason,
        days: calculateDays(editFormData.startDate, editFormData.endDate),
      };

      const response = await axios.put(
        `${API_URL}/${editFormData.id}`,
        updatedData
      );
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === response.data._id ? response.data : leave
        )
      );
      setIsEditDialogOpen(false);
      showSnackbar("Leave request updated successfully");
    } catch (error) {
      showSnackbar("Error updating leave request", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setLeaveData(leaveData.filter((leave) => leave._id !== id));
      showSnackbar("Leave request deleted successfully");
    } catch (error) {
      showSnackbar("Error deleting leave request", "error");
    }
  };

  const handleConfirmationChange = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/status`, {
        status,
        confirmation: status,
      });
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === response.data._id ? response.data : leave
        )
      );
      showSnackbar(`Leave request ${status.toLowerCase()} successfully`);
    } catch (error) {
      showSnackbar(`Error updating leave request status`, "error");
    }
  };
  const handleSaveComment = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${selectedLeaveId}/comment`,
        { comment: newComment }
      );
      setLeaveData(
        leaveData.map((leave) =>
          leave._id === response.data._id ? response.data : leave
        )
      );
      handleCloseCommentDialog();
      showSnackbar("Comment updated successfully");
    } catch (error) {
      showSnackbar("Error updating comment", "error");
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCreateInputChange = (e) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (leave) => {
    setEditFormData({
      type: leave.type,
      startDate: leave.startDate.split("T")[0],
      endDate: leave.endDate.split("T")[0],
      reason: leave.comment,
      id: leave._id,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenCommentDialog = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setIsCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsCommentDialogOpen(false);
    setSelectedLeaveId(null);
    setNewComment("");
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

  const filteredLeaveData = leaveData.filter((leave) => {
    const matchesType = !filters.type || leave.type === filters.type;
    const matchesStatus = !filters.status || leave.status === filters.status;
    const matchesSearch =
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leave.comment &&
        leave.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
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
            placeholder="Search by type, status or comment..."
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCreateOpen(true)}
              startIcon={<Add />}
            >
              Create Request
            </Button>
          </div>
        </div>
      </div>
      <div className="leave-requests-table-container">
        <table className="leave-requests-table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Confirmation</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaveData.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.type}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.days}</td>
                <td>
                  <span className={getStatusBadgeClass(leave.status)}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  <div className="confirmation-actions">
                    <Tooltip title="Approve">
                      <IconButton
                        onClick={() =>
                          handleConfirmationChange(leave._id, "Approved")
                        }
                        color={
                          leave.confirmation === "Approved"
                            ? "success"
                            : "default"
                        }
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        onClick={() =>
                          handleConfirmationChange(leave._id, "Rejected")
                        }
                        color={
                          leave.confirmation === "Rejected"
                            ? "error"
                            : "default"
                        }
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
                <td>
                  <div className="leave-comment-section">
                    <Tooltip title="Add Comment">
                      <IconButton
                        onClick={() => handleOpenCommentDialog(leave._id)}
                      >
                        <AddComment />
                      </IconButton>
                    </Tooltip>
                    {leave.comment && (
                      <Tooltip title={leave.comment}>
                        <IconButton size="small">
                          <ChatBubbleOutline />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </td>
                <td>
                  <div className="leave-actions-section">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(leave)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(leave._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialogs */}

      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
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
          Create Leave Request
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Select
            name="type"
            value={createFormData.type}
            onChange={handleCreateInputChange}
            fullWidth
            margin="dense"
            displayEmpty
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "12px",
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          >
            <MenuItem value="">Select Leave Type</MenuItem>
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Personal Leave">Personal Leave</MenuItem>
          </Select>

          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            margin="dense"
            value={createFormData.startDate}
            onChange={handleCreateInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
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
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            margin="dense"
            value={createFormData.endDate}
            onChange={handleCreateInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
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
            name="reason"
            label="Reason"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={createFormData.reason}
            onChange={handleCreateInputChange}
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
            onClick={() => setIsCreateOpen(false)}
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
            onClick={handleCreateSubmit}
            color="primary"
            variant="contained"
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
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
          Edit Leave Request
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Select
            name="type"
            value={editFormData.type}
            onChange={handleEditInputChange}
            fullWidth
            margin="dense"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "12px",
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          >
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Personal Leave">Personal Leave</MenuItem>
          </Select>

          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            margin="dense"
            value={editFormData.startDate}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
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
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            margin="dense"
            value={editFormData.endDate}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
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
            name="reason"
            label="Reason"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={editFormData.reason}
            onChange={handleEditInputChange}
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
            onClick={() => setIsEditDialogOpen(false)}
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
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
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
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}

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
        PaperProps={{
          sx: {
            width: "400px",
            borderRadius: "16px",
            mt: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filter Leave Requests
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              fullWidth
              displayEmpty
              sx={{
                height: "56px",
                backgroundColor: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e7ff",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
              renderValue={(selected) => selected || "Select Leave Type"}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Annual Leave">Annual Leave</MenuItem>
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Personal Leave">Personal Leave</MenuItem>
            </Select>

            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              fullWidth
              displayEmpty
              sx={{
                height: "56px",
                backgroundColor: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e7ff",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
              renderValue={(selected) => selected || "Select Status"}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              onClick={() => {
                setFilters({
                  type: "",
                  status: "",
                  dateRange: { start: "", end: "" },
                });
              }}
              sx={{
                border: "2px solid #1976d2",
                color: "#1976d2",
                "&:hover": {
                  border: "2px solid #64b5f6",
                  backgroundColor: "#e3f2fd",
                },
                borderRadius: "8px",
                py: 1,
                fontWeight: 600,
              }}
            >
              Clear All
            </Button>

            <Button
              fullWidth
              onClick={() => setFilterAnchorEl(null)}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                borderRadius: "8px",
                py: 1,
                fontWeight: 600,
              }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/*Comment Dialog */}

      <Dialog
        open={isCommentDialogOpen}
        onClose={handleCloseCommentDialog}
        PaperProps={{
          sx: {
            width: "500px",
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
          Add Comment
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "12px",
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontWeight: 500,
              },
            }}
          />
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
            onClick={handleCloseCommentDialog}
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
            onClick={handleSaveComment}
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
              textTransform: "none",
              borderRadius: "8px",
              px: 4,
              py: 1,
              fontWeight: 600,
            }}
          >
            Save Comment
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LeaveRequests;
