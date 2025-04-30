import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { ArrowForward, EventAvailable, EventBusy } from "@mui/icons-material";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { styled } from "@mui/system";
import axios from "axios";
import {
  Refresh,
  Person,
  Business,
  Announcement,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  Info,
  Event,
  Block,
  Weekend,
} from "@mui/icons-material";
// Import the API functions
import { fetchHolidays } from "./api/holidays";

// Register necessary elements and components for Chart.js
Chart.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Styled component for card headers
const StyledHeader = styled(Box)(({ theme, color }) => ({
  height: "4px",
  backgroundColor: color,
  marginBottom: "10px",
}));

const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5002";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOnboarded: 0,
      totalOffboarded: 0,
      averageOnboardingTime: 0,
      completionRate: 0,
    },
    trendData: [],
    departmentData: [],
    employeeData: [],
  });
  const [userLeaveData, setUserLeaveData] = useState({
    upcomingLeaves: [],
    leaveBalance: null,
    loading: true,
    error: null
  });
  const [timeRange, setTimeRange] = useState("6m");
  const [recentJoins, setRecentJoins] = useState([]);

  // State for all types of announcements
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [activeAnnouncementType, setActiveAnnouncementType] = useState("all");

  useEffect(() => {
    fetchDashboardData();
    fetchRecentJoins();
    fetchAllAnnouncements();
    fetchUserLeaveData(); // Add this line
  }, [timeRange]);

