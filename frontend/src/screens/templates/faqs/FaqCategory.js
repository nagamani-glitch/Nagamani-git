import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Button,
  Modal,
  Card,
  CardContent,
  Grid,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  DialogActions,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Add,
  Search,
  Close,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function FaqCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiBaseURL}/api/faqCategories`);
      setCategories(data);
    } catch (err) {
      console.error(
        "Error fetching FAQ categories:",
        err.response?.data || err.message
      );
      showSnackbar("Error fetching FAQ categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = toSentenceCase(value);
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage("Category title is required.");
      return;
    }

    try {
      setLoading(true);
      if (editingCategoryId) {
        await axios.put(
          `${apiBaseURL}/api/faqCategories/${editingCategoryId}`,
          formData
        );
        showSnackbar("Category updated successfully");
        setEditingCategoryId(null);
      } else {
        await axios.post(`${apiBaseURL}/api/faqCategories`, formData);
        showSnackbar("Category created successfully");
      }
      fetchCategories();
      setIsAddModalOpen(false);
      setFormData({ title: "", description: "" });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to save category.");
      showSnackbar("Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    setShowActions(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      await axios.delete(
        `${apiBaseURL}/api/faqCategories/${categoryToDelete._id}`
      );
      fetchCategories();
      showSnackbar("Category deleted successfully");
    } catch (err) {
      console.error("Error deleting category:", err);
      showSnackbar("Error deleting category", "error");
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const openEditModal = (category) => {
    setFormData({ title: category.title, description: category.description });
    setEditingCategoryId(category._id);
    setIsAddModalOpen(true);
    setShowActions(null);
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: isMobile ? 1 : 3 }}>
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

      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: isMobile ? "16px" : isTablet ? "20px 24px" : "24px 32px",
            marginBottom: "24px",
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={isMobile ? 2 : 0}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 600,
                background: "#1976d2",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: isMobile ? 1 : 0,
              }}
            >
              FAQ Categories
            </Typography>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={isMobile ? 1 : 2}
              alignItems={isMobile ? "stretch" : "center"}
              width={isMobile ? "100%" : "auto"}
            >
              <TextField
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth={isMobile}
                sx={{
                  width: isMobile ? "100%" : isTablet ? "200px" : "300px",
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
                onClick={() => {
                  setEditingCategoryId(null);
                  setIsAddModalOpen(true);
                  setFormData({ title: "", description: "" });
                  setErrorMessage(null);
                }}
                startIcon={<Add />}
                fullWidth={isMobile}
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
                Create Category
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={isMobile ? 2 : 3}>
          {categories
            .filter((category) =>
              category?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card sx={{ position: "relative", height: "100%" }}>
                    <CardContent>
                      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActions(
                              showActions === category._id ? null : category._id
                            );
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>

                        <AnimatePresence>
                          {showActions === category._id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: "100%",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                zIndex: 10,
                              }}
                            >
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                  onClick={() => openEditModal(category)}
                                  sx={{
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#2563eb" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteClick(category)}
                                  sx={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#dc2626" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>

                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        sx={{
                          mb: 2,
                          pr: 5, // Add padding to prevent text from going under the more icon
                          wordBreak: "break-word",
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          color: "text.secondary",
                          wordBreak: "break-word",
                        }}
                      >
                        {category.description}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate(`/Dashboards/faq/${category._id}`)
                        }
                        sx={{
                          mt: "auto",
                          backgroundColor: "#3b82f6",
                          "&:hover": { backgroundColor: "#2563eb" },
                          width: isMobile ? "100%" : "auto",
                        }}
                      >
                        View FAQs
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
        </Grid>

        {/* Add New Category Modal */}
        <Dialog
          open={isAddModalOpen}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              width: isMobile ? "100%" : isTablet ? "600px" : "700px",
              maxWidth: "90vw",
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
            {editingCategoryId ? "Edit Category" : "Add New Category"}
            <IconButton
              onClick={() => setIsAddModalOpen(false)}
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

          <DialogContent sx={{ padding: isMobile ? "20px" : "32px" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {errorMessage && (
                  <Alert severity="error" sx={{ borderRadius: "8px" }}>
                    {errorMessage}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Category Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  justifyContent={isMobile ? "stretch" : "flex-end"}
                  sx={{ mt: 4 }}
                >
                  <Button
                    onClick={() => setIsAddModalOpen(false)}
                    fullWidth={isMobile}
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
                      order: isMobile ? 1 : 0,
                      mt: isMobile ? 1 : 0,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    fullWidth={isMobile}
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
                      order: isMobile ? 0 : 1,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : editingCategoryId ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
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
              Are you sure you want to delete this FAQ category?
            </Alert>
            {categoryToDelete && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                <Typography variant="body1" fontWeight={600} color="#2c3e50">
                  Category: {categoryToDelete.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Description: {categoryToDelete.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 2, fontWeight: 500 }}
                >
                  Note: All FAQs in this category will also be deleted.
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
            }}
          >
            <Button
              onClick={handleCloseDeleteDialog}
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
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={loading}
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
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
