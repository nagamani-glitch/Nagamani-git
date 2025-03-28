// // AssetDashboard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AssetDashboard.css';
// import { Pie, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Box, Typography, Grid } from '@mui/material';


// // Register the components
// ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



// const Dashboard = () => {
//   const [totalAssets, setTotalAssets] = useState(0);
//   const [assetsInUse, setAssetsInUse] = useState(0);
//   const [categoryData, setCategoryData] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();

//     // Cleanup function to handle chart unmounting
//     return () => {
//       // Add cleanup logic here if needed, like destroying chart instances
//       // Since react-chartjs-2 automatically cleans up, this is usually not required.
//     };
//   }, []);

//   const APP_URL = process.env.REACT_APP_API_URL;

//   const fetchDashboardData = async () => {
//     try {
//       // Adjusted API URL to match backend
//       const response = await axios.get(`${APP_URL}/api/assetHistory/summary`);
//       setTotalAssets(response.data.totalAssets);
//       setAssetsInUse(response.data.assetsInUse);
//       setCategoryData(response.data.categoryData);
//       setStatusData(response.data.statusData);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data.');
//     }
//   };

//   const statusChartData = {
//     labels: statusData.map((status) => status._id),
//     datasets: [
//       {
//         data: statusData.map((status) => status.count),
//         backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
//       },
//     ],
//   };

//   const categoryChartData = {
//     labels: categoryData.map((category) => category._id),
//     datasets: [
//       {
//         label: 'Assets by Category',
//         data: categoryData.map((category) => category.count),
//         backgroundColor: '#36a2eb',
//       },
//     ],
//   };

//   return (

//     <Box sx={{
//       padding: '24px',
//       backgroundColor: '#f8fafc'
//   }}>
//       {/* Header Section */}
//       <Typography variant="h4" sx={{ 
//           fontWeight: 600, 
//           color: '#1976d2',
//           background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           mb: 4
//       }}>
//           Asset Dashboard
//       </Typography>
  
//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6}>
//               <Box sx={{
//                   backgroundColor: 'white',
//                   borderRadius: '16px',
//                   padding: '24px',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                   height: '100%'
//               }}>
//                   <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
//                       Total Assets
//                   </Typography>
//                   <Typography variant="h3" sx={{ 
//                       color: '#1976d2',
//                       fontWeight: 600 
//                   }}>
//                       {totalAssets}
//                   </Typography>
//               </Box>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//               <Box sx={{
//                   backgroundColor: 'white',
//                   borderRadius: '16px',
//                   padding: '24px',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                   height: '100%'
//               }}>
//                   <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
//                       Assets in Use
//                   </Typography>
//                   <Typography variant="h3" sx={{ 
//                       color: '#1976d2',
//                       fontWeight: 600 
//                   }}>
//                       {assetsInUse}
//                   </Typography>
//               </Box>
//           </Grid>
//       </Grid>
  
//       {/* Charts Section */}
//       <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//               <Box sx={{
//                   backgroundColor: 'white',
//                   borderRadius: '16px',
//                   padding: '24px',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                   height: '100%'
//               }}>
//                   <Typography variant="h6" sx={{ 
//                       color: '#475569',
//                       mb: 3,
//                       fontWeight: 600
//                   }}>
//                       Asset Status Distribution
//                   </Typography>
//                   {statusData.length ? (
//                       <Box sx={{ height: 300 }}>
//                           <Pie 
//                               data={statusChartData}
//                               options={{
//                                   responsive: true,
//                                   maintainAspectRatio: false,
//                                   plugins: {
//                                       legend: {
//                                           position: 'bottom',
//                                           labels: {
//                                               padding: 20,
//                                               usePointStyle: true
//                                           }
//                                       }
//                                   }
//                               }}
//                           />
//                       </Box>
//                   ) : (
//                       <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
//                           Loading status data...
//                       </Typography>
//                   )}
//               </Box>
//           </Grid>
//           <Grid item xs={12} md={6}>
//               <Box sx={{
//                   backgroundColor: 'white',
//                   borderRadius: '16px',
//                   padding: '24px',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                   height: '100%'
//               }}>
//                   <Typography variant="h6" sx={{ 
//                       color: '#475569',
//                       mb: 3,
//                       fontWeight: 600
//                   }}>
//                       Assets by Category
//                   </Typography>
//                   {categoryData.length ? (
//                       <Box sx={{ height: 300 }}>
//                           <Bar 
//                               data={categoryChartData}
//                               options={{
//                                   responsive: true,
//                                   maintainAspectRatio: false,
//                                   plugins: {
//                                       legend: {
//                                           display: false
//                                       }
//                                   },
//                                   scales: {
//                                       y: {
//                                           beginAtZero: true,
//                                           grid: {
//                                               drawBorder: false
//                                           }
//                                       },
//                                       x: {
//                                           grid: {
//                                               display: false
//                                           }
//                                       }
//                                   }
//                               }}
//                           />
//                       </Box>
//                   ) : (
//                       <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
//                           Loading category data...
//                       </Typography>
//                   )}
//               </Box>
//           </Grid>
//       </Grid>
//   </Box>
  
