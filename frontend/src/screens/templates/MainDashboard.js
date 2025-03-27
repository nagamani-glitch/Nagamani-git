// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, Typography, Box, Grid, CircularProgress, Alert, Button, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tooltip, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { Doughnut, Bar } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// import { styled } from '@mui/system';
// import axios from 'axios';
// import { Refresh, Person, Business, Announcement, CalendarToday, TrendingUp, TrendingDown, Info } from '@mui/icons-material';

// // Register necessary elements and components for Chart.js
// Chart.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement);

// // Styled component for card headers
// const StyledHeader = styled(Box)(({ theme, color }) => ({
//   height: '4px',
//   backgroundColor: color,
//   marginBottom: '10px',
// }));

// const MainDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dashboardData, setDashboardData] = useState({
//     stats: {
//       totalOnboarded: 0,
//       totalOffboarded: 0,
//       averageOnboardingTime: 0,
//       completionRate: 0
//     },
//     trendData: [],
//     departmentData: [],
//     employeeData: []
//   });
//   const [timeRange, setTimeRange] = useState('6m');
//   const [recentJoins, setRecentJoins] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchRecentJoins();
//     // In a real app, you would fetch announcements from an API
//     setAnnouncements([
//       { id: 1, title: 'Company Picnic', date: '2023-07-15', content: 'Annual company picnic at Central Park.' },
//       { id: 2, title: 'New Health Benefits', date: '2023-07-10', content: 'Updated health benefits package available.' },
//       { id: 3, title: 'Office Closure', date: '2023-07-04', content: 'Office will be closed for Independence Day.' }
//     ]);
//   }, [timeRange]);

// const fetchDashboardData = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const response = await axios.get(`http://localhost:5000/api/employees/report?period=${timeRange}`);
    
//     // Get the original data
//     const dashData = response.data.data;
    
//     // Fetch all employees to get gender information
//     const employeesResponse = await axios.get('http://localhost:5000/api/employees/registered');
    
//     // Extract gender information
//     const genderData = employeesResponse.data.map(emp => ({
//       gender: emp.personalInfo?.gender || 'Other'
//     }));
    
//     // Add gender data to dashboard data
//     setDashboardData({
//       ...dashData,
//       genderData: genderData
//     });
//   } catch (err) {
//     console.error("Error fetching dashboard data:", err);
//     setError("Failed to load dashboard data. Please try again later.");
//   } finally {
//     setLoading(false);
//   }
// };

// const fetchRecentJoins = async () => {
//   try {
//     const response = await axios.get('http://localhost:5000/api/employees/registered');
    
//     // Sort by joining date (most recent first) and take the top 5
//     const sortedEmployees = response.data
//       .filter(emp => emp.joiningDetails && emp.joiningDetails.dateOfJoining)
//       .sort((a, b) => {
//         const dateA = new Date(a.joiningDetails.dateOfJoining);
//         const dateB = new Date(b.joiningDetails.dateOfJoining);
//         return dateB - dateA;
//       })
//       .slice(0, 5);
    
//     setRecentJoins(sortedEmployees);
//   } catch (err) {
//     console.error("Error fetching recent joins:", err);
//   }
// };



//   const handleRefresh = () => {
//     fetchDashboardData();
//     fetchRecentJoins();
//   };

//   const handleTimeRangeChange = (event) => {
//     setTimeRange(event.target.value);
//   };

//   // Prepare department chart data
//   const getDepartmentChartData = () => {
//     if (!dashboardData.departmentData || dashboardData.departmentData.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           data: [1],
//           backgroundColor: ['#e0e0e0'],
//         }]
//       };
//     }

//     return {
//       labels: dashboardData.departmentData.map(item => item.name),
//       datasets: [{
//         data: dashboardData.departmentData.map(item => item.value),
//         backgroundColor: [
//           '#4A90E2', '#FF5C8D', '#F5A623', '#F8E71C', '#50E3C2', 
//           '#9013FE', '#4CAF50', '#FF9800', '#E91E63', '#2196F3'
//         ],
//       }]
//     };
//   };

