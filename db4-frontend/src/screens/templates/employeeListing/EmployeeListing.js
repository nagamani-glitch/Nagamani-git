import React, { useState, useEffect } from 'react';
import { Card, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, FilterList, ViewModule, ViewList, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import './EmployeeListing.css';

const EmployeeListing = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [profiles, setProfiles] = useState([]);
  const [filteredEmployeesList, setFilteredEmployeesList] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees/all');
        const employeeData = response.data.map(employee => ({
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          role: employee.role,
          location: employee.location
        }));
        setProfiles(employeeData);
        setFilteredEmployeesList(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeClick = (employeeId) => {
    onNavigate(`/Dashboards/profile/${employeeId}`);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    if (status === 'Online') {
      setFilteredEmployeesList(profiles.filter(employee => employee.status === 'Online'));
    } else if (status === 'Offline') {
      setFilteredEmployeesList(profiles.filter(employee => employee.status === 'Offline'));
    } else {
      setFilteredEmployeesList(profiles);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const filteredEmployees = filteredEmployeesList.filter((employee) =>
    employee.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box padding={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h4">Employees</Typography>
          <TextField
            variant="outlined"
            placeholder="Search"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search />
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <IconButton onClick={() => toggleView('list')}><ViewList /></IconButton>
          <IconButton onClick={() => toggleView('grid')}><ViewModule /></IconButton>
          <Button startIcon={<FilterList />} variant="outlined">Filter</Button>
          <FormControl variant="outlined" style={{ minWidth: 120, marginLeft: 10 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => handleFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {viewMode === 'grid' ? (
        <Grid container spacing={2} marginTop={3}>
          {paginatedEmployees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <Card onClick={() => handleEmployeeClick(employee._id)}>
                <Box padding={2} display="flex" alignItems="center">
                  <Box marginRight={2}>
                    <Typography variant="h6">{employee.name}</Typography>
                    <Typography color="textSecondary">{employee.email}</Typography>
                    <Typography color="textSecondary">{employee.phone}</Typography>
                    <Typography color="textSecondary">{employee.department}</Typography>
                    <Typography color="textSecondary">{employee.role}</Typography>
                    <Typography color="textSecondary">{employee.location}</Typography>
                  </Box>
                  <IconButton><MoreVert /></IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee._id} onClick={() => handleEmployeeClick(employee._id)}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.location}</TableCell>
                  <TableCell>
                    <IconButton><MoreVert /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="center" marginTop={3}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
};

export default EmployeeListing;
