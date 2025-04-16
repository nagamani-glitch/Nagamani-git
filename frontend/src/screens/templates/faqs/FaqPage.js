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
      return;
    }
    if (!formData.question || !formData.answer) {
      setError("Both question and answer are required.");
      return;
    }

    try {
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
    } catch (err) {
      console.error("Error adding FAQ:", err.response?.data || err.message);
      setError("Failed to add FAQ.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingFaq) return;

    try {
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
    } catch (err) {
      console.error("Error editing FAQ:", err.response?.data || err.message);
      setError("Failed to edit FAQ.");
    }
  };

  const handleDelete = async (faqId) => {
    try {
      console.log("Deleting FAQ ID:", faqId);
      await axios.delete(`${apiBaseURL}/api/faqs/${faqId}`);
      const updatedFaqs = faqs.filter((faq) => faq._id !== faqId);
      setFaqs(updatedFaqs);
      setFilteredFaqs(updatedFaqs);
      setError(null);
    } catch (err) {
      console.error("Error deleting FAQ:", err.response?.data || err.message);
      setError("Failed to delete FAQ.");
    }
  };

  const [viewType, setViewType] = useState("grid");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewType(newView);
    }
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
              {categoryTitle || "Loading..."} - FAQs
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      },
                    },
                  },
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
            display: viewType === "grid" ? "grid" : "flex",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            flexDirection: viewType === "grid" ? "unset" : "column",
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
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.question}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsEditModalOpen(true);
                        }}
                        sx={{
                          color: "#1976d2",
                          //  backgroundColor: '#e3f2fd',
                          "&:hover": {
                            backgroundColor: "#bae6fd",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(faq._id)}
                        sx={{
                          color: "#ef4444",
                          // backgroundColor: '#fee2e2',
                          "&:hover": {
                            backgroundColor: "#fecaca",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#64748b",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Create and Edit Dialog  */}

        <Dialog
          open={isAddModalOpen || isEditModalOpen}
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
            {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            <IconButton
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setEditingFaq(null);
              }}
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
            <form onSubmit={editingFaq ? handleEditSubmit : handleAddSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Question"
                  name="question"
                  value={editingFaq ? editingFaq.question : formData.question}
                  onChange={editingFaq ? handleEditChange : handleAddChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  label="Answer"
                  name="answer"
                  value={editingFaq ? editingFaq.answer : formData.answer}
                  onChange={editingFaq ? handleEditChange : handleAddChange}
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
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setEditingFaq(null);
                    }}
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
                    {editingFaq ? "Update" : "Save"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
}