// // Prepare gender chart data
// const getGenderChartData = () => {
//   // Calculate gender distribution from gender data
//   const genderCounts = { Male: 0, Female: 0, Other: 0 };
  
//   dashboardData.genderData?.forEach(item => {
//     const gender = item.gender || 'Other';
//     if (gender === 'Male') genderCounts.Male++;
//     else if (gender === 'Female') genderCounts.Female++;
//     else genderCounts.Other++;
//   });

//   return {
//     labels: Object.keys(genderCounts),
//     datasets: [{
//       data: Object.values(genderCounts),
//       backgroundColor: ['#4A90E2', '#FF5C8D', '#F8E71C'],
//     }]
//   };
// };


//   // Prepare onboarding trend data
//   const getOnboardingTrendData = () => {
//     if (!dashboardData.trendData || dashboardData.trendData.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           label: 'Onboarded',
//           data: [0],
//           backgroundColor: '#4CAF50',
//         }]
//       };
//     }

//     return {
//       labels: dashboardData.trendData.map(item => item.month),
//       datasets: [{
//         label: 'Onboarded',
//         data: dashboardData.trendData.map(item => item.onboarded),
//         backgroundColor: '#4CAF50',
//       }]
//     };
//   };

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           boxWidth: 12,
//           padding: 15,
//           font: {
//             size: 11
//           }
//         }
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             const label = context.label || '';
//             const value = context.raw || 0;
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
//             return `${label}: ${value} (${percentage}%)`;
//           }
//         }
//       }
//     },
//   };

//   const barOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           precision: 0
//         }
//       }
//     }
//   };

//   if (loading && !dashboardData.stats.totalOnboarded) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//                <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Loading dashboard data...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//         <Button 
//           variant="contained" 
//           startIcon={<Refresh />}
//           onClick={handleRefresh}
//         >
//           Try Again
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       {/* Dashboard Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
//           HR Dashboard
//         </Typography>
        
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
//             <InputLabel>Time Range</InputLabel>
//             <Select
//               value={timeRange}
//               onChange={handleTimeRangeChange}
//               label="Time Range"
//             >
//               <MenuItem value="1m">Last Month</MenuItem>
//               <MenuItem value="3m">Last 3 Months</MenuItem>
//               <MenuItem value="6m">Last 6 Months</MenuItem>
//               <MenuItem value="1y">Last Year</MenuItem>
//             </Select>
//           </FormControl>
          
//           <Tooltip title="Refresh Data">
//             <IconButton 
//               onClick={handleRefresh} 
//               color="primary"
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : <Refresh />}
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//             <StyledHeader color="#4CAF50" />
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mr: 2 }}>
//                   <Person />
//                 </Avatar>
//                 <Typography variant="h6" component="div">
//                   Total Onboarded
//                 </Typography>
//               </Box>
//               <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 {dashboardData.stats.totalOnboarded}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <TrendingUp sx={{ color: '#4CAF50', mr: 0.5 }} fontSize="small" />
//                 <Typography variant="body2" color="text.secondary">
//                   {dashboardData.stats.totalOnboarded} employees onboarded
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//             <StyledHeader color="#F44336" />
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Avatar sx={{ bgcolor: '#FFEBEE', color: '#F44336', mr: 2 }}>
//                   <Person />
//                 </Avatar>
//                 <Typography variant="h6" component="div">
//                   Total Offboarded
//                 </Typography>
//               </Box>
//               <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 {dashboardData.stats.totalOffboarded}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <TrendingDown sx={{ color: '#F44336', mr: 0.5 }} fontSize="small" />
//                 <Typography variant="body2" color="text.secondary">
//                   {dashboardData.stats.totalOffboarded} employees offboarded
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//             <StyledHeader color="#2196F3" />
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', mr: 2 }}>
//                   <CalendarToday />
//                 </Avatar>
//                 <Typography variant="h6" component="div">
//                   Avg. Onboarding
//                 </Typography>
//               </Box>
//               <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 {dashboardData.stats.averageOnboardingTime || 0}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Info sx={{ color: '#2196F3', mr: 0.5 }} fontSize="small" />
//                 <Typography variant="body2" color="text.secondary">
//                   Days to complete onboarding
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//             <StyledHeader color="#FF9800" />
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800', mr: 2 }}>
//                   <Business />
//                 </Avatar>
//                 <Typography variant="h6" component="div">
//                   Completion Rate
//                 </Typography>
//               </Box>
//               <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 {dashboardData.stats.completionRate || 0}%
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <TrendingUp sx={{ color: '#FF9800', mr: 0.5 }} fontSize="small" />
//                 <Typography variant="body2" color="text.secondary">
//                   Onboarding completion rate
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts and Data */}
//       <Grid container spacing={3}>
//         {/* Department Distribution */}
//         <Grid item xs={12} md={6} lg={4}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//               Department Distribution
//             </Typography>
//             <Divider sx={{ mb: 3 }} />
//             <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//               {dashboardData.departmentData && dashboardData.departmentData.length > 0 ? (
//                 <Doughnut data={getDepartmentChartData()} options={chartOptions} />
//               ) : (
//                 <Typography variant="body1" color="text.secondary">
//                   No department data available
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Gender Distribution */}
// <Grid item xs={12} md={6} lg={4}>
//   <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
//     <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//       Gender Distribution
//     </Typography>
//     <Divider sx={{ mb: 3 }} />
//     <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       {dashboardData.genderData && dashboardData.genderData.length > 0 ? (
//         <Doughnut data={getGenderChartData()} options={chartOptions} />
//       ) : (
//         <Typography variant="body1" color="text.secondary">
//           No gender data available
//         </Typography>
//       )}
//     </Box>
//   </Paper>
// </Grid>


