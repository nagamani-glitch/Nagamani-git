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
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, Add, Edit, Delete, Close } from "@mui/icons-material";

const AssetView = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  });

  const onClose = () => {
    setModalOpen(false);
    setAssetData({
      name: "",
      category: "",
      status: "",
      currentEmployee: "",
      previousEmployees: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      if (editAsset) {
        await axios.put(`${API_URL}/api/assets/${editAsset._id}`, assetData);
      } else {
        await axios.post(`${API_URL}/api/assets`, assetData);
      }
      fetchAssets();
      onClose();
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (editAsset) {
      setAssetData({
        name: editAsset.name,
        category: editAsset.category,
        status: editAsset.status,
        currentEmployee: editAsset.currentEmployee || "",
        previousEmployees: editAsset.previousEmployees || [],
      });
    }
  }, [editAsset]);

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
        console.error("Error fetching assets:", error);
        setError("Failed to load assets");
        setLoading(false);
      });
  };

  const handleAddAssetClick = () => {
    setEditAsset(null);
    setModalOpen(true);
  };

  const handleEditClick = (asset) => {
    setEditAsset(asset);
    setAssetData({
      name: asset.name,
      category: asset.category,
      status: asset.status,
      currentEmployee: asset.currentEmployee || "",
      previousEmployees: asset.previousEmployees || [],
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchTerm("");
  };

  const filteredAssets = assets.filter((asset) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchTermLower) ||
      asset.category.toLowerCase().includes(searchTermLower) ||
      asset.status.toLowerCase().includes(searchTermLower) ||
      (asset.currentEmployee &&
        asset.currentEmployee.toLowerCase().includes(searchTermLower))
    );
  });

  const handleDelete = (assetId) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setLoading(true);
      axios
        .delete(`${API_URL}/api/assets/${assetId}`)
        .then(() => {
          fetchAssets();
        })
        .catch((error) => {
          console.error("Error deleting asset:", error);
          setError("Failed to delete asset");
          setLoading(false);
        });
    }
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 2, backgroundColor: "#ffffff" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: "24px 32px",
            marginBottom: "24px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                // background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                background: "#1976d2",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Assets Category
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search by name, category, status or current employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  width: "400px",
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
                    <Search sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />

              <Button
                onClick={handleAddAssetClick}
                startIcon={<Add />}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  textTransform: "none",
                  borderRadius: "8px",
                  height: "40px",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                }}
                variant="contained"
              >
                Add Asset
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

        <Paper elevation={1} sx={{ overflow: "auto" }}>
          <Box sx={{ minWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  margin: "24px 0",
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Current Employee
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Previous Employees
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 600, color: "#475569", py: 2 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow
                        key={asset._id}
                        sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                      >
                        <TableCell sx={{ color: "#d013d1", fontWeight: 500 }}>
                          {toSentenceCase(asset.name)}
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>
                          {toSentenceCase(asset.category)}
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>
                          {toSentenceCase(asset.status)}
                        </TableCell>
                        {/* <TableCell>
                        <Chip 
                            label={asset.status}
                            variant="outlined"
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                               // borderColor: '#e2e8f0',
                                color: '#64748b',
                                backgroundColor: '#f8fafc'
                            }}
                        />
                    </TableCell> */}
                        <TableCell sx={{ color: "#2563eb" }}>
                          {toSentenceCase(asset.currentEmployee) || "None"}
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>
                          {asset.previousEmployees
                            .map((emp) => toSentenceCase(emp))
                            .join(", ") || "None"}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <IconButton
                              onClick={() => handleEditClick(asset)}
                              size="small"
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(asset._id)}
                              size="small"
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                  transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
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
            </motion.div>
          </Box>
        </Paper>

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

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={assetData.category}
                  onChange={handleChange}
                  label="Category"
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
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
      </Paper>
    </Container>
  );
};

export default AssetView;
