import React, { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../api/assetHistory';
import { 
  Container, Paper, Typography, TextField, IconButton, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Modal, Button, Select, MenuItem, InputAdornment
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  AddCircle as AddCircleIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Add toSentenceCase helper function at the top
const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AssetHistory = () => {
  const [assets, setAssets] = useState([]);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [editData, setEditData] = useState({ status: '', returnDate: '' });
  const [newAssetData, setNewAssetData] = useState({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching asset history:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleEditClick = (asset) => {
    setEditingAssetId(asset._id);
    setEditData({
      status: asset.status,
      returnDate: asset.returnDate ? new Date(asset.returnDate).toISOString().split('T')[0] : '',
    });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...newAssetData,
        assetName: toSentenceCase(newAssetData.assetName),
        category: toSentenceCase(newAssetData.category)
      };
      await createAsset(formattedData);
      fetchAssets();
      setNewAssetData({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding new asset:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAsset(editingAssetId, editData);
      setEditingAssetId(null);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
          Asset History
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
  fullWidth
  variant="outlined"
  placeholder="Search by name, status or category"
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
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setIsAddModalOpen(true)}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Add New Asset
            </Button>
          </motion.div>
        </Box>

        <Paper elevation={1} sx={{ overflow: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Asset Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Allotted Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Return Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <motion.tr
                      key={asset._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      component={motion.tr}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                    >
                      <TableCell>{toSentenceCase(asset.assetName)}</TableCell>
                      <TableCell>{toSentenceCase(asset.category)}</TableCell>
                      <TableCell>{new Date(asset.allottedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{asset.returnDate ? new Date(asset.returnDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{asset.status}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </Box>
        </Paper>

        {/* Add Asset Modal */}
        <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Asset</Typography>
            <form onSubmit={handleAddAsset}>
              <TextField
                fullWidth
                label="Asset Name"
                value={newAssetData.assetName}
                onChange={(e) => setNewAssetData({ 
                  ...newAssetData, 
                  assetName: toSentenceCase(e.target.value) 
                })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Category"
                value={newAssetData.category}
                onChange={(e) => setNewAssetData({ 
                  ...newAssetData, 
                  category: toSentenceCase(e.target.value) 
                })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Allotted Date"
                value={newAssetData.allottedDate}
                onChange={(e) => setNewAssetData({ ...newAssetData, allottedDate: e.target.value })}
                sx={{ mb: 2 }}
                required
                InputLabelProps={{ shrink: true }}
              />
              <Select
  fullWidth
  value={newAssetData.status}
  onChange={(e) => setNewAssetData({ ...newAssetData, status: e.target.value })}
  sx={{ mb: 2 }}
  required
  displayEmpty
>
  <MenuItem value="" disabled>Select Asset Status</MenuItem>
  <MenuItem value="In Use">In Use</MenuItem>
  <MenuItem value="Returned">Returned</MenuItem>
  <MenuItem value="Under Service">Under Service</MenuItem>
  <MenuItem value="Available">Available</MenuItem>
</Select>
              <TextField
                fullWidth
                type="date"
                label="Return Date"
                value={newAssetData.returnDate}
                onChange={(e) => setNewAssetData({ ...newAssetData, returnDate: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button variant="contained" type="submit">Submit</Button>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Edit Asset Modal */}
        <Modal open={!!editingAssetId} onClose={() => setEditingAssetId(null)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>Edit Asset</Typography>
            <form onSubmit={handleUpdate}>
            <Select
  fullWidth
  value={editData.status}
  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
  sx={{ mb: 2 }}
  displayEmpty
>
  <MenuItem value="" disabled>Select Asset Status</MenuItem>
  <MenuItem value="In Use">In Use</MenuItem>
  <MenuItem value="Returned">Returned</MenuItem>
  <MenuItem value="Under Service">Under Service</MenuItem>
  <MenuItem value="Available">Available</MenuItem>
</Select>
              <TextField
                fullWidth
                type="date"
                label="Return Date"
                value={editData.returnDate}
                onChange={(e) => setEditData({ ...editData, returnDate: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setEditingAssetId(null)}>Cancel</Button>
                <Button variant="contained" type="submit">Update</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Paper>
    </Container>
  );
};

export default AssetHistory;