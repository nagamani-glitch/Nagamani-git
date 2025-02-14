import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, 
  IconButton, Grid, Stack, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, InputAdornment, MenuItem, Chip,
  Alert, Snackbar
} from '@mui/material';
import { 
  UploadFile, Close, Search, Edit, Delete, FilterList,
  Sort, Download 
} from '@mui/icons-material';
import GavelIcon from '@mui/icons-material/Gavel';

const DisciplinaryActions = () => {
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingAction, setEditingAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const actionStatuses = ['Warning', 'Suspension', 'Termination', 'Written Notice'];
  
  const initialFormState = {
    employee: '',
    action: '',
    description: '',
    startDate: '',
    status: '',
    attachments: null
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchActions();
  }, [searchQuery, filterStatus]);

  const fetchActions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/disciplinary-actions?searchQuery=${searchQuery}&status=${filterStatus}`);
      if (!response.ok) throw new Error('Failed to fetch actions');
      const data = await response.json();
      setActions(data);
    } catch (error) {
      showSnackbar('Error fetching actions', 'error');
    }
  };

  const handleClickOpen = () => {
    setEditingAction(null);
    setFormData(initialFormState);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAction(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'attachments') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.attachments) {
        formDataToSend.append('attachments', formData.attachments);
      }

      const method = editingAction ? 'PUT' : 'POST';
      const url = editingAction 
        ? `http://localhost:5000/api/disciplinary-actions/${editingAction._id}`
        : 'http://localhost:5000/api/disciplinary-actions';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to save action');
      
      showSnackbar(editingAction ? 'Action updated successfully' : 'Action created successfully');
      fetchActions();
      handleClose();
    } catch (error) {
      showSnackbar('Error saving action', 'error');
    }
  };

  const handleEdit = (action) => {
    setEditingAction(action);
    setFormData({
      ...action,
      attachments: null // Reset file input
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/disciplinary-actions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete action');
      
      showSnackbar('Action deleted successfully');
      fetchActions();
    } catch (error) {
      showSnackbar('Error deleting action', 'error');
    }
  };

  const downloadFile = async (filename, originalName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/disciplinary-actions/download/${filename}`);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showSnackbar('Error downloading file', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Warning': 'warning',
      'Suspension': 'error',
      'Termination': 'error',
      'Written Notice': 'info'
    };
    return colors[status] || 'default';
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h3" fontWeight="800"  fontSize="1.5rem">
          Disciplinary Actions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<span style={{ fontSize: '1.5rem' }}>+</span>}
        >
          Take An Action
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ width: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          {actionStatuses.map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Employee</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Attachments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.length > 0 ? (
              actions.map((action) => (
                <TableRow key={action._id} hover>
                  <TableCell>{action.employee}</TableCell>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{action.description}</TableCell>
                  <TableCell>{new Date(action.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={action.status}
                      color={getStatusColor(action.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {action.attachments && (
                      <IconButton
                        size="small"
                        onClick={() => downloadFile(action.attachments.filename, action.attachments.originalName)}
                      >
                        <Download />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(action)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(action._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <GavelIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                    <Typography color="textSecondary">
                      No disciplinary actions found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {editingAction ? 'Edit Action' : 'Take An Action'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="employee"
                label="Employee"
                fullWidth
                required
                value={formData.employee}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="action"
                select
                label="Action Type"
                fullWidth
                required
                value={formData.action}
                onChange={handleInputChange}
              >
                {actionStatuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="status"
                select
                label="Status"
                fullWidth
                required
                value={formData.status}
                onChange={handleInputChange}
              >
                {actionStatuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                fullWidth
              >
                Upload Supporting Documents
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              {formData.attachments && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Selected file: {formData.attachments.name}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.employee || !formData.action || !formData.description || !formData.startDate || !formData.status}
            >
              {editingAction ? 'Update' : 'Save'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DisciplinaryActions;
