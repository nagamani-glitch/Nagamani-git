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
  Stack,
  useTheme,
  styled,
  alpha,
  Menu,
  SearchTextField,
  Paper,
  InputAdornment
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

const API_URL = "http://localhost:5000/api/leave-requests";

const LeaveRequests = () => {
  const [leaveData, setLeaveData] = useState([]);
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



  // For Filter

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const FilterMenu = styled(Menu)(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 16,
      marginTop: 12,
      minWidth: 280,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
      border: "1px solid rgba(25, 118, 210, 0.12)",
    },
    "& .MuiMenuItem-root": {
      padding: "12px 16px",
      transition: "background-color 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
      },
    },
  }));

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

  // Helper functions
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

  const applyFilters = (data) => {
    return data.filter((leave) => {
      const matchesType = !filters.type || leave.type === filters.type;
      const matchesStatus = !filters.status || leave.status === filters.status;
      const matchesDateRange =
        !filters.dateRange.start ||
        (new Date(leave.startDate) >= new Date(filters.dateRange.start) &&
          new Date(leave.endDate) <= new Date(filters.dateRange.end));

      return matchesType && matchesStatus && matchesDateRange;
    });
  };

  const filteredLeaveData = applyFilters(leaveData).filter(
    (leave) =>
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leave.comment &&
        leave.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

        // Search

        const SearchTextField = styled(TextField)(({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: theme.spacing(2),
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
          },
        }));    
        
        
        const StyledPaper = styled(Paper)(({ theme }) => ({
          padding: theme.spacing(3),
          marginBottom: theme.spacing(3),
          borderRadius: theme.spacing(1),
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
        }));


  return (
    <div className="App">


<Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
  <Typography
    variant="h4"
    sx={{
      mb: 4,
      color: theme.palette.primary.main,
      fontWeight: 600,
      letterSpacing: 0.5,
    }}
  >
    Leave Requests
  </Typography>

  <StyledPaper>
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        width: "100%",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <SearchTextField
        placeholder="Search records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{
          width: { xs: "100%", sm: "300px" },
          marginRight: "auto",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
      <Button
  variant="outlined"
  onClick={handleFilterClick}  // Changed from setFilterOpen
  startIcon={<FilterList />}
  sx={{
    height: 40,
    whiteSpace: "nowrap",
    borderColor: theme.palette.primary.main,
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }
  }}
>
  Filter
</Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateOpen(true)}
          sx={{
            height: 40,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: "white",
            "&:hover": {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
            },
          }}
        >
          Create Leave Request
        </Button>
      </Box>
    </Box>
  </StyledPaper>

      {/* <div className="headers">
        <Typography variant="h6">Leave Requests</Typography>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
        />
        <div className="header-actions">
          <Button
            variant="outlined"
            onClick={handleFilterClick} // Changed from setFilterOpen
            startIcon={<FilterList />}
            sx={{
              height: 40,
              whiteSpace: "nowrap",
              borderColor: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            Filter
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCreateOpen(true)}
            startIcon={<Add />}
          >
            Create
          </Button>
        </div>
      </div> */}

      {/* Leave Requests Table */}
      <div className="leave-table">
        <table>
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
                <td>{leave.status}</td>
                <td>
                  <div className="confirmation-buttons">
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
                </td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}

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


      <FilterMenu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleFilterClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
  PaperProps={{
    elevation: 3,
    sx: {
      mt: 1.5,
      ml:0,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
    }
  }}
>
  <Box sx={{ width: 320, p: 2 }}>
    <Typography
      variant="subtitle1"
      sx={{
        mb: 2,
        fontWeight: 600,
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.light}`,
        pb: 1
      }}
    >
      Filter Options
    </Typography>

    <Stack spacing={2}>
      <TextField
        select
        fullWidth
        size="small"
        label="Leave Type"
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 1.5
          }
        }}
      >
        <MenuItem value="">All Types</MenuItem>
        <MenuItem value="Annual Leave">Annual Leave</MenuItem>
        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
        <MenuItem value="Maladie">Personal Leave</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        size="small"
        label="Status"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 1.5
          }
        }}
      >
        <MenuItem value="">All Status</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Approved">Approved</MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>
      </TextField>

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          setFilters({
            type: "",
            status: "",
            dateRange: { start: "", end: "" }
          });
          handleFilterClose();
        }}
        sx={{
          mt: 1,
          py: 1,
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          borderRadius: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #42a5f5)'
          }
        }}
      >
        Reset Filters
      </Button>
    </Stack>
  </Box>
</FilterMenu>

   

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onClose={handleCloseCommentDialog}>
        <DialogTitle>Add Comment</DialogTitle>
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
          <Button onClick={handleCloseCommentDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveComment}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </Box>
    
    </div>

  );
};

export default LeaveRequests;
