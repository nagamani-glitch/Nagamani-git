import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Dialog, DialogTitle, DialogContent, TableCell, Chip, TableHead, TableRow, TableBody, Table, IconButton, InputAdornment, TextField, Box, Typography, Container, Paper, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Add, Edit, Delete, Close } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AssetBatch() {
  const [assetBatches, setAssetBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    description: '',
    numberOfAssets: ''
  });
  const [editBatchId, setEditBatchId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssetBatches();
  }, []);

  const fetchAssetBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/asset-batches`);
      setAssetBatches(response.data);
    } catch (err) {
      console.error('Error fetching asset batches:', err.message);
      setError('Failed to fetch asset batches. Please check the server.');
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(`${API_URL}/api/asset-batches/search?q=${e.target.value}`);
      setAssetBatches(response.data);
    } catch (err) {
      console.error('Error during search:', err.message);
      setError('Failed to fetch search results.');
    }
  };

  const toSentenceCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const transformedValue = name === 'numberOfAssets' ? value : toSentenceCase(value);
    setFormData({ ...formData, [name]: transformedValue });
  };

  useEffect(() => {
    const handleBatchesUpdated = () => {
      console.log('Batches updated event received, refreshing batches list');
      fetchAssetBatches();
    };
    
    window.addEventListener('batchesUpdated', handleBatchesUpdated);
    
    const lastUpdate = localStorage.getItem('batchesUpdated');
    if (lastUpdate) {
      const currentTimestamp = Date.now();
      const lastUpdateTimestamp = parseInt(lastUpdate, 10);
      if (currentTimestamp - lastUpdateTimestamp < 5000) {
        fetchAssetBatches();
      }
    }
    
    return () => {
      window.removeEventListener('batchesUpdated', handleBatchesUpdated);
    };
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/asset-batches/${editBatchId}`, formData);
        setAssetBatches(assetBatches.map(batch => batch._id === editBatchId ? { ...batch, ...formData } : batch));
        setIsEditing(false);
        setEditBatchId(null);
      } else {
        const response = await axios.post(`${API_URL}/api/asset-batches`, formData);
        setAssetBatches([...assetBatches, response.data]);
      }
      setFormData({ batchNumber: '', description: '', numberOfAssets: '' });
      setShowForm(false);
      
      const timestamp = Date.now().toString();
      localStorage.setItem('batchesUpdated', timestamp);
      
      const event = new CustomEvent('batchesUpdated', { detail: { timestamp } });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error creating/updating asset batch:', err.message);
      setError('Failed to save asset batch. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/asset-batches/${id}`);
      setAssetBatches(assetBatches.filter(batch => batch._id !== id));
      
      const timestamp = Date.now().toString();
      localStorage.setItem('batchesUpdated', timestamp);
      
      const event = new CustomEvent('batchesUpdated', { detail: { timestamp } });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error deleting asset batch:', err.message);
      setError('Failed to delete asset batch. Please try again.');
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      batchNumber: batch.batchNumber,
      description: batch.description,
      numberOfAssets: batch.numberOfAssets
    });
    setEditBatchId(batch._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreateAssetsFromBatch = async (batch) => {
    try {
      const assetNames = [];
      for (let i = 1; i <= batch.numberOfAssets; i++) {
        assetNames.push(`${batch.batchNumber}-Asset-${i}`);
      }
      await axios.post(`${API_URL}/api/assets/from-batch`, {
        batchId: batch._id,
        assetNames,
        category: 'Hardware'
      });
      
      const timestamp = Date.now().toString();
      localStorage.setItem('assetsUpdated', timestamp);
      
      const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
      window.dispatchEvent(event);
      
      alert(`${batch.numberOfAssets} assets created successfully from batch ${batch.batchNumber}`);
    } catch (err) {
      console.error('Error creating assets from batch:', err.message);
      setError('Failed to create assets from batch. Please try again.');
    }
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
              background: "#1976d2",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Asset Batch
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField 
                placeholder="Search asset batch..." 
                value={searchQuery}
                onChange={handleSearch}
                size="small"
                sx={{
                  width: '300px',
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
                onClick={() => {
                  setFormData({ batchNumber: '', description: '', numberOfAssets: '' });
                  setShowForm(true);
                  setIsEditing(false);
                }}
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
                Create Batch
              </Button>
            </Stack>
          </Stack>
        </Box>

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
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Batch Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Number of Assets</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetBatches.map((batch) => (
                  <TableRow 
                    key={batch._id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f8fafc' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                      {batch.batchNumber}
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#64748b',
                      maxWidth: '400px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {batch.description}
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#64748b',
                      maxWidth: '400px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {batch.numberOfAssets}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton 
                          onClick={() => handleEdit(batch)}
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
                          onClick={() => handleDelete(batch._id)}
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
                        <IconButton 
                          onClick={() => handleCreateAssetsFromBatch(batch)}
                          size="small"
                          sx={{ 
                            color: '#10b981',
                            '&:hover': { 
                              backgroundColor: '#ecfdf5',
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                          title="Create Assets from Batch"
                        >
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
        <Dialog 
          open={showForm} 
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
            {isEditing ? 'Edit Asset Batch' : 'Create Asset Batch'}
            <IconButton
              onClick={() => setShowForm(false)}
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
            <form onSubmit={handleCreateBatch}>
              <Stack spacing={3} sx={{mt:2}}>
                <TextField
                  label="Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
                <TextField
                  label="Number of Assets"
                  name="numberOfAssets"
                  type="number"
                  value={formData.numberOfAssets}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button
                    onClick={() => setShowForm(false)}
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
                    {isEditing ? 'Update' : 'Save'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default AssetBatch;