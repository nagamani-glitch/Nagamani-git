import React, { useState, useEffect } from 'react';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Select, TextField, Typography, Tooltip
} from '@mui/material';
import {
  Add, Delete, FilterList, Search, Edit, Save, CheckCircle, Cancel,
  AddComment, ChatBubbleOutline
} from '@mui/icons-material';
import './LeaveRequests.css'

const LeaveRequests = () => {
  // Initialize leaveData from localStorage
  const [leaveData, setLeaveData] = useState(() => {
    const savedData = localStorage.getItem('leaveRequests');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [createFormData, setCreateFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: { start: '', end: '' }
  });

  const [filterValues, setFilterValues] = useState({
    leaveType: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    id: null
  });

  const handleEditClick = (leave) => {
    setEditFormData({
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.comment,
      id: leave.id
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = () => {
    const updatedData = leaveData.map(leave => {
      if (leave.id === editFormData.id) {
        return {
          ...leave,
          type: editFormData.type,
          startDate: editFormData.startDate,
          endDate: editFormData.endDate,
          comment: editFormData.reason,
          days: calculateDays(editFormData.startDate, editFormData.endDate)
        };
      }
      return leave;
    });
    setLeaveData(updatedData);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedData));
    setIsEditDialogOpen(false);
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
      [e.target.name]: e.target.value
    });
  };

  const handleCreateSubmit = (formData) => {
    const newLeave = {
      id: Date.now(),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calculateDays(formData.startDate, formData.endDate),
      status: 'Pending',
      comment: formData.reason,
      confirmation: 'Pending'
    };
    const updatedData = [...leaveData, newLeave];
    setLeaveData(updatedData);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedData));
    setIsCreateOpen(false);
    setCreateFormData({ type: '', startDate: '', endDate: '', reason: '' });
  };

  const handleDelete = (id) => {
    const updatedData = leaveData.filter(leave => leave.id !== id);
    setLeaveData(updatedData);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedData));
  };

  const handleConfirmationChange = (id, status) => {
    const updatedData = leaveData.map(leave =>
      leave.id === id ? { 
        ...leave, 
        confirmation: status,
        status: status // This will update the status column to match confirmation
      } : leave
    );
    setLeaveData(updatedData);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedData));
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

  const handleSaveComment = () => {
    const updatedData = leaveData.map(leave =>
      leave.id === selectedLeaveId ? { ...leave, comment: newComment } : leave
    );
    setLeaveData(updatedData);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedData));
    handleCloseCommentDialog();
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setSelectedRows(event.target.checked ? leaveData.map(row => row.id) : []);
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
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
    leave.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      {/* Header Section */}
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <DialogTitle>Create Leave Request</DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={createFormData.type}
            onChange={handleCreateInputChange}
            fullWidth
            margin="dense"
            label="Leave Type"
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
          <Button onClick={() => handleCreateSubmit(createFormData)} color="primary">
            Submit
          </Button>
          <Button onClick={() => setIsCreateOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Requests Table */}
      <div className="leave-table">
        <table>
          <thead>
            <tr>
              <th><Checkbox checked={selectAll} onChange={handleSelectAll} /></th>
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
              <tr key={leave.id}>
                <td>
                  <Checkbox
                    checked={selectedRows.includes(leave.id)}
                    onChange={() => handleRowSelect(leave.id)}
                  />
                </td>
                <td>{leave.type}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.days}</td>
                <td>{leave.status}</td>
                <td>
                  <div className="confirmation-buttons">
                    <Tooltip title="Approve">
                      <IconButton
                        onClick={() => handleConfirmationChange(leave.id, 'Approved')}
                        color={leave.confirmation === 'Approved' ? 'success' : 'default'}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        onClick={() => handleConfirmationChange(leave.id, 'Rejected')}
                        color={leave.confirmation === 'Rejected' ? 'error' : 'default'}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
                <td>
                  <Tooltip title="Add Comment">
                    <IconButton onClick={() => handleOpenCommentDialog(leave.id)}>
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
                    <IconButton color="error" onClick={() => handleDelete(leave.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comment Dialog */}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Leave Request</DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={editFormData.type}
            onChange={handleEditInputChange}
            fullWidth
            margin="dense"
            label="Leave Type"
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
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
          <Button onClick={() => setIsEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>



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
          <Button onClick={handleCloseCommentDialog}>Cancel</Button>
          <Button onClick={handleSaveComment} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveRequests;