import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Button,
  TableCell,
  TableRow,
  TableBody,
  Chip,
  Table,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  InputAdornment,
  Divider,
  TableContainer,
  alpha,
  styled,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, Add, Edit, Delete, Close, Visibility } from "@mui/icons-material";
import AddAsset from "./AddAsset";

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

const AssetView = () => {
  const theme = useTheme();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assetData, setAssetData] = useState({
    name: "",
    category: "",
    status: "",
    currentEmployee: "",
    previousEmployees: [],
    batchId: ""
  });

  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchAssets();
    fetchBatches();

    const handleAssetsUpdated = (event) => {
      console.log('Assets updated event received, refreshing assets list');
      fetchAssets();
    };

    const handleBatchesUpdated = (event) => {
      console.log('Batches updated event received, refreshing batches list');
      fetchBatches();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'assetsUpdated') {
        console.log('Assets updated via storage event, refreshing assets list');
        fetchAssets();
      }
      if (e.key === 'batchesUpdated') {
        console.log('Batches updated via storage event, refreshing batches list');
        fetchBatches();
      }
    };

    window.addEventListener('assetsUpdated', handleAssetsUpdated);
    window.addEventListener('batchesUpdated', handleBatchesUpdated);
    window.addEventListener('storage', handleStorageChange);

    const lastAssetUpdate = localStorage.getItem('assetsUpdated');
    const lastBatchUpdate = localStorage.getItem('batchesUpdated');

    if (lastAssetUpdate) {
      const currentTimestamp = Date.now();
      const lastUpdateTimestamp = parseInt(lastAssetUpdate, 10);
      if (currentTimestamp - lastUpdateTimestamp < 5000) {
        fetchAssets();
      }
    }

    if (lastBatchUpdate) {
      const currentTimestamp = Date.now();
      const lastUpdateTimestamp = parseInt(lastBatchUpdate, 10);
      if (currentTimestamp - lastUpdateTimestamp < 5000) {
        fetchBatches();
      }
    }

    return () => {
      window.removeEventListener('assetsUpdated', handleAssetsUpdated);
      window.removeEventListener('batchesUpdated', handleBatchesUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAssets = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/assets`)
      .then((response) => {
        console.log('Assets fetched:', response.data);
        setAssets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching assets:', error);
        setError('Failed to load assets');
        setLoading(false);
      });
  };

  const fetchBatches = () => {
    axios
      .get(`${API_URL}/api/asset-batches`)
      .then((response) => {
        console.log('Batches fetched:', response.data);
        setBatches(response.data);
      })
      .catch((error) => {
        console.error('Error fetching batches:', error);
      });
  };

  const handleAddAssetClick = () => {
    setEditAsset(null);
    // Reset the assetData state when adding a new asset
    setAssetData({
      name: "",
      category: "",
      status: "Available", // Set a default status
      currentEmployee: "",
      previousEmployees: [],
      batchId: ""
    });
    setModalOpen(true);
  };

  const handleEditClick = (asset) => {
    setEditAsset(asset);
    // Populate the form with the asset's data
    setAssetData({
      name: asset.name || "",
      category: asset.category || "",
      status: asset.status || "",
      currentEmployee: asset.currentEmployee || "",
      previousEmployees: asset.previousEmployees || [],
      batchId: asset.batchId || ""
    });
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
          
          const timestamp = Date.now().toString();
          localStorage.setItem('assetsUpdated', timestamp);
          
          const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
          window.dispatchEvent(event);
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

  const onClose = () => {
    setModalOpen(false);
    setAssetData({
      name: "",
      category: "",
      status: "",
      currentEmployee: "",
      previousEmployees: [],
      batchId: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewDetails = (asset) => {
    console.log("View details for asset:", asset);
  };

  const handlePreviousEmployeesChange = (e) => {
    const employees = e.target.value.split(",").map((emp) => emp.trim());
    setAssetData((prev) => ({
      ...prev,
      previousEmployees: employees,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!assetData.name || !assetData.category || !assetData.status) {
        alert("Please fill in all required fields");
        return;
      }
    
      setLoading(true);
    
      if (editAsset) {
        await axios.put(`${API_URL}/api/assets/${editAsset._id}`, assetData);
      } else {
        await axios.post(`${API_URL}/api/assets`, assetData);
      }
    
      fetchAssets();
      setModalOpen(false);
      setLoading(false);
    
      const timestamp = Date.now().toString();
      localStorage.setItem('assetsUpdated', timestamp);
    
      const event = new CustomEvent('assetsUpdated', { detail: { timestamp } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error saving asset:", error);
      setLoading(false);
      setError("Failed to save asset: " + error.message);
    }
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
          Assets Management
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
              placeholder="Search by name, category, status or current employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "400px" },
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
              onClick={handleAddAssetClick}
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
              Add Asset
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
          onClick={() => setSearchTerm("Available")}
        >
          ● Available
        </Button>
        <Button
          sx={{
            color: "blue",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setSearchTerm("In Use")}
        >
          ● In Use
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

      {/* Enhanced Table Container */}
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
              <StyledTableCell sx={{ minWidth: 180 }}>Name</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 150 }}>Category</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 120 }}>Status</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 180 }}>Current Employee</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 200 }}>Previous Employees</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 120 }}>Batch</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 100, textAlign: "center" }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <StyledTableRow
                key={asset._id}
                hover
              >
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
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
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
                    {toSentenceCase(asset.status)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#2563eb",
                      fontWeight: asset.currentEmployee ? 500 : 400
                    }}
                  >
                    {toSentenceCase(asset.currentEmployee) || "None"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {asset.previousEmployees
                      .map((emp) => toSentenceCase(emp))
                      .join(", ") || "None"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {asset.batchId ? batches.find(b => b._id === asset.batchId)?.batchNumber || "Unknown" : "None"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(asset)}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(asset._id)}
                      sx={{
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.2),
                        },
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

      {/** Create Asset Modal **/}
      <Dialog
        open={isModalOpen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "700px",
            maxWidth: "90vw",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            position: "relative",
          }}
        >
          {editAsset ? "Edit Asset" : "Add New Asset"}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "32px" }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Asset Name"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={assetData.category}
                onChange={handleChange}
                label="Category"
                sx={{ borderRadius: "8px" }}
                required
              >
                <MenuItem value="Hardware">Hardware</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Office Equipment">Office Equipment</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Batch</InputLabel>
              <Select
                name="batchId"
                value={assetData.batchId || ""}
                onChange={handleChange}
                label="Batch"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="">No Batch</MenuItem>
                {batches.map(batch => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={assetData.status}
                onChange={handleChange}
                label="Status"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="In Use">In Use</MenuItem>
                <MenuItem value="Under Maintenance">
                  Under Maintenance
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Current Employee"
              name="currentEmployee"
              value={assetData.currentEmployee}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Previous Employees"
              name="previousEmployees"
              value={assetData.previousEmployees.join(", ")}
              onChange={handlePreviousEmployeesChange}
              helperText="Enter names separated by commas"
              fullWidth
              multiline
              rows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 4 }}
            >
              <Button
                onClick={onClose}
                sx={{
                  border: "2px solid #1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    border: "2px solid #64b5f6",
                    backgroundColor: "#e3f2fd",
                  },
                  borderRadius: "8px",
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  borderRadius: "8px",
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {editAsset ? "Update" : "Save"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssetView;
