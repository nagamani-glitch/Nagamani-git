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

  const fetchDashboardData = async () => {
    try {
      // Adjusted API URL to match backend
      const response = await axios.get('https://db-4-demo-project-hlv5.vercel.app/api/assetHistory/summary');
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
    <div className="dashboard">
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Assets</h3>
          <p>{totalAssets}</p>
        </div>
        <div className="stat-card">
          <h3>Assets in Use</h3>
          <p>{assetsInUse}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>Asset Status Distribution</h3>
          {statusData.length ? <Pie data={statusChartData} /> : <p>Loading status data...</p>}
        </div>

        <div className="chart-container">
          <h3>Assets by Category</h3>
          {categoryData.length ? <Bar data={categoryChartData} /> : <p>Loading category data...</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
