import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAsset from './AddAsset';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField, Box, Typography, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const AssetView = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAssets = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/assets`)
      .then((response) => {
        setAssets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching assets:', error);
        setError('Failed to load assets');
        setLoading(false);
      });
  };

  const handleAddAssetClick = () => {
    setEditAsset(null);
    setModalOpen(true);
  };

  const handleEditClick = (asset) => {
    setEditAsset(asset);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchTerm('');
  };

  const filteredAssets = assets.filter((asset) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchTermLower) ||
      asset.category.toLowerCase().includes(searchTermLower) ||
      asset.status.toLowerCase().includes(searchTermLower) ||
      (asset.currentEmployee && asset.currentEmployee.toLowerCase().includes(searchTermLower))
    );
  });

  const handleDelete = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setLoading(true);
      axios
        .delete(`${API_URL}/api/assets/${assetId}`)
        .then(() => {
          fetchAssets();
        })
        .catch((error) => {
          console.error('Error deleting asset:', error);
          setError('Failed to delete asset');
          setLoading(false);
        });
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
          Assets Category
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
            placeholder="Search by name, category, status or current employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={handleAddAssetClick}
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
              <Typography sx={{ ml: 1 }}>Add Asset</Typography>
            </IconButton>
          </motion.div>
        </Box>

        {loading && <Typography sx={{ textAlign: 'center', my: 2 }}>Loading assets...</Typography>}
        {error && (
          <Typography sx={{ 
            bgcolor: '#fee2e2', 
            color: '#dc2626', 
            p: 2, 
            borderRadius: 1, 
            mb: 2 
          }}>
            {error}
          </Typography>
        )}

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
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Name</th>
                    <th style={{ padding: '16px', backgroundColor: '#f8fafc', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '16px', backgroundColor: '#f8fafc', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '16px', backgroundColor: '#f8fafc', textAlign: 'left' }}>Current Employee</th>
                    <th style={{ padding: '16px', backgroundColor: '#f8fafc', textAlign: 'left' }}>Previous Employees</th>
                    <th style={{ padding: '16px', backgroundColor: '#f8fafc', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
  {filteredAssets.map((asset) => (
    <motion.tr
      key={asset._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: '#f8fafc' }}
      style={{ transition: 'background-color 0.2s' }}
    >
      <td style={{ padding: '16px' }}>{toSentenceCase(asset.name)}</td>
      <td style={{ padding: '16px' }}>{toSentenceCase(asset.category)}</td>
      <td style={{ padding: '16px' }}>{asset.status}</td>
      <td style={{ padding: '16px' }}>{toSentenceCase(asset.currentEmployee) || 'None'}</td>
      <td style={{ padding: '16px' }}>
        {asset.previousEmployees.map(emp => toSentenceCase(emp)).join(', ') || 'None'}
      </td>
      <td style={{ 
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <IconButton
          onClick={() => handleEditClick(asset)}
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            '&:hover': { backgroundColor: '#2563eb' }
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(asset._id)}
          sx={{
            backgroundColor: '#ef4444',
            color: 'white',
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

        {isModalOpen && (
          <AddAsset           
           onClose={handleCloseModal}
            refreshAssets={fetchAssets}
            editAsset={editAsset}
          />
        )}
      </Paper>
    </Container>
  );
};

export default AssetView;