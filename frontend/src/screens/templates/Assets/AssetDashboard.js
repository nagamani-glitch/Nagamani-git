// AssetDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssetDashboard.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Grid } from '@mui/material';


// Register the components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const Dashboard = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [assetsInUse, setAssetsInUse] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    // Cleanup function to handle chart unmounting
    return () => {
      // Add cleanup logic here if needed, like destroying chart instances
      // Since react-chartjs-2 automatically cleans up, this is usually not required.
    };
  }, []);

  const APP_URL = process.env.REACT_APP_API_URL;

  const fetchDashboardData = async () => {
    try {
      // Adjusted API URL to match backend
      const response = await axios.get(`${APP_URL}/api/assetHistory/summary`);
      setTotalAssets(response.data.totalAssets);
      setAssetsInUse(response.data.assetsInUse);
      setCategoryData(response.data.categoryData);
      setStatusData(response.data.statusData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data.');
    }
  };

  const statusChartData = {
    labels: statusData.map((status) => status._id),
    datasets: [
      {
        data: statusData.map((status) => status.count),
        backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
      },
    ],
  };

  const categoryChartData = {
    labels: categoryData.map((category) => category._id),
    datasets: [
      {
        label: 'Assets by Category',
        data: categoryData.map((category) => category.count),
        backgroundColor: '#36a2eb',
      },
    ],
  };

  return (

    <Box sx={{
      padding: '24px',
      backgroundColor: '#f8fafc'
  }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          color: '#1976d2',
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
      }}>
          Asset Dashboard
      </Typography>
  
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
              <Box sx={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  height: '100%'
              }}>
                  <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                      Total Assets
                  </Typography>
                  <Typography variant="h3" sx={{ 
                      color: '#1976d2',
                      fontWeight: 600 
                  }}>
                      {totalAssets}
                  </Typography>
              </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
              <Box sx={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  height: '100%'
              }}>
                  <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                      Assets in Use
                  </Typography>
                  <Typography variant="h3" sx={{ 
                      color: '#1976d2',
                      fontWeight: 600 
                  }}>
                      {assetsInUse}
                  </Typography>
              </Box>
          </Grid>
      </Grid>
  
      {/* Charts Section */}
      <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
              <Box sx={{
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
                  {statusData.length ? (
                      <Box sx={{ height: 300 }}>
                          <Pie 
                              data={statusChartData}
                              options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                      legend: {
                                          position: 'bottom',
                                          labels: {
                                              padding: 20,
                                              usePointStyle: true
                                          }
                                      }
                                  }
                              }}
                          />
                      </Box>
                  ) : (
                      <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
                          Loading status data...
                      </Typography>
                  )}
              </Box>
          </Grid>
          <Grid item xs={12} md={6}>
              <Box sx={{
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
                  {categoryData.length ? (
                      <Box sx={{ height: 300 }}>
                          <Bar 
                              data={categoryChartData}
                              options={{
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
                                              drawBorder: false
                                          }
                                      },
                                      x: {
                                          grid: {
                                              display: false
                                          }
                                      }
                                  }
                              }}
                          />
                      </Box>
                  ) : (
                      <Typography sx={{ color: '#64748b', textAlign: 'center' }}>
                          Loading category data...
                      </Typography>
                  )}
              </Box>
          </Grid>
      </Grid>
  </Box>
  
  );
};

export default Dashboard;
