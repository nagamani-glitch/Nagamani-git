import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Select, TextField, Typography, Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  Add, Delete, FilterList, Search, Edit, CheckCircle, Cancel,
  AddComment, ChatBubbleOutline
} from '@mui/icons-material';
import './LeaveRequests.css';

const API_URL = 'http://localhost:5000/api/leave-requests';

const LeaveRequests = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [createFormData, setCreateFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [editFormData, setEditFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    id: null
  });

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: { start: '', end: '' }
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(API_URL);
      setLeaveData(response.data);
    } catch (error) {
      showSnackbar('Error fetching leave requests', 'error');
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const leaveRequestData = {
        type: createFormData.type,
        startDate: new Date(createFormData.startDate),
        endDate: new Date(createFormData.endDate),
        comment: createFormData.reason,
        status: 'Pending',
        confirmation: 'Pending',
        days: calculateDays(createFormData.startDate, createFormData.endDate)
      };

      const response = await axios.post(API_URL, leaveRequestData);
      setLeaveData([...leaveData, response.data]);
      setIsCreateOpen(false);
      setCreateFormData({ type: '', startDate: '', endDate: '', reason: '' });
      showSnackbar('Leave request created successfully');
    } catch (error) {
      showSnackbar('Error creating leave request', 'error');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedData = {
        type: editFormData.type,
        startDate: new Date(editFormData.startDate),
        endDate: new Date(editFormData.endDate),
        comment: editFormData.reason,
        days: calculateDays(editFormData.startDate, editFormData.endDate)
      };

      const response = await axios.put(`${API_URL}/${editFormData.id}`, updatedData);
      setLeaveData(leaveData.map(leave => 
        leave._id === response.data._id ? response.data : leave
      ));
      setIsEditDialogOpen(false);
      showSnackbar('Leave request updated successfully');
    } catch (error) {
      showSnackbar('Error updating leave request', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setLeaveData(leaveData.filter(leave => leave._id !== id));
      showSnackbar('Leave request deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting leave request', 'error');
    }
  };

  const handleConfirmationChange = async (id, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/status`,
        { status, confirmation: status }
      );
      setLeaveData(leaveData.map(leave => 
        leave._id === response.data._id ? response.data : leave
      ));
      showSnackbar(`Leave request ${status.toLowerCase()} successfully`);
    } catch (error) {
      showSnackbar(`Error updating leave request status`, 'error');
    }
  };

  const handleSaveComment = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${selectedLeaveId}/comment`,
        { comment: newComment }
      );
      setLeaveData(leaveData.map(leave => 
        leave._id === response.data._id ? response.data : leave
      ));
      handleCloseCommentDialog();
      showSnackbar('Comment updated successfully');
    } catch (error) {
      showSnackbar('Error updating comment', 'error');
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
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (leave) => {
    setEditFormData({
      type: leave.type,
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      reason: leave.comment,
      id: leave._id
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenCommentDialog = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setIsCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsCommentDialogOpen(false);
    setSelectedLeaveId(null);
    setNewComment('');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const applyFilters = (data) => {
    return data.filter(leave => {
      const matchesType = !filters.type || leave.type === filters.type;
      const matchesStatus = !filters.status || leave.status === filters.status;
      const matchesDateRange = !filters.dateRange.start ||
        (new Date(leave.startDate) >= new Date(filters.dateRange.start) &&
          new Date(leave.endDate) <= new Date(filters.dateRange.end));

      return matchesType && matchesStatus && matchesDateRange;
    });
  };

  const filteredLeaveData = applyFilters(leaveData).filter(leave =>
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (leave.comment && leave.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="App">
      <div className="headers">
        <Typography variant="h6">Leave Requests</Typography>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
        />
        <div className="header-actions">
          <Button variant="outlined" onClick={() => setFilterOpen(true)} startIcon={<FilterList />}>
            Filter
          </Button>
          <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)} startIcon={<Add />}>
            Create
          </Button>
        </div>
      </div>

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
                        onClick={() => handleConfirmationChange(leave._id, 'Approved')}
                        color={leave.confirmation === 'Approved' ? 'success' : 'default'}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        onClick={() => handleConfirmationChange(leave._id, 'Rejected')}
                        color={leave.confirmation === 'Rejected' ? 'error' : 'default'}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
                <td>
                  <Tooltip title="Add Comment">
                    <IconButton onClick={() => handleOpenCommentDialog(leave._id)}>
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
                    <IconButton color="primary" onClick={() => handleEditClick(leave)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(leave._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Leave Request</DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={createFormData.type}
            onChange={handleCreateInputChange}
            fullWidth
            margin="dense"
            displayEmpty
          >
            <MenuItem value="" disabled>Select Leave Type</MenuItem>
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Maladie">Maladie</MenuItem>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Leave Request</DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={editFormData.type}
            onChange={handleEditInputChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Maladie">Maladie</MenuItem>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onClose={() => setFilterOpen(false)}>
        <DialogTitle>Filter Leave Requests</DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Maladie">Maladie</MenuItem>
          </Select>
          <Select
            name="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({
              type: '',
              status: '',
              dateRange: { start: '', end: '' }
            });
          }} color="inherit">
            Clear
          </Button>
          <Button onClick={() => setFilterOpen(false)} color="primary" variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleCloseCommentDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSaveComment} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LeaveRequests;
