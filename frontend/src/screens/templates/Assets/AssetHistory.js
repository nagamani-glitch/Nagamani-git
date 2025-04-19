import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Table, TableBody, TableCell, TableHead, TableRow,
    Modal, Button, Select, MenuItem, InputAdornment, Stack, Chip, Dialog, DialogContent, DialogTitle,FormControl,InputLabel,
    TableContainer, alpha, styled, Divider, useTheme
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

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
  padding: theme.spacing(2),
  whiteSpace: "nowrap",
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transition: "background-color 0.2s ease",
  },
  // Hide last border
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));
   
const AssetHistory = () => {
    const theme = useTheme();
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
    };
    
    const handleUpdate = async (e) => {
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
    };
    
    const filteredAssets = assets.filter(asset =>
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
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              color: theme.palette.primary.main,
              fontWeight: 600,
              letterSpacing: 0.5,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Asset History
          </Typography>

          <Paper 
            elevation={3}
            sx={{ 
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              mb: 3
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              sx={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                placeholder="Search by name, status, category or employee" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  width: { xs: "100%", sm: "350px" },
                  marginRight: { xs: 0, sm: "auto" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                onClick={() => setIsAddModalOpen(true)}
                startIcon={<Add />}
                sx={{
                  height: { xs: "auto", sm: 50 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  },
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                }}
              >
                Add New Asset
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Filter buttons for asset status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            mb: 2,
          }}
        >
          <Button
            sx={{
              color: "green",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setSearchTerm("In Use")}
          >
            ● In Use
          </Button>
          <Button
            sx={{
              color: "blue",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setSearchTerm("Available")}
          >
            ● Available
          </Button>
          <Button
            sx={{
              color: "orange",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setSearchTerm("Under Maintenance")}
          >
            ● Under Maintenance
          </Button>
          <Button
            sx={{
              color: "gray",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setSearchTerm("")}
          >
            ● All Assets
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

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

        <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: 350, sm: 400, md: 450 },
          overflowY: "auto",
          overflowX: "auto",
          mx: 0,
          borderRadius: 2,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          mb: 4,
          "& .MuiTableContainer-root": {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: 8,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ minWidth: 180 }}>Asset Name</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 150 }}>Category</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 180 }}>Current Employee</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 130 }}>Allotted Date</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 130 }}>Return Date</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 120 }}>Status</StyledTableCell>
              <StyledTableCell align="center" sx={{ minWidth: 100 }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <StyledTableRow key={asset._id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#1976d2", // Fixed blue color instead of theme palette
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      flexShrink: 0,
                    }}
                    
                    >
                      {asset.name?.[0] || "A"}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#111" }}>
                      {toSentenceCase(asset.name)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {toSentenceCase(asset.category)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#2563eb" }}>
                    {toSentenceCase(asset.currentEmployee) || 'None'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {asset.allottedDate 
                      ? new Date(asset.allottedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) 
                      : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {asset.returnDate 
                      ? new Date(asset.returnDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) 
                      : 'N/A'}
                  </Typography>
                </TableCell>                               
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                      backgroundColor:
                        asset.status === "Available"
                          ? alpha("#4caf50", 0.1)
                          : asset.status === "In Use"
                          ? alpha("#1976d2", 0.1)
                          : alpha("#ff9800", 0.1),
                      color:
                        asset.status === "Available"
                          ? "#2e7d32"
                          : asset.status === "In Use"
                          ? "#1565c0"
                          : "#e65100",
                    }}
                  >
                    {asset.status}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton 
                      onClick={() => handleEditClick(asset)}
                      size="small"
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        },
                        color: "#1976d2",
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(asset._id)}
                      size="small"
                      sx={{ 
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.2),
                        },
                        color: "#ef4444",
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
            {filteredAssets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No assets found matching your search criteria.
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setSearchTerm("")}
                    sx={{ mt: 1 }}
                  >
                    Clear search
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

        <DialogContent sx={{ padding: '32px', backgroundColor: "#f8fafc" }}>
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
                    backgroundColor: "white",
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
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: "white"
                  }}
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
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: "white"
                  }}
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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

        <DialogContent sx={{ padding: '32px', backgroundColor: "#f8fafc" }}>
          <form onSubmit={handleUpdate}>
            <Stack spacing={3} sx={{mt:2}}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  required
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: "white"
                  }}
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
                    backgroundColor: "white",
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
    </Box>
  );
};

export default AssetHistory;

