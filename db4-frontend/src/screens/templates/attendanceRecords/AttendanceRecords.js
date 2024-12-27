import React, { useState } from 'react';
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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab,
} from '@mui/material';
import { FilterList, GroupWork, Add, Visibility, Cancel } from '@mui/icons-material';

const AttendanceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupByOpen, setGroupByOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([
    { id: 1, name: 'Alan Gland', empId: 'PEP234585', date: 'Nov. 7, 2024', day: 'Thursday', checkIn: '07:09 PM' },
    { id: 2, name: 'Dinesh Raj', empId: 'PEP234586', date: 'Nov. 6, 2024', day: 'Wednesday', checkIn: '07:09 PM' },
    { id: 3, name: 'Sanju Samson', empId: 'PEP234587', date: 'Nov. 5, 2024', day: 'Tuesday', checkIn: '07:09 PM' },
    { id: 4, name: 'Subikshan', empId: 'PEP234588', date: 'Nov. 4, 2024', day: 'Monday', checkIn: '07:09 PM' },
    { id: 5, name: 'Ramachandran', empId: 'PEP234589', date: 'Nov. 3, 2024', day: 'Sunday', checkIn: '07:09 PM' },
    { id: 6, name: 'Sangeetha', empId: 'PEP234590', date: 'Nov. 2, 2024', day: 'Saturday', checkIn: '07:09 PM' },
    { id: 7, name: 'Dilli Babu', empId: 'PEP234591', date: 'Nov. 1, 2024', day: 'Friday', checkIn: '07:09 PM' },
    { id: 8, name: 'Subrahmanyam', empId: 'PEP234592', date: 'Nov. 8, 2024', day: 'Friday', checkIn: '07:09 PM' },
  ]);
  
  const [newRecord, setNewRecord] = useState({
    name: '',
    empId: '',
    date: '',
    day: '',
    checkIn: ''
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map(row => row.id));
    }
    setSelectedAll(!selectedAll);
  };

  const handleHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedRows(rows.map(row => row.id));
      setSelectedAll(true);
    } else {
      setSelectedRows([]);
      setSelectedAll(false);
    }
  };

  const handleRowCheckboxChange = (id) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(rowId => rowId !== id) : [...prevSelected, id]
    );
  };

  const handleCreateRecord = () => {
    setRows([...rows, { ...newRecord, id: rows.length + 1 }]);
    setCreateOpen(false);
    setNewRecord({
      name: '',
      empId: '',
      date: '',
      day: '',
      checkIn: ''
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Attendances</Typography>

      {/* Search Box */}
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
      <TextField
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: <IconButton size="small"><span role="img" aria-label="search">🔍</span></IconButton>
        }}
        style={{ width: '150px', marginBottom: '16px' }}
      />

      {/* Filter, Group By, Actions, and Create Buttons */}
      <Box display="flex" gap={2} mb={3} style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
        <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFilterOpen(true)}>Filter</Button>
        <Button variant="outlined" startIcon={<GroupWork />} onClick={() => setGroupByOpen(true)}>GroupBy</Button>
        <Button variant="outlined">Actions</Button>
        <Button variant="contained" color="error" startIcon={<Add />} onClick={() => setCreateOpen(true)}>Create</Button>
      </Box>
      </div>

      {/* Select All Attendance Button */}
      <Button
        variant="outlined"
        color="success"
        onClick={handleSelectAll}
        style={{ marginBottom: '16px' }}
      >
        {selectedAll ? 'Deselect All Records' : 'Select All Records'}
      </Button>

      {/* Attendance Table */}
      <TableContainer component={Paper} style={{ maxHeight: '350px', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  onChange={handleHeaderCheckboxChange}
                />
              </TableCell>
              <TableCell style={{ position: 'sticky', left: '40px', background: '#fff', zIndex: 1 }}>Employee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>In Date</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Out Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Work Type</TableCell>
              <TableCell>Min Hour</TableCell>
              <TableCell>At Work</TableCell>
              <TableCell>Overtime</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell style={{ position: 'sticky', right: 0, background: '#fff', zIndex: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox" style={{ position: 'sticky', left: 0, background: '#fff' }}>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowCheckboxChange(row.id)}
                  />
                </TableCell>
                <TableCell style={{ position: 'sticky', left: '40px', background: '#fff' }}>{row.name} ({row.empId})</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell style={{ position: 'sticky', right: 0, background: '#fff' }}>
                  <IconButton><Visibility /></IconButton>
                  <IconButton><Cancel /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button */}
      <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => setCreateOpen(true)}>
        <Add />
      </Fab>

      {/* Create Popup */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create Attendance</DialogTitle>
        <DialogContent>
          <TextField
            label="Employee Name"
            fullWidth
            value={newRecord.name}
            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Employee ID"
            fullWidth
            value={newRecord.empId}
            onChange={(e) => setNewRecord({ ...newRecord, empId: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Date"
            fullWidth
            type="date"
            value={newRecord.date}
            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Day"
            fullWidth
            value={newRecord.day}
            onChange={(e) => setNewRecord({ ...newRecord, day: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Check-In Time"
            fullWidth
            type="time"
            value={newRecord.checkIn}
            onChange={(e) => setNewRecord({ ...newRecord, checkIn: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleCreateRecord} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceRecords;
