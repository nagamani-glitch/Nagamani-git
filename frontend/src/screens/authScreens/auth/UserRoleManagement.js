import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  TextField,
  Grid,
  InputLabel,
  Snackbar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  inviteUser, 
  updateUserRole, 
  updateUserPermissions,
  selectUsers,
  selectUserManagementLoading,
  selectUserManagementError,
  selectInviteSuccess,
  selectUpdateSuccess,
  clearUserManagementState
} from '../../../redux/userManagementSlice';

const UserRoleManagement = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserManagementLoading);
  const error = useSelector(selectUserManagementError);
  const inviteSuccess = useSelector(selectInviteSuccess);
  const updateSuccess = useSelector(selectUpdateSuccess);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [inviteFormData, setInviteFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: 'employee'
  });
  const [formErrors, setFormErrors] = useState({});

  // Debug authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Authentication Debug:', {
      hasToken: !!token,
      tokenFirstChars: token ? token.substring(0, 10) + '...' : 'none',
      companyCode,
      userRole: user.role,
      userPermissions: user.permissions
    });
    
    // Check if user has the required permission
    const hasRequiredPermission = user.permissions?.includes('manage_company_settings') || user.role === 'admin';
    console.log('Has required permission:', hasRequiredPermission);
    
    // If no token or no required permission, show error
    if (!token) {
      setFormErrors(prev => ({ ...prev, auth: 'No authentication token found. Please log in again.' }));
    } else if (!hasRequiredPermission) {
      setFormErrors(prev => ({ ...prev, auth: 'You do not have permission to access this page.' }));
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    if (inviteSuccess) {
      setOpenInviteDialog(false);
      setSuccessMessage('User invited successfully');
      setInviteFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        role: 'employee'
      });
      fetchUserData();
      dispatch(clearUserManagementState());
    }
  }, [inviteSuccess, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setOpenPermissionsDialog(false);
      setSuccessMessage('User updated successfully');
      dispatch(clearUserManagementState());
    }
  }, [updateSuccess, dispatch]);

  const fetchUserData = () => {
    dispatch(fetchUsers());
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  const openPermissionEditor = (user) => {
    setSelectedUser(user);
    setSelectedPermissions([...user.permissions]);
    setOpenPermissionsDialog(true);
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const savePermissions = () => {
    dispatch(updateUserPermissions({
      userId: selectedUser._id,
      permissions: selectedPermissions
    }));
  };

  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
    setFormErrors({});
  };

  const handleInviteFormChange = (e) => {
    const { name, value } = e.target;
    setInviteFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateInviteForm = () => {
    const errors = {};
    
    if (!inviteFormData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!inviteFormData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!inviteFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(inviteFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!inviteFormData.role) {
      errors.role = 'Role is required';
    }
    
    return errors;
  };

  const handleInviteUser = () => {
    const errors = validateInviteForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    dispatch(inviteUser(inviteFormData));
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const permissionGroups = {
    'Employee Management': [
      'view_employees', 'edit_employees', 'create_employees', 'delete_employees'
    ],
    'Payroll': [
      'view_payroll', 'manage_payroll'
    ],
    'Leave Management': [
      'view_leave', 'approve_leave', 'manage_leave_policy'
    ],
    'Attendance': [
      'view_attendance', 'manage_attendance'
    ],
    'Reports': [
      'view_reports', 'create_reports'
    ],
    'Settings': [
      'manage_company_settings'
    ]
  };

  if (loading && users.length === 0) return <Typography>Loading users...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Role Management
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {formErrors.auth && <Alert severity="error" sx={{ mb: 2 }}>{formErrors.auth}</Alert>}
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenInviteDialog}
        >
          Invite New User
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.isActive ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => openPermissionEditor(user)}
                  >
                    Edit Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Permissions Dialog */}
      <Dialog 
        open={openPermissionsDialog} 
        onClose={() => setOpenPermissionsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Permissions for {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          {Object.entries(permissionGroups).map(([groupName, permissions]) => (
            <Box key={groupName} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {groupName}
              </Typography>
              <FormGroup>
                {permissions.map(permission => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                      />
                    }
                    label={permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermissionsDialog(false)}>
            Cancel
          </Button>
          <Button onClick={savePermissions} variant="contained">
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog 
        open={openInviteDialog} 
        onClose={() => setOpenInviteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={inviteFormData.firstName}
                  onChange={handleInviteFormChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  value={inviteFormData.middleName}
                  onChange={handleInviteFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={inviteFormData.lastName}
                  onChange={handleInviteFormChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={inviteFormData.email}
                  onChange={handleInviteFormChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.role}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="role"
                    value={inviteFormData.role}
                    onChange={handleInviteFormChange}
                    label="Role"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                  {formErrors.role && (
                    <Typography variant="caption" color="error">
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Cancel</Button>
          <Button onClick={handleInviteUser} variant="contained" color="primary">
            Invite User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default UserRoleManagement;