//   );
// };

// export default Dashboard;

// AssetDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssetDashboard.css';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress, 
  Alert, 
  Button, 
  Chip, 
  Stack, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
  Computer, 
  DevicesOther, 
  Storage, 
  Refresh, 
  TrendingUp, 
  TrendingDown, 
  Warning, 
  CheckCircle, 
  Error, 
  Info, 
  Person, 
  Category, 
  CalendarToday,
  Inventory,
  Dashboard,
  Layers,
  History
} from '@mui/icons-material';

// Register the components
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const AssetDashboard = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    assetsInUse: 0,
    categoryData: [],
    statusData: []
  });
  const [assetHistory, setAssetHistory] = useState([]);
  const [assetBatches, setAssetBatches] = useState([]);
  const [assetCategories, setAssetCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [assetTrends, setAssetTrends] = useState({
    labels: [],
    allocated: [],
    returned: []
  });
  const [activeTab, setActiveTab] = useState(0);
  const [topEmployees, setTopEmployees] = useState([]);

  useEffect(() => {
    fetchAllAssetData();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchAllAssetData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch dashboard summary data
      const summaryResponse = await axios.get(`${API_URL}/api/assetHistory/summary`);
      
      // Fetch asset history data
      const historyResponse = await axios.get(`${API_URL}/api/assetHistory`);
      
      // Fetch asset batches
      const batchesResponse = await axios.get(`${API_URL}/api/asset-batches`);
      
      // Fetch asset categories
      const categoriesResponse = await axios.get(`${API_URL}/api/assets`);
      
      // Process and set the data
      setDashboardData({
        totalAssets: summaryResponse.data.totalAssets,
        assetsInUse: summaryResponse.data.assetsInUse,
        categoryData: summaryResponse.data.categoryData,
        statusData: summaryResponse.data.statusData
      });
      
      setAssetHistory(historyResponse.data);
      setAssetBatches(batchesResponse.data);
      setAssetCategories(categoriesResponse.data);
      
      // Generate recent transactions from asset history
      const sortedHistory = [...historyResponse.data].sort((a, b) => 
        new Date(b.allottedDate) - new Date(a.allottedDate)
      ).slice(0, 5);
      setRecentTransactions(sortedHistory);
      
      // Generate asset trends data
      generateAssetTrends(historyResponse.data);
      
      // Generate top employees with most assets
      generateTopEmployees(categoriesResponse.data);
      
    } catch (error) {
      console.error('Error fetching asset dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate asset trends data from history
  const generateAssetTrends = (historyData) => {
    // Get last 6 months
    const months = [];
    const allocated = [];
    const returned = [];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      months.push(monthName);
      
      // Count allocations and returns for this month
      const allocationsCount = historyData.filter(asset => {
        const assetDate = new Date(asset.allottedDate);
        return assetDate.getMonth() === month.getMonth() && 
               assetDate.getFullYear() === month.getFullYear();
      }).length;
      
      const returnsCount = historyData.filter(asset => {
        if (!asset.returnDate) return false;
        const returnDate = new Date(asset.returnDate);
        return returnDate.getMonth() === month.getMonth() && 
               returnDate.getFullYear() === month.getFullYear();
      }).length;
      
      allocated.push(allocationsCount);
      returned.push(returnsCount);
    }
    
    setAssetTrends({
      labels: months,
      allocated,
      returned
    });
  };

  // Generate top employees with most assets
  const generateTopEmployees = (assetData) => {
    const employeeAssetCount = {};
    
    assetData.forEach(asset => {
      if (asset.currentEmployee) {
        if (employeeAssetCount[asset.currentEmployee]) {
          employeeAssetCount[asset.currentEmployee]++;
        } else {
          employeeAssetCount[asset.currentEmployee] = 1;
        }
      }
    });
    
    // Convert to array and sort
    const sortedEmployees = Object.entries(employeeAssetCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setTopEmployees(sortedEmployees);
  };

  // Chart data preparation
  const statusChartData = {
    labels: dashboardData.statusData.map((status) => status._id),
    datasets: [
      {
        data: dashboardData.statusData.map((status) => status.count),
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const categoryChartData = {
    labels: dashboardData.categoryData.map((category) => category._id),
    datasets: [
      {
        label: 'Assets by Category',
        data: dashboardData.categoryData.map((category) => category.count),
        backgroundColor: '#3f51b5',
        borderRadius: 6,
      },
    ],
  };

  const assetTrendsChartData = {
    labels: assetTrends.labels,
    datasets: [
      {
        label: 'Allocated',
        data: assetTrends.allocated,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Returned',
        data: assetTrends.returned,
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const batchDistributionData = {
    labels: assetBatches.slice(0, 5).map(batch => batch.batchNumber),
    datasets: [
      {
        data: assetBatches.slice(0, 5).map(batch => batch.numberOfAssets),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF4394', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
      }
    ]
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
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
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchAllAssetData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading asset dashboard data...
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
    <Box sx={{
      padding: '24px',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          color: '#1976d2',
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Asset Dashboard
        </Typography>
        
        <MuiTooltip title="Refresh Data">
          <IconButton 
            onClick={handleRefresh} 
            color="primary"
            sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { backgroundColor: '#f0f7ff' }
            }}
          >
            <Refresh />
          </IconButton>
        </MuiTooltip>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            backgroundColor: 'white',
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
              height: 3
            }
          }}
        >
          <Tab 
            icon={<Dashboard />} 
            label="Overview" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              py: 2
            }} 
          />
          <Tab 
            icon={<Inventory />} 
            label="Assets" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              py: 2
            }} 
          />
          <Tab 
            icon={<Layers />} 
            label="Batches" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              py: 2
            }} 
          />
          <Tab 
            icon={<History />} 
            label="History" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              py: 2
            }} 
          />
        </Tabs>
      </Paper>

      {/* Overview Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  height: '4px', 
                  backgroundColor: '#4CAF50', 
                  width: '100%' 
                }} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#E8F5E9', color: '#4CAF50', mr: 2 }}>
                      <Inventory />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                      Total Assets
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {dashboardData.totalAssets}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ color: '#4CAF50', mr: 0.5 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((dashboardData.totalAssets / (dashboardData.totalAssets || 1)) * 100)}% of inventory tracked
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  height: '4px', 
                  backgroundColor: '#2196F3', 
                  width: '100%' 
                }} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                      Assets in Use
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {dashboardData.assetsInUse}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ color: '#2196F3', mr: 0.5 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((dashboardData.assetsInUse / dashboardData.totalAssets) * 100)}% utilization rate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  height: '4px', 
                  backgroundColor: '#FF9800', 
                  width: '100%' 
                }} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800', mr: 2 }}>
                      <Category />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                      Categories
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {dashboardData.categoryData.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#FF9800', mr: 0.5 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {dashboardData.categoryData.length} different asset types
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  height: '4px', 
                  backgroundColor: '#F44336', 
                  width: '100%' 
                }} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#FFEBEE', color: '#F44336', mr: 2 }}>
                      <CalendarToday />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                      Recent Activity
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {recentTransactions.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ color: '#F44336', mr: 0.5 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {recentTransactions.length} recent transactions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#475569',
                  mb: 3,
                  fontWeight: 600
                }}>
                  Asset Status Distribution
                </Typography>
                {dashboardData.statusData.length ? (
                  <Box sx={{ height: 300 }}>
                    <Doughnut 
                      data={statusChartData}
                      options={pieOptions}
                    />
                  </Box>
                ) : (
                  <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
                    No status data available
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#475569',
                  mb: 3,
                  fontWeight: 600
                }}>
                  Assets by Category
                </Typography>
                {dashboardData.categoryData.length ? (
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={categoryChartData}
                      options={barOptions}
                    />
                  </Box>
                ) : (
                  <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
                    No category data available
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#475569',
                  mb: 3,
                  fontWeight: 600
                }}>
                  Asset Allocation Trends (6 Months)
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={assetTrendsChartData}
                    options={lineOptions}
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#475569',
                  mb: 3,
                  fontWeight: 600
                }}>
                  Top Employees with Assets
                </Typography>
                {topEmployees.length > 0 ? (
                  <List>
                    {topEmployees.map((employee, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `hsl(${index * 50}, 70%, 50%)` }}>
                            {employee.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={employee.name}
                          secondary={`${employee.count} asset${employee.count !== 1 ? 's' : ''}`}
                        />
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          sx={{ 
                            bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E0E0E0',
                            color: index < 3 ? '#000' : '#666',
                            fontWeight: 'bold'
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
                    No employee data available
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Assets Tab Content */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Inventory
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Current Employee</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Previous Employees</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetCategories.slice(0, 10).map((asset) => (
                      <TableRow key={asset._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                          {asset.name}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={asset.category}
                            size="small"
                            sx={{ 
                              bgcolor: asset.category === 'Hardware' ? '#E3F2FD' : 
                                      asset.category === 'Software' ? '#E8F5E9' : '#FFF3E0',
                              color: asset.category === 'Hardware' ? '#1976d2' : 
                                     asset.category === 'Software' ? '#4CAF50' : '#FF9800',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={asset.status}
                            size="small"
                            sx={{ 
                              bgcolor: asset.status === 'Available' ? '#E8F5E9' : 
                                      asset.status === 'In Use' ? '#E3F2FD' : '#FFEBEE',
                              color: asset.status === 'Available' ? '#4CAF50' : 
                                     asset.status === 'In Use' ? '#1976d2' : '#F44336',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#2563eb' }}>
                          {asset.currentEmployee || 'None'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {asset.previousEmployees && asset.previousEmployees.length > 0 
                            ? asset.previousEmployees.join(', ') 
                            : 'None'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {assetCategories.length > 10 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                                        variant="outlined" 
                    color="primary"
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    View All Assets
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Status Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie 
                  data={statusChartData}
                  options={pieOptions}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Category Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut 
                  data={{
                    labels: dashboardData.categoryData.map(cat => cat._id),
                    datasets: [{
                      data: dashboardData.categoryData.map(cat => cat.count),
                      backgroundColor: [
                        '#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#3F51B5'
                      ],
                      borderWidth: 1,
                      borderColor: '#fff'
                    }]
                  }}
                  options={pieOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Batches Tab Content */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Batches
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Batch Number</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Purchase Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Number of Assets</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Vendor</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Total Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetBatches.map((batch) => (
                      <TableRow key={batch._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {new Date(batch.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: '#2563eb', fontWeight: 500 }}>
                          {batch.numberOfAssets}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {batch.vendor}
                        </TableCell>
                        <TableCell sx={{ color: '#4CAF50', fontWeight: 500 }}>
                          ${batch.totalCost ? batch.totalCost.toFixed(2) : '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Batch Size Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut 
                  data={batchDistributionData}
                  options={pieOptions}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Batch Purchase Timeline
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={{
                    labels: assetBatches.map(batch => 
                      new Date(batch.purchaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    ),
                    datasets: [{
                      label: 'Assets Purchased',
                      data: assetBatches.map(batch => batch.numberOfAssets),
                      borderColor: '#3f51b5',
                      backgroundColor: 'rgba(63, 81, 181, 0.1)',
                      tension: 0.4,
                      fill: true
                    }]
                  }}
                  options={lineOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* History Tab Content */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Transaction History
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Asset Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Allotted Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Return Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetHistory.slice(0, 10).map((history) => (
                      <TableRow key={history._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                          {history.assetName}
                        </TableCell>
                        <TableCell sx={{ color: '#2563eb' }}>
                          {history.employeeName}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {new Date(history.allottedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {history.returnDate ? new Date(history.returnDate).toLocaleDateString() : 'Not Returned'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={history.returnDate ? 'Returned' : 'Active'}
                            size="small"
                            sx={{ 
                              bgcolor: history.returnDate ? '#E8F5E9' : '#E3F2FD',
                              color: history.returnDate ? '#4CAF50' : '#1976d2',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {assetHistory.length > 10 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    View Full History
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Recent Transactions
              </Typography>
              
              <List>
                {recentTransactions.map((transaction) => (
                  <ListItem key={transaction._id} sx={{ 
                    px: 0, 
                    borderBottom: '1px solid #f1f5f9',
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: transaction.returnDate ? '#E8F5E9' : '#E3F2FD',
                        color: transaction.returnDate ? '#4CAF50' : '#1976d2'
                      }}>
                        {transaction.returnDate ? <CheckCircle /> : <Info />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {transaction.assetName}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {transaction.employeeName}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {transaction.returnDate 
                              ? `Returned on ${new Date(transaction.returnDate).toLocaleDateString()}`
                              : `Allotted on ${new Date(transaction.allottedDate).toLocaleDateString()}`
                            }
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Chip 
                      label={transaction.returnDate ? 'Returned' : 'Active'}
                      size="small"
                      sx={{ 
                        bgcolor: transaction.returnDate ? '#E8F5E9' : '#E3F2FD',
                        color: transaction.returnDate ? '#4CAF50' : '#1976d2',
                        fontWeight: 500
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#475569',
                mb: 3,
                fontWeight: 600
              }}>
                Asset Allocation Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={assetTrendsChartData}
                  options={lineOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AssetDashboard;

    