//         {/* Onboarding Trend */}
//         <Grid item xs={12} lg={4}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//               Onboarding Trend
//             </Typography>
//             <Divider sx={{ mb: 3 }} />
//             <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//               {dashboardData.trendData && dashboardData.trendData.length > 0 ? (
//                 <Bar data={getOnboardingTrendData()} options={barOptions} />
//               ) : (
//                 <Typography variant="body1" color="text.secondary">
//                   No trend data available
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Recent Joins */}
// <Grid item xs={12} md={6}>
//   <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//     <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//       Recent Joins
//     </Typography>
//     <Divider sx={{ mb: 2 }} />
//     <List sx={{ width: '100%' }}>
//       {recentJoins.length > 0 ? (
//         recentJoins.map((employee) => (
//           <ListItem key={employee._id} alignItems="flex-start" sx={{ px: 0 }}>
//             <ListItemAvatar>
//               <Avatar 
//                 alt={`${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`} 
//                 src={employee.personalInfo?.employeeImage || ''}
//               >
//                 {employee.personalInfo?.firstName ? employee.personalInfo.firstName.charAt(0) : 'E'}
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText
//               primary={
//                 <Typography variant="subtitle1" fontWeight="medium">
//                   {`${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`}
//                 </Typography>
//               }
//               secondary={
//                 <React.Fragment>
//                   <Typography
//                     component="span"
//                     variant="body2"
//                     color="text.primary"
//                   >
//                     ID: {employee.Emp_ID || 'N/A'}
//                   </Typography>
//                   <br />
//                   <Typography component="span" variant="body2">
//                     {employee.joiningDetails?.initialDesignation || 'Employee'}
//                     {employee.joiningDetails?.department && ` — ${employee.joiningDetails.department}`}
//                   </Typography>
//                   <br />
//                   <Typography component="span" variant="caption" color="text.secondary">
//                     Joined: {employee.joiningDetails?.dateOfJoining ? 
//                       new Date(employee.joiningDetails.dateOfJoining).toLocaleDateString() : 'N/A'}
//                   </Typography>
//                 </React.Fragment>
//               }
//             />
//           </ListItem>
//         ))
//       ) : (
//         <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//           No recent joins found
//         </Typography>
//       )}
//     </List>
//   </Paper>
// </Grid>