// Add this function to fetch user leave data
const fetchUserLeaveData = async () => {
  try {
    // Get the user ID from localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.log("No user ID found in localStorage");
      return;
    }
    
    // First get the employee data using the user ID
    const employeeResponse = await axios.get(`${apiBaseURL}/api/employees/by-user/${userId}`);
    
    if (!employeeResponse.data.success || !employeeResponse.data.data) {
      console.log("No employee data found for this user");
      return;
    }
    
    const employeeData = employeeResponse.data.data;
    const employeeCode = employeeData.Emp_ID;
    
    if (!employeeCode) {
      console.log("No employee code found");
      return;
    }
    
    // Now fetch leave requests for this employee
    const leaveRequestsResponse = await axios.get(`${apiBaseURL}/api/leave-requests/employee/${employeeCode}`);
    
    // Fetch leave balance
    const leaveBalanceResponse = await axios.get(`${apiBaseURL}/api/leave-requests/balance/${employeeCode}`);
    
    // Fetch leave statistics
    const leaveStatsResponse = await axios.get(`${apiBaseURL}/api/leave-requests/statistics/${employeeCode}`);
    
    // Get upcoming leaves (pending or approved)
    const upcomingLeaves = leaveRequestsResponse.data
      .filter(leave => {
        // Filter for pending or approved leaves that are in the future
        const isRelevantStatus = leave.status === 'pending' || leave.status === 'approved';
        const leaveStartDate = new Date(leave.startDate);
        const today = new Date();
        return isRelevantStatus && leaveStartDate >= today;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3); // Get only the next 3 upcoming leaves
    
    setUserLeaveData({
      upcomingLeaves,
      leaveBalance: leaveBalanceResponse.data,
      leaveStats: leaveStatsResponse.data,
      loading: false,
      error: null
    });
    
  } catch (error) {
    console.error("Error fetching user leave data:", error);
    setUserLeaveData({
      upcomingLeaves: [],
      leaveBalance: null,
      leaveStats: null,
      loading: false,
      error: "Failed to load leave data"
    });
  }
};

  // Function to fetch all types of announcements
  const fetchAllAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      // Fetch holidays using the imported function
      const holidaysResponse = await fetchHolidays();
      const holidays = holidaysResponse.data.map((holiday) => ({
        id: holiday._id,
        title: holiday.name,
        date: holiday.startDate,
        content: `Holiday${
          holiday.recurring ? " (Recurring)" : ""
        } from ${new Date(
          holiday.startDate
        ).toLocaleDateString()} to ${new Date(
          holiday.endDate
        ).toLocaleDateString()}`,
        type: "holiday",
        icon: <Event />,
        color: "#2196F3",
        bgColor: "#E3F2FD",
      }));

      // Fetch company holidays
      const companyHolidaysResponse = await axios.get(
        `${apiBaseURL}/api/companyHolidays`
      );
      const companyHolidays = companyHolidaysResponse.data.map((holiday) => ({
        id: holiday._id,
        title: `${holiday.week} ${holiday.day}`,
        date: new Date().toISOString(), // Current date as these are recurring
        content: `Weekly holiday on ${holiday.day}`,
        type: "companyHoliday",
        icon: <Weekend />,
        color: "#FF9800",
        bgColor: "#FFF3E0",
      }));

      // Fetch restricted leaves
      const restrictLeavesResponse = await axios.get(
        `${apiBaseURL}/api/restrictLeaves`
      );
      const restrictLeaves = restrictLeavesResponse.data.map((leave) => ({
        id: leave._id,
        title: leave.title,
        date: leave.startDate,
        content: `${leave.description} (${leave.department}, ${leave.jobPosition})`,
        endDate: leave.endDate,
        type: "restrictLeave",
        icon: <Block />,
        color: "#F44336",
        bgColor: "#FFEBEE",
      }));

      // Combine all announcements and sort by date (most recent first)
      const allAnnouncements = [
        ...holidays,
        ...companyHolidays,
        ...restrictLeaves,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setAnnouncements(allAnnouncements);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiBaseURL}/api/employees/report?period=${timeRange}`
      );

      // Get the original data
      const dashData = response.data.data;

      // Fetch all employees to get gender information
      const employeesResponse = await axios.get(
        `${apiBaseURL}/api/employees/registered`
      );

      // Fetch offboarding data to get total offboarded count
      const offboardingResponse = await axios.get(
        `http://localhost:5002/api/offboarding`
      );
      const totalOffboarded = offboardingResponse.data.length || 0;

      // Extract gender information
      const genderData = employeesResponse.data.map((emp) => ({
        gender: emp.personalInfo?.gender || "Other",
      }));

      // Add gender data and updated offboarding count to dashboard data
      setDashboardData({
        ...dashData,
        genderData: genderData,
        stats: {
          ...dashData.stats,
          totalOffboarded: totalOffboarded,
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentJoins = async () => {
    try {
      const response = await axios.get(
        `${apiBaseURL}/api/employees/registered`
      );

      // Sort by joining date (most recent first) and take the top 5
      const sortedEmployees = response.data
        .filter((emp) => emp.joiningDetails && emp.joiningDetails.dateOfJoining)
        .sort((a, b) => {
          const dateA = new Date(a.joiningDetails.dateOfJoining);
          const dateB = new Date(b.joiningDetails.dateOfJoining);
          return dateB - dateA;
        })
        .slice(0, 5);

      setRecentJoins(sortedEmployees);
    } catch (err) {
      console.error("Error fetching recent joins:", err);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    fetchRecentJoins();
    fetchAllAnnouncements();
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Filter announcements based on active type
  const getFilteredAnnouncements = () => {
    if (activeAnnouncementType === "all") {
      return announcements.slice(0, 5); // Show only 5 for 'all' to avoid overcrowding
    }
    return announcements
      .filter((announcement) => announcement.type === activeAnnouncementType)
      .slice(0, 10); // Show more when filtered by type
  };

  // Prepare department chart data
  const getDepartmentChartData = () => {
    if (
      !dashboardData.departmentData ||
      dashboardData.departmentData.length === 0
    ) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e0e0e0"],
          },
        ],
      };
    }


    return {
      labels: dashboardData.departmentData.map((item) => item.name),
      datasets: [
        {
          data: dashboardData.departmentData.map((item) => item.value),
          backgroundColor: [
            "#4A90E2",
            "#FF5C8D",
            "#F5A623",
            "#F8E71C",
            "#50E3C2",
            "#9013FE",
            "#4CAF50",
            "#FF9800",
            "#E91E63",
            "#2196F3",
          ],
        },
      ],
    };
  };

  // Prepare gender chart data
  const getGenderChartData = () => {
    // Calculate gender distribution from gender data
    const genderCounts = { Male: 0, Female: 0, Other: 0 };

    dashboardData.genderData?.forEach((item) => {
      const gender = item.gender || "Other";
      if (gender === "Male") genderCounts.Male++;
      else if (gender === "Female") genderCounts.Female++;
      else genderCounts.Other++;
    });

    return {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
          backgroundColor: ["#4A90E2", "#FF5C8D", "#F8E71C"],
        },
      ],
    };
  };

  // Prepare onboarding trend data
  const getOnboardingTrendData = () => {
    if (!dashboardData.trendData || dashboardData.trendData.length === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            label: "Onboarded",
            data: [0],
            backgroundColor: "#4CAF50",
          },
        ],
      };
    }

    return {
      labels: dashboardData.trendData.map((item) => item.month),
      datasets: [
        {
          label: "Onboarded",
          data: dashboardData.trendData.map((item) => item.onboarded),
          backgroundColor: "#4CAF50",
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  if (loading && !dashboardData.stats.totalOnboarded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Dashboard Header */}
      {/* Dashboard Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" }, // Align left on mobile
          mb: 3,
          gap: { xs: 2, sm: 0 }, // Add gap for mobile
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#333",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }, // Smaller on mobile
          }}
        >
          Dashboard
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "auto" }, // Full width on mobile
          }}
        >
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 }, // Full width on mobile
              mr: { xs: 0, sm: 2 }, // No margin on mobile
              flexGrow: { xs: 1, sm: 0 }, // Grow to fill space on mobile
            }}
          >
            <InputLabel
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" }, // Smaller on mobile
              }}
            >
              Time Range
            </InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
              sx={{
                "& .MuiSelect-select": {
                  padding: { xs: "6px 8px", sm: "8px 14px" }, // Smaller padding on mobile
                  fontSize: { xs: "0.8rem", sm: "0.875rem" }, // Smaller font on mobile
                },
              }}
            >
              <MenuItem value="1m">Last Month</MenuItem>
              <MenuItem value="3m">Last 3 Months</MenuItem>
              <MenuItem value="6m">Last 6 Months</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              color="primary"
              disabled={loading}
              sx={{
                ml: { xs: 1, sm: 0 }, // Add margin on mobile
                padding: { xs: 1, sm: 1.5 }, // Smaller padding on mobile
              }}
            >
              {loading ? <CircularProgress size={24} /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <StyledHeader color="#4CAF50" />
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#E8F5E9", color: "#4CAF50", mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Onboarded
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {dashboardData.stats.totalOnboarded}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp
                  sx={{ color: "#4CAF50", mr: 0.5 }}
                  fontSize="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.totalOnboarded} employees onboarded
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <StyledHeader color="#F44336" />
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#FFEBEE", color: "#F44336", mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Offboarded
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {dashboardData.stats.totalOffboarded}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingDown
                  sx={{ color: "#F44336", mr: 0.5 }}
                  fontSize="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.totalOffboarded} employees offboarded
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <StyledHeader color="#2196F3" />
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#E3F2FD", color: "#2196F3", mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h6" component="div">
                  Avg. Onboarding
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {dashboardData.stats.averageOnboardingTime || 0}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Info sx={{ color: "#2196F3", mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Days to complete onboarding
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <StyledHeader color="#FF9800" />
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#FFF3E0", color: "#FF9800", mr: 2 }}>
                  <Business />
                </Avatar>
                <Typography variant="h6" component="div">
                  Completion Rate
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {dashboardData.stats.completionRate || 0}%
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp
                  sx={{ color: "#FF9800", mr: 0.5 }}
                  fontSize="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Onboarding completion rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Data */}
      <Grid container spacing={3}>
        {/* Department Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Department Distribution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {dashboardData.departmentData &&
              dashboardData.departmentData.length > 0 ? (
                <Doughnut
                  data={getDepartmentChartData()}
                  options={chartOptions}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No department data available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Gender Distribution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {dashboardData.genderData &&
              dashboardData.genderData.length > 0 ? (
                <Doughnut data={getGenderChartData()} options={chartOptions} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No gender data available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Onboarding Trend */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Onboarding Trend
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {dashboardData.trendData && dashboardData.trendData.length > 0 ? (
                <Bar data={getOnboardingTrendData()} options={barOptions} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No trend data available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        

        {/* Recent Joins */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Recent Joins
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: "100%" }}>
              {recentJoins.length > 0 ? (
                recentJoins.map((employee) => (
                  <ListItem
                    key={employee._id}
                    alignItems="flex-start"
                    sx={{ px: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`${employee.personalInfo?.firstName || ""} ${
                          employee.personalInfo?.lastName || ""
                        }`}
                        src={employee.personalInfo?.employeeImage || ""}
                      >
                        {employee.personalInfo?.firstName
                          ? employee.personalInfo.firstName.charAt(0)
                          : "E"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {`${employee.personalInfo?.firstName || ""} ${
                            employee.personalInfo?.lastName || ""
                          }`}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ID: {employee.Emp_ID || "N/A"}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {employee.joiningDetails?.initialDesignation ||
                              "Employee"}
                            {employee.joiningDetails?.department &&
                              ` — ${employee.joiningDetails.department}`}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            Joined:{" "}
                            {employee.joiningDetails?.dateOfJoining
                              ? new Date(
                                  employee.joiningDetails.dateOfJoining
                                ).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ py: 2, textAlign: "center" }}
                >
                  No recent joins found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* All Announcements - Enhanced Section */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Announcements & Holidays
              </Typography>
              <Tooltip title="Refresh Announcements">
                <IconButton onClick={fetchAllAnnouncements} size="small">
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Filter chips for announcement types */}
            <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setActiveAnnouncementType("all")}
                color={activeAnnouncementType === "all" ? "primary" : "default"}
                variant={
                  activeAnnouncementType === "all" ? "filled" : "outlined"
                }
              />
              <Chip
                label="Holidays"
                icon={<Event fontSize="small" />}
                onClick={() => setActiveAnnouncementType("holiday")}
                color={
                  activeAnnouncementType === "holiday" ? "primary" : "default"
                }
                variant={
                  activeAnnouncementType === "holiday" ? "filled" : "outlined"
                }
              />
              <Chip
                label="Weekly Holidays"
                icon={<Weekend fontSize="small" />}
                onClick={() => setActiveAnnouncementType("companyHoliday")}
                color={
                  activeAnnouncementType === "companyHoliday"
                    ? "primary"
                    : "default"
                }
                variant={
                  activeAnnouncementType === "companyHoliday"
                    ? "filled"
                    : "outlined"
                }
              />
              <Chip
                label="Restricted Leaves"
                icon={<Block fontSize="small" />}
                onClick={() => setActiveAnnouncementType("restrictLeave")}
                color={
                  activeAnnouncementType === "restrictLeave"
                    ? "primary"
                    : "default"
                }
                variant={
                  activeAnnouncementType === "restrictLeave"
                    ? "filled"
                    : "outlined"
                }
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {loadingAnnouncements ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : getFilteredAnnouncements().length > 0 ? (
              <List
                sx={{ width: "100%", maxHeight: "400px", overflow: "auto" }}
              >
                {getFilteredAnnouncements().map((announcement) => (
                  <ListItem
                    key={announcement.id}
                    alignItems="flex-start"
                    sx={{
                      px: 0,
                      mb: 1,
                      pb: 1,
                      borderBottom: "1px solid #f0f0f0",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: announcement.bgColor,
                          color: announcement.color,
                        }}
                      >
                        {announcement.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="subtitle1" fontWeight="medium">
                            {announcement.title}
                          </Typography>
                          <Chip
                            label={
                              announcement.type === "holiday"
                                ? "Holiday"
                                : announcement.type === "companyHoliday"
                                ? "Weekly"
                                : "Restricted"
                            }
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              bgcolor: announcement.bgColor,
                              color: announcement.color,
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {announcement.content}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {announcement.type === "holiday" &&
                            announcement.recurring
                              ? "Recurring Holiday"
                              : announcement.type === "companyHoliday"
                              ? "Weekly Holiday"
                              : "Restricted Leave"}{" "}
                            •
                            {announcement.date
                              ? ` ${new Date(
                                  announcement.date
                                ).toLocaleDateString()}`
                              : ""}
                            {announcement.endDate &&
                            announcement.type === "restrictLeave"
                              ? ` to ${new Date(
                                  announcement.endDate
                                ).toLocaleDateString()}`
                              : ""}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                No{" "}
                {activeAnnouncementType === "all"
                  ? "announcements"
                  : activeAnnouncementType === "holiday"
                  ? "holidays"
                  : activeAnnouncementType === "companyHoliday"
                  ? "weekly holidays"
                  : "restricted leaves"}{" "}
                found
              </Typography>
            )}
          </Paper>
        </Grid>
<Grid item xs={12} md={6}>
  <Paper
    sx={{
      p: 3,
      borderRadius: 2,
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      height: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        My Leave Status
      </Typography>
      <Button
        variant="text"
        size="small"
        onClick={() => window.location.href = '/dashboards/my-leave-requests'}
        endIcon={<ArrowForward />}
      >
        View All
      </Button>
    </Box>
    <Divider sx={{ mb: 2 }} />
    
    {userLeaveData.loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    ) : userLeaveData.error ? (
      <Typography color="error" sx={{ p: 2 }}>
        {userLeaveData.error}
      </Typography>
    ) : (
      <>
        {/* Leave Balance Summary */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Leave Balance
        </Typography>
        <Box sx={{ mb: 3 }}>
          {userLeaveData.leaveBalance ? (
            <Grid container spacing={2}>
              {Object.entries(userLeaveData.leaveBalance).slice(0, 3).map(([type, balance]) => {
                const total = balance.total || 0;
                const used = balance.used || 0;
                const pending = balance.pending || 0;
                const available = total - used - pending;
                const usedPercentage = (used / total) * 100;
                const pendingPercentage = (pending / total) * 100;
                
                // Get leave type label
                const getLeaveTypeLabel = (type) => {
                  const labels = {
                    annual: "Annual Leave",
                    sick: "Sick Leave",
                    personal: "Personal Leave",
                    casual: "Casual Leave",
                    earned: "Earned Leave",
                    maternity: "Maternity Leave",
                    paternity: "Paternity Leave"
                  };
                  return labels[type] || type;
                };
                
                return (
                  <Grid item xs={12} sm={4} key={type}>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {getLeaveTypeLabel(type)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                          {available}/{total}
                        </Typography>
                      </Box>
                      <Box sx={{ position: "relative", height: 6, bgcolor: "#eee", borderRadius: 1 }}>
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
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No leave balance data available
            </Typography>
          )}
        </Box>
        
        {/* Upcoming Leaves */}
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Upcoming Leaves
        </Typography>
        {userLeaveData.upcomingLeaves && userLeaveData.upcomingLeaves.length > 0 ? (
          <List sx={{ p: 0 }}>
            {userLeaveData.upcomingLeaves.map((leave) => (
              <ListItem
                key={leave._id}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: "1px solid #f0f0f0",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 
                        leave.status === "approved" 
                          ? "rgba(76, 175, 80, 0.1)" 
                          : "rgba(255, 152, 0, 0.1)",
                      color: 
                        leave.status === "approved" 
                          ? "#4caf50" 
                          : "#ff9800",
                    }}
                  >
                    {leave.status === "approved" ? <EventAvailable /> : <EventBusy />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''} • 
                        <Chip 
                          size="small" 
                          label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} 
                          color={leave.status === "approved" ? "success" : "warning"}
                          sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                        />
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No upcoming leaves
          </Typography>
        )}
      </>
    )}
  </Paper>
</Grid>

      </Grid>
    </Box>
  );
};

export default MainDashboard;
