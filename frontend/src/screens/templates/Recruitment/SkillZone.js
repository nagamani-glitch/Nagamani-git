import React, { useState, useEffect } from "react";
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
  Container,
  Fade,
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Search,
  PersonAdd,
  WorkOutline,
} from "@mui/icons-material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const SkillZone = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newReason, setNewReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/skill-zone");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewSkillName("");
    setNewCandidateName("");
    setNewReason("");
    setCurrentSkillId(null);
    setCurrentCandidateId(null);
  };

  const handleAddSkill = async () => {
    if (!newSkillName || !newCandidateName || !newReason) return;

    try {
      const newCandidate = {
        name: newCandidateName,
        reason: newReason,
        addedOn: new Date().toLocaleDateString(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/skill-zone",
        {
          name: newSkillName,
          candidates: [newCandidate],
        }
      );

      setSkills([...skills, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };
  const handleEditCandidate = (skillId, candidateId) => {
    const skill = skills.find((s) => s._id === skillId);
    const candidate = skill.candidates.find((c) => c._id === candidateId);
    setCurrentSkillId(skillId);
    setCurrentCandidateId(candidateId);
    setNewCandidateName(candidate.name);
    setNewReason(candidate.reason);
    setNewSkillName(skill.name);
    setEditing(true);
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`,
        {
          name: newCandidateName,
          reason: newReason,
        }
      );
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === currentSkillId ? response.data : skill
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const handleDeleteCandidate = async (skillId, candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/skill-zone/${skillId}/candidates/${candidateId}`
      );
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === skillId
            ? {
                ...skill,
                candidates: skill.candidates.filter(
                  (c) => c._id !== candidateId
                ),
              }
            : skill
        )
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this skill and all its candidates?"
      )
    )
      return;

    try {
      await axios.delete(`http://localhost:5000/api/skill-zone/${skillId}`);
      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill._id !== skillId)
      );
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.candidates.some((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 2, bgcolor: "#ffffff" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                borderBottom: "2px solid #1976d2",
                pb: 2,
              }}
            >
              <WorkOutline
                sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                Skill Zone Management
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search skills or candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#f8f9fa",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleClickOpen}
                  sx={{
                    height: "56px",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  Add New Skill
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              {filteredSkills.map((skill) => (
                <Accordion
                  key={skill._id}
                  sx={{
                    mb: 2,
                    border: "1px solid #e0e0e0",
                    "&:hover": { boxShadow: 2 },
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ flexGrow: 1, fontWeight: 500 }}
                    >
                      {skill.name}
                    </Typography>
                    <Tooltip title="Delete Skill">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSkill(skill._id);
                        }}
                        sx={{
                          "&:hover": {
                            color: "error.main",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            Candidate
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            Reason
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {skill.candidates.map((candidate) => (
                          <TableRow
                            key={candidate._id}
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.reason}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() =>
                                    handleEditCandidate(
                                      skill._id,
                                      candidate._id
                                    )
                                  }
                                  sx={{ color: "primary.main" }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() =>
                                    handleDeleteCandidate(
                                      skill._id,
                                      candidate._id
                                    )
                                  }
                                  sx={{ color: "error.main" }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                elevation: 24,
                sx: { borderRadius: 2 },
              }}
            >
              <DialogTitle
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  py: 2,
                }}
              >
                {editing ? "Edit Candidate" : "Add New Skill"}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  disabled={editing}
                  sx={{ mb: 2, mt:2 }}
                />
                <TextField
                  fullWidth
                  label="Candidate Name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Reason"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  multiline
                  rows={3}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={handleClose}
                  color="inherit"
                  sx={{
                    border: '2px solid #1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      border: '2px solid #64b5f6',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2'
                    },
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    fontWeight: 600
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editing ? handleSaveEdit : handleAddSkill}
                  variant="contained"
                  sx={{ px: 3 }}
                >
                  {editing ? "Save Changes" : "Add Skill"}
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Fade>
      </Container>
    </ThemeProvider>
  );
};

export default SkillZone;
