import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Paper,
  Grid,
} from '@mui/material';
import { ExpandMore, Add, Edit, Delete, Search } from '@mui/icons-material';
import axios from 'axios';

const SkillZone = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newReason, setNewReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/skill-zone')
      .then((response) => setSkills(response.data))
      .catch((error) => console.error('Error fetching skills:', error));
  }, []);

  const handleClickOpen = () => {
    setEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewSkillName('');
    setNewCandidateName('');
    setNewReason('');
    setCurrentSkillId(null);
    setCurrentCandidateId(null);
  };

  const handleAddSkill = () => {
    if (newSkillName && newCandidateName && newReason) {
      const newCandidate = {
        name: newCandidateName,
        reason: newReason,
        addedOn: new Date().toLocaleDateString(),
      };
      axios
        .post('http://localhost:5000/api/skill-zone', { name: newSkillName, candidates: [newCandidate] })
        .then((response) => {
          setSkills([...skills, response.data]);
          handleClose();
        })
        .catch((error) => console.error('Error adding skill:', error));
    }
  };

  const handleEditCandidate = (skillId, candidateId) => {
    const skill = skills.find((s) => s._id === skillId);
    const candidate = skill.candidates.find((c) => c._id === candidateId);

    setNewSkillName(skill.name);
    setNewCandidateName(candidate.name);
    setNewReason(candidate.reason);
    setCurrentSkillId(skillId);
    setCurrentCandidateId(candidateId);
    setEditing(true);
    setOpen(true);
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:5000/api/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`, {
        name: newCandidateName,
        reason: newReason,
      })
      .then((response) => {
        setSkills((prevSkills) =>
          prevSkills.map((skill) => (skill._id === currentSkillId ? response.data : skill))
        );
        handleClose();
      })
      .catch((error) => console.error('Error updating candidate:', error));
  };

  const handleDeleteCandidate = (skillId, candidateId) => {
    axios
      .delete(`http://localhost:5000/api/skill-zone/${skillId}/candidates/${candidateId}`)
      .then(() => {
        setSkills((prevSkills) =>
          prevSkills.map((skill) =>
            skill._id === skillId
              ? { ...skill, candidates: skill.candidates.filter((c) => c._id !== candidateId) }
              : skill
          )
        );
      })
      .catch((error) => console.error('Error deleting candidate:', error));
  };

  const handleDeleteSkill = (skillId) => {
    // Ask for confirmation before deleting the skill
    if (window.confirm('Are you sure you want to delete this skill? This will also remove all associated candidates.')) {
      axios
        .delete(`http://localhost:5000/api/skill-zone/${skillId}`)
        .then(() => {
          setSkills((prevSkills) => prevSkills.filter((skill) => skill._id !== skillId));
        })
        .catch((error) => console.error('Error deleting skill:', error));
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.candidates.some((candidate) => candidate.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box p={3} sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Skill Zone Management
      </Typography>

      {/* Search and Add Skill Section */}
      <Grid container spacing={2} mb={4} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Search Skills & Candidates"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleClickOpen}
            fullWidth
          >
            Add New Skill
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, backgroundColor: '#fff', boxShadow: 2 }}>
        {/* Display Skills with Candidates */}
        {filteredSkills.map((skill) => (
          <Accordion key={skill._id} sx={{ marginBottom: 2, border: '1px solid #ddd' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {skill.name}
              </Typography>
              <IconButton onClick={() => handleDeleteSkill(skill._id)} sx={{ marginLeft: 'auto' }}>
                <Delete color="error" />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Candidate Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skill.candidates.map((candidate) => (
                    <TableRow key={candidate._id}>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.reason}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditCandidate(skill._id, candidate._id)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteCandidate(skill._id, candidate._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Dialog for adding/editing Skill */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Candidate' : 'Add New Skill'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Skill Name"
            variant="outlined"
            fullWidth
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Candidate Name"
            variant="outlined"
            fullWidth
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Reason"
            variant="outlined"
            fullWidth
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={editing ? handleSaveEdit : handleAddSkill} color="primary">
            {editing ? 'Save Changes' : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillZone;
