import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Edit, Delete, Add, FilterList } from '@mui/icons-material';

const Interview = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [candidate, setCandidate] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({
    candidate: '',
    interviewer: '',
    date: '',
    status: 'All',
  });
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch interviews from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/interviews')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching interviews:', error));
  }, []);

  // Open the dialog for adding or editing an interview
  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditMode(true);
      setSelectedRow(row);
      setCandidate(row.candidate);
      setInterviewer(row.interviewer);
      setDate(row.date);
      setTime(row.time);
      setDescription(row.description);
      setStatus(row.status);
    } else {
      setEditMode(false);
      setCandidate('');
      setInterviewer('');
      setDate('');
      setTime('');
      setDescription('');
      setStatus('');
    }
    setOpenDialog(true);
  };

  // Save the new or updated interview
  const handleSave = () => {
    const interviewData = { candidate, interviewer, date, time, description, status: status || 'Scheduled' };
    if (editMode && selectedRow) {
      axios.put(`http://localhost:5000/api/interviews/${selectedRow._id}`, interviewData)
        .then(response => {
          setData((prevData) => prevData.map((item) => (item._id === selectedRow._id ? response.data : item)));
          setOpenDialog(false);
        }).catch(error => console.error('Error updating interview:', error));
    } else {
      axios.post('http://localhost:5000/api/interviews', interviewData)
        .then(response => {
          setData([...data, response.data]);
          setOpenDialog(false);
        }).catch(error => console.error('Error adding interview:', error));
    }
  };

  // Delete an interview
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/interviews/${id}`)
      .then(() => setData(data.filter((item) => item._id !== id)))
      .catch(error => console.error('Error deleting interview:', error));
  };

  // Open and close filter menu
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  // Apply filters to data
  const applyFilters = () => {
    handleFilterClose();
    axios.get('http://localhost:5000/api/interviews', { params: filters })
      .then(response => setData(response.data))
      .catch(error => console.error('Error applying filters:', error));
  };

  return (
    <Box padding={3} sx={{ backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
        Interview Management
      </Typography>
      <Box display="flex" alignItems="center" marginBottom={2} sx={{ marginBottom: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginRight: 2,
            width: '300px',
            borderColor: '#ddd',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#bbb',
              },
            },
          }}
        />
        <Button variant="outlined" startIcon={<FilterList />} onClick={handleFilterClick} sx={{ padding: '8px 16px' }}>
          Filter
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Candidate</InputLabel>
              <OutlinedInput
                value={filters.candidate}
                onChange={(e) => setFilters({ ...filters, candidate: e.target.value })}
                label="Candidate"
                sx={{ marginBottom: 1 }}
              />
            </FormControl>
          </MenuItem>
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Interviewer</InputLabel>
              <OutlinedInput
                value={filters.interviewer}
                onChange={(e) => setFilters({ ...filters, interviewer: e.target.value })}
                label="Interviewer"
                sx={{ marginBottom: 1 }}
              />
            </FormControl>
          </MenuItem>
          <MenuItem>
            <FormControl fullWidth>
              <TextField
                label="Date"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 1 }}
              />
            </FormControl>
          </MenuItem>
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          <MenuItem>
            <Button variant="contained" onClick={applyFilters}>Apply</Button>
          </MenuItem>
        </Menu>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ marginLeft: 2, padding: '8px 16px' }}
        >
          Add Interview
        </Button>
      </Box>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#3f51b5', color: '#fff' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Candidate</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Interviewer</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter(item => 
            item.candidate.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((row) => (
            <TableRow key={row._id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
              <TableCell>{row.candidate}</TableCell>
              <TableCell>{row.interviewer}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenDialog(row)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(row._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={Math.ceil(data.length / 10)} color="primary" sx={{ marginTop: 2 }} />
      
      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? 'Edit Interview' : 'Add Interview'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Candidate"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Interviewer"
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interview;
