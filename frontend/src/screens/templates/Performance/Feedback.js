import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateFeedback from "./CreateFeedback";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";

import "./Feedback.css";

const Feedback = () => {
  const [activeTab, setActiveTab] = useState("feedbackToReview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterPopupVisible, setFilterPopupVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    selfFeedback: [],
    requestedFeedback: [],
    feedbackToReview: [],
    anonymousFeedback: [],
  });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({
    title: "",
    employee: "",
    status: "",
    manager: "",
    startDate: "",
    endDate: "",
  });

  // Filter options

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Add these handlers
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterPopupVisible(true);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterPopupVisible(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/feedback");
      setFeedbackData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch feedbacks");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async (newFeedback, isEditing) => {
    try {
      const feedbackData = {
        ...newFeedback,
        feedbackType: activeTab,
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/feedback/${newFeedback._id}`,
          feedbackData
        );
      } else {
        await axios.post("http://localhost:5000/api/feedback", feedbackData);
      }
      await fetchFeedbacks();
      setIsCreateModalOpen(false);
      setEditingFeedback(null);
    } catch (error) {
      console.error("Error saving feedback:", error);
      setError("Failed to save feedback");
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredFeedbackData =
    feedbackData[activeTab]?.filter((item) => {
      const matchesSearch =
        item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        (!filterCriteria.title ||
          item.title
            .toLowerCase()
            .includes(filterCriteria.title.toLowerCase())) &&
        (!filterCriteria.employee ||
          item.employee
            .toLowerCase()
            .includes(filterCriteria.employee.toLowerCase())) &&
        (!filterCriteria.status || item.status === filterCriteria.status) &&
        (!filterCriteria.manager ||
          item.manager
            .toLowerCase()
            .includes(filterCriteria.manager.toLowerCase())) &&
        (!filterCriteria.startDate ||
          new Date(item.startDate) >= new Date(filterCriteria.startDate)) &&
        (!filterCriteria.endDate ||
          new Date(item.dueDate) <= new Date(filterCriteria.endDate));

      return matchesSearch && matchesFilter;
    }) || [];

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="feedback">
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
              color: "#1976d2",
              // background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              background: '#1976d2',
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#1976d2",
            }}
          >
            Feedbacks
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search"
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

            <Button
              variant="outlined"
              onClick={handleFilterClick}
              startIcon={<FilterList />}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "#e3f2fd",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Filter
            </Button>

            <Popover
              open={Boolean(filterAnchorEl)}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  width: "400px",
                  borderRadius: "16px",
                  mt: 1,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  position: "relative", // Added position relative
                  zIndex: 1300, // Added higher z-index
                },
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Filter Feedback
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={filterCriteria.title}
                    onChange={handleFilterChange}
                    size="small"
                  />

                  <TextField
                    fullWidth
                    label="Employee"
                    name="employee"
                    value={filterCriteria.employee}
                    onChange={handleFilterChange}
                    size="small"
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={filterCriteria.status}
                      onChange={handleFilterChange}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Manager"
                    name="manager"
                    value={filterCriteria.manager}
                    onChange={handleFilterChange}
                    size="small"
                  />

                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={filterCriteria.startDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />

                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={filterCriteria.endDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    fullWidth
                    onClick={handleFilterClose}
                    sx={{
                      border: "2px solid #1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        border: "2px solid #64b5f6",
                        backgroundColor: "#e3f2fd",
                      },
                      borderRadius: "8px",
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    fullWidth
                    onClick={handleFilterClose}
                    sx={{
                      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      },
                      borderRadius: "8px",
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    Apply Filters
                  </Button>
                </Stack>
              </Box>
            </Popover>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
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
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/*** Filter Popup ***/}

      {/* <Popover
    open={Boolean(filterAnchorEl)}
    anchorEl={filterAnchorEl}
    onClose={handleFilterClose}
    anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
    }}
    transformOrigin={{
        vertical: "top",
        horizontal: "left"
    }}
    PaperProps={{
        sx: {
            width: "400px",
            borderRadius: "16px",
            mt: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }
    }}
>
    <Box sx={{ 
        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        p: 2
    }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Filter Feedback
        </Typography>
    </Box>

    <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={filterCriteria.title}
                onChange={handleFilterChange}
                size="small"
            />

            <TextField
                fullWidth
                label="Employee"
                name="employee"
                value={filterCriteria.employee}
                onChange={handleFilterChange}
                size="small"
            />

            <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={filterCriteria.status}
                    onChange={handleFilterChange}
                    label="Status"
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Manager"
                name="manager"
                value={filterCriteria.manager}
                onChange={handleFilterChange}
                size="small"
            />

            <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={filterCriteria.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                size="small"
            />

            <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={filterCriteria.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                size="small"
            />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
                fullWidth
                onClick={handleFilterClose}
                sx={{
                    border: '2px solid #1976d2',
                    color: '#1976d2',
                    '&:hover': {
                        border: '2px solid #64b5f6',
                        backgroundColor: '#e3f2fd',
                    },
                    borderRadius: '8px',
                    py: 1,
                    fontWeight: 600
                }}
            >
                Cancel
            </Button>

            <Button
                fullWidth
                onClick={handleFilterClose}
                sx={{
                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                    color: 'white',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    },
                    borderRadius: '8px',
                    py: 1,
                    fontWeight: 600
                }}
            >
                Apply Filters
            </Button>
        </Stack>
    </Box>
</Popover> */}

      <div className="tabs">
        <button
          className={activeTab === "selfFeedback" ? "active" : ""}
          onClick={() => setActiveTab("selfFeedback")}
        >
          Self Feedback
        </button>
        <button
          className={activeTab === "requestedFeedback" ? "active" : ""}
          onClick={() => setActiveTab("requestedFeedback")}
        >
          Requested Feedback
        </button>
        <button
          className={activeTab === "feedbackToReview" ? "active" : ""}
          onClick={() => setActiveTab("feedbackToReview")}
        >
          Feedback to Review
        </button>
        <button
          className={activeTab === "anonymousFeedback" ? "active" : ""}
          onClick={() => setActiveTab("anonymousFeedback")}
        >
          Anonymous Feedback
        </button>
      </div>

      {/** Create options **/}

      {isCreateModalOpen && (
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          maxWidth="md" // Changed from "sm" to "md"
          fullWidth
          PaperProps={{
            sx: {
              width: "700px", // Increased from 600px
              maxWidth: "90vw", // Added to handle smaller screens
              borderRadius: "20px",
              overflow: "hidden",
              margin: "16px",
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
            {editingFeedback ? "Edit Feedback" : "Create New Feedback"}
            <IconButton
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingFeedback(null);
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

          <DialogContent
            sx={{
              padding: "32px",
              "& .MuiFormControl-root": {
                width: "100%", // Ensures form controls take full width
              },
              "& form": {
                width: "100%", // Ensures form takes full width
              },
            }}
          >
            <CreateFeedback
              addFeedback={handleAddFeedback}
              editData={editingFeedback}
              onClose={() => {
                setIsCreateModalOpen(false);
                setEditingFeedback(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

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
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Employee
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Title
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Due Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFeedbackData.map((item) => (
              <TableRow
                key={item._id || item.id}
                sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
              >
                <TableCell>{item.employee}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.status}</TableCell>
                {/* <TableCell>
                    <Chip 
        label={item.status}
        variant="outlined"
        size="small"
        sx={{ 
            fontWeight: 500,
            borderColor: '#e2e8f0',
            color: '#64748b'
        }}
    />
                         <Chip 
                            label={item.status}
                            color={
                                item.status === 'Completed' ? 'success' :
                                item.status === 'In Progress' ? 'warning' :
                                item.status === 'Not Started' ? 'error' : 'default'
                            }
                            size="small"
                            sx={{ fontWeight: 500 }}
                        /> 
                    </TableCell> */}

                <TableCell>
                  {new Date(item.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      size="small"
                      sx={{
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item._id || item.id)}
                      size="small"
                      sx={{
                        color: "#ef4444",
                        "&:hover": { backgroundColor: "#fee2e2" },
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
      <div className="pagination">Page 1 of 1</div>
    </div>
  );
};

export default Feedback;
