import React, { useState, useEffect } from "react";
import "./CandidateView.css";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/hired-employees";

const CandidatesView = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    department: "All",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    joiningDate: "",
    probationEnds: "",
    jobPosition: "",
    recruitment: "",
    status: "Pending",
    department: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const departments = ["Engineering", "Product", "Marketing", "Sales", "HR"];
  const statuses = ["Active", "Pending", "Inactive"];

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error fetching candidates", "error");
    }
    setLoading(false);
  };

  const handleFilterChange = async (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    try {
      const response = await axios.get(`${API_URL}/filter`, {
        params: {
          department:
            newFilters.department !== "All" ? newFilters.department : "",
          status: newFilters.status !== "All" ? newFilters.status : "",
          search: searchTerm,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error applying filters", "error");
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    try {
      const response = await axios.get(`${API_URL}/filter`, {
        params: {
          department: filters.department !== "All" ? filters.department : "",
          status: filters.status !== "All" ? filters.status : "",
          search: value,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error applying search", "error");
    }
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const candidateData = {
        ...formData,
        probationEnds: new Date(formData.joiningDate).setMonth(
          new Date(formData.joiningDate).getMonth() + 3
        ),
        recruitment: formData.recruitment || "Direct",
      };

      if (editMode) {
        const response = await axios.put(
          `${API_URL}/${selectedCandidate._id}`,
          candidateData
        );
        setCandidates((prev) =>
          prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
        );
        showSnackbar("Candidate updated successfully");
      } else {
        const response = await axios.post(API_URL, candidateData);
        setCandidates((prev) => [...prev, response.data]);
        showSnackbar("New candidate added successfully");
      }
      handleDialogClose();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      joiningDate: candidate.joiningDate.split("T")[0],
      probationEnds: candidate.probationEnds.split("T")[0],
      jobPosition: candidate.jobPosition,
      recruitment: candidate.recruitment,
      status: candidate.status,
      department: candidate.department,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      showSnackbar("Candidate deleted successfully", "warning");
    } catch (error) {
      showSnackbar("Error deleting candidate", "error");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedCandidate(null);
    setFormData(initialFormState);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getStatusChipColor = (status) => {
    const colors = {
      Active: "success",
      Pending: "warning",
      Inactive: "error",
    };
    return colors[status] || "default";
  };

  return (
    <div className="candidate-view">
      <Box className="header-section">
        <Typography variant="h4">Hired Candidates</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Add Candidate
        </Button>
      </Box>

      <Box className="filters-section">
        <TextField
          className="search-field"
          placeholder="Search candidates..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
        <FormControl size="small" variant="outlined" className="filter-select">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            label="Status"
          >
            <MenuItem value="All">All Status</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" variant="outlined" className="filter-select">
          <InputLabel>Department</InputLabel>
          <Select
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            label="Department"
          >
            <MenuItem value="All">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      ) : (
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.department}</td>
                <td>{new Date(candidate.joiningDate).toLocaleDateString()}</td>
                <td>
                  <Chip
                    label={candidate.status}
                    color={getStatusChipColor(candidate.status)}
                    size="small"
                  />
                </td>
                <td className="actions-cell">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(candidate)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(candidate._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            width: "600px",
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
          }}
        >
          {editMode ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box
            className="dialog-form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
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
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
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

            <TextField
              name="joiningDate"
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
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

            <TextField
              name="jobPosition"
              label="Job Position"
              value={formData.jobPosition}
              onChange={handleFormChange}
              fullWidth
              required
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

            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                label="Department"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
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
            onClick={handleSubmit}
            variant="contained"
            color="primary"
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
            }}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CandidatesView;
