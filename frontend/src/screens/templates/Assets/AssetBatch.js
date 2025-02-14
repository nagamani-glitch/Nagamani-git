import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField, Box, Typography, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

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
    } catch (err) {
      console.error('Error creating/updating asset batch:', err.message);
      setError('Failed to save asset batch. Please try again.');
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/asset-batches/${id}`);
      setAssetBatches(assetBatches.filter(batch => batch._id !== id));
    } catch (err) {
      console.error('Error deleting asset batch:', err.message);
      setError('Failed to delete asset batch. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            color: '#1a1a1a' 
          }}
        >
          Asset Batch
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search asset batch..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              maxWidth: '70%',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <IconButton
              onClick={() => {
                setFormData({ batchNumber: '', description: '', numberOfAssets: '' });
                setShowForm(true);
                setIsEditing(false);
              }}
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: 2,
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <AddCircleIcon />
              <Typography sx={{ ml: 1 }}>Create Asset Batch</Typography>
            </IconButton>
          </motion.div>
        </Box>

        <Paper elevation={1} sx={{ overflow: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: '0 8px' 
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '16px', 
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Batch Number</th>
                    <th style={{ padding: '16px', backgroundColor: '#f1f5f9', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '16px', backgroundColor: '#f1f5f9', textAlign: 'left' }}>Number of Assets</th>
                    <th style={{ padding: '16px', backgroundColor: '#f1f5f9', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assetBatches.map((batch) => (
                    <motion.tr
                      key={batch._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: '#f1f5f9' }}
                      style={{ transition: 'background-color 0.2s' }}
                    >
                      <td style={{ padding: '16px' }}>{batch.batchNumber}</td>
                      <td style={{ padding: '16px' }}>{batch.description}</td>
                      <td style={{ padding: '16px' }}>{batch.numberOfAssets}</td>
                      <td style={{ 
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <IconButton
                          onClick={() => handleEdit(batch)}
                          sx={{
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            '&:hover': { backgroundColor: '#2563eb' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(batch._id)}
                          sx={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            '&:hover': { backgroundColor: '#dc2626' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </Box>
        </Paper>

        {showForm && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              width: '400px',
              backgroundColor: '#ffffff'
            }}>
              <form onSubmit={handleCreateBatch}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {isEditing ? 'Edit Asset Batch' : 'Create Asset Batch'}
                </Typography>
                
                <TextField
                  fullWidth
                  label="Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Number of Assets"
                  name="numberOfAssets"
                  value={formData.numberOfAssets}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => setShowForm(false)}
                    sx={{
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      '&:hover': { backgroundColor: '#d1d5db' }
                    }}
                  >
                    Cancel
                  </IconButton>
                  <IconButton
                    type="submit"
                    sx={{
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#2563eb' }
                    }}
                  >
                    {isEditing ? 'Update' : 'Submit'}
                  </IconButton>
                </Box>
              </form>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AssetBatch;