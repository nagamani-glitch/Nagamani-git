import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import {
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Button,
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
  InputAdornment,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit,
  Delete,
  Add,
  Search,
  Close,
  QuestionAnswer,
} from "@mui/icons-material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { ToggleButtonGroup, ToggleButton } from "@mui/lab";

const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5002";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Add this helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

  // const fetchFaqs = useCallback(async () => {
  //   if (!categoryId) return;

  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get(
  //       `${apiBaseURL}/api/faqs/category/${categoryId}`
  //     );
  //     setFaqs(data);
  //     setFilteredFaqs(data);
  //     setError(null);
  //   } catch (err) {
  //     console.error("Error fetching FAQs:", err.response?.data || err.message);
  //     setError("Failed to fetch FAQs.");
  //     showSnackbar("Failed to fetch FAQs", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [categoryId]);

// Update the fetchFaqs function
const fetchFaqs = useCallback(async () => {
  if (!categoryId) return;

  setLoading(true);
  try {
    const token = getAuthToken();
    const { data } = await axios.get(
      `${apiBaseURL}/api/faqs/category/${categoryId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
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

  // const fetchCategoryTitle = async () => {
  //   if (!categoryId) return;

  //   try {
  //     const response = await axios.get(
  //       `${apiBaseURL}/api/faqCategories/${categoryId}`
  //     );
  //     if (response.data) {
  //       setCategoryTitle(response.data.title);
  //     }
  //   } catch (err) {
  //     setCategoryTitle("Category Not Found");
  //     showSnackbar("Category not found", "error");
  //   }
  // };

// Update the fetchCategoryTitle function
const fetchCategoryTitle = async () => {
  if (!categoryId) return;

  try {
    const token = getAuthToken();
    const response = await axios.get(
      `${apiBaseURL}/api/faqCategories/${categoryId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
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

  // const handleAddSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!categoryId) {
  //     setError("Category ID is missing.");
  //     showSnackbar("Category ID is missing", "error");
  //     return;
  //   }
  //   if (!formData.question || !formData.answer) {
  //     setError("Both question and answer are required.");
  //     showSnackbar("Both question and answer are required", "error");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     console.log("Adding FAQ:", { ...formData, categoryId });
  //     const { data: newFaq } = await axios.post(
  //       `${apiBaseURL}/api/faqs/category/${categoryId}`,
  //       formData
  //     );
  //     setFaqs([...faqs, newFaq]);
  //     setFilteredFaqs([...faqs, newFaq]);
  //     setIsAddModalOpen(false);
  //     setFormData({ question: "", answer: "" });
  //     setError(null);
  //     showSnackbar("FAQ added successfully");
  //   } catch (err) {
  //     console.error("Error adding FAQ:", err.response?.data || err.message);
  //     setError("Failed to add FAQ.");
  //     showSnackbar("Failed to add FAQ", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!editingFaq) return;

  //   try {
  //     setLoading(true);
  //     console.log("Editing FAQ:", editingFaq);
  //     const { data: updatedFaq } = await axios.put(
  //       `${apiBaseURL}/api/faqs/${editingFaq._id}`,
  //       editingFaq
  //     );
  //     const updatedFaqs = faqs.map((faq) =>
  //       faq._id === editingFaq._id ? updatedFaq : faq
  //     );
  //     setFaqs(updatedFaqs);
  //     setFilteredFaqs(updatedFaqs);
  //     setIsEditModalOpen(false);
  //     setEditingFaq(null);
  //     setError(null);
  //     showSnackbar("FAQ updated successfully");
  //   } catch (err) {
  //     console.error("Error editing FAQ:", err.response?.data || err.message);
  //     setError("Failed to edit FAQ.");
  //     showSnackbar("Failed to edit FAQ", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// Update the handleEditSubmit function
const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!editingFaq) return;

  try {
    setLoading(true);
    console.log("Editing FAQ:", editingFaq);
    const token = getAuthToken();
    const { data: updatedFaq } = await axios.put(
      `${apiBaseURL}/api/faqs/${editingFaq._id}`,
      editingFaq,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
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

  // // In the handleAddSubmit function, after successfully adding a new FAQ:S
  // const handleAddSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!categoryId) {
  //     setError("Category ID is missing.");
  //     showSnackbar("Category ID is missing", "error");
  //     return;
  //   }
  //   if (!formData.question || !formData.answer) {
  //     setError("Both question and answer are required.");
  //     showSnackbar("Both question and answer are required", "error");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     console.log("Adding FAQ:", { ...formData, categoryId });
  //     const { data: newFaq } = await axios.post(
  //       `${apiBaseURL}/api/faqs/category/${categoryId}`,
  //       formData
  //     );
  //     setFaqs([...faqs, newFaq]);
  //     setFilteredFaqs([...faqs, newFaq]);
  //     setIsAddModalOpen(false);
  //     setFormData({ question: "", answer: "" });
  //     setError(null);
  //     showSnackbar("FAQ added successfully");

  //     // Update the category title with new count
  //     fetchCategoryTitle();
  //   } catch (err) {
  //     console.error("Error adding FAQ:", err.response?.data || err.message);
  //     setError("Failed to add FAQ.");
  //     showSnackbar("Failed to add FAQ", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Update the handleAddSubmit function
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
    const token = getAuthToken();
    const { data: newFaq } = await axios.post(
      `${apiBaseURL}/api/faqs/category/${categoryId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    setFaqs([...faqs, newFaq]);
    setFilteredFaqs([...faqs, newFaq]);
    setIsAddModalOpen(false);
    setFormData({ question: "", answer: "" });
    setError(null);
    showSnackbar("FAQ added successfully");

    // Update the category title with new count
    fetchCategoryTitle();
  } catch (err) {
    console.error("Error adding FAQ:", err.response?.data || err.message);
    setError("Failed to add FAQ.");
    showSnackbar("Failed to add FAQ", "error");
  } finally {
    setLoading(false);
  }
};

  // // Similarly, in the handleConfirmDelete function:
  // const handleConfirmDelete = async () => {
  //   if (!faqToDelete) return;

  //   try {
  //     setLoading(true);
  //     await axios.delete(`${apiBaseURL}/api/faqs/${faqToDelete._id}`);
  //     const updatedFaqs = faqs.filter((faq) => faq._id !== faqToDelete._id);
  //     setFaqs(updatedFaqs);
  //     setFilteredFaqs(updatedFaqs);
  //     setError(null);
  //     showSnackbar("FAQ deleted successfully");

  //     // Update the category title with new count
  //     fetchCategoryTitle();
  //   } catch (err) {
  //     console.error("Error deleting FAQ:", err.response?.data || err.message);
  //     setError("Failed to delete FAQ.");
  //     showSnackbar("Failed to delete FAQ", "error");
  //   } finally {
  //     setLoading(false);
  //     handleCloseDeleteDialog();
  //   }
  // };

  // Update the handleConfirmDelete function
const handleConfirmDelete = async () => {
  if (!faqToDelete) return;

  try {
    setLoading(true);
    const token = getAuthToken();
    await axios.delete(`${apiBaseURL}/api/faqs/${faqToDelete._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const updatedFaqs = faqs.filter((faq) => faq._id !== faqToDelete._id);
    setFaqs(updatedFaqs);
    setFilteredFaqs(updatedFaqs);
    setError(null);
    showSnackbar("FAQ deleted successfully");

    // Update the category title with new count
    fetchCategoryTitle();
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
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "#f5f5f5",
            //minHeight: "100vh",
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
              {categoryTitle || "Loading..."} - FAQs
            </Typography>

            <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
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
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{
                    width: { xs: "100%", sm: "300px" },
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
                        <Search sx={{ color: "action.active", mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 1 },
                    width: { xs: "100%", sm: "auto" },
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
                          background:
                            "linear-gradient(45deg, #1976d2, #64b5f6)",
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
                    sx={{
                      height: { xs: "auto", sm: 40 },
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
                      fontWeight: 500,
                    }}
                    variant="contained"
                  >
                    Add FAQ
                  </Button>
                </Box>
              </Box>
            </StyledPaper>
          </Box>
        </Box>

        {/* FAQ summary cards */}
        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#e6f7ff",
              border: "1px solid #91d5ff",
              flex: 1,
              minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
            }}
          >
            <QuestionAnswer sx={{ color: "#1890ff", mr: 1 }} />
            <Box>
              <Typography variant="body2" color="#1890ff" fontWeight={500}>
                Total FAQs
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {faqs.length}
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#fff7e6",
              border: "1px solid #ffd591",
              flex: 1,
              minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
            }}
          >
            <Search sx={{ color: "#fa8c16", mr: 1 }} />
            <Box>
              <Typography variant="body2" color="#fa8c16" fontWeight={500}>
                Search Results
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {searchQuery ? filteredFaqs.length : faqs.length}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Total FAQ and search card  */}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* FAQ cards */}

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
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  overflow: "hidden",
                  border: "1px solid rgba(25, 118, 210, 0.08)",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    borderColor: "rgba(25, 118, 210, 0.2)",
                  },
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #1976d2, #64b5f6)",
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, pb: 2 }}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        wordBreak: "break-word",
                        color: "#334155",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {faq.question}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: "#64748b",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                        p: 2,
                        borderRadius: "8px",
                        borderLeft: "3px solid #1976d2",
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>

                  <Divider sx={{ opacity: 0.6 }} />

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(25, 118, 210, 0.02)",
                    }}
                  >
                    <Tooltip title="Edit FAQ">
                      <IconButton
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsEditModalOpen(true);
                        }}
                        sx={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#2563eb",
                            transform: "scale(1.05)",
                          },
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete FAQ">
                      <IconButton
                        onClick={() => handleDeleteClick(faq)}
                        sx={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#dc2626",
                            transform: "scale(1.05)",
                          },
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Back to main Faq Category page */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-start" }}>
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
