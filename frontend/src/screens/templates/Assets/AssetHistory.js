import React, { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../api/assetHistory';
import { 
  Container, Paper, Typography, TextField, IconButton, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Modal, Button, Select, MenuItem, InputAdornment, Stack, Chip, Dialog, DialogContent, DialogTitle,FormControl,InputLabel
} from '@mui/material';
import { 
  Edit, Delete,
 Search, Add, Close
} from '@mui/icons-material';




// const AssetHistory = () => {
//   const [assets, setAssets] = useState([]);
//   const [editingAssetId, setEditingAssetId] = useState(null);
//   const [editData, setEditData] = useState({ status: '', returnDate: '' });
//   const [newAssetData, setNewAssetData] = useState({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     try {
//       const response = await getAssets();
//       setAssets(response.data);
//     } catch (error) {
//       console.error('Error fetching asset history:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteAsset(id);
//       fetchAssets();
//     } catch (error) {
//       console.error('Error deleting asset:', error);
//     }
//   };

//   const handleEditClick = (asset) => {
//     setEditingAssetId(asset._id);
//     setEditData({
//       status: asset.status,
//       returnDate: asset.returnDate ? new Date(asset.returnDate).toISOString().split('T')[0] : '',
//     });
//   };

//   const handleAddAsset = async (e) => {
//     e.preventDefault();
//     try {
//       const formattedData = {
//         ...newAssetData,
//         assetName: toSentenceCase(newAssetData.assetName),
//         category: toSentenceCase(newAssetData.category)
//       };
//       await createAsset(formattedData);
//       fetchAssets();
//       setNewAssetData({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
//       setIsAddModalOpen(false);
//     } catch (error) {
//       console.error('Error adding new asset:', error);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateAsset(editingAssetId, editData);
//       setEditingAssetId(null);
//       fetchAssets();
//     } catch (error) {
//       console.error('Error updating asset:', error);
//     }
//   };

//   const filteredAssets = assets.filter(asset =>
//     asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     asset.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     asset.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     borderRadius: 2,
//     boxShadow: 24,
//     p: 4,
//   };

// Add toSentenceCase helper function at the top  HISTORY
const  toSentenceCase= (str) => {
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
          assetName: (newAssetData.assetName),
          category: (newAssetData.category)
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
            // background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            background: '#1976d2',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Asset History
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField 
                placeholder="Search by name, status or category" 
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


        <Paper elevation={1} sx={{ overflow: 'auto' }}>
          {/* <Box sx={{ minWidth: 800 }}>
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
                      <TableCell>{(asset.assetName)}</TableCell>
                      <TableCell>{(asset.category)}</TableCell>
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
          </Box>            */}

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
                        {(asset.assetName)}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                        {(asset.category)}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                        {new Date(asset.allottedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                        {asset.returnDate ? new Date(asset.returnDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={asset.status}
                            variant="outlined"
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                                borderColor: 
                                    asset.status === 'In Use' ? '#22c55e' :
                                    asset.status === 'Available' ? '#3b82f6' :
                                    asset.status === 'Under Service' ? '#f59e0b' : '#e2e8f0',
                                color: 
                                    asset.status === 'In Use' ? '#16a34a' :
                                    asset.status === 'Available' ? '#2563eb' :
                                    asset.status === 'Under Service' ? '#d97706' : '#64748b',
                                backgroundColor: 
                                    asset.status === 'In Use' ? '#f0fdf4' :
                                    asset.status === 'Available' ? '#eff6ff' :
                                    asset.status === 'Under Service' ? '#fefce8' : '#f8fafc',
                            }}
                        />
                    </TableCell>
                    <TableCell>
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
            ))}
        </TableBody>
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
        {editingAssetId ? 'Edit Asset' : 'Add New Asset'}
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
        <form onSubmit={editingAssetId ? handleUpdate : handleAddAsset}>
            <Stack spacing={3} sx={{mt:2}}>
                <TextField
                    label="Asset Name"
                    name="assetName"
                    value={newAssetData.assetName}
                    onChange={(e) => setNewAssetData({ ...newAssetData, assetName: e.target.value })}
                    required
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                        }
                    }}
                />

                <TextField
                    label="Category"
                    name="category"
                    value={newAssetData.category}
                    onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value })}
                    required
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                        }
                    }}
                />

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
                        <MenuItem value="Under Service">Under Service</MenuItem>
                    </Select>
                </FormControl>

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
                        {editingAssetId ? 'Update' : 'Save'}
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
                        <MenuItem value="Under Service">Under Service</MenuItem>
                        <MenuItem value="Returned">Returned</MenuItem>
                    </Select>
                </FormControl>

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


        {/* <Modal open={!!editingAssetId} onClose={() => setEditingAssetId(null)}>
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
        </Modal> */}
      </Paper>
    </Container>
  );
};

export default AssetHistory;