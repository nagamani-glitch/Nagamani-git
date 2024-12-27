import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Box,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add, Search, List, GridView, FilterList, MoreVert } from '@mui/icons-material';
import axios from 'axios';

const RecruitmentCandidate = () => {
  const [view, setView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    position: '',
    status: 'Not-Hired',
    color: '#ff9800',
  });
  const [filter, setFilter] = useState(""); // For filtering
  const [groupBy, setGroupBy] = useState(false); // For grouping
  const [selectedCandidates, setSelectedCandidates] = useState([]); // For batch actions

  useEffect(() => {
    // Fetch the candidates when the component mounts
    axios.get('http://localhost:5000/api/applicantProfiles') // Corrected URL path
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the candidates!", error);
      });
  }, []);

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleMenuOpen = (event, candidate) => {
    setAnchorEl(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/api/applicantProfiles/${selectedCandidate._id}`) // Corrected URL path
      .then(() => {
        setCandidates(candidates.filter(candidate => candidate._id !== selectedCandidate._id));
        setDeleteDialogOpen(false);
      })
      .catch(error => {
        console.error("There was an error deleting the candidate!", error);
      });
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({ ...newCandidate, [name]: value });
  };

  const handleCreateSubmit = () => {
    axios.post('http://localhost:5000/api/applicantProfiles', newCandidate) // Corrected URL path
      .then(response => {
        setCandidates([...candidates, response.data]);
        setCreateDialogOpen(false);
        setNewCandidate({
          name: '',
          email: '',
          position: '',
          status: 'Not-Hired',
          color: '#ff9800',
        });
      })
      .catch(error => {
        console.error("There was an error creating the candidate!", error);
      });
  };

  const handleFilterChange = () => {
    setFilter(filter === "" ? "Hired" : filter === "Hired" ? "Not-Hired" : "");
  };

  const handleGroupByToggle = () => {
    setGroupBy(!groupBy);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidates((prevSelected) => {
      if (prevSelected.includes(candidate)) {
        return prevSelected.filter(c => c !== candidate);
      }
      return [...prevSelected, candidate];
    });
  };

  const handleBatchDelete = () => {
    axios.delete('http://localhost:5000/api/applicantProfiles/batch', { data: { ids: selectedCandidates.map(c => c._id) } }) // Corrected URL path
      .then(() => {
        setCandidates(candidates.filter(candidate => !selectedCandidates.includes(candidate)));
        setSelectedCandidates([]); // Clear selection after delete
      })
      .catch(error => {
        console.error("There was an error deleting the selected candidates!", error);
      });
  };

  const filteredCandidates = candidates.filter(
    candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter ? candidate.status === filter : true)
  );

  const groupedCandidates = groupBy
    ? filteredCandidates.reduce((groups, candidate) => {
        const position = candidate.position;
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {})
    : { All: filteredCandidates };

  return (
    <Box p={3} bgcolor="#f5f5f5">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">Candidates</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            InputProps={{
              startAdornment: <Search fontSize="small" />,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2, width: 200 }}
          />
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="list" aria-label="list view">
              <List />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <GridView />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" startIcon={<FilterList />} onClick={handleFilterChange} sx={{ mr: 2 }}>
            {filter || "Filter"}
          </Button>
          <Button variant="outlined" onClick={handleGroupByToggle} sx={{ mr: 2 }}>
            {groupBy ? "Ungroup" : "Group By Position"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleBatchDelete}
            disabled={selectedCandidates.length === 0}
            sx={{ mr: 2 }}
          >
            Delete Selected
          </Button>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleCreateDialogOpen}>
            Create
          </Button>
        </Box>
      </Box>

      {Object.entries(groupedCandidates).map(([position, candidates]) => (
        <Box key={position} mt={2}>
          {groupBy && <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{position}</Typography>}
          <Grid container spacing={2}>
            {candidates.map((candidate, index) => (
              <Grid item xs={view === "grid" ? 3 : 12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid ${candidate.color}`,
                    borderRadius: 2,
                    bgcolor: selectedCandidates.includes(candidate) ? "#e0f7fa" : "inherit",
                  }}
                  onClick={() => handleCandidateSelect(candidate)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: candidate.color, mr: 2 }}>
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {candidate.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {candidate.email}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {candidate.position}
                      </Typography>
                    </Box>
                    <IconButton onClick={(event) => handleMenuOpen(event, candidate)}>
                      <MoreVert />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Candidate</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this candidate?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
        <DialogTitle>Create Candidate</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newCandidate.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={newCandidate.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Position"
            name="position"
            value={newCandidate.position}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newCandidate.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Not-Hired">Not-Hired</MenuItem>
              <MenuItem value="Hired">Hired</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button onClick={handleCreateSubmit} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentCandidate;
