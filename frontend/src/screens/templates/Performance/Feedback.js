import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";

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
  DialogActions,
  Fade,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  Autocomplete,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Drawer,
  Divider,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@mui/lab";

import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Close,
  History as HistoryIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  GetApp as GetAppIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

// Import libraries for Excel and PDF export
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import "./Feedback.css";

const Feedback = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [comment, setComment] = useState("");
  const [exportOptions, setExportOptions] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Status options based on feedback type
  const [statusOptions] = useState({
    selfFeedback: ["Not Started", "In Progress", "Completed", "Pending"],
    requestedFeedback: ["Not Started", "In Progress", "Completed", "Pending"],
    feedbackToReview: ["Not Started", "In Progress", "Completed", "Pending"],
    anonymousFeedback: ["Not Started", "In Progress", "Completed", "Pending"],
  });



  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));
  
  const SearchTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(2),
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  }));

  
  // Filter handlers
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
    fetchEmployees();
  }, []);

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(
        "http://localhost:5000/api/employees/registered"
      );

      // Transform the data to the format we need
      const formattedEmployees = response.data.map((emp) => ({
        id: emp.Emp_ID,
        name: `${emp.personalInfo?.firstName || ""} ${
          emp.personalInfo?.lastName || ""
        }`.trim(),
        email: emp.personalInfo?.email || "",
        designation: emp.joiningDetails?.initialDesignation || "No Designation",
        department: emp.joiningDetails?.department || "No Department",
      }));

      setEmployees(formattedEmployees);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoadingEmployees(false);
    }
  };

  // Check for overdue feedbacks and generate notifications
  useEffect(() => {
    const checkOverdueFeedbacks = () => {
      const today = new Date();
      const overdueFeedbacks = [];

      Object.values(feedbackData).forEach((feedbackList) => {
        feedbackList.forEach((feedback) => {
          const dueDate = new Date(feedback.dueDate);
          if (dueDate < today && feedback.status !== "Completed") {
            overdueFeedbacks.push({
              id: feedback._id || feedback.id,
              message: `Feedback "${feedback.title}" for ${feedback.employee} is overdue`,
              type: "warning",
            });
          }

          // Upcoming deadlines (3 days)
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(today.getDate() + 3);

          if (
            dueDate <= threeDaysFromNow &&
            dueDate > today &&
            feedback.status !== "Completed"
          ) {
            overdueFeedbacks.push({
              id: feedback._id || feedback.id,
              message: `Feedback "${feedback.title}" for ${feedback.employee} is due soon`,
              type: "info",
            });
          }
        });
      });

      setNotifications(overdueFeedbacks);
    };

    if (feedbackData) {
      checkOverdueFeedbacks();
    }
  }, [feedbackData]);

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


  // Add these functions to your component
  const handleDeleteClick = (feedback) => {
    console.log("Feedback object:", feedback); // Debug log
    setItemToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/feedback/${
          itemToDelete._id || itemToDelete.id
        }`
      );
      await fetchFeedbacks();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Helper function to check if a date is valid
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
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

  // Status change handler
  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${feedbackId}`, {
        status: newStatus,
      });
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update feedback status");
    }
  };

  // View history handler
  const handleViewHistory = async (feedbackId) => {
    try {
      // In a real app, you would fetch the history from the backend
      const response = await axios.get(
        `http://localhost:5000/api/feedback/${feedbackId}/history`
      );
      setSelectedFeedback({
        ...Object.values(feedbackData)
          .flat()
          .find((f) => f._id === feedbackId || f.id === feedbackId),
        history: response.data.history || mockHistory(feedbackId),
      });
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      // For demo purposes, show mock history if API fails
      const feedback = Object.values(feedbackData)
        .flat()
        .find((f) => f._id === feedbackId || f.id === feedbackId);
      setSelectedFeedback({
        ...feedback,
        history: mockHistory(feedbackId),
      });
      setShowHistory(true);
    }
  };

  // Mock history function for demo purposes
  const mockHistory = (feedbackId) => {
    return [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        action: "Created",
        user: "John Doe",
        details: "Feedback created",
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        action: "Updated",
        user: "Jane Smith",
        details: "Status changed from Not Started to In Progress",
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        action: "Comment",
        user: "Mike Johnson",
        details: "Please provide more specific examples in your feedback",
      },
    ];
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeedback) return;

    try {
      // In a real app, you would send this to the backend
      await axios.post(
        `http://localhost:5000/api/feedback/${selectedFeedback._id}/comments`,
        {
          comment,
        }
      );

      // Update the local state with the new comment
      setSelectedFeedback({
        ...selectedFeedback,
        history: [
          ...selectedFeedback.history,
          {
            date: new Date().toISOString(),
            action: "Comment",
            user: "Current User", // In a real app, use the logged-in user
            details: comment,
          },
        ],
      });

      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      // For demo purposes, update the UI anyway
      setSelectedFeedback({
        ...selectedFeedback,
        history: [
          ...selectedFeedback.history,
          {
            date: new Date().toISOString(),
            action: "Comment",
            user: "Current User", // In a real app, use the logged-in user
            details: comment,
          },
        ],
      });
      setComment("");
    }
  };

  // Export handler with working Excel and PDF exports
  const handleExport = (format) => {
    const dataToExport = filteredFeedbackData.map((item) => ({
      Employee: item.employee,
      Title: item.title,
      Status: item.status,
      StartDate: new Date(item.startDate).toLocaleDateString(),
      DueDate: new Date(item.dueDate).toLocaleDateString(),
      Manager: item.manager,
    }));

    if (format === "csv") {
      // Create CSV content
      const headers = Object.keys(dataToExport[0]).join(",");
      const rows = dataToExport
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        )
        .join("\n");
      const csvContent = `${headers}\n${rows}`;

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === "excel") {
      try {
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Feedback");

        // Generate Excel file and trigger download
        XLSX.writeFile(
          wb,
          `feedback_export_${new Date().toISOString().split("T")[0]}.xlsx`
        );
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert(
          "Failed to export to Excel. Please make sure the xlsx library is properly installed."
        );
      }
    } else if (format === "pdf") {
      try {
        // Create a new PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text("Feedback Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        // Prepare data for table
        const tableColumn = Object.keys(dataToExport[0]);
        const tableRows = dataToExport.map((item) => Object.values(item));

        // Generate the table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 30,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [25, 118, 210] },
        });

        // Save the PDF
        doc.save(
          `feedback_export_${new Date().toISOString().split("T")[0]}.pdf`
        );
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        alert(
          "Failed to export to PDF. Please make sure the jspdf and jspdf-autotable libraries are properly installed."
        );
      }
    }

    setExportOptions(false);
  };

  // Bulk selection handlers
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFeedbackData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFeedbackData.map((item) => item._id || item.id));
    }
  };

  // Bulk action handler
  const handleBulkAction = async (action) => {
    try {
      if (action === "delete") {
        await Promise.all(
          selectedItems.map((id) =>
            axios.delete(`http://localhost:5000/api/feedback/${id}`)
          )
        );
      } else if (action === "status") {
        await Promise.all(
          selectedItems.map((id) =>
            axios.put(`http://localhost:5000/api/feedback/${id}`, {
              status: "Completed",
            })
          )
        );
      }

      await fetchFeedbacks();
      setSelectedItems([]);
      setBulkActionAnchor(null);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      setError("Failed to perform bulk action");
    }
  };

  // Analytics handler
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Try to fetch analytics from the backend
      try {
        const response = await axios.get(
          "http://localhost:5000/api/feedback/analytics/summary"
        );
        setAnalyticsData(response.data);
        setShowAnalytics(true);
        setLoading(false);
        return;
      } catch (apiError) {
        console.error("Error fetching analytics from API:", apiError);
        // If API fails, continue to calculate locally
      }

      // If API fails, calculate analytics from local data
      const allFeedback = Object.values(feedbackData).flat();

      const analytics = {
        total: allFeedback.length,
        byStatus: {
          completed: allFeedback.filter((f) => f.status === "Completed").length,
          inProgress: allFeedback.filter((f) => f.status === "In Progress")
            .length,
          notStarted: allFeedback.filter((f) => f.status === "Not Started")
            .length,
          pending: allFeedback.filter((f) => f.status === "Pending").length,
        },
        byType: {
          selfFeedback: feedbackData.selfFeedback?.length || 0,
          requestedFeedback: feedbackData.requestedFeedback?.length || 0,
          feedbackToReview: feedbackData.feedbackToReview?.length || 0,
          anonymousFeedback: feedbackData.anonymousFeedback?.length || 0,
        },
        overdue: allFeedback.filter(
          (f) => new Date(f.dueDate) < new Date() && f.status !== "Completed"
        ).length,
        completionRate:
          allFeedback.length > 0
            ? (
                (allFeedback.filter((f) => f.status === "Completed").length /
                  allFeedback.length) *
                100
              ).toFixed(1)
            : 0,
      };

      setAnalyticsData(analytics);
      setShowAnalytics(true);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating analytics:", error);
      setError("Failed to generate analytics");
      setLoading(false);
    }
  };

  // Handle mobile action menu
  const handleActionMenuOpen = (event, id) => {
    setActionMenuAnchorEl(event.currentTarget);
    setCurrentFeedbackId(id);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setCurrentFeedbackId(null);
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

  // Render mobile card view for feedback items
  const renderMobileCard = (item) => (
    <Card
      key={item._id || item.id}
      sx={{
        mb: 2,
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: selectedItems.includes(item._id || item.id)
          ? "2px solid #1976d2"
          : "none",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.employee}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={selectedItems.includes(item._id || item.id)}
              onChange={() => handleSelectItem(item._id || item.id)}
              size="small"
            />
            <IconButton
              size="small"
              onClick={(e) => handleActionMenuOpen(e, item._id || item.id)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Status:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={item.status}
              onChange={(e) =>
                handleStatusChange(item._id || item.id, e.target.value)
              }
              size="small"
              sx={{
                height: "32px",
                fontSize: "0.875rem",
                "& .MuiSelect-select": { padding: "4px 14px" },
              }}
            >
              {statusOptions[activeTab]?.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date:
          </Typography>
          <Typography variant="body2">
            {new Date(item.startDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Due Date:
          </Typography>
          <Typography variant="body2">
            {new Date(item.dueDate).toLocaleDateString()}
          </Typography>
        </Box>
        
      </CardContent>
    </Card>
  );

  return (
    <div className="feedback">
      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: "80%", maxWidth: "300px" },
        }}
      >


        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Feedback Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: "text.secondary" }}
          >
            FEEDBACK TYPES
          </Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Button
              fullWidth
              variant={activeTab === "selfFeedback" ? "contained" : "outlined"}
              onClick={() => {
                setActiveTab("selfFeedback");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Self Feedback
            </Button>
            <Button
              fullWidth
              variant={
                activeTab === "requestedFeedback" ? "contained" : "outlined"
              }
              onClick={() => {
                setActiveTab("requestedFeedback");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Requested Feedback
            </Button>
            <Button
              fullWidth
              variant={
                activeTab === "feedbackToReview" ? "contained" : "outlined"
              }
              onClick={() => {
                setActiveTab("feedbackToReview");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Feedback to Review
            </Button>
            <Button
              fullWidth
              variant={
                activeTab === "anonymousFeedback" ? "contained" : "outlined"
              }
              onClick={() => {
                setActiveTab("anonymousFeedback");
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Anonymous Feedback
            </Button>
          </Stack>

          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: "text.secondary" }}
          >
            ACTIONS
          </Typography>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                setIsCreateModalOpen(true);
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Create Feedback
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => {
                handleFilterClick(e);
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Filter
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BarChartIcon />}
              onClick={() => {
                fetchAnalytics();
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Analytics
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={(e) => {
                setExportOptions(e.currentTarget);
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Export
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Action Menu for Mobile */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem
          onClick={() => {
            const feedback = Object.values(feedbackData)
              .flat()
              .find(
                (f) => f._id === currentFeedbackId || f.id === currentFeedbackId
              );
            handleEdit(feedback);
            handleActionMenuClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleViewHistory(currentFeedbackId);
            handleActionMenuClose();
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View History</ListItemText>
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleDeleteClick(currentFeedbackId);
            handleActionMenuClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            handleDeleteClick(
              Object.values(feedbackData)
                .flat()
                .find(
                  (f) =>
                    f._id === currentFeedbackId || f.id === currentFeedbackId
                )
            );
            handleActionMenuClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: { xs: "16px", sm: "20px", md: "24px 32px" },
          marginBottom: "24px",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                background: "#1976d2",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "#1976d2",
              }}
            >
              Feedbacks
            </Typography>


          </Box>





          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            width={{ xs: "100%", sm: "auto" }}
          >
            <TextField
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              fullWidth={isMobile}
              sx={{
                width: { xs: "100%", sm: "300px" },
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

            {!isMobile && (
              <>
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

                <Button
                  onClick={fetchAnalytics}
                  startIcon={<BarChartIcon />}
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
                  variant="outlined"
                >
                  Analytics
                </Button>

                <Button
                  onClick={(e) => setExportOptions(e.currentTarget)}
                  startIcon={<GetAppIcon />}
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
                  variant="outlined"
                >
                  Export
                </Button>
              </>
            )}

            <Button
              onClick={() => setIsCreateModalOpen(true)}
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
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Box sx={{ mt: 2, mb: 3 }}>
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              severity={notification.type}
              sx={{ mb: 1 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    const feedback = Object.values(feedbackData)
                      .flat()
                      .find(
                        (f) =>
                          f._id === notification.id || f.id === notification.id
                      );
                    if (feedback) handleEdit(feedback);
                  }}
                >
                  Take Action
                </Button>
              }
            >
              {notification.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Tabs - Visible on all devices but styled differently */}
      <Box
        className="tabs"
        sx={{
          overflowX: "auto",
          display: { xs: isMobile ? "none" : "flex", sm: "flex" },
          flexWrap: { xs: "nowrap", md: "wrap" },
          gap: { xs: "10px", md: "20px" },
          pb: 1,
        }}
      >
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
      </Box>

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}// Replace the existing Box component at the beginning of your return statement with this:
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
      {activeTab === "selfFeedback" 
        ? "Self Feedback" 
        : activeTab === "requestedFeedback" 
          ? "Requested Feedback" 
          : activeTab === "feedbackToReview" 
            ? "Feedback to Review" 
            : "Anonymous Feedback"}
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
          placeholder="Search"
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
              <Search sx={{ color: "action.active", mr: 1 }} />
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
          <Button
            variant="outlined"
            onClick={handleFilterClick}
            startIcon={<FilterList />}
            sx={{
              height: { xs: "auto", sm: 40 },
              padding: { xs: "8px 16px", sm: "6px 16px" },
              width: { xs: "100%", sm: "auto" },
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Filter
          </Button>

          <Button
            onClick={fetchAnalytics}
            startIcon={<BarChartIcon />}
            sx={{
              height: { xs: "auto", sm: 40 },
              padding: { xs: "8px 16px", sm: "6px 16px" },
              width: { xs: "100%", sm: "auto" },
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
            }}
            variant="outlined"
          >
            Analytics
          </Button>

          <Button
            onClick={(e) => setExportOptions(e.currentTarget)}
            startIcon={<GetAppIcon />}
            sx={{
              height: { xs: "auto", sm: 40 },
              padding: { xs: "8px 16px", sm: "6px 16px" },
              width: { xs: "100%", sm: "auto" },
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
            }}
            variant="outlined"
          >
            Export
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
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
            }}
            variant="contained"
          >
            Create Feedback
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  </Box>
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "400px" },
            borderRadius: "16px",
            mt: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 1300,
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
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
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

            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                return option.name || "";
              }}
              freeSolo
              value={filterCriteria.employee}
              onChange={(event, newValue) => {
                setFilterCriteria((prev) => ({
                  ...prev,
                  employee:
                    typeof newValue === "object"
                      ? newValue?.name || ""
                      : newValue || "",
                }));
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.id} • {option.designation} • {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee"
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
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
                {statusOptions[activeTab]?.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                return option.name || "";
              }}
              freeSolo
              value={filterCriteria.manager}
              onChange={(event, newValue) => {
                setFilterCriteria((prev) => ({
                  ...prev,
                  manager:
                    typeof newValue === "object"
                      ? newValue?.name || ""
                      : newValue || "",
                }));
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.id} • {option.designation} • {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Manager"
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
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

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 4 }}
          >
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

      {/* Export Menu */}
      <Menu
        anchorEl={exportOptions}
        open={Boolean(exportOptions)}
        onClose={() => setExportOptions(null)}
      >
        <MenuItem onClick={() => handleExport("csv")}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport("excel")}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport("pdf")}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={() => setBulkActionAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction("status")}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("delete")}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/** Create/Edit Feedback Modal **/}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "700px" },
            maxWidth: "90vw",
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
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
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
            padding: { xs: "20px", sm: "32px" },
            "& .MuiFormControl-root": {
              width: "100%",
            },
            "& form": {
              width: "100%",
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
            statusOptions={statusOptions[activeTab]}
          />
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: "12px", sm: "20px" },
            width: { xs: "95%", sm: "auto" },
            margin: { xs: "16px", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
          }}
        >
          Feedback Analytics
          <IconButton
            onClick={() => setShowAnalytics(false)}
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

        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {analyticsData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Feedback Overview
                  </Typography>
                  <Stack spacing={2}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Total Feedback</Typography>
                      <Typography fontWeight="bold">
                        {analyticsData.total}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Completion Rate</Typography>
                      <Typography fontWeight="bold">
                        {analyticsData.completionRate}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Overdue</Typography>
                      <Typography fontWeight="bold" color="error">
                        {analyticsData.overdue}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    By Status
                  </Typography>
                  <Stack spacing={2}>
                    {Object.entries(analyticsData.byStatus).map(
                      ([status, count]) => (
                        <Box
                          key={status}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ textTransform: "capitalize" }}>
                            {status.replace(/([A-Z])/g, " $1").trim()}
                          </Typography>
                          <Typography fontWeight="bold">{count}</Typography>
                        </Box>
                      )
                    )}
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    By Feedback Type
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {Object.entries(analyticsData.byType).map(
                      ([type, count]) => (
                        <Box
                          key={type}
                          sx={{
                            textAlign: "center",
                            p: 2,
                            minWidth: { xs: "100px", sm: "120px" },
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            flexGrow: { xs: 1, sm: 0 },
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              mb: 1,
                              color: "#1976d2",
                              fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                          >
                            {count}
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "capitalize",
                              color: "#64748b",
                              fontWeight: 500,
                              fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            }}
                          >
                            {type.replace(/([A-Z])/g, " $1").trim()}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: "12px", sm: "16px" },
            overflow: "hidden",
            width: { xs: "95%", sm: "auto" },
            margin: { xs: "16px", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
          }}
        >
          Feedback History
          <IconButton
            onClick={() => setShowHistory(false)}
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

        <DialogContent sx={{ p: 0 }}>
          {selectedFeedback && (
            <>
              <Box
                sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #e2e8f0" }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  {selectedFeedback.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For: {selectedFeedback.employee} • Status:{" "}
                  {selectedFeedback.status}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  maxHeight: { xs: "250px", sm: "300px" },
                  overflowY: "auto",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Activity Timeline
                </Typography>

                <Timeline position="right" sx={{ p: 0, m: 0 }}>
                  {selectedFeedback.history.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            item.action === "Created"
                              ? "success"
                              : item.action === "Updated"
                              ? "primary"
                              : item.action === "Comment"
                              ? "info"
                              : "grey"
                          }
                        />
                        {index < selectedFeedback.history.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="subtitle2"
                          component="span"
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                          {item.action} by {item.user}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {new Date(item.date).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {item.details}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Box>

              <Box sx={{ p: { xs: 2, sm: 3 }, borderTop: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Add Comment
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Type your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                  }}
                >
                  Add Comment
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Table or Cards based on screen size */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
          margin: "24px 0",
        }}
      >
        {isMobile ? (
          // Mobile Card View
          <Box sx={{ p: 2 }}>
            {filteredFeedbackData.length > 0 ? (
              filteredFeedbackData.map((item) => renderMobileCard(item))
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No feedback found. Try adjusting your filters or create a new
                  feedback.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setIsCreateModalOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Create Feedback
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          // Table View for Tablet and Desktop
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              {/* <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedItems.length > 0 &&
                        selectedItems.length < filteredFeedbackData.length
                      }
                      checked={
                        filteredFeedbackData.length > 0 &&
                        selectedItems.length === filteredFeedbackData.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
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
              </TableHead> */}
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    <Checkbox
                      indeterminate={
                        selectedItems.length > 0 &&
                        selectedItems.length < filteredFeedbackData.length
                      }
                      checked={
                        filteredFeedbackData.length > 0 &&
                        selectedItems.length === filteredFeedbackData.length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        color: "white",
                        "&.Mui-checked": { color: "white" },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Employee
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "white",
                      py: 2,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredFeedbackData.length > 0 ? (
                  filteredFeedbackData.map((item) => (
                    <TableRow
                      key={item._id || item.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        backgroundColor: selectedItems.includes(
                          item._id || item.id
                        )
                          ? "#e3f2fd"
                          : "inherit",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedItems.includes(item._id || item.id)}
                          onChange={() => handleSelectItem(item._id || item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.employee}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item._id || item.id,
                                e.target.value
                              )
                            }
                            size="small"
                            sx={{
                              height: "32px",
                              fontSize: "0.875rem",
                              "& .MuiSelect-select": { padding: "4px 14px" },
                            }}
                          >
                            {statusOptions[activeTab]?.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
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
                            onClick={() =>
                              handleViewHistory(item._id || item.id)
                            }
                            size="small"
                            sx={{
                              color: "#64748b",
                              "&:hover": { backgroundColor: "#f1f5f9" },
                            }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                          {/* <IconButton
                            onClick={() => handleDeleteClick(item._id || item.id)}
                            size="small"
                            sx={{
                              color: "#ef4444",
                              "&:hover": { backgroundColor: "#fee2e2" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton> */}
                          <IconButton
                            onClick={() => handleDeleteClick(item)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No feedback found. Try adjusting your filters or create
                        a new feedback.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setIsCreateModalOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Create Feedback
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            p: { xs: 1.5, sm: 2 },
            bgcolor: "white",
            borderRadius: "8px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
            zIndex: 10,
            mx: { xs: -1, sm: 0 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              {selectedItems.length}{" "}
              {selectedItems.length === 1 ? "item" : "items"} selected
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setSelectedItems([])}
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                Clear Selection
              </Button>

              <Button
                variant="contained"
                onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                size="small"
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  borderRadius: "8px",
                }}
              >
                Bulk Actions
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      <div className="pagination">Page 1 of 1</div>
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
        TransitionComponent={Fade}
        TransitionProps={{
          timeout: 300,
        }}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "center",
            alignItems: "center",
            "& .MuiPaper-root": {
              margin: { xs: "16px", sm: "32px" },
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            },
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
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              {/* Adjust these fields based on your actual data structure */}
              <Typography variant="body1" fontWeight={600} color="#2c3e50">
                {itemToDelete.feedbackTitle ||
                  itemToDelete.title ||
                  "Untitled Feedback"}
              </Typography>

              {/* Employee information */}
              {(itemToDelete.employeeName || itemToDelete.employee) && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  <strong>For:</strong>{" "}
                  {itemToDelete.employeeName ||
                    (typeof itemToDelete.employee === "object"
                      ? itemToDelete.employee.name
                      : itemToDelete.employee)}
                </Typography>
              )}

              {/* Feedback type */}
              {itemToDelete.feedbackType && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Type:</strong> {itemToDelete.feedbackType}
                </Typography>
              )}

              {/* Status */}
              {(itemToDelete.feedbackStatus || itemToDelete.status) && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong>{" "}
                  {itemToDelete.feedbackStatus || itemToDelete.status}
                </Typography>
              )}

              {/* Dates */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                {itemToDelete.startDate && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Start Date:</strong>{" "}
                    {isValidDate(new Date(itemToDelete.startDate))
                      ? new Date(itemToDelete.startDate).toLocaleDateString()
                      : "Invalid Date"}
                  </Typography>
                )}

                {itemToDelete.dueDate && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Due Date:</strong>{" "}
                    {isValidDate(new Date(itemToDelete.dueDate))
                      ? new Date(itemToDelete.dueDate).toLocaleDateString()
                      : "Invalid Date"}
                  </Typography>
                )}
              </Box>
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
    </div>
  );
};

export default Feedback;
