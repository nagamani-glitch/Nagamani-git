import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Dropdown, InputGroup, Row, Col } from 'react-bootstrap';
// import { FaSearch, FaFilter, FaThList, FaThLarge, FaEllipsisV } from 'react-icons/fa';
import { Card, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, FilterList, ViewModule, ViewList, MoreVert } from '@mui/icons-material';

import axios from 'axios'
import './EmployeeListing.css';

// const employeesData = [
//   { id: 1, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 2, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 3, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 4, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 5, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 6, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 7, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 8, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 9, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 10, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
  
//   { id: 11, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 12, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 13, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 14, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 15, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 16, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 17, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 18, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 19, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 20, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
  
//   { id: 21, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 22, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 23, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 24, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 25, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 26, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 27, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 28, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 29, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 30, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
//   { id: 81, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 82, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 83, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 84, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 85, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 86, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 87, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 88, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 89, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 90, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
  
//   { id: 11, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 12, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 13, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 14, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 15, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 16, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 17, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 18, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 19, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 20, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
//   // Continue adding unique names up to 90 employees
//   { id: 21, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 22, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 23, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 24, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 25, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 26, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 27, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 28, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 29, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 30, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
//   { id: 31, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 32, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 33, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 34, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 35, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 36, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 37, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 38, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 39, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 40, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
//   // Add more names to reach 90 employees
//   { id: 51, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 52, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 53, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 54, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 55, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 56, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 57, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 58, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 59, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 60, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
  
//   { id: 71, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 72, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 73, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 74, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 75, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 76, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 77, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 78, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 79, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 80, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
  
// ];



const EmployeeListing = ({ onEmployeeClick }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [profiles, setProfiles] = useState([]);
  const [filteredEmployeesList, setFilteredEmployeesList] = useState([]);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/profiles/all');
        setProfiles(response.data);
        setFilteredEmployeesList(response.data);
      } catch (error) {
        console.error('Error fetching all profiles', error);
      }
    };

    fetchProfiles();
  }, []);

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
              <Card onClick={() => onEmployeeClick(employee._id)}>
                <Box padding={2} display="flex" alignItems="center">
                  <Box marginRight={2}>
                    <Typography variant="h6">{employee.name}</Typography>
                    <Typography color="textSecondary">{employee.email}</Typography>
                    <Typography color="textSecondary">{employee.phone}</Typography>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee._id} onClick={() => onEmployeeClick(employee._id)}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
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
