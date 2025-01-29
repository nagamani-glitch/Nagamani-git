// import React, { useState, useEffect } from 'react';
// import { 
//   Card, Button, TextField, IconButton, MenuItem, Select, InputLabel, 
//   FormControl, Pagination, Grid, Typography, Box, Table, TableBody, 
//   TableCell, TableContainer, TableHead, TableRow, Paper, Avatar 
// } from '@mui/material';
// import { 
//   Search, FilterList, ViewModule, ViewList, MoreVert, 
//   Edit, Delete, Visibility 
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './EmployeeListing.css';

// const EmployeeListing = () => {
//   const navigate = useNavigate();
//   const [viewMode, setViewMode] = useState('grid');
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const itemsPerPage = 30;

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/employees');
//       setEmployees(response.data);
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       toast.error('Error fetching employees');
//     }
//   };

//   const handleFilter = (status) => {
//     setStatusFilter(status);
//     let filtered = employees;
//     if (status !== 'All') {
//       filtered = employees.filter(employee => employee.status === status);
//     }
//     setFilteredEmployees(filtered);
//   };

//   const handleSearch = (e) => {
//     const searchValue = e.target.value.toLowerCase();
//     setSearchText(searchValue);
//     const filtered = employees.filter(employee =>
//       employee.name.toLowerCase().includes(searchValue) ||
//       employee.email.toLowerCase().includes(searchValue)
//     );
//     setFilteredEmployees(filtered);
//   };

//   const handleEdit = (id) => {
//     navigate(`/employee/edit/${id}`);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/employees/${id}`);
//       toast.success('Employee deleted successfully');
//       fetchEmployees();
//     } catch (error) {
//       toast.error('Error deleting employee');
//     }
//   };

//   const handleView = (id) => {
//     navigate(`/employee/view/${id}`);
//   };

//   const paginatedEmployees = filteredEmployees.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const renderGridView = () => (
//     <Grid container spacing={2}>
//       {paginatedEmployees.map((employee) => (
//         <Grid item xs={12} sm={6} md={4} key={employee._id}>
//           <Card className="employee-card">
//             <Box p={2}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item>
//                   <Avatar 
//                     src={`http://localhost:5000${employee.img}`}
//                     alt={employee.name}
//                     sx={{ width: 56, height: 56 }}
//                   />
//                 </Grid>
//                 <Grid item xs>
//                   <Typography variant="h6">{employee.name}</Typography>
//                   <Typography color="textSecondary">{employee.email}</Typography>
//                   <Typography color="textSecondary">{employee.department}</Typography>
//                 </Grid>
//                 <Grid item>
//                   <IconButton onClick={() => handleView(employee._id)}>
//                     <Visibility />
//                   </IconButton>
//                   <IconButton onClick={() => handleEdit(employee._id)}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(employee._id)}>
//                     <Delete />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );

//   const renderListView = () => (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Employee</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Department</TableCell>
//             <TableCell>Role</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {paginatedEmployees.map((employee) => (
//             <TableRow key={employee._id}>
//               <TableCell>
//                 <Box display="flex" alignItems="center">
//                   <Avatar 
//                     src={`http://localhost:5000${employee.img}`}
//                     alt={employee.name}
//                     sx={{ marginRight: 2 }}
//                   />
//                   {employee.name}
//                 </Box>
//               </TableCell>
//               <TableCell>{employee.email}</TableCell>
//               <TableCell>{employee.department}</TableCell>
//               <TableCell>{employee.role}</TableCell>
//               <TableCell>
//                 <IconButton onClick={() => handleView(employee._id)}>
//                   <Visibility />
//                 </IconButton>
//                 <IconButton onClick={() => handleEdit(employee._id)}>
//                   <Edit />
//                 </IconButton>
//                 <IconButton onClick={() => handleDelete(employee._id)}>
//                   <Delete />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );

//   return (
//     <Box padding={3}>
//       <Grid container spacing={2} alignItems="center" marginBottom={3}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="h4" gutterBottom>
//             Employees Directory
//           </Typography>
//           <TextField
//             fullWidth
//             placeholder="Search employees..."
//             value={searchText}
//             onChange={handleSearch}
//             InputProps={{
//               startAdornment: <Search />
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Box display="flex" justifyContent="flex-end" gap={2}>
//             <IconButton onClick={() => setViewMode('list')}>
//               <ViewList color={viewMode === 'list' ? 'primary' : 'inherit'} />
//             </IconButton>
//             <IconButton onClick={() => setViewMode('grid')}>
//               <ViewModule color={viewMode === 'grid' ? 'primary' : 'inherit'} />
//             </IconButton>
//             <FormControl sx={{ minWidth: 120 }}>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={statusFilter}
//                 onChange={(e) => handleFilter(e.target.value)}
//                 label="Status"
//               >
//                 <MenuItem value="All">All</MenuItem>
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </Grid>
//       </Grid>

//       {viewMode === 'grid' ? renderGridView() : renderListView()}

//       <Box display="flex" justifyContent="center" marginTop={3}>
//         <Pagination
//           count={Math.ceil(filteredEmployees.length / itemsPerPage)}
//           page={currentPage}
//           onChange={(e, page) => setCurrentPage(page)}
//           color="primary"
//         />
//       </Box>
//     </Box>
//   );
// };

// export default EmployeeListing;

import React, { useState, useEffect } from 'react';
import { Card, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, FilterList, ViewModule, ViewList, MoreVert } from '@mui/icons-material';
import axios from 'axios'
import './EmployeeListing.css';

const EmployeeListing = ({ onEmployeeClick }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [profiles, setProfiles] = useState([]);
  const [filteredEmployeesList, setFilteredEmployeesList] = useState([]);
  const itemsPerPage = 10;

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
