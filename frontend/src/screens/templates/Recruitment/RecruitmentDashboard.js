import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { styled } from '@mui/system';

// Register necessary elements and components for Chart.js
Chart.register(ArcElement, Tooltip, Legend);

// Styled component for card headers
const StyledHeader = styled(Box)(({ color }) => ({
  height: '4px',
  backgroundColor: color,
  marginBottom: '10px',
}));

// Sample data for the Candidate Offer Letter Status chart
const offerLetterStatusData = {
  labels: ['Not Sent', 'Sent', 'Accepted', 'Rejected', 'Joined'],
  datasets: [{
    data: [40, 20, 10, 5, 25],
    backgroundColor: ['#BDBDBD', '#FFEB3B', '#42A5F5', '#F44336', '#4CAF50'],
  }],
};

// Mock data for other sections
const statsData = [
  { label: "Total Vacancies", value: 31, color: "#4CAF50" },
  { label: "Ongoing Recruitments", value: 4, color: "#FFA726" },
  { label: "Hired Candidates", value: 8, color: "#66BB6A" },
  { label: "Conversion Rate", value: "47.1%", color: "#90A4AE" },
  { label: "Offer Acceptance Rate (OAR)", value: "62.5%", color: "#FF5722" },
];

const skillZoneStatus = [
  { initials: "TE", skill: "Test Engineer", candidates: 1, color: "#FFEB3B" },
  { initials: "DE", skill: "Designer", candidates: 2, color: "#CDDC39" },
];

const candidateData = [
  { initials: "MR", name: "Mia Reed", position: "Odoo Dev - (S/…)" },
  { initials: "LB", name: "Liam Bennett", position: "Odoo Dev - (S/…)" },
];

// Styled component for each recruitment card section
const SectionCard = ({ color, title, children }) => (
  <Card sx={{ boxShadow: 3, mb: 2, height: '100%' }}>
    <StyledHeader color={color} />
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

const RecruitmentDashboard = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} justifyContent="space-between">
        {/* Stats Cards */}
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <SectionCard color={stat.color} title={stat.label}>
              <Typography variant="h3">{stat.value}</Typography>
            </SectionCard>
          </Grid>
        ))}

        {/* Skill Zone Status */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#FFEB3B" title="Skill Zone Status">
            {skillZoneStatus.map((skill, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: skill.color, mr: 2 }}>{skill.initials}</Avatar>
                <Typography variant="body1" sx={{ flex: 1 }}>{skill.skill}</Typography>
                <Typography variant="body2">{skill.candidates} Candidate{skill.candidates > 1 ? 's' : ''}</Typography>
              </Box>
            ))}
          </SectionCard>
        </Grid>

        {/* Candidate Offer Letter Status */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#50E3C2" title="Candidate Offer Letter Status">
            <Doughnut 
              data={offerLetterStatusData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                    }
                  },
                },
              }}
            />
          </SectionCard>
        </Grid>

        {/* Candidate on Onboard */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#FF5C8D" title="Candidate on Onboard">
            {candidateData.map((candidate, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: "#FF5722", mr: 2 }}>{candidate.initials}</Avatar>
                <Box>
                  <Typography variant="body1">{candidate.name}</Typography>
                  <Typography variant="caption" color="textSecondary">{candidate.position}</Typography>
                </Box>
              </Box>
            ))}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruitmentDashboard;
