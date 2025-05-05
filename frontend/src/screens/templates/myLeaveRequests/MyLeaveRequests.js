import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import axios from "axios";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import isWeekend from "date-fns/isWeekend";
import addDays from "date-fns/addDays";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNotifications } from '../../../context/NotificationContext';

const LEAVE_TYPES = [
  { value: "annual", label: "Annual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "earned", label: "Earned Leave" },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
];

const API_URL = "http://localhost:5002/api/leave-requests";
const EMPLOYEE_API_URL = "http://localhost:5002/api/employees";

const MyLeaveRequests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { notifications, markAsRead } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    leaveType: "annual",
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
    halfDay: false,
    halfDayType: "morning",
  });

  useEffect(() => {
    // First fetch the employee data
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Only fetch leave data once we have employee data
    if (employee) {
      fetchLeaveRequests();
      fetchLeaveBalance();
      fetchLeaveStatistics();
    }
  }, [employee]);

  // Add this useEffect to check for notifications related to this user's leave requests
  useEffect(() => {
    if (employee && notifications.length > 0) {
      // Find notifications related to this employee's leave requests
      const userNotifications = notifications.filter(notification => 
        notification.type === 'leave' && 
        notification.message.includes(employee.name)
      );
      
      // If there are unread notifications, show a snackbar
      const unreadNotifications = userNotifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        showSnackbar(`You have ${unreadNotifications.length} new leave request update(s)`, "info");
      }
    }
  }, [employee, notifications]);

  // Add this useEffect to recalculate days when form data changes
