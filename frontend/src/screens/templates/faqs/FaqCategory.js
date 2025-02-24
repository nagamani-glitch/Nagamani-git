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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${apiBaseURL}/api/faqCategories`);
      setCategories(data);
    } catch (err) {
      console.error(
        "Error fetching FAQ categories:",
        err.response?.data || err.message
      );
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
      if (editingCategoryId) {
        await axios.put(
          `${apiBaseURL}/api/faqCategories/${editingCategoryId}`,
          formData
        );
        setEditingCategoryId(null);
      } else {
        await axios.post(`${apiBaseURL}/api/faqCategories`, formData);
      }
      fetchCategories();
      setIsAddModalOpen(false);
      setFormData({ title: "", description: "" });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseURL}/api/faqCategories/${id}`);
      fetchCategories();
      setShowActions(null);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const openEditModal = (category) => {
    setFormData({ title: category.title, description: category.description });
    setEditingCategoryId(category._id);
    setIsAddModalOpen(true);
    setShowActions(null);
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
              FAQ Categories
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  width: "300px",
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
                }}
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
                Create Category
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={3}>
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
                                  onClick={() => handleDelete(category._id)}
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

                      <Typography variant="h6" sx={{ mb: 2 }}>
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "text.secondary" }}
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

          <DialogContent sx={{ padding: "32px" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {errorMessage && (
                  <Alert severity="error" sx={{ borderRadius: "8px" }}>
                    {errorMessage}
                  </Alert>
                )}

                <TextField
                  label="Category Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
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
                    onClick={() => setIsAddModalOpen(false)}
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
                    type="submit"
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
                    {editingCategoryId ? "Update" : "Create"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>

        {/* <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                sx={{ mb: 3 }}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit">
                                    {editingCategoryId ? 'Update' : 'Create'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal> */}
      </Paper>
    </Container>
  );
}
