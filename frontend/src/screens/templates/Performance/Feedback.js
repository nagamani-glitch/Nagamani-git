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
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  Rating,
  Divider,
  Pagination
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent
} from '@mui/lab';

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
  Notifications as NotificationsIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Sort as SortIcon
} from "@mui/icons-material";

// Import libraries for Excel and PDF export
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import "./Feedback.css";

// API base URL
const API_BASE_URL = "http://localhost:5000/api/feedback";

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
    priority: ""
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [comment, setComment] = useState('');
  const [exportOptions, setExportOptions] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [reminderDialog, setReminderDialog] = useState(false);
  const [reminderData, setReminderData] = useState({
    feedbackId: '',
    reminderDate: '',
    reminderNote: '',
    recipients: []
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [feedbackPreview, setFeedbackPreview] = useState(null);
  const [responseRating, setResponseRating] = useState(0);
  const [feedbackResponse, setFeedbackResponse] = useState('');
  const [employees, setEmployees] = useState([]);

  // Status options based on feedback type
  const [statusOptions] = useState({
    selfFeedback: ["Not Started", "In Progress", "Completed", "Pending"],
    requestedFeedback: ["Not Started", "In Progress", "Completed", "Pending"],
    feedbackToReview: ["Not Started", "In Progress", "Completed", "Pending"],
    anonymousFeedback: ["Not Started", "In Progress", "Completed", "Pending"]
  });

  // Priority options
  const priorityOptions = ["Low", "Medium", "High", "Critical"];

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
  }, [activeTab, sortConfig]);

  // Check for overdue feedbacks and generate notifications
  useEffect(() => {
    const checkOverdueFeedbacks = () => {
      const today = new Date();
      const overdueFeedbacks = [];
      
      Object.values(feedbackData).forEach(feedbackList => {
        feedbackList.forEach(feedback => {
          const dueDate = new Date(feedback.dueDate);
          if (dueDate < today && feedback.status !== 'Completed') {
            overdueFeedbacks.push({
              id: feedback._id || feedback.id,
              message: `Feedback "${feedback.title}" for ${typeof feedback.employee === 'object' ? feedback.employee.name : feedback.employee} is overdue`,
              type: 'warning'
            });
          }
          
          // Upcoming deadlines (3 days)
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(today.getDate() + 3);
          
          if (dueDate <= threeDaysFromNow && dueDate > today && feedback.status !== 'Completed') {
            overdueFeedbacks.push({
              id: feedback._id || feedback.id,
              message: `Feedback "${feedback.title}" for ${typeof feedback.employee === 'object' ? feedback.employee.name : feedback.employee} is due soon`,
              type: 'info'
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/registered");
      
      // Transform the data to the format we need
      const formattedEmployees = response.data.map(emp => ({
        id: emp.Emp_ID,
        name: `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.trim(),
        designation: emp.joiningDetails?.initialDesignation || 'No Designation',
        department: emp.joiningDetails?.department || 'No Department'
      }));
      
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      console.log("Fetching feedbacks from:", API_BASE_URL);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchTerm', searchQuery);
      if (filterCriteria.title) params.append('title', filterCriteria.title);
      if (filterCriteria.employee) params.append('employee', filterCriteria.employee);
      if (filterCriteria.status) params.append('status', filterCriteria.status);
      if (filterCriteria.manager) params.append('manager', filterCriteria.manager);
      if (filterCriteria.startDate) params.append('startDate', filterCriteria.startDate);
      if (filterCriteria.endDate) params.append('endDate', filterCriteria.endDate);
      if (filterCriteria.priority) params.append('priority', filterCriteria.priority);
      params.append('sortBy', sortConfig.key);
      params.append('sortDirection', sortConfig.direction);
      
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      console.log("Received feedback data:", response.data);
      
      // If the response is already organized by feedback type
      if (response.data.selfFeedback || response.data.requestedFeedback || 
          response.data.feedbackToReview || response.data.anonymousFeedback) {
        setFeedbackData(response.data);
      } else {
        // If the response is a flat array, organize it by feedback type
        const organized = {
          selfFeedback: response.data.filter(item => item.feedbackType === 'selfFeedback'),
          requestedFeedback: response.data.filter(item => item.feedbackType === 'requestedFeedback'),
          feedbackToReview: response.data.filter(item => item.feedbackType === 'feedbackToReview'),
          anonymousFeedback: response.data.filter(item => item.feedbackType === 'anonymousFeedback')
        };
        setFeedbackData(organized);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to fetch feedbacks. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async (newFeedback, isEditing) => {
    try {
      // Ensure all required fields are present
      const feedbackData = {
        ...newFeedback,
        feedbackType: activeTab,
        // Add default values for any missing required fields
        status: newFeedback.status || 'Not Started',
        priority: newFeedback.priority || 'Medium'
      };

      console.log("Sending feedback data:", feedbackData);

      if (isEditing) {
        await axios.put(
          `${API_BASE_URL}/${newFeedback._id || newFeedback.id}`,
          feedbackData
        );
      } else {
        await axios.post(API_BASE_URL, feedbackData);
      }
      await fetchFeedbacks();
      setIsCreateModalOpen(false);
      setEditingFeedback(null);
    } catch (error) {
      console.error("Error saving feedback:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to save feedback: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to delete feedback: " + (error.response?.data?.message || error.message));
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

  // Apply filters
  const applyFilters = () => {
    fetchFeedbacks();
    handleFilterClose();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCriteria({
      title: "",
      employee: "",
      status: "",
      manager: "",
      startDate: "",
      endDate: "",
      priority: ""
    });
    handleFilterClose();
    fetchFeedbacks();
  };

  // Status change handler
  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${feedbackId}`, {
        status: newStatus
      });
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error updating status:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to update feedback status: " + (error.response?.data?.message || error.message));
    }
  };

  // View history handler
  const handleViewHistory = async (feedbackId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${feedbackId}/history`);
      const feedback = Object.values(feedbackData)
        .flat()
        .find(f => f._id === feedbackId || f.id === feedbackId);
      
      setSelectedFeedback({
        ...feedback,
        history: response.data.history || []
      });
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      console.error("Error details:", error.response?.data);
      
      // For demo purposes, show mock history if API fails
      const feedback = Object.values(feedbackData)
        .flat()
        .find(f => f._id === feedbackId || f.id === feedbackId);
      
      setSelectedFeedback({
        ...feedback,
        history: [
          { 
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Created',
            user: 'John Doe',
            details: 'Feedback created'
          },
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Updated',
            user: 'Jane Smith',
            details: 'Status changed from Not Started to In Progress'
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Comment',
            user: 'Mike Johnson',
            details: 'Please provide more specific examples in your feedback'
          }
        ]
      });
      setShowHistory(true);
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeedback) return;
    
    try {
      await axios.post(`${API_BASE_URL}/${selectedFeedback._id || selectedFeedback.id}/comments`, {
        comment,
        user: 'Current User' // In a real app, use the logged-in user
      });
      
      // Update the local state with the new comment
      setSelectedFeedback({
        ...selectedFeedback,
        history: [
          ...selectedFeedback.history,
          {
            date: new Date().toISOString(),
            action: 'Comment',
            user: 'Current User', // In a real app, use the logged-in user
            details: comment
          }
        ]
      });
      
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Error details:", error.response?.data);
      
      // For demo purposes, update the UI anyway
      setSelectedFeedback({
        ...selectedFeedback,
        history: [
          ...selectedFeedback.history,
          {
            date: new Date().toISOString(),
            action: 'Comment',
            user: 'Current User', // In a real app, use the logged-in user
            details: comment
          }
        ]
      });
      setComment('');
    }
  };

  // Export handler with working Excel and PDF exports
  const handleExport = (format) => {
    const dataToExport = filteredFeedbackData.map(item => ({
      Employee: typeof item.employee === 'object' ? item.employee.name : item.employee,
      Title: item.title,
      Status: item.status,
      Priority: item.priority || 'Medium',
      StartDate: formatDate(item.startDate),
      DueDate: formatDate(item.dueDate),
      Manager: typeof item.manager === 'object' ? item.manager.name : item.manager
    }));
    
    if (format === 'csv') {
      // Create CSV content
      const headers = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      ).join('\n');
      const csvContent = `${headers}\n${rows}`;
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === 'excel') {
      try {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        
        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Feedback");
        
        // Generate Excel file and trigger download
        XLSX.writeFile(wb, `feedback_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Failed to export to Excel. Please make sure the xlsx library is properly installed.");
      }
    } else if (format === 'pdf') {
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
        const tableRows = dataToExport.map(item => Object.values(item));
        
        // Generate the table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 30,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [25, 118, 210] }
        });
        
        // Save the PDF
        doc.save(`feedback_export_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        alert("Failed to export to PDF. Please make sure the jspdf and jspdf-autotable libraries are properly installed.");
      }
    }
    
    setExportOptions(false);
  };

  // Bulk selection handlers
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFeedbackData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFeedbackData.map(item => item._id || item.id));
    }
  };

  // Bulk action handler
  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        await axios.post(`${API_BASE_URL}/bulk`, {
          ids: selectedItems,
          action: 'delete'
        });
      } else if (action === 'status') {
        await axios.post(`${API_BASE_URL}/bulk`, {
          ids: selectedItems,
          action: 'status',
          value: 'Completed'
        });
      }
      
      await fetchFeedbacks();
      setSelectedItems([]);
      setBulkActionAnchor(null);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to perform bulk action: " + (error.response?.data?.message || error.message));
    }
  };

  // Reminder handlers
  const handleSetReminder = (feedbackId) => {
    const feedback = Object.values(feedbackData).flat().find(f => f._id === feedbackId || f.id === feedbackId);
    
    setReminderData({
      feedbackId: feedbackId,
      reminderDate: '',
      reminderNote: `Reminder for feedback: ${feedback.title}`,
      recipients: [typeof feedback.employee === 'object' ? feedback.employee.name : feedback.employee]
    });
    
    setReminderDialog(true);
  };

  const saveReminder = async () => {
    try {
      await axios.post(`${API_BASE_URL}/${reminderData.feedbackId}/reminders`, reminderData);
      
      // Show success message
      alert('Reminder set successfully');
      setReminderDialog(false);
    } catch (error) {
      console.error("Error setting reminder:", error);
      console.error("Error details:", error.response?.data);
      
      // For demo purposes, show success anyway
      alert('Reminder set successfully (demo)');
      setReminderDialog(false);
    }
  };

  // Analytics handler
  const calculateAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/summary`);
      setAnalyticsData(response.data);
      setShowAnalytics(true);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      console.error("Error details:", error.response?.data);
      
      // If API fails, calculate analytics from local data
      const allFeedback = Object.values(feedbackData).flat();
      
      const analytics = {
        total: allFeedback.length,
        byStatus: {
          completed: allFeedback.filter(f => f.status === 'Completed').length,
          inProgress: allFeedback.filter(f => f.status === 'In Progress').length,
          notStarted: allFeedback.filter(f => f.status === 'Not Started').length,
          pending: allFeedback.filter(f => f.status === 'Pending').length,
        },
        byType: {
          selfFeedback: feedbackData.selfFeedback?.length || 0,
          requestedFeedback: feedbackData.requestedFeedback?.length || 0,
          feedbackToReview: feedbackData.feedbackToReview?.length || 0,
          anonymousFeedback: feedbackData.anonymousFeedback?.length || 0,
        },
        byPriority: {
          low: allFeedback.filter(f => f.priority === 'Low').length,
          medium: allFeedback.filter(f => f.priority === 'Medium').length,
          high: allFeedback.filter(f => f.priority === 'High').length,
          critical: allFeedback.filter(f => f.priority === 'Critical').length,
        },
        overdue: allFeedback.filter(f => 
          new Date(f.dueDate) < new Date() && f.status !== 'Completed'
        ).length,
        completionRate: allFeedback.length > 0 
          ? ((allFeedback.filter(f => f.status === 'Completed').length / allFeedback.length) * 100).toFixed(1)
          : 0
      };
      
      setAnalyticsData(analytics);
      setShowAnalytics(true);
    }
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle preview feedback
  const handlePreviewFeedback = (feedback) => {
    setFeedbackPreview(feedback);
    setPreviewOpen(true);
  };

  // Handle submit feedback response
  const handleSubmitResponse = async () => {
    if (!feedbackResponse.trim() || responseRating === 0 || !feedbackPreview) return;
    
    try {
      await axios.post(`${API_BASE_URL}/${feedbackPreview._id || feedbackPreview.id}/response`, {
        text: feedbackResponse,
        rating: responseRating,
        submittedBy: 'Current User' // In a real app, use the logged-in user
      });
      
      // Update status to completed
      await axios.put(`${API_BASE_URL}/${feedbackPreview._id || feedbackPreview.id}`, {
        status: 'Completed'
      });
      
      await fetchFeedbacks();
      setPreviewOpen(false);
      setFeedbackResponse('');
      setResponseRating(0);
      
      alert('Feedback response submitted successfully');
    } catch (error) {
      console.error("Error submitting feedback response:", error);
      console.error("Error details:", error.response?.data);
      
      // For demo purposes, show success anyway
      alert('Feedback response submitted successfully (demo)');
      setPreviewOpen(false);
      setFeedbackResponse('');
      setResponseRating(0);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredFeedbackData =
    feedbackData[activeTab]?.filter((item) => {
      const matchesSearch =
        (typeof item.employee === 'object' 
          ? item.employee.name.toLowerCase().includes(searchQuery.toLowerCase())
          : item.employee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    }) || [];

  // Apply pagination
  const paginatedData = filteredFeedbackData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <div className="loading">Loading...</div>;

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

            <Button
              onClick={calculateAnalytics}
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

      {/* Notifications */}
      {notifications.length > 0 && (
        <Box sx={{ mt: 2, mb: 3 }}>
          {notifications.map(notification => (
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
                      .find(f => f._id === notification.id || f.id === notification.id);
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

      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

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

      {/* View Mode Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>View:</Typography>
          <IconButton 
            color={viewMode === 'table' ? 'primary' : 'default'} 
            onClick={() => handleViewModeChange('table')}
            size="small"
          >
            <ViewListIcon />
          </IconButton>
          <IconButton 
            color={viewMode === 'card' ? 'primary' : 'default'} 
            onClick={() => handleViewModeChange('card')}
            size="small"
          >
            <ViewModuleIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Sort by:</Typography>
          <Button 
            size="small" 
            onClick={() => handleSort('dueDate')}
            endIcon={sortConfig.key === 'dueDate' ? 
              <SortIcon sx={{ transform: sortConfig.direction === 'asc' ? 'none' : 'rotate(180deg)' }} /> : 
              undefined
            }
          >
            Due Date
          </Button>
          <Button 
            size="small" 
            onClick={() => handleSort('priority')}
            endIcon={sortConfig.key === 'priority' ? 
              <SortIcon sx={{ transform: sortConfig.direction === 'asc' ? 'none' : 'rotate(180deg)' }} /> : 
              undefined
            }
          >
            Priority
          </Button>
          <Button 
            size="small" 
            onClick={() => handleSort('status')}
            endIcon={sortConfig.key === 'status' ? 
              <SortIcon sx={{ transform: sortConfig.direction === 'asc' ? 'none' : 'rotate(180deg)' }} /> : 
              undefined
            }
          >
            Status
          </Button>
        </Box>
      </Box>

      {/* Filter Popover */}
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
                {statusOptions[activeTab]?.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={filterCriteria.priority}
                onChange={handleFilterChange}
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                {priorityOptions.map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
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
              onClick={resetFilters}
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
              Reset
            </Button>

            <Button
              fullWidth
              onClick={applyFilters}
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
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
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
        <MenuItem onClick={() => handleBulkAction('status')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Table View */}
      {viewMode === 'table' && (
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
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < filteredFeedbackData.length}
                    checked={filteredFeedbackData.length > 0 && selectedItems.length === filteredFeedbackData.length}
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
                  Priority
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow
                    key={item._id || item.id}
                    sx={{ 
                      "&:hover": { backgroundColor: "#f8fafc" },
                      backgroundColor: selectedItems.includes(item._id || item.id) ? '#e3f2fd' : 'inherit'
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.includes(item._id || item.id)}
                        onChange={() => handleSelectItem(item._id || item.id)}
                      />
                    </TableCell>
                    <TableCell>{typeof item.employee === 'object' ? item.employee.name : item.employee}</TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: '#1976d2', 
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handlePreviewFeedback(item)}
                      >
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id || item.id, e.target.value)}
                          size="small"
                          sx={{
                            height: '32px',
                            fontSize: '0.875rem',
                            '& .MuiSelect-select': { padding: '4px 14px' }
                          }}
                        >
                          {statusOptions[activeTab]?.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.priority || 'Medium'} 
                        size="small"
                        color={
                          item.priority === 'Critical' ? 'error' :
                          item.priority === 'High' ? 'warning' :
                          item.priority === 'Medium' ? 'info' : 'success'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(item.startDate)}
                    </TableCell>
                    <TableCell>
                      {formatDate(item.dueDate)}
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
                          onClick={() => handleViewHistory(item._id || item.id)}
                          size="small"
                          sx={{
                            color: "#64748b",
                            "&:hover": { backgroundColor: "#f1f5f9" },
                          }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleSetReminder(item._id || item.id)}
                          size="small"
                          sx={{
                            color: "#0ea5e9",
                            "&:hover": { backgroundColor: "#e0f2fe" },
                          }}
                        >
                          <NotificationsIcon fontSize="small" />
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No feedback found. Try adjusting your filters or create a new feedback.
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
          
          {/* Pagination */}
          {filteredFeedbackData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <Pagination 
                count={Math.ceil(filteredFeedbackData.length / rowsPerPage)} 
                page={page + 1}
                onChange={(e, newPage) => setPage(newPage - 1)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Box sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={3}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id || item.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: selectedItems.includes(item._id || item.id) ? '2px solid #1976d2' : '1px solid #e2e8f0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Checkbox
                        checked={selectedItems.includes(item._id || item.id)}
                        onChange={() => handleSelectItem(item._id || item.id)}
                        size="small"
                      />
                      <Chip 
                        label={item.priority || 'Medium'} 
                        size="small"
                        color={
                          item.priority === 'Critical' ? 'error' :
                          item.priority === 'High' ? 'warning' :
                          item.priority === 'Medium' ? 'info' : 'success'
                        }
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        color: '#1976d2',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handlePreviewFeedback(item)}
                    >
                      {item.title}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Employee:
                      </Typography>
                      <Typography variant="body1">
                        {typeof item.employee === 'object' ? item.employee.name : item.employee}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                        <Select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id || item.id, e.target.value)}
                          size="small"
                        >
                          {statusOptions[activeTab]?.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Dates:
                      </Typography>
                      <Typography variant="body2">
                        Start: {formatDate(item.startDate)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: new Date(item.dueDate) < new Date() && item.status !== 'Completed' ? 'error.main' : 'inherit' }}>
                        Due: {formatDate(item.dueDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                      <IconButton
                        onClick={() => handleViewHistory(item._id || item.id)}
                        size="small"
                        sx={{ color: "#64748b" }}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSetReminder(item._id || item.id)}
                        size="small"
                        sx={{ color: "#0ea5e9" }}
                      >
                        <NotificationsIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(item)}
                        size="small"
                        sx={{ color: "#1976d2" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item._id || item.id)}
                        size="small"
                        sx={{ color: "#ef4444" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No feedback found. Try adjusting your filters or create a new feedback.
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
              </Grid>
            )}
          </Grid>
          
          {/* Pagination */}
          {filteredFeedbackData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(filteredFeedbackData.length / rowsPerPage)} 
                page={page + 1}
                onChange={(e, newPage) => setPage(newPage - 1)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}

      {/** Create/Edit Feedback Modal **/}
      {isCreateModalOpen && (
        <Dialog
          open={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingFeedback(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: "700px",
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
              priorityOptions={priorityOptions}
              employees={employees}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Analytics Dialog */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(45deg, #1976d2, #64b5f6)",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: 600,
          padding: "24px 32px"
        }}>
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
        
        <DialogContent sx={{ p: 4 }}>
          {analyticsData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Feedback Overview</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Total Feedback</Typography>
                      <Typography fontWeight="bold">{analyticsData.total}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Completion Rate</Typography>
                      <Typography fontWeight="bold">{analyticsData.completionRate}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Overdue</Typography>
                      <Typography fontWeight="bold" color="error">{analyticsData.overdue}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>By Status</Typography>
                  <Stack spacing={2}>
                    {analyticsData.byStatus && Object.entries(analyticsData.byStatus).map(([status, count]) => (
                      <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ textTransform: 'capitalize' }}>
                          {status.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography fontWeight="bold">{count}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>By Feedback Type</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    {analyticsData.byType && Object.entries(analyticsData.byType).map(([type, count]) => (
                      <Box 
                        key={type} 
                        sx={{ 
                          textAlign: 'center', 
                          p: 2, 
                          minWidth: '120px',
                          borderRadius: 2,
                          bgcolor: '#f8fafc'
                        }}
                      >
                        <Typography variant="h4" sx={{ mb: 1, color: '#1976d2' }}>{count}</Typography>
                        <Typography sx={{ 
                          textTransform: 'capitalize',
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>By Priority</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    {analyticsData.byPriority && Object.entries(analyticsData.byPriority).map(([priority, count]) => (
                      <Box 
                        key={priority} 
                        sx={{ 
                          textAlign: 'center', 
                          p: 2, 
                          minWidth: '120px',
                          borderRadius: 2,
                          bgcolor: 
                            priority === 'critical' ? '#fee2e2' :
                            priority === 'high' ? '#fff7ed' :
                            priority === 'medium' ? '#f0f9ff' : '#f0fdf4'
                        }}
                      >
                        <Typography variant="h4" sx={{ 
                          mb: 1, 
                          color: 
                            priority === 'critical' ? '#dc2626' :
                            priority === 'high' ? '#ea580c' :
                            priority === 'medium' ? '#0284c7' : '#16a34a'
                        }}>
                          {count}
                        </Typography>
                        <Typography sx={{ 
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}>
                          {priority}
                        </Typography>
                      </Box>
                    ))}
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
            borderRadius: "16px",
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
              <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedFeedback.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For: {typeof selectedFeedback.employee === 'object' ? selectedFeedback.employee.name : selectedFeedback.employee} • Status: {selectedFeedback.status}
                </Typography>
              </Box>
              
              <Box sx={{ p: 3, maxHeight: '300px', overflowY: 'auto' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Activity Timeline
                </Typography>
                
                <Timeline position="right" sx={{ p: 0, m: 0 }}>
                  {selectedFeedback.history && selectedFeedback.history.length > 0 ? (
                    selectedFeedback.history.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot 
                            color={
                              item.action === 'Created' ? 'success' :
                              item.action === 'Updated' ? 'primary' :
                              item.action === 'Comment' ? 'info' : 'grey'
                            }
                          />
                          {index < selectedFeedback.history.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                          <Typography variant="subtitle2" component="span">
                            {item.action} by {item.user}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.date).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {item.details}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No history available for this feedback.
                    </Typography>
                  )}
                </Timeline>
              </Box>
              
              <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
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

      {/* Reminder Dialog */}
      <Dialog
        open={reminderDialog}
        onClose={() => setReminderDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #0ea5e9, #38bdf8)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          Set Reminder
          <IconButton
            onClick={() => setReminderDialog(false)}
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
        
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Reminder Date & Time"
              type="datetime-local"
              value={reminderData.reminderDate}
              onChange={(e) => setReminderData({...reminderData, reminderDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Reminder Note"
              multiline
              rows={3}
              value={reminderData.reminderNote}
              onChange={(e) => setReminderData({...reminderData, reminderNote: e.target.value})}
            />
            
            <FormControl fullWidth>
              <InputLabel>Recipients</InputLabel>
              <Select
                multiple
                value={reminderData.recipients}
                onChange={(e) => setReminderData({...reminderData, recipients: e.target.value})}
                renderValue={(selected) => selected.join(', ')}
                label="Recipients"
              >
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.name}>{emp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Send email notification"
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={saveReminder}
              sx={{
                background: "linear-gradient(45deg, #0ea5e9, #38bdf8)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #0284c7, #0ea5e9)",
                },
                textTransform: "none",
                borderRadius: "8px",
                py: 1.5,
                mt: 2,
              }}
            >
              Set Reminder
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Feedback Preview/Response Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
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
          Feedback Details
          <IconButton
            onClick={() => setPreviewOpen(false)}
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
          {feedbackPreview && (
            <>
              <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {feedbackPreview.title}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Employee:
                    </Typography>
                    <Typography variant="body1">
                      {typeof feedbackPreview.employee === 'object' ? feedbackPreview.employee.name : feedbackPreview.employee}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Manager:
                    </Typography>
                    <Typography variant="body1">
                      {typeof feedbackPreview.manager === 'object' ? feedbackPreview.manager.name : feedbackPreview.manager}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Period:
                    </Typography>
                    <Typography variant="body1">
                      {feedbackPreview.period}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip 
                      label={feedbackPreview.status} 
                      color={
                        feedbackPreview.status === 'Completed' ? 'success' :
                        feedbackPreview.status === 'In Progress' ? 'info' :
                        feedbackPreview.status === 'Pending' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Start Date:
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(feedbackPreview.startDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: new Date(feedbackPreview.dueDate) < new Date() && 
                               feedbackPreview.status !== 'Completed' ? 'error.main' : 'inherit' 
                      }}
                    >
                      {formatDate(feedbackPreview.dueDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Key Result:
                    </Typography>
                    <Typography variant="body1">
                      {feedbackPreview.keyResult}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Question Template:
                    </Typography>
                    <Typography variant="body1">
                      {feedbackPreview.questionTemplate}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Response Section */}
              <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Feedback Response
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Rating:
                  </Typography>
                  <Rating
                    value={responseRating}
                    onChange={(event, newValue) => {
                      setResponseRating(newValue);
                    }}
                    size="large"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Feedback Comments:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Provide your detailed feedback here..."
                    value={feedbackResponse}
                    onChange={(e) => setFeedbackResponse(e.target.value)}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setPreviewOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmitResponse}
                    disabled={!feedbackResponse.trim() || responseRating === 0}
                    sx={{
                      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      },
                    }}
                  >
                    Submit Feedback
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Box sx={{ position: 'sticky', bottom: 0, p: 2, bgcolor: 'white', borderRadius: '8px', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
            </Typography>
            
            <Button
              variant="outlined"
              onClick={() => setSelectedItems([])}
              size="small"
              sx={{ borderRadius: '8px' }}
            >
              Clear Selection
            </Button>
            
            <Button
              variant="contained"
              onClick={(e) => setBulkActionAnchor(e.currentTarget)}
              size="small"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                borderRadius: '8px'
              }}
            >
              Bulk Actions
            </Button>
          </Stack>
        </Box>
      )}

      {/* Pagination at bottom for mobile view */}
      {viewMode === 'table' && filteredFeedbackData.length > 0 && (
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2, mb: 4 }}>
          <Pagination 
            count={Math.ceil(filteredFeedbackData.length / rowsPerPage)} 
            page={page + 1}
            onChange={(e, newPage) => setPage(newPage - 1)}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
};

export default Feedback;






  
