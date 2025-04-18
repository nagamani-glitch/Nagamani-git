import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Table, TableBody, TableCell, TableHead, TableRow,
    Modal, Button, Select, MenuItem, InputAdornment, Stack, Chip, Dialog, DialogContent, DialogTitle,FormControl,InputLabel
} from '@mui/material';
import { 
    Edit, Delete,
   Search, Add, Close
} from '@mui/icons-material';

// Add toSentenceCase helper function at the top  HISTORY
const toSentenceCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

// Helper functions for status colors
const getStatusColor = (status) => {
  if (status === 'In Use') return '#22c55e';
  if (status === 'Available') return '#3b82f6';
  if (status === 'Under Maintenance' || status === 'Under Service') return '#f59e0b';
  return '#e2e8f0';
};

const getStatusTextColor = (status) => {
  if (status === 'In Use') return '#16a34a';
  if (status === 'Available') return '#2563eb';
  if (status === 'Under Maintenance' || status === 'Under Service') return '#d97706';
  return '#64748b';
};

const getStatusBgColor = (status) => {
  if (status === 'In Use') return '#f0fdf4';
  if (status === 'Available') return '#eff6ff';
  if (status === 'Under Maintenance' || status === 'Under Service') return '#fefce8';
  return '#f8fafc';
};
   
