import React, { useState } from 'react';
import { Button, Card, Checkbox, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import { Add, Delete, FilterList, Search, Edit, Save } from '@mui/icons-material';
import './MyLeaveRequests.css';

const leaveTypes = [
  { type: 'Maladie', color: 'blue', availableDays: 10, carryForward: 2, totalDays: 12, taken: 3 },
  { type: 'Annual Leave', color: 'orange', availableDays: 15, carryForward: 5, totalDays: 20, taken: 10 },
  { type: 'Leave Without Pay', color: 'red', availableDays: 0, carryForward: 0, totalDays: 0, taken: 0 },
  { type: 'Company Paid Sickness', color: 'green', availableDays: 7, carryForward: 0, totalDays: 7, taken: 1 },
  { type: 'Paternity Leave', color: 'purple', availableDays: 5, carryForward: 0, totalDays: 5, taken: 0 },
  { type: 'Study Leave', color: 'teal', availableDays: 10, carryForward: 3, totalDays: 13, taken: 5 },
  { type: 'Bereavement Leave', color: 'grey', availableDays: 3, carryForward: 0, totalDays: 3, taken: 0 },
  { type: 'Marriage Leave', color: 'pink', availableDays: 5, carryForward: 0, totalDays: 5, taken: 2 }
];


const MyLeaveRequests = () => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    days: '',
    status: '',
    comment: '',
    confirmation: ''
  });

  // Initialize leaveData with localStorage
  const [leaveData, setLeaveData] = useState(() => {
    const savedData = localStorage.getItem('leaveData');
    return savedData ? JSON.parse(savedData) : [
      { id: 1, type: 'Maladie', startDate: 'Nov. 6, 2024', endDate: 'Nov. 6, 2024', days: 1, status: 'Approved', comment: 'Urgent', confirmation: 'Confirmed' },
      { id: 2, type: 'Maladie', startDate: 'Nov. 5, 2024', endDate: 'Nov. 6, 2024', days: 2, status: 'Rejected', comment: 'Incomplete', confirmation: 'Pending' },
      { id: 3, type: 'Annual Leave', startDate: 'Nov. 4, 2024', endDate: 'Nov. 4, 2024', days: 1, status: 'Approved', comment: 'Vacation', confirmation: 'Confirmed' },
    ];
  });

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

  const handleEdit = (leave) => {
    setEditingId(leave.id);
    setEditFormData({
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.days,
      status: leave.status,
      comment: leave.comment,
      confirmation: leave.confirmation
    });
  };

  const handleUpdate = (id) => {
    const updatedData = leaveData.map(leave => 
      leave.id === id ? { ...leave, ...editFormData } : leave
    );
    setLeaveData(updatedData);
    localStorage.setItem('leaveData', JSON.stringify(updatedData));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updatedData = leaveData.filter(leave => leave.id !== id);
    setLeaveData(updatedData);
    localStorage.setItem('leaveData', JSON.stringify(updatedData));
  };

  const handleCreateClose = () => setIsCreateOpen(false);
  const handleFilterClose = () => setFilterOpen(false);

  const filteredLeaveData = leaveData.filter(
    (leave) =>
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className="headers" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <Typography variant="h6" style={{ minWidth: "200px" }}>My Leave Requests</Typography>
        
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          style={{ flex: 1, maxWidth: "400px" }}
        />
        
        <div className="header-actions" style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <Button variant="outlined" onClick={() => setFilterOpen(true)} startIcon={<FilterList />}>Filter</Button>
          <Button variant="contained" color="error" onClick={() => setIsCreateOpen(true)} startIcon={<Add />}>Create</Button>
        </div>
      </div>
        <div className="leave-cards" style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          padding: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
          scrollBehavior: "smooth"
        }}>
          {leaveTypes.map((card, index) => (
            <Card key={index} className="leave-card" style={{
              padding: "20px",
              cursor: "pointer",
              minHeight: "200px",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              border: `2px solid ${card.color}`,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
            }}>
              <Typography variant="h6" style={{ 
                marginBottom: "15px",
                color: card.color,
                fontWeight: "bold" 
              }}>
                {card.type}
              </Typography>
              <div className="card-content">
                <p>Available Days: {card.availableDays}</p>
                <p>Carry Forward Days: {card.carryForward}</p>
                <p>Total Leave Days: {card.totalDays}</p>
                <p>Total Leave Taken: {card.taken}</p>
              </div>
            </Card>
          ))}
        </div>
      <div className="leave-table" style={{
        overflowX: "auto",
        padding: "20px"
      }}>
        <table style={{ width: "100%", minWidth: "800px" }}>
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
                <td>
                  {editingId === leave.id ? (
                    <TextField
                      value={editFormData.type}
                      onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    />
                  ) : leave.type}
                </td>
                <td>
                  {editingId === leave.id ? (
                    <TextField
                      value={editFormData.startDate}
                      onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                    />
                  ) : leave.startDate}
                </td>
                <td>
                  {editingId === leave.id ? (
                    <TextField
                      value={editFormData.endDate}
                      onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                    />
                  ) : leave.endDate}
                </td>
                <td>
                  {editingId === leave.id ? (
                    <TextField
                      value={editFormData.days}
                      onChange={(e) => setEditFormData({...editFormData, days: e.target.value})}
                    />
                  ) : leave.days}
                </td>
                <td>{leave.status}</td>
                <td>
                  {editingId === leave.id ? (
                    <TextField
                      value={editFormData.comment}
                      onChange={(e) => setEditFormData({...editFormData, comment: e.target.value})}
                    />
                  ) : leave.comment}
                </td>
                <td>{leave.confirmation}</td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === leave.id ? (
                    <Tooltip title="Save">
                      <IconButton 
                        color="primary"
                        onClick={() => handleUpdate(leave.id)}
                      >
                        <Save />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit">
                      <IconButton 
                        color="primary"
                        onClick={() => handleEdit(leave)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(leave.id)}
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
    </div>
  );
};

export default MyLeaveRequests;