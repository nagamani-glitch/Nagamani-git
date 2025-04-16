import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
//import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/policies");
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      showSnackbar("Error fetching policies", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredPolicies = policies.filter((policy) =>
    policy.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedPolicy({ title: "", content: "" });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (policy) => {
    setPolicyToDelete(policy);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!policyToDelete) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/policies/${policyToDelete._id}`);
      setPolicies(policies.filter((policy) => policy._id !== policyToDelete._id));
      showSnackbar("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy:", error);
      showSnackbar("Error deleting policy", "error");
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPolicy(null);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isEditMode) {
        if (selectedPolicy._id) {
          // Update existing policy
          const response = await axios.put(
            `http://localhost:5000/api/policies/${selectedPolicy._id}`,
            selectedPolicy
          );
          setPolicies(
            policies.map((p) =>
              p._id === selectedPolicy._id ? response.data : p
            )
          );
          showSnackbar("Policy updated successfully");
        } else {
          // Create new policy
          const response = await axios.post(
            "http://localhost:5000/api/policies",
            selectedPolicy
          );
          setPolicies([...policies, response.data]);
          showSnackbar("Policy created successfully");
        }
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving policy:", error);
      showSnackbar("Error saving policy", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box sx={{ padding: isMobile ? "16px" : "24px" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : 0}
      >
        <Typography 
          variant="h3" 
          fontWeight="800" 
          fontSize={isMobile ? "1.25rem" : "1.5rem"}
        >
          Policies
        </Typography>
        <Box 
          display="flex" 
          alignItems={isMobile ? "stretch" : "center"}
          flexDirection={isMobile ? "column" : "row"}
          width={isMobile ? "100%" : "auto"}
          gap={isMobile ? 1 : 0}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ 
              marginRight: isMobile ? 0 : "16px",
              width: isMobile ? "100%" : "auto",
              mb: isMobile ? 1 : 0
            }}
          />
          
          <Button
            variant="contained"
            color="error"
            onClick={handleCreate}
            startIcon={<AddIcon />}
            fullWidth={isMobile}
          >
            Create
          </Button>
        </Box>
      </Box>

      {loading && !isDialogOpen && !deleteDialogOpen ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredPolicies.map((policy) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={policy._id}>
              <Card
                sx={{ 
                  height: "100%", 
                  padding: isMobile ? "12px" : "16px", 
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="h6">
                  <span style={{ color: "green", fontSize: "24px" }}>●</span>{" "}
                  {policy.title}
                  <IconButton
                    onClick={() => handleEdit(policy)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 40 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(policy)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Typography>
                <CardContent sx={{ height: "120px", overflowY: "auto", px: 0 }}>
                  <Typography 
                    variant="body2" 
                    component="p"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                  >
                    {policy.content}
                  </Typography>
                </CardContent>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleView(policy)}
                  sx={{ mt: 1 }}
                >
                  View Policy
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "600px",
            borderRadius: isMobile ? "0" : "20px",
            overflow: "hidden",
            margin: isMobile ? 0 : undefined,
            height: isMobile ? "100%" : undefined,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: 600,
            padding: isMobile ? "16px 20px" : "24px 32px",
            position: "relative",
          }}
        >
          {isEditMode ? "Edit Policy" : "View Policy"}
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: isMobile ? "20px" : "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              value={selectedPolicy?.title || ""}
              onChange={(e) =>
                setSelectedPolicy({ ...selectedPolicy, title: e.target.value })
              }
              disabled={!isEditMode}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1976d2",
                },
              }}
            />

            <TextField
              label="Content"
              fullWidth
              multiline
              rows={isMobile ? 10 : 4}
              variant="outlined"
              value={selectedPolicy?.content || ""}
              onChange={(e) =>
                setSelectedPolicy({
                  ...selectedPolicy,
                  content: e.target.value,
                })
              }
              disabled={!isEditMode}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: isMobile ? "16px 20px" : "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            onClick={handleDialogClose}
            fullWidth={isMobile}
            sx={{
              border: "2px solid #1976d2",
              color: "#1976d2",
              "&:hover": {
                border: "2px solid #64b5f6",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
              },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
              order: isMobile ? 1 : 0,
            }}
          >
            Cancel
          </Button>

          {isEditMode && (
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loading}
              fullWidth={isMobile}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                fontSize: "0.95rem",
                textTransform: "none",
                padding: "8px 32px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                order: isMobile ? 0 : 1,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "500px" },
            maxWidth: "500px",
            borderRadius: "20px",
            overflow: "hidden",
            margin: { xs: "8px", sm: "32px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #ff7961)",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteIcon color="white" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent 
          sx={{
            padding: { xs: "24px", sm: "32px" },
            backgroundColor: "#f8fafc",
            paddingTop: { xs: "24px", sm: "32px" },
          }}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this policy?
          </Alert>
          {policyToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#2c3e50">
                Policy: {policyToDelete.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {policyToDelete.content.length > 100 
                  ? `${policyToDelete.content.substring(0, 100)}...` 
                  : policyToDelete.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{
            padding: { xs: "16px 24px", sm: "24px 32px" },
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            fullWidth={isMobile}
            sx={{
              border: "2px solid #1976d2",
              color: "#1976d2",
              "&:hover": {
                border: "2px solid #64b5f6",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
              },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
              order: isMobile ? 1 : 0,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
            fullWidth={isMobile}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              background: "linear-gradient(45deg, #f44336, #ff7961)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
              },
              order: isMobile ? 0 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Policies;