//         {/* Announcements */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//               Announcements
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             <List sx={{ width: '100%' }}>
//               {announcements.map((announcement) => (
//                 <ListItem key={announcement.id} alignItems="flex-start" sx={{ px: 0 }}>
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800' }}>
//                       <Announcement />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={announcement.title}
//                     secondary={
//                       <React.Fragment>
//                         <Typography
//                           component="span"
//                           variant="body2"
//                           color="text.primary"
//                         >
//                           {announcement.content}
//                         </Typography>
//                         <br />
//                         <Typography component="span" variant="caption" color="text.secondary">
//                           Date: {new Date(announcement.date).toLocaleDateString()}
//                         </Typography>
//                       </React.Fragment>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
// export default MainDashboard;
 

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, CircularProgress, Alert, Button, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tooltip, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { styled } from '@mui/system';
import axios from 'axios';
import { Refresh, Person, Business, Announcement, CalendarToday, TrendingUp, TrendingDown, Info, Event } from '@mui/icons-material';
// Import the API functions
import { fetchHolidays } from './api/holidays';

// Register necessary elements and components for Chart.js
Chart.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement);

// Styled component for card headers
const StyledHeader = styled(Box)(({ theme, color }) => ({
  height: '4px',
  backgroundColor: color,
  marginBottom: '10px',
}));

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOnboarded: 0,
      totalOffboarded: 0,
      averageOnboardingTime: 0,
      completionRate: 0
    },
    trendData: [],
    departmentData: [],
    employeeData: []
  });
  const [timeRange, setTimeRange] = useState('6m');
  const [recentJoins, setRecentJoins] = useState([]);
  
  // State for holiday announcements
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentJoins();
    fetchHolidayAnnouncements();
  }, [timeRange]);

  // Function to fetch holiday announcements
  const fetchHolidayAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      // Fetch holidays using the imported function
      const holidaysResponse = await fetchHolidays();
      
      // Transform holidays into announcement format
      const holidayAnnouncements = holidaysResponse.data.map(holiday => ({
        id: holiday._id,
        title: holiday.name,
        date: holiday.startDate,
        content: `Holiday${holiday.recurring ? ' (Recurring)' : ''} from ${new Date(holiday.startDate).toLocaleDateString()} to ${new Date(holiday.endDate).toLocaleDateString()}`,
        recurring: holiday.recurring
      }));

      // Sort by date (most recent first)
      const sortedAnnouncements = holidayAnnouncements
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Take only the 5 most recent

      setAnnouncements(sortedAnnouncements);
    } catch (err) {
      console.error("Error fetching holiday announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiBaseURL}/api/employees/report?period=${timeRange}`);
      
      // Get the original data
      const dashData = response.data.data;
      
      // Fetch all employees to get gender information
      const employeesResponse = await axios.get(`${apiBaseURL}/api/employees/registered`);
      
      // Extract gender information
      const genderData = employeesResponse.data.map(emp => ({
        gender: emp.personalInfo?.gender || 'Other'
      }));
      
      // Add gender data to dashboard data
      setDashboardData({
        ...dashData,
        genderData: genderData
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
      const response = await axios.get(`${apiBaseURL}/api/employees/registered`);
      
      // Sort by joining date (most recent first) and take the top 5
      const sortedEmployees = response.data
        .filter(emp => emp.joiningDetails && emp.joiningDetails.dateOfJoining)
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
    fetchHolidayAnnouncements();
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Prepare department chart data
  const getDepartmentChartData = () => {
    if (!dashboardData.departmentData || dashboardData.departmentData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e0e0e0'],
        }]
      };
    }

    return {
      labels: dashboardData.departmentData.map(item => item.name),
      datasets: [{
        data: dashboardData.departmentData.map(item => item.value),
        backgroundColor: [
          '#4A90E2', '#FF5C8D', '#F5A623', '#F8E71C', '#50E3C2', 
          '#9013FE', '#4CAF50', '#FF9800', '#E91E63', '#2196F3'
        ],
      }]
    };
  };

  // Prepare gender chart data
  const getGenderChartData = () => {
    // Calculate gender distribution from gender data
    const genderCounts = { Male: 0, Female: 0, Other: 0 };
    
    dashboardData.genderData?.forEach(item => {
      const gender = item.gender || 'Other';
      if (gender === 'Male') genderCounts.Male++;
      else if (gender === 'Female') genderCounts.Female++;
      else genderCounts.Other++;
    });

    return {
      labels: Object.keys(genderCounts),
      datasets: [{
        data: Object.values(genderCounts),
        backgroundColor: ['#4A90E2', '#FF5C8D', '#F8E71C'],
      }]
    };
  };

  // Prepare onboarding trend data
  const getOnboardingTrendData = () => {
    if (!dashboardData.trendData || dashboardData.trendData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Onboarded',
          data: [0],
          backgroundColor: '#4CAF50',
        }]
      };
    }

    return {
      labels: dashboardData.trendData.map(item => item.month),
      datasets: [{
        label: 'Onboarded',
        data: dashboardData.trendData.map(item => item.onboarded),
        backgroundColor: '#4CAF50',
      }]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  if (loading && !dashboardData.stats.totalOnboarded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
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
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
          HR Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
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
            >
              {loading ? <CircularProgress size={24} /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <StyledHeader color="#4CAF50" />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Onboarded
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.stats.totalOnboarded}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: '#4CAF50', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.totalOnboarded} employees onboarded
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <StyledHeader color="#F44336" />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#FFEBEE', color: '#F44336', mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Offboarded
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.stats.totalOffboarded}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDown sx={{ color: '#F44336', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.totalOffboarded} employees offboarded
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <StyledHeader color="#2196F3" />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h6" component="div">
                  Avg. Onboarding
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.stats.averageOnboardingTime || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ color: '#2196F3', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Days to complete onboarding
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <StyledHeader color="#FF9800" />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800', mr: 2 }}>
                  <Business />
                </Avatar>
                <Typography variant="h6" component="div">
                  Completion Rate
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.stats.completionRate || 0}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: '#FF9800', mr: 0.5 }} fontSize="small" />
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
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Department Distribution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {dashboardData.departmentData && dashboardData.departmentData.length > 0 ? (
                <Doughnut data={getDepartmentChartData()} options={chartOptions} />
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
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Gender Distribution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {dashboardData.genderData && dashboardData.genderData.length > 0 ? (
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
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Onboarding Trend
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Recent Joins
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentJoins.length > 0 ? (
                recentJoins.map((employee) => (
                  <ListItem key={employee._id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar 
                        alt={`${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`} 
                        src={employee.personalInfo?.employeeImage || ''}
                      >
                        {employee.personalInfo?.firstName ? employee.personalInfo.firstName.charAt(0) : 'E'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {`${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ID: {employee.Emp_ID || 'N/A'}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {employee.joiningDetails?.initialDesignation || 'Employee'}
                            {employee.joiningDetails?.department && ` — ${employee.joiningDetails.department}`}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            Joined: {employee.joiningDetails?.dateOfJoining ? 
                              new Date(employee.joiningDetails.dateOfJoining).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No recent joins found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Holiday Announcements - Updated Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Holiday Announcements
              </Typography>
              <Tooltip title="Refresh Holidays">
                <IconButton onClick={fetchHolidayAnnouncements} size="small">
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {loadingAnnouncements ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : announcements.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {announcements.map((announcement) => (
                  <ListItem key={announcement.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3' }}>
                        <Event />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {announcement.title}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {announcement.content}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {announcement.recurring ? 'Recurring Holiday' : 'Holiday'} • 
                            {announcement.date ? ` ${new Date(announcement.date).toLocaleDateString()}` : ''}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No holiday announcements found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