const AssetHistory = () => {
    const [assets, setAssets] = useState([]);
    const [editingAssetId, setEditingAssetId] = useState(null);
    const [editData, setEditData] = useState({ status: '', returnDate: '' });
    const [newAssetData, setNewAssetData] = useState({ 
      name: '', 
      category: '', 
      status: '', 
      returnDate: '', 
      allottedDate: '',
      currentEmployee: '',
      previousEmployees: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   
    useEffect(() => {
      fetchAssets();
    
      // Listen for asset updates from AssetView
      const handleAssetsUpdated = () => {
        console.log('Assets updated event received, refreshing assets list');
        fetchAssets();
      };
    
      window.addEventListener('assetsUpdated', handleAssetsUpdated);
      window.addEventListener('storage', (e) => {
        if (e.key === 'assetsUpdated') {
          fetchAssets();
        }
      });
    
      return () => {
        window.removeEventListener('assetsUpdated', handleAssetsUpdated);
      };
    }, []);
   
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/assets`);
        setAssets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching asset history:', error);
        setError('Failed to load assets');
        setLoading(false);
      }
    };
   
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this asset?')) {
        try {
          setLoading(true);
          await axios.delete(`${API_URL}/api/assets/${id}`);
          fetchAssets();
        
          // Notify other components about the update
          const timestamp = Date.now().toString();
          localStorage.setItem('assetsUpdated', timestamp);
        
          const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
          window.dispatchEvent(event);
        } catch (error) {
          console.error('Error deleting asset:', error);
          setError('Failed to delete asset');
        } finally {
          setLoading(false);
        }
      }
    };
    const handleEditClick = (asset) => {
      setEditingAssetId(asset._id);
      setEditData({
        status: asset.status || '',
        returnDate: asset.returnDate ? new Date(asset.returnDate).toISOString().split('T')[0] : '',
        allottedDate: asset.allottedDate ? new Date(asset.allottedDate).toISOString().split('T')[0] : '',
        currentEmployee: asset.currentEmployee || ''
      });
    };
   
    const handleAddAsset = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const formattedData = {
          name: newAssetData.name,
          category: newAssetData.category,
          status: newAssetData.status,
          currentEmployee: newAssetData.currentEmployee,
          previousEmployees: newAssetData.previousEmployees || [],
          // Format the allottedDate properly
          allottedDate: newAssetData.allottedDate ? new Date(newAssetData.allottedDate).toISOString() : null,
          // Format the returnDate properly if it exists
          returnDate: newAssetData.returnDate ? new Date(newAssetData.returnDate).toISOString() : null
        };
        
        console.log('Sending asset data:', formattedData);
        
        await axios.post(`${API_URL}/api/assets`, formattedData);
        fetchAssets();
        setNewAssetData({ 
          name: '', 
          category: '', 
          status: '', 
          returnDate: '', 
          allottedDate: '',
          currentEmployee: '',
          previousEmployees: []
        });
        setIsAddModalOpen(false);
      
        // Notify other components about the update
        const timestamp = Date.now().toString();
        localStorage.setItem('assetsUpdated', timestamp);
      
        const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Error adding new asset:', error);
        setError('Failed to add asset: ' + error.message);
      } finally {
        setLoading(false);
      }
    };       const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const updatedData = {
          ...editData,
          // Format the allottedDate properly if it exists
          allottedDate: editData.allottedDate ? new Date(editData.allottedDate).toISOString() : null,
          // Format the returnDate properly if it exists
          returnDate: editData.returnDate ? new Date(editData.returnDate).toISOString() : null
        };
        
        console.log('Updating asset with data:', updatedData); // Add this line to debug
        
        await axios.put(`${API_URL}/api/assets/${editingAssetId}`, updatedData);
        setEditingAssetId(null);
        fetchAssets();
      
        // Notify other components about the update
        const timestamp = Date.now().toString();
        localStorage.setItem('assetsUpdated', timestamp);
      
        const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Error updating asset:', error);
        setError('Failed to update asset: ' + error.message);
      } finally {
        setLoading(false);
      }
    };       const filteredAssets = assets.filter(asset =>
      (asset.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (asset.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (asset.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (asset.currentEmployee?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handlePreviousEmployeesChange = (e) => {
      const employees = e.target.value.split(",").map((emp) => emp.trim());
      setNewAssetData((prev) => ({
        ...prev,
        previousEmployees: employees,
      }));
    };

    return (   
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            padding: '24px 32px',
            marginBottom: '24px'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" sx={{ 
                fontWeight: 600, 
                background: '#1976d2',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Asset History
              </Typography>
            
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                  placeholder="Search by name, status, category or employee" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{
                    width: '350px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />
              
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  startIcon={<Add />}
                  sx={{
                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    },
                    textTransform: 'none',
                    borderRadius: '8px',
                    height: '40px',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)'
                  }}
                  variant="contained"
                >
                  Add New Asset
                </Button>
              </Stack>
            </Stack>
          </Box>

          {loading && (
            <Typography sx={{ textAlign: "center", my: 2 }}>
              Loading assets...
            </Typography>
          )}
        
          {error && (
            <Typography
              sx={{
                bgcolor: "#fee2e2",
                color: "#dc2626",
                p: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {error}
            </Typography>
          )}

          <Paper elevation={1} sx={{ overflow: 'auto' }}>
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              margin: '24px 0'
            }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Asset Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Current Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Allotted Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Return Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {filteredAssets.map((asset) => (
                    <TableRow 
                      key={asset._id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8fafc' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                        {toSentenceCase(asset.name)}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>
                        {toSentenceCase(asset.category)}
                      </TableCell>
                      <TableCell sx={{ color: '#2563eb' }}>
                        {toSentenceCase(asset.currentEmployee) || 'None'}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>
                        {asset.allottedDate 
                          ? new Date(asset.allottedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) 
                          : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>
                        {asset.returnDate 
                          ? new Date(asset.returnDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) 
                          : 'N/A'}
                      </TableCell>                               
                      <TableCell>
                        <Chip 
                          label={asset.status}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontWeight: 500,
                            borderColor: getStatusColor(asset.status),
                            color: getStatusTextColor(asset.status),
                            backgroundColor: getStatusBgColor(asset.status)
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            onClick={() => handleEditClick(asset)}
                            size="small"
                            sx={{ 
                              color: '#1976d2',
                              '&:hover': { 
                                backgroundColor: '#e3f2fd',
                                transform: 'translateY(-1px)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(asset._id)}
                            size="small"
                            sx={{ 
                              color: '#ef4444',
                              '&:hover': { 
                                backgroundColor: '#fee2e2',
                                transform: 'translateY(-1px)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}                </TableBody>
              </Table>
            </Box>
        </Paper>

        {/* Add Asset Modal */}
        <Dialog 
          open={isAddModalOpen} 
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: '700px',
              maxWidth: '90vw',
              borderRadius: '20px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
              padding: '24px 32px',
              position: 'relative'
            }}
          >
            Add New Asset
            <IconButton
              onClick={() => setIsAddModalOpen(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white'
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: '32px' }}>
            <form onSubmit={handleAddAsset}>
              <Stack spacing={3} sx={{mt:2}}>
                <TextField
                  label="Asset Name"
                  name="name"
                  value={newAssetData.name}
                  onChange={(e) => setNewAssetData({ ...newAssetData, name: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={newAssetData.category}
                    onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value })}
                    required
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="Hardware">Hardware</MenuItem>
                    <MenuItem value="Software">Software</MenuItem>
                    <MenuItem value="Furniture">Furniture</MenuItem>
                    <MenuItem value="Office Equipment">Office Equipment</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newAssetData.status}
                    onChange={(e) => setNewAssetData({ ...newAssetData, status: e.target.value })}
                    required
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="In Use">In Use</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  </Select>
                </FormControl>


                <TextField
                  label="Current Employee"
                  name="currentEmployee"
                  value={newAssetData.currentEmployee}
                  onChange={(e) => setNewAssetData({ ...newAssetData, currentEmployee: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <TextField
                  label="Previous Employees"
                  name="previousEmployees"
                  value={newAssetData.previousEmployees.join(", ")}
                  onChange={handlePreviousEmployeesChange}
                  helperText="Enter names separated by commas"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <TextField
                  type="date"
                  label="Allotted Date"
                  name="allottedDate"
                  value={newAssetData.allottedDate}
                  onChange={(e) => setNewAssetData({ ...newAssetData, allottedDate: e.target.value })}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <TextField
                  type="date"
                  label="Return Date"
                  name="returnDate"
                  value={newAssetData.returnDate}
                  onChange={(e) => setNewAssetData({ ...newAssetData, returnDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                  helperText="Select the expected return date (if applicable)"
                />



                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button
                    onClick={() => setIsAddModalOpen(false)}
                    sx={{
                      border: '2px solid #1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        border: '2px solid #64b5f6',
                        backgroundColor: '#e3f2fd',
                      },
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                      },
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      fontWeight: 600
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Asset Modal */}
        <Dialog 
          open={!!editingAssetId} 
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: '700px',
              maxWidth: '90vw',
              borderRadius: '20px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
              padding: '24px 32px',
              position: 'relative'
            }}
          >
            Edit Asset
            <IconButton
              onClick={() => setEditingAssetId(null)}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white'
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: '32px' }}>
            <form onSubmit={handleUpdate}>
              <Stack spacing={3} sx={{mt:2}}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    required
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="In Use">In Use</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Returned">Returned</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Current Employee"
                  value={editData.currentEmployee}
                  onChange={(e) => setEditData({ ...editData, currentEmployee: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <TextField
                  type="date"
                  label="Allotted Date"
                  value={editData.allottedDate}
                  onChange={(e) => setEditData({ ...editData, allottedDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <TextField
                  type="date"
                  label="Return Date"
                  value={editData.returnDate}
                  onChange={(e) => setEditData({ ...editData, returnDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button
                    onClick={() => setEditingAssetId(null)}
                    sx={{
                      border: '2px solid #1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        border: '2px solid #64b5f6',
                        backgroundColor: '#e3f2fd',
                      },
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                      },
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      fontWeight: 600
                    }}
                  >
                    Update
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AssetHistory;