useEffect(() => {
  // This will run whenever formData changes
  console.log("Form data changed:", formData);
  
  // No need to do anything else as the render will show the updated days
}, [formData]);


  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      // Get the user ID from localStorage or your auth context
      const userId = localStorage.getItem('userId'); // Adjust based on your auth implementation
      
      if (!userId) {
        showSnackbar("User not authenticated", "error");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${EMPLOYEE_API_URL}/by-user/${userId}`);
      
      if (response.data.success && response.data.data) {
        const employeeData = response.data.data;
        setEmployee({
          code: employeeData.Emp_ID,
          name: `${employeeData.personalInfo?.firstName || ''} ${employeeData.personalInfo?.lastName || ''}`,
          department: employeeData.joiningDetails?.department || 'Not Assigned'
        });
        console.log("Employee data fetched:", employeeData);
      } else {
        showSnackbar("Failed to fetch employee data", "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      showSnackbar("Error fetching employee data", "error");
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employee/${employee.code}`);
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      showSnackbar("Error fetching leave requests", "error");
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/balance/${employee.code}`);
      setLeaveBalance(response.data);
      console.log("Leave balance fetched:", response.data);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      showSnackbar("Error fetching leave balance", "error");
    }
  };

  const fetchLeaveStatistics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/statistics/${employee.code}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching leave statistics:", error);
    }
  };

  const fetchUpdatedEarnedLeaveBalance = async () => {
    try {
      // Call the new endpoint to update earned leave balance
      await axios.post(`${API_URL}/update-earned-leave`);

      // Then fetch the updated balance
      await fetchLeaveBalance();

      showSnackbar("Earned leave balance updated successfully");
    } catch (error) {
      console.error("Error updating earned leave balance:", error);
      showSnackbar("Error updating earned leave balance", "error");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setFormData({
      leaveType: "annual",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      halfDay: false,
      halfDayType: "morning",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const handleInputChange = (field, value) => {
  //   if (field === "halfDay" && value === true) {
  //     // If half day is selected, set end date equal to start date
  //     setFormData({
  //       ...formData,
  //       [field]: value,
  //       endDate: formData.startDate,
  //     });
  //   } else if (field === "startDate" && formData.halfDay) {
  //     // If changing start date while half day is selected, update end date too
  //     setFormData({
  //       ...formData,
  //       [field]: value,
  //       endDate: value,
  //     });
  //   } else {
  //     // Normal case
  //     setFormData({
  //       ...formData,
  //       [field]: value,
  //     });
  //   }
  // };

  // const calculateBusinessDays = (start, end, isHalfDay) => {
  //   if (isHalfDay) return 0.5;

  //   let count = 0;
  //   let currentDate = new Date(start);

  //   while (currentDate <= end) {
  //     if (!isWeekend(currentDate)) {
  //       count++;
  //     }
  //     currentDate = addDays(currentDate, 1);
  //   }

  //   return count;
  // };

  // Update the calculateBusinessDays function to ensure it handles date objects properly

// Update the handleInputChange function to recalculate days when dates change
const handleInputChange = (field, value) => {
  let updatedFormData = { ...formData };
  
  if (field === "halfDay" && value === true) {
    // If half day is selected, set end date equal to start date
    updatedFormData = {
      ...formData,
      [field]: value,
      endDate: formData.startDate,
    };
  } else if (field === "startDate" && formData.halfDay) {
    // If changing start date while half day is selected, update end date too
    updatedFormData = {
      ...formData,
      [field]: value,
      endDate: value,
    };
  } else {
    // Normal case
    updatedFormData = {
      ...formData,
      [field]: value,
    };
  }
  
  // Update the form data
  setFormData(updatedFormData);
  
  // Force a re-render to update the displayed number of days
  // This is needed because the number of days might not update automatically
  if (field === "startDate" || field === "endDate" || field === "halfDay") {
    // Use setTimeout to ensure the state has been updated
    setTimeout(() => {
      const daysElement = document.getElementById('leave-days-count');
      if (daysElement) {
        daysElement.textContent = calculateBusinessDays(
          updatedFormData.startDate,
          updatedFormData.endDate,
          updatedFormData.halfDay
        );
      }
    }, 0);
  }
};

  const calculateBusinessDays = (start, end, isHalfDay) => {
  if (isHalfDay) return 0.5;

  // Make sure we're working with Date objects
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  // Log the dates for debugging
  console.log("Calculating business days between:", startDate, endDate);
  
  let count = 0;
  let currentDate = new Date(startDate);

  // Ensure the dates are valid before proceeding
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date objects:", { start, end });
    return 0;
  }

  while (currentDate <= endDate) {
    // Only count weekdays (Monday to Friday)
    if (!isWeekend(currentDate)) {
      count++;
    }
    currentDate = addDays(currentDate, 1);
  }

  console.log("Calculated business days:", count);
  return count;
};

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const numberOfDays = calculateBusinessDays(
        formData.startDate,
        formData.endDate,
        formData.halfDay
      );

      // Check if there's sufficient balance
      const availableBalance = getAvailableBalance(formData.leaveType);
      console.log(
        `Requesting ${numberOfDays} days of ${formData.leaveType} leave`
      );
      console.log(`Available balance: ${availableBalance} days`);

      // Add this check to prevent submission when balance is insufficient
      if (numberOfDays > availableBalance) {
        showSnackbar(
          `Insufficient ${formData.leaveType} leave balance. Available: ${availableBalance} days, Requested: ${numberOfDays} days`,
          "error"
        );
        setLoading(false);
        return; // Stop execution here to prevent the API call
      }

      // Format dates as strings in YYYY-MM-DD format
      const formatDateToString = (date) => {
        return format(date, "yyyy-MM-dd");
      };

      const leaveData = {
        employeeCode: employee.code,
        employeeName: employee.name,
        leaveType: formData.leaveType,
        startDate: formatDateToString(formData.startDate),
        endDate: formatDateToString(formData.endDate),
        reason: formData.reason,
        halfDay: formData.halfDay,
        halfDayType: formData.halfDayType,
        numberOfDays,
      };

      console.log("Submitting leave request:", leaveData);

      const response = await axios.post(API_URL, leaveData);
      console.log("Response:", response.data);

      setOpenDialog(false);
      fetchLeaveRequests();
      fetchLeaveBalance();
      fetchLeaveStatistics();
      showSnackbar("Leave request submitted successfully");
    } catch (error) {
      console.error("Error submitting leave request:", error);

      // Extract detailed error message from response
      let errorMessage = "Error submitting leave request";
      if (error.response) {
        console.log("Server error details:", error.response.data);
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      fetchLeaveRequests();
      fetchLeaveBalance();
      fetchLeaveStatistics();
      showSnackbar("Leave request deleted successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error deleting leave request:", error);
      showSnackbar("Error deleting leave request", "error");
      setLoading(false);
    }
  };
  //   // Add this function to refresh the leave balance
  // const refreshLeaveBalance = async () => {
  //   try {
  //     setLoading(true);
  //     await fetchLeaveBalance();
  //     await fetchLeaveStatistics();
  //     showSnackbar("Leave balance refreshed successfully");
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error refreshing leave balance:", error);
  //     showSnackbar("Error refreshing leave balance", "error");
  //     setLoading(false);
  //   }
  // };
  // Add this function to refresh the leave balance
  const refreshLeaveBalance = async () => {
    try {
      setLoading(true);
      // Call the recalculate endpoint
      await axios.post(`${API_URL}/recalculate-balance/${employee.code}`);
      // Then fetch the updated balance
      await fetchLeaveBalance();
      await fetchLeaveStatistics();
      showSnackbar("Leave balance recalculated successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error recalculating leave balance:", error);
      showSnackbar("Error recalculating leave balance", "error");
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

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Chip label="Approved" color="success" size="small" />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const getLeaveTypeName = (type) => {
    const leaveType = LEAVE_TYPES.find((t) => t.value === type);
    return leaveType ? leaveType.label : type;
  };

  const getAvailableBalance = (type) => {
    if (!leaveBalance) return 0;

    const balance = leaveBalance[type];
    if (!balance) {
      console.warn(`No balance found for leave type: ${type}`);
      return 0;
    }

    const total = balance.total || 0;
    const used = balance.used || 0;
    const pending = balance.pending || 0;
    const available = total - used - pending;

    return available;
  };

  // Fix for the error: Convert object to array for chart data
  const getMonthlyChartData = (statistics) => {
    if (
      !statistics ||
      !statistics.statistics ||
      !statistics.statistics.monthlyUsage
    ) {
      return [];
    }

    // Convert the monthlyUsage object to an array of objects
    return Object.entries(statistics.statistics.monthlyUsage).map(
      ([month, days]) => ({
        month,
        days,
      })
    );
  };

  // Fix for the error: Convert object to array for chart data
  const getLeaveTypeChartData = (statistics) => {
    if (
      !statistics ||
      !statistics.statistics ||
      !statistics.statistics.leaveTypeUsage
    ) {
      return [];
    }

    // Convert the leaveTypeUsage object to an array of objects
    return Object.entries(statistics.statistics.leaveTypeUsage).map(
      ([type, days]) => ({
        type: getLeaveTypeName(type),
        days,
        value: days, // For pie chart
      })
    );
  };

  // Render mobile card view for leave requests
  const renderLeaveRequestCard = (request) => (
    <Card
      sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      key={request._id}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {getLeaveTypeName(request.leaveType)}
          </Typography>
          {getStatusChip(request.status)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <CalendarIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2">
                {new Date(request.startDate).toLocaleDateString()} -{" "}
                {new Date(request.endDate).toLocaleDateString()}
                {request.halfDay && ` (${request.halfDayType} Half Day)`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.numberOfDays}{" "}
                {request.numberOfDays === 1 ? "day" : "days"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Reason
              </Typography>
              <Typography variant="body2">{request.reason}</Typography>
            </Box>
          </Box>

          {request.status === "rejected" && request.rejectionReason && (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <InfoIcon fontSize="small" color="error" sx={{ mt: 0.3 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Rejection Reason
                </Typography>
                <Typography variant="body2" color="error.main">
                  {request.rejectionReason}
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>

        {request.status === "pending" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteRequest(request._id)}
            >
              Cancel
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Render mobile card view for leave balance
  const renderLeaveBalanceCard = (type, balance) => {
    const total = balance.total;
    const used = balance.used;
    const pending = balance.pending;
    const available = total - used - pending;
    const usedPercentage = (used / total) * 100;
    const pendingPercentage = (pending / total) * 100;

    return (
      <Card
        key={type.value}
        sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {type.label}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography variant="h5" color="primary.main" fontWeight={700}>
              {available}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of {total} days available
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              height: 8,
              bgcolor: "#eee",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${usedPercentage}%`,
                bgcolor: "#f44336",
                borderRadius: "4px 0 0 4px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: `${usedPercentage}%`,
                top: 0,
                height: "100%",
                width: `${pendingPercentage}%`,
                bgcolor: "#ff9800",
              }}
            />
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Used: {used} days
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending: {pending} days
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Show loading state if employee data is not yet loaded
  if (loading && !employee) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading employee data...
        </Typography>
      </Box>
    );
  }

  // Show message if no employee data is found
  if (!loading && !employee) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Employee profile not found
        </Typography>
        <Typography variant="body1">
          Please complete your employee registration before accessing leave requests.
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: isMobile ? 2 : 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1a237e",
              fontSize: isMobile ? "1.5rem" : "2rem",
            }}
          >
            My Leave Requests
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
            Request Leave
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-flexContainer": {
              overflowX: "auto",
              flexWrap: isMobile ? "nowrap" : "wrap",
            },
          }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Dashboard" />
          <Tab label="My Requests" />
          <Tab label="Leave Balance" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: isMobile ? 2 : 3,
                    mb: isMobile ? 2 : 3,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Usage by Month
                  </Typography>
                  <Box sx={{ height: isMobile ? 250 : 300, width: "100%" }}>
                    {statistics ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getMonthlyChartData(statistics)}
                          margin={{
                            top: 5,
                            right: isMobile ? 10 : 30,
                            left: isMobile ? 0 : 20,
                            bottom: isMobile ? 30 : 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar
                            dataKey="days"
                            fill="#8884d8"
                            name="Days Taken"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upcoming Leaves
                  </Typography>
                  {statistics &&
                  statistics.upcomingLeaves &&
                  statistics.upcomingLeaves.length > 0 ? (
                    isMobile ? (
                      <Stack spacing={2}>
                        {statistics.upcomingLeaves.map((leave) => (
                          <Card
                            key={leave._id}
                            sx={{
                              boxShadow: "none",
                              border: "1px solid #eee",
                              borderRadius: 1,
                            }}
                          >
                            <CardContent sx={{ p: 1.5 }}>
                              <Typography variant="subtitle2">
                                {getLeaveTypeName(leave.leaveType)}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    leave.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(leave.endDate).toLocaleDateString()}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {leave.numberOfDays} days
                                  </Typography>
                                  {getStatusChip(leave.status)}
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              >
                                Type
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              >
                                From
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              >
                                To
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              >
                                Days
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              >
                                Status
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {statistics.upcomingLeaves.map((leave) => (
                              <TableRow key={leave._id}>
                                <TableCell>
                                  {getLeaveTypeName(leave.leaveType)}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    leave.startDate
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(leave.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{leave.numberOfDays}</TableCell>
                                <TableCell>
                                  {getStatusChip(leave.status)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      No upcoming leaves
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: isMobile ? 2 : 3,
                    mb: isMobile ? 2 : 3,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Type Distribution
                  </Typography>
                  <Box sx={{ height: isMobile ? 250 : 300 }}>
                    {statistics ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getLeaveTypeChartData(statistics)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={isMobile ? 70 : 80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="type"
                            label={
                              isMobile
                                ? undefined
                                : ({ type, value }) => `${type}: ${value}`
                            }
                          >
                            {getLeaveTypeChartData(statistics).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Balance Summary
                  </Typography>
                  {leaveBalance ? (
                    <Box>
                      {LEAVE_TYPES.map((type) => {
                        const balance = leaveBalance[type.value];
                        if (!balance) return null;

                        const total = balance.total;
                        const used = balance.used;
                        const pending = balance.pending;
                        const available = total - used - pending;
                        const usedPercentage = (used / total) * 100;
                        const pendingPercentage = (pending / total) * 100;

                        return (
                          <Box key={type.value} sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {type.label}
                              </Typography>
                              <Typography variant="body2">
                                {available} / {total} days
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                position: "relative",
                                height: 8,
                                bgcolor: "#eee",
                                borderRadius: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  height: "100%",
                                  width: `${usedPercentage}%`,
                                  bgcolor: "#f44336",
                                  borderRadius: "4px 0 0 4px",
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: `${usedPercentage}%`,
                                  top: 0,
                                  height: "100%",
                                  width: `${pendingPercentage}%`,
                                  bgcolor: "#ff9800",
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Used: {used} days
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Pending: {pending} days
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              My Leave Requests
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : leaveRequests.length > 0 ? (
              isMobile ? (
                <Stack spacing={2}>
                  {leaveRequests.map((request) =>
                    renderLeaveRequestCard(request)
                  )}
                </Stack>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Leave Type
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          From
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          To
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Days
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Reason
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>
                            {getLeaveTypeName(request.leaveType)}
                          </TableCell>
                          <TableCell>
                            {new Date(request.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(request.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{request.numberOfDays}</TableCell>
                          <TableCell>
                            <Tooltip title={request.reason}>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 150,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {request.reason}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(request.status)}
                            {request.rejectionReason && (
                              <Tooltip
                                title={`Reason: ${request.rejectionReason}`}
                              >
                                <InfoIcon
                                  fontSize="small"
                                  color="error"
                                  sx={{ ml: 1, verticalAlign: "middle" }}
                                />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteRequest(request._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  No leave requests found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ mt: 2 }}
                >
                  Request Leave
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">Leave Balance</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={refreshLeaveBalance}
                  startIcon={<RefreshIcon />}
                >
                  Refresh Balance
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchUpdatedEarnedLeaveBalance}
                >
                  Update Earned Leave
                </Button>
              </Box>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Leave Balance
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={fetchUpdatedEarnedLeaveBalance}
              >
                Update Earned Leave
              </Button>
            </Box> */}
            {leaveBalance ? (
              isMobile ? (
                <Stack spacing={2}>
                  {LEAVE_TYPES.map((type) => {
                    const balance = leaveBalance[type.value];
                    if (!balance) return null;
                    return renderLeaveBalanceCard(type, balance);
                  })}
                </Stack>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Leave Type
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Used
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Pending
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Available
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {LEAVE_TYPES.map((type) => {
                        const balance = leaveBalance[type.value];
                        if (!balance) return null;

                        return (
                          <TableRow key={type.value}>
                            <TableCell>{type.label}</TableCell>
                            <TableCell>{balance.total}</TableCell>
                            <TableCell>{balance.used}</TableCell>
                            <TableCell>{balance.pending}</TableCell>
                            <TableCell>
                              {balance.total - balance.used - balance.pending}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            Request Leave
            {isMobile && (
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => handleInputChange("leaveType", e.target.value)}
                fullWidth
                margin="normal"
                helperText={`Available balance: ${getAvailableBalance(
                  formData.leaveType
                )} days`}
              >
                {LEAVE_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} ({getAvailableBalance(option.value)} days
                    available)
                  </MenuItem>
                ))}
              </TextField>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleInputChange("startDate", date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disablePast
                />

                {!formData.halfDay && (
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleInputChange("endDate", date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    disablePast
                    minDate={formData.startDate}
                  />
                )}
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.halfDay}
                    onChange={(e) =>
                      handleInputChange("halfDay", e.target.checked)
                    }
                  />
                }
                label="Half Day"
                sx={{ mt: 2 }}
              />
              {formData.halfDay && (
                <TextField
                  select
                  label="Half Day Type"
                  value={formData.halfDayType}
                  onChange={(e) =>
                    handleInputChange("halfDayType", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                </TextField>
              )}
              <TextField
                label="Reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              {/* <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Number of days:{" "}
                  {calculateBusinessDays(
                    formData.startDate,
                    formData.endDate,
                    formData.halfDay
                  )}
                </Typography>
              </Box> */}
              <Box sx={{ mt: 2 }}>
  <Typography variant="body2" color="textSecondary" id="leave-days-count">
    Number of days:{" "}
    {calculateBusinessDays(
      formData.startDate,
      formData.endDate,
      formData.halfDay
    )}
  </Typography>
</Box>

            </Box>
          </DialogContent>
          <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 3 : 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!formData.reason || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Box>
    </LocalizationProvider>
  );
};

export default MyLeaveRequests;
