import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { styled } from '@mui/system';

// Register necessary elements and components for Chart.js
Chart.register(ArcElement, Tooltip, Legend);

// Styled component for card headers
const StyledHeader = styled(Box)(({ theme, color }) => ({
  height: '4px',
  backgroundColor: color,
  marginBottom: '10px',
}));

// Sample data for the charts
const departmentData = {
  labels: ['S/W Dept', 'Sales Dept', 'HR Dept', 'Marketing Dept', 'Finance Dept'],
  datasets: [{
    data: [20, 10, 15, 5, 31],
    backgroundColor: ['#4A90E2', '#FF5C8D', '#F5A623', '#F8E71C', '#50E3C2'],
  }],
};

const genderData = {
  labels: ['Male', 'Female', 'Other'],
  datasets: [{
    data: [40, 30, 10],
    backgroundColor: ['#4A90E2', '#FF5C8D', '#F8E71C'],
  }],
};

const objectiveStatusData = {
  labels: ['At Risk', 'Not Started'],
  datasets: [{
    data: [10, 50],
    backgroundColor: ['#50E3C2', '#FF5C8D'],
  }],
};

const MainDashboard = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#4CAF50" /> {/* Green Header */}
            <CardContent>
              <Typography variant="h6">New Joining Today</Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#FFA726" /> {/* Orange Header */}
            <CardContent>
              <Typography variant="h6">New Joining This Week</Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#B0BEC5" /> {/* Gray Header */}
            <CardContent>
              <Typography variant="h6">Total Strength</Typography>
              <Typography variant="h3">81</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#4CAF50" /> {/* Green Header */}
            <CardContent>
              <Typography variant="h6">Department Chart</Typography>
              <Doughnut data={departmentData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#FF5C8D" /> {/* Pink Header */}
            <CardContent>
              <Typography variant="h6">Gender Chart</Typography>
              <Doughnut data={genderData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#50E3C2" /> {/* Teal Header */}
            <CardContent>
              <Typography variant="h6">Objective Status</Typography>
              <Doughnut data={objectiveStatusData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <StyledHeader color="#9E9E9E" /> {/* Dark Gray Header */}
            <CardContent>
              <Typography variant="h6">Announcements</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>No Announcements to show.</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
