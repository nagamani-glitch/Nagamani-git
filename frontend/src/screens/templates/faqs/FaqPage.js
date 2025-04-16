import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit,
  Delete,
  Add,
  Search,
  Close,
} from "@mui/icons-material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { ToggleButtonGroup, ToggleButton } from "@mui/lab";

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

export default function FaqPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const fetchFaqs = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiBaseURL}/api/faqs/category/${categoryId}`
      );
      setFaqs(data);
      setFilteredFaqs(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching FAQs:", err.response?.data || err.message);
      setError("Failed to fetch FAQs.");
      showSnackbar("Failed to fetch FAQs", "error");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const fetchCategoryTitle = async () => {
    if (!categoryId) return;

    try {
      const response = await axios.get(
        `${apiBaseURL}/api/faqCategories/${categoryId}`
      );
      if (response.data) {
        setCategoryTitle(response.data.title);
      }
    } catch (err) {
      setCategoryTitle("Category Not Found");
      showSnackbar("Category not found", "error");
    }
  };

  useEffect(() => {
    fetchCategoryTitle();
    fetchFaqs();
  }, [fetchFaqs]);

  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(query)
    );
    setFilteredFaqs(filtered);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: toSentenceCase(value) });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingFaq({ ...editingFaq, [name]: toSentenceCase(value) });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setError("Category ID is missing.");
      showSnackbar("Category ID is missing", "error");
      return;
    }
    if (!formData.question || !formData.answer) {
      setError("Both question and answer are required.");
      showSnackbar("Both question and answer are required", "error");
      return;
    }

    try {
      setLoading(true);
      console.log("Adding FAQ:", { ...formData, categoryId });
      const { data: newFaq } = await axios.post(
        `${apiBaseURL}/api/faqs/category/${categoryId}`,
        formData
      );
      setFaqs([...faqs, newFaq]);
      setFilteredFaqs([...faqs, newFaq]);
      setIsAddModalOpen(false);
      setFormData({ question: "", answer: "" });
      setError(null);
      showSnackbar("FAQ added successfully");
    } catch (err) {
      console.error("Error adding FAQ:", err.response?.data || err.message);
      setError("Failed to add FAQ.");
      showSnackbar("Failed to add FAQ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingFaq) return;

    try {
      setLoading(true);
      console.log("Editing FAQ:", editingFaq);
      const { data: updatedFaq } = await axios.put(
        `${apiBaseURL}/api/faqs/${editingFaq._id}`,
        editingFaq
      );
      const updatedFaqs = faqs.map((faq) =>
        faq._id === editingFaq._id ? updatedFaq : faq
      );
      setFaqs(updatedFaqs);
      setFilteredFaqs(updatedFaqs);
      setIsEditModalOpen(false);
      setEditingFaq(null);
      setError(null);
      showSnackbar("FAQ updated successfully");
    } catch (err) {
      console.error("Error editing FAQ:", err.response?.data || err.message);
      setError("Failed to edit FAQ.");
      showSnackbar("Failed to edit FAQ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFaqToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${apiBaseURL}/api/faqs/${faqToDelete._id}`);
      const updatedFaqs = faqs.filter((faq) => faq._id !== faqToDelete._id);
      setFaqs(updatedFaqs);
      setFilteredFaqs(updatedFaqs);
      setError(null);
      showSnackbar("FAQ deleted successfully");
    } catch (err) {
      console.error("Error deleting FAQ:", err.response?.data || err.message);
      setError("Failed to delete FAQ.");
      showSnackbar("Failed to delete FAQ", "error");
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const [viewType, setViewType] = useState("grid");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewType(newView);
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
              {categoryTitle || "Loading..."} - FAQs
            </Typography>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={isMobile ? 1 : 2}
              alignItems={isMobile ? "stretch" : "center"}
              width={isMobile ? "100%" : "auto"}
            >
              <TextField
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearchChange}
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

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={handleViewChange}
                  sx={{
                    "& .MuiToggleButton-root": {
                      border: "1px solid #e2e8f0",
                      "&.Mui-selected": {
                        background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                        color: "white",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565c0, #42a5f5)",
                        },
                      },
                    },
                    display: isMobile ? "none" : "flex",
                  }}
                >
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="grid" aria-label="grid view">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  onClick={() => setIsAddModalOpen(true)}
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
                  Add FAQ
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {loading && (
          <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            display: isMobile ? "flex" : viewType === "grid" ? "grid" : "flex",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {filteredFaqs.map((faq) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {faq.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      color: "text.secondary",
                      wordBreak: "break-word",
                    }}
                  >
                    {faq.answer}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    sx={{ mt: 2 }}
                  >
                    <IconButton
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsEditModalOpen(true);
                      }}
                      sx={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        "&:hover": { backgroundColor: "#2563eb" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(faq)}
                      sx={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        "&:hover": { backgroundColor: "#dc2626" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-start" }}>
          {/* <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/Dashboards/faq")}
            sx={{
              color: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Back to Categories
          </Button> */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/Dashboards/faq-category")}
            sx={{
              color: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Back to Categories
          </Button>
        </Box>

        {/* Add FAQ Modal */}
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
            Add New FAQ
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
            <form onSubmit={handleAddSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: "8px" }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Question"
                  name="question"
                  value={formData.question}
                  onChange={handleAddChange}
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
                  label="Answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleAddChange}
                  required
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
                    ) : (
                      "Add FAQ"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit FAQ Modal */}
        <Dialog
          open={isEditModalOpen}
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
            Edit FAQ
            <IconButton
              onClick={() => setIsEditModalOpen(false)}
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
            {editingFaq && (
              <form onSubmit={handleEditSubmit}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  {error && (
                    <Alert severity="error" sx={{ borderRadius: "8px" }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Question"
                    name="question"
                    value={editingFaq.question}
                    onChange={handleEditChange}
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
                    label="Answer"
                    name="answer"
                    value={editingFaq.answer}
                    onChange={handleEditChange}
                    required
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
                      onClick={() => setIsEditModalOpen(false)}
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
                          background:
                            "linear-gradient(45deg, #1565c0, #42a5f5)",
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
                      ) : (
                        "Update FAQ"
                      )}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
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
            <Delete color="white" />
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
              Are you sure you want to delete this FAQ?
            </Alert>
            {faqToDelete && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                <Typography variant="body1" fontWeight={600} color="#2c3e50">
                  Question: {faqToDelete.question}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Answer: {faqToDelete.answer}
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
