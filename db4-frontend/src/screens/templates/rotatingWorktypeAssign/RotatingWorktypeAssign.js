import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Checkbox,
  Typography,
  Toolbar,
  Paper,
  Divider,
} from '@mui/material';
import { FilterList, GroupWork, Add, Edit, FileCopy, Delete } from '@mui/icons-material';

// Sample Data
const employees = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  employeeCode: `#EMP${i + 1}`,
  requestedShift: i % 2 === 0 ? 'First Shift' : 'Second Shift',
  currentShift: 'Regular Shift',
  requestedDate: 'Nov. 7, 2024',
  requestedTill: 'Nov. 9, 2024',
  status: i % 2 === 0 ? 'Approved' : 'Rejected',
  description: 'Request for shift adjustment',
  comment: 'Needs urgent consideration',
}));

const RotatingWorktypeAssign = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Rotating Work Type Assign
      </Typography>

      {/* Header Section */}
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1 }}>
          <Button variant="outlined" sx={{ color: 'green', borderColor: 'green', mr: 2 }}>
            Select All Worktypes
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<FilterList />} variant="outlined">Filter</Button>
          <Button startIcon={<GroupWork />} variant="outlined">Group By</Button>
          <Button variant="outlined">Actions</Button>
          <Button startIcon={<Add />} variant="contained" color="error">Create</Button>
        </Box>
      </Toolbar>

      {/* Approval Status Indicators */}
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <Typography sx={{ color: 'green' }}>● Approved</Typography>
        <Typography sx={{ color: 'red' }}>● Rejected</Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={0} textColor="primary" indicatorColor="primary">
        <Tab label="Worktype Requests" />
        <Tab label="Allocated Worktype Requests" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Requested Work Type</TableCell>
              <TableCell>Previous/Current Work Type</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Requested Till</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Confirmation</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: emp.id % 2 === 0 ? 'primary.main' : 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      {emp.name.split(' ')[1][0]}
                    </Box>
                    {emp.name} ({emp.employeeCode})
                  </Box>
                </TableCell>
                <TableCell>{emp.requestedShift}</TableCell>
                <TableCell>{emp.currentShift}</TableCell>
                <TableCell>{emp.requestedDate}</TableCell>
                <TableCell>{emp.requestedTill}</TableCell>
                <TableCell sx={{ color: emp.status === 'Approved' ? 'green' : 'red' }}>
                  {emp.status}
                </TableCell>
                <TableCell>{emp.description}</TableCell>
                <TableCell>{emp.comment}</TableCell>
                <TableCell>
                  <IconButton color="success">
                    ✔️
                  </IconButton>
                  <IconButton color="error">
                    ✖️
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton color="secondary">
                    <FileCopy fontSize="small" />
                  </IconButton>
                  <IconButton color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Floating Action Button */}
      <IconButton
        color="error"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: 'error.main',
          color: 'white',
          '&:hover': { bgcolor: 'error.dark' },
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default RotatingWorktypeAssign;
