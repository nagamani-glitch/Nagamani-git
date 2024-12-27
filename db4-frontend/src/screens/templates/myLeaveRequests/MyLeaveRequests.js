import React, { useState } from 'react';
import { Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography, Tooltip } from '@mui/material';
import { Add, Delete, FilterList, Group, MoreVert, Search } from '@mui/icons-material';
import './MyLeaveRequests.css';

const leaveTypes = [
  { type: 'Maladie', color: 'blue', availableDays: 10, carryForward: 2, totalDays: 12, taken: 3 },
  { type: 'Annual Leave', color: 'orange', availableDays: 15, carryForward: 5, totalDays: 20, taken: 10 },
  { type: 'Leave Without Pay', color: 'red', availableDays: 0, carryForward: 0, totalDays: 0, taken: 0 },
  { type: 'Company Paid Sickness', color: 'green', availableDays: 7, carryForward: 0, totalDays: 7, taken: 1 },
];

const groupByOptions = ['Leave Type', 'Status', 'Requested Date'];

const MyLeaveRequests = () => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isGroupOpen, setGroupOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [leaveData, setLeaveData] = useState([
    { id: 1, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
    { id: 2, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
    { id: 3, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
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
        <Typography variant="h6">My Leave Requests</Typography>
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
          <Button variant="contained" color="error" onClick={() => setIsCreateOpen(true)} startIcon={<Add />}>Create</Button>
        </div>
      </div>

      {/* Leave Type Cards */}
      <div className="leave-cards">
        {leaveTypes.map((card, index) => (
          <Card key={index} className="leave-card" onClick={() => openCreatePopup(card.type)}>
            <Typography>{card.type}</Typography>
            <div className="card-content">
              <p>Available Days: {card.availableDays}</p>
              <p>Carry Forward Days: {card.carryForward}</p>
              <p>Total Leave Days: {card.totalDays}</p>
              <p>Total Leave Taken: {card.taken}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="leave-table">
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Requested Days</th>
              <th>Status</th>
              <th>Comments</th>
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
}
 export default MyLeaveRequests
