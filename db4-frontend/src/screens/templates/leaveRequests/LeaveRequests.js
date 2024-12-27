import React, { useState } from 'react';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Select, TextField, Typography, Tooltip
} from '@mui/material';
import { Add, Delete, FilterList, Group, MoreVert, Search } from '@mui/icons-material';
import './LeaveRequests.css'


const groupByOptions = ['Leave Type', 'Status', 'Requested Date'];

const LeaveRequests = () => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isGroupOpen, setGroupOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [leaveData] = useState([
    { id: 1, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
    { id: 2, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
    { id: 3, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
    { id: 4, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
    { id: 5, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
    { id: 6, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
    { id: 7, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
    { id: 8, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
    { id: 9, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
    { id: 10, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
    { id: 11, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
    { id: 12, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
  ]);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedRows(isChecked ? leaveData.map(row => row.id) : []);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const openCreatePopup = (type) => {
    setSelectedCard(type);
    setIsCreateOpen(true);
    console.log(selectedCard)
  };

  const handleCreateClose = () => setIsCreateOpen(false);
  const handleFilterClose = () => setFilterOpen(false);
  const handleGroupClose = () => setGroupOpen(false);

  // Filter leave data based on search term
  const filteredLeaveData = leaveData.filter(
    (leave) =>
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      {/* Header */}
      <div className="headers">
        <Typography variant="h6">Leave Requests</Typography>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
        />
        <div className="header-actions" style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
          <Button variant="outlined" onClick={() => setFilterOpen(true)} startIcon={<FilterList />}>Filter</Button>
          <Button variant="outlined" onClick={() => setGroupOpen(true)} startIcon={<Group />}>GroupBy</Button>
          <Button variant="outlined" startIcon={<MoreVert />}>Actions</Button>
          <Button variant="contained" color="error" onClick={() => openCreatePopup('Leave Request')} startIcon={<Add />}>Create</Button>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onClose={handleFilterClose}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <TextField label="Search" fullWidth variant="outlined" onChange={(e) => setSearchTerm(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Group By Dialog */}
      <Dialog open={isGroupOpen} onClose={handleGroupClose}>
        <DialogTitle>Group By</DialogTitle>
        <DialogContent>
          <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} fullWidth>
            {groupByOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGroupClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Leave Request Dialog */}
      <Dialog open={isCreateOpen} onClose={handleCreateClose}>
        <DialogTitle>Create Leave Request</DialogTitle>
        <DialogContent>
          <TextField label="Leave Type" fullWidth />
          <TextField label="Start Date" fullWidth type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" fullWidth type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="Reason" fullWidth multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">Submit</Button>
          <Button onClick={handleCreateClose} color="secondary">Cancel</Button>
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
              <th>Requested Days</th>
              <th>Leave Clash</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Confirmation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaveData.map((leave) => (
              <tr key={leave.id}>
                <td>
                  <Checkbox checked={selectedRows.includes(leave.id)} onChange={() => handleRowSelect(leave.id)} />
                </td>
                <td>{leave.type}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.days}</td>
                <td>{leave.status}</td>
                <td>{leave.comment}</td>
                <td>{leave.confirmation}</td>
                <td>
                  <Tooltip title="Delete">
                    <IconButton color="error"><Delete /></IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
