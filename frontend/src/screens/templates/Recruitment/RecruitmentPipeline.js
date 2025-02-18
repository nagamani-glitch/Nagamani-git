import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Avatar,
  Divider,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

const initialColumns = {
  "Recruitment Drive": [
    "Initial",
    "Interview",
    "Hired",
    "Cancelled",
    "Technical",
  ],
  "FutureForce Recruitment": [
    "Applied",
    "Screening",
    "Interviewed",
    "Offered",
    "Rejected",
  ],
  "Operating Manager": ["Reviewed", "In Progress", "Completed"],
  "Hiring Employees": ["Shortlisted", "Offer Extended", "Joined"],
};

const RecruitmentPipeline = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    department: "",
    column: "Initial",
    stars: 0,
  });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
  });

  const tabLabels = useMemo(
    () => [
      "Recruitment Drive",
      "FutureForce Recruitment",
      "Operating Manager",
      "Hiring Employees",
    ],
    []
  );
  useEffect(() => {
    fetchCandidates(tabLabels[tabIndex]);
  }, [tabIndex, tabLabels]);

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchCandidates = async (recruitment) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/recruitment/${recruitment}`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleDialogOpen = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setNewCandidate({ ...candidate });
    } else {
      setEditingCandidate(null);
      setNewCandidate({
        name: "",
        email: "",
        department: "",
        column: "Initial",
        stars: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleInputChange = (field, value) => {
    setNewCandidate({ ...newCandidate, [field]: value });

    if (field === "name") {
      setValidationErrors({
        ...validationErrors,
        name: validateName(value)
          ? ""
          : "Name should contain only letters and be 2-30 characters long",
      });
    }

    if (field === "email") {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(value) ? "" : "Please enter a valid email address",
      });
    }
  };
  const handleAddOrEditCandidate = async () => {
    if (
      !validateName(newCandidate.name) ||
      !validateEmail(newCandidate.email)
    ) {
      return;
    }

    const selectedTabLabel = tabLabels[tabIndex];
    try {
      if (editingCandidate) {
        await axios.put(
          `http://localhost:5000/api/recruitment/${editingCandidate._id}`,
          newCandidate
        );
      } else {
        await axios.post("http://localhost:5000/api/recruitment", {
          ...newCandidate,
          recruitment: selectedTabLabel,
        });
      }
      fetchCandidates(selectedTabLabel);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/editing candidate:", error);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    const selectedTabLabel = tabLabels[tabIndex];
    try {
      await axios.delete(
        `http://localhost:5000/api/recruitment/${candidateId}`
      );
      fetchCandidates(selectedTabLabel);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = initialColumns[tabLabels[tabIndex]];

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        padding: { xs: "16px", sm: "24px", md: "32px" },
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#1a237e",
            flexShrink: 0,
          }}
        >
          Recruitment Pipeline
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-end" },
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: { xs: "60%", sm: "300px" },
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>

          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              minWidth: "fit-content",
            }}
          >
            Add Candidate
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          mb: 2,
          "& .MuiTabs-flexContainer": {
            borderBottom: "2px solid #e0e0e0",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: "auto",
            padding: "12px 24px",
            color: "#64748b",
            "&.Mui-selected": {
              color: "#1976d2",
            },
          },
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box
        sx={{
          overflowX: "auto",
          width: "100%",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            mt: 1,
            height: "calc(100vh - 250px)",
            flexWrap: "nowrap",
            minWidth: "fit-content",
          }}
        >
          {columns.map((column) => (
            <Grid item key={column} sx={{ width: 330 }}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "2px solid #f1f5f9",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#ffffff",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1976d2",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {column}
                    <Typography
                      component="span"
                      sx={{
                        ml: "auto",
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        borderRadius: "16px",
                        padding: "4px 12px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {
                        filteredCandidates.filter((c) => c.column === column)
                          .length
                      }
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    p: 2,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#cbd5e1",
                      borderRadius: "3px",
                    },
                  }}
                >
                  {filteredCandidates
                    .filter((candidate) => candidate.column === column)
                    .map((candidate) => (
                      <Paper
                        key={candidate._id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#FF5C8D",
                              width: 40,
                              height: 40,
                              fontSize: "1.2rem",
                              flexShrink: 0,
                            }}
                          >
                            {candidate?.name?.[0]?.toUpperCase() || "U"}
                          </Avatar>

                          <Box
                            sx={{
                              flexGrow: 1,
                              minWidth: 0,
                              width: "calc(100% - 120px)",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: "#334155",
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {candidate.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {candidate.email}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  backgroundColor: "#f1f5f9",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  color: "#475569",
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {candidate.department}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  flexShrink: 0,
                                }}
                              >
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <StarIcon
                                    key={idx}
                                    sx={{
                                      fontSize: 16,
                                      color:
                                        idx < candidate.stars
                                          ? "#FFD700"
                                          : "#E0E0E0",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexShrink: 0,
                              ml: "auto",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDialogOpen(candidate)}
                              sx={{
                                color: "#64748b",
                                "&:hover": {
                                  color: "#1976d2",
                                  backgroundColor: "#e3f2fd",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteCandidate(candidate._id)
                              }
                              sx={{
                                color: "#64748b",
                                "&:hover": {
                                  color: "#ef4444",
                                  backgroundColor: "#fee2e2",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            width: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <TextField
            fullWidth
            label="Name"
            value={newCandidate.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={newCandidate.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Department"
            value={newCandidate.department}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, department: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Column"
            value={newCandidate.column}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, column: e.target.value })
            }
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Rating
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <IconButton
                  key={idx}
                  onClick={() =>
                    setNewCandidate({ ...newCandidate, stars: idx + 1 })
                  }
                >
                  <StarIcon
                    sx={{
                      color: idx < newCandidate.stars ? "#FFD700" : "#E0E0E0",
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <Button
            onClick={handleDialogClose}
            sx={{
              border: "2px solid #1976d2",
              color: "#1976d2",
              "&:hover": {
                border: "2px solid #64b5f6",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
              },
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddOrEditCandidate}
            disabled={!!validationErrors.name || !!validationErrors.email}
          >
            {editingCandidate ? "Save Changes" : "Add Candidate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentPipeline;
