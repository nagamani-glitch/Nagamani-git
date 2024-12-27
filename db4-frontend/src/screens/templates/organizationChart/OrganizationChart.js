import React, { useState } from 'react';
import { Box, Typography, FormControl, MenuItem, Select, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Sample organizational data for employees
const orgData = {
  "Harsh Kashyap": [
    { name: "Harsh Kashyap", title: "React Dev", color: "#ff6b6b" },
    { name: "Benjamin Parker", title: "Sales Man", color: "#ff6b6b" },
    { name: "Emily Clark", title: "Odoo Dev", color: "#ff6b6b" },
    { name: "Hafiz Al Asad", title: "Dot Net Core Development", color: "#1e90ff" }
  ],
  "Emily Clark": [
    { name: "Emily Clark", title: "Odoo Dev", color: "#ff6b6b" },
    { name: "Samantha Doe", title: "Backend Dev", color: "#1e90ff" },
    { name: "Michael Smith", title: "Frontend Dev", color: "#ff6b6b" }
  ],
  // Add other employees' data here
};

const OrganizationalChart = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("Harsh Kashyap");

  const handleChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Organizational Chart</Typography>
      <Box display="flex" alignItems="center" mb={3}>
        <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
          <Select
            value={selectedEmployee}
            onChange={handleChange}
            displayEmpty
          >
            {Object.keys(orgData).map((employee) => (
              <MenuItem key={employee} value={employee}>{employee}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField placeholder="Search" variant="outlined" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'repeat(10, 40px)',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 1,
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          padding: 2,
          borderRadius: 2,
          position: 'relative',
        }}
      >
        {orgData[selectedEmployee].map((person, index) => (
          <Box
            key={person.name}
            sx={{
              gridColumn: `span 2`,
              gridRow: `${index * 2 + 1} / span 2`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 1,
              backgroundColor: person.color,
              borderRadius: 1,
              boxShadow: 3,
              color: 'white',
              fontWeight: 'bold',
              position: 'relative',
            }}
          >
            <Typography>{person.name}</Typography>
            <Typography variant="caption">{person.title}</Typography>
            {index < orgData[selectedEmployee].length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  width: '2px',
                  height: '40px',
                  backgroundColor: 'black',
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <IconButton
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'red',
          color: 'white',
          '&:hover': { backgroundColor: 'darkred' },
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default OrganizationalChart;
