import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import gsap from 'gsap';
import { Card, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Pagination, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Search, FilterList, ViewModule, ViewList, MoreVert } from '@mui/icons-material';
import axios from 'axios';



const StyledContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #f6f7f9 0%, #ffffff 100%)',
  minHeight: '100vh',
  padding: theme.spacing(3),
}));

const SearchContainer = styled(motion.div)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  backdropFilter: 'blur(4px)',
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(motion.div)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  background: '#ffffff',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.01)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '8px 16px',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 500,
  background: theme.palette.primary.light,
  color: theme.palette.primary.main,
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '12px',
    margin: '0 4px',
    '&:hover': {
      background: theme.palette.primary.light,
    }
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  }
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const HeaderContainer = styled(Box)({
  marginBottom: '2rem',
  background: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
});

const SearchBarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem'
});

const ControlsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem'
});


const EmployeeListing = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [profiles, setProfiles] = useState([]);
  const [filteredEmployeesList, setFilteredEmployeesList] = useState([]);
  const itemsPerPage = 10;

  // GSAP animations
useEffect(() => {
  gsap.from(".search-container", {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".employee-card", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out"
  });
}, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees/registered');
        const employeeData = response.data.map(employee => ({
          _id: employee.Emp_ID || '',
          name: employee.personalInfo ? 
            `${employee.personalInfo.firstName || ''} ${employee.personalInfo.lastName || ''}`.trim() : '',
          email: employee.personalInfo?.email || '',
          phone: employee.personalInfo?.mobileNumber || '',
          department: employee.joiningDetails?.department || 'Not Assigned',
          role: employee.joiningDetails?.initialDesignation || 'Not Assigned',
          location: employee.addressDetails?.presentAddress?.city || 'Not Specified'
        }));
        
        setProfiles(employeeData);
        setFilteredEmployeesList(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();

    gsap.from(".search-container", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
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

  const GridView = ({ employees }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={3}>
        {employees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee._id}>
            <StyledCard
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEmployeeClick(employee._id)}
            >
              <Box p={3}>
                <Typography variant="h6" gutterBottom>{employee.name}</Typography>
                <Typography color="textSecondary" gutterBottom>{employee.role}</Typography>
                <Chip label={employee.department} size="small" sx={{ marginBottom: 1 }} />
                <Typography variant="body2">{employee.email}</Typography>
                <Typography variant="body2">{employee.phone}</Typography>
                <Typography variant="body2">{employee.location}</Typography>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  return (
    <StyledContainer>
      <HeaderContainer>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Employees Directory
        </Typography>
        
        <SearchBarContainer>
          <TextField
            variant="outlined"
            placeholder="Search employees..."
            value={searchText}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              startAdornment: <Search color="action" />,
            }}
          />
        </SearchBarContainer>

        <ControlsContainer>
          <Button 
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => toggleView('list')}
            startIcon={<ViewList />}
            sx={{ zIndex: 1, visibility: 'visible' }}
          >
            List View
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => toggleView('grid')}
            startIcon={<ViewModule />}
            sx={{ zIndex: 1, visibility: 'visible' }}
          >
            Grid View
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            sx={{ zIndex: 1, visibility: 'visible' }}
          >
            Filter
          </Button>
          <FormControl variant="outlined" style={{ minWidth: 200, zIndex: 1, visibility: 'visible' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => handleFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All Employees</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </ControlsContainer>
      </HeaderContainer>

      {viewMode === 'grid' ? (
        <GridView employees={paginatedEmployees} />
      ) : (
        <StyledTableContainer>
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
                <TableRow 
                  key={employee._id}
                  onClick={() => handleEmployeeClick(employee._id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
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
        </StyledTableContainer>
      )}

      <Box display="flex" justifyContent="center" marginTop={3}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary"
          size="large"
          sx={{ visibility: 'visible', zIndex: 1 }}
        />
      </Box>
    </StyledContainer>
  );
};

export default EmployeeListing;

