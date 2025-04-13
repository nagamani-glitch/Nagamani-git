import React, { useState, useEffect } from "react";
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
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Fade,
  Snackbar,
  Alert,
  Paper,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  Search,
  List,
  GridView,
  FilterList,
  MoreVert,
  Delete,
  GroupWork,
} from "@mui/icons-material";
import axios from "axios";

const styles = {
  root: {
    padding: {
      xs: "12px",
      sm: "16px",
      md: "24px",
    },
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    alignItems: {
      xs: "flex-start",
      md: "center",
    },
    gap: {
      xs: 2,
      md: 0,
    },
    justifyContent: "space-between",
    marginBottom: "32px",
    padding: {
      xs: "16px",
      sm: "20px",
      md: "24px",
    },
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "center",
    width: {
      xs: "100%",
      md: "auto",
    },
  },
  searchBar: {
    marginRight: 2,
    width: {
      xs: "100%",
      sm: "280px",
    },
    backgroundColor: "#fff",
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#2196f3",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },
  },
  card: {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "12px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },
  cardContent: {
    padding: "24px !important",
  },
  avatar: {
    width: 56,
    height: 56,
    fontWeight: "bold",
    fontSize: "1.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  statusChip: {
    marginTop: 1,
    fontWeight: 600,
    borderRadius: "8px",
    padding: "4px 12px",
    height: "28px",
  },
  dialog: {
    "& .MuiDialog-paper": {
      width: "560px",
      padding: "24px",
      borderRadius: "16px",
    },
  },
  toggleButton: {
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "white",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },
  },
  actionButton: {
    borderRadius: "8px",
    textTransform: "none",
    padding: "8px 16px",
    fontWeight: 600,
  },
  menuItem: {
    gap: "8px",
    padding: "12px 24px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
};

// Update the statusColors object to use red for "Not-Hired"
const statusColors = {
  "Not-Hired": "#ef4444", // Changed to red
  Hired: "#4caf50", // Green (unchanged)
};

const RecruitmentCandidate = () => {
  const [view, setView] = useState("grid");
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [groupBy, setGroupBy] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    position: "",
    status: "Not-Hired",
    color: statusColors["Not-Hired"],
    employeeId: "",
  });

  useEffect(() => {
    fetchCandidates();
    fetchRegisteredEmployees();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/applicantProfiles"
      );
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error fetching candidates", "error");
    }
  };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(
        "http://localhost:5000/api/employees/registered"
      );
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      showSnackbar("Error fetching employees", "error");
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the candidate form with employee data
      setNewCandidate({
        ...newCandidate,
        name: `${employee.personalInfo?.firstName || ""} ${
          employee.personalInfo?.lastName || ""
        }`.trim(),
        email: employee.personalInfo?.email || "",
        position: employee.joiningDetails?.initialDesignation || "",
        employeeId: employee.Emp_ID || "",
      });
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/applicantProfiles",
        newCandidate
      );
      setCandidates([...candidates, response.data]);
      setCreateDialogOpen(false);
      resetNewCandidate();
      showSnackbar("Candidate created successfully");
    } catch (error) {
      showSnackbar("Error creating candidate", "error");
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/applicantProfiles/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
      setDeleteDialogOpen(false);
      showSnackbar("Candidate deleted successfully");
    } catch (error) {
      showSnackbar("Error deleting candidate", "error");
    }
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setNewCandidate({
      ...newCandidate,
      status: status,
      color: statusColors[status],
    });

    // If changing to a status that doesn't support employee selection, clear the selected employee
    if (status !== "Hired") {
      setSelectedEmployee(null);
      setNewCandidate((prev) => ({
        ...prev,
        status: status,
        color: statusColors[status],
        employeeId: "",
      }));
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const resetNewCandidate = () => {
    setNewCandidate({
      name: "",
      email: "",
      position: "",
      status: "Not-Hired",
      color: statusColors["Not-Hired"],
      employeeId: "",
    });
    setSelectedEmployee(null);
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
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

  // Check if employee selection should be enabled
  const isEmployeeSelectionEnabled = () => {
    return newCandidate.status === "Hired";
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box maxWidth="1800px" margin="0 auto">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            color: "#1976d2",
            fontWeight: 600,
            letterSpacing: 0.5,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Recruitment Candidates
        </Typography>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 2, sm: 3 },
            marginBottom: 3,
            borderRadius: 2,
            boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search candidates..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: "300px", md: "350px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                ml: { sm: "auto" },
                flexWrap: { xs: "wrap", md: "nowrap" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, nextView) => nextView && setView(nextView)}
                size="small"
                sx={{
                  height: 40,
                  backgroundColor: "white",
                  "& .MuiToggleButton-root": {
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <ToggleButton
                  value="list"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: alpha("#1976d2", 0.1),
                      color: "#1976d2",
                    },
                  }}
                >
                  <List />
                </ToggleButton>
                <ToggleButton
                  value="grid"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: alpha("#1976d2", 0.1),
                      color: "#1976d2",
                    },
                  }}
                >
                  <GridView />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() =>
                  setFilter(
                    filter === ""
                      ? "Hired"
                      : filter === "Hired"
                      ? "Not-Hired"
                      : ""
                  )
                }
                sx={{
                  height: 40,
                  whiteSpace: "nowrap",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  padding: { xs: "6px 8px", sm: "6px 16px" },
                }}
              >
                {filter || "All Status"}
              </Button>

              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  height: 40,
                  whiteSpace: "nowrap",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  padding: { xs: "6px 8px", sm: "6px 16px" },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {groupBy ? "Ungroup" : "Group by Position"}
              </Button>

              <Button
                variant="contained"
                // startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  height: 40,
                  background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
                  },
                  display: { xs: "none", sm: "flex" },
                  whiteSpace: "nowrap",
                }}
              >
                Add Candidate
              </Button>
            </Box>

            {/* Add a second row of buttons for mobile */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                width: "100%",
                gap: 1,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  height: 40,
                  whiteSpace: "nowrap",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  flex: 1,
                }}
              >
                {groupBy ? "Ungroup" : "Group"}
              </Button>

              <Button
                variant="contained"
                // startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  height: 50,
                  background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
                  },
                  flex: 1,
                }}
              >
                Add Candidate
              </Button>
            </Box>
          </Box>
        </Paper>

        {Object.entries(groupedCandidates).map(([position, candidates]) => (
          <Fade in={true} timeout={500} key={position}>
            <Box mb={4}>
              {groupBy && (
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color="#1a2027"
                  sx={{
                    mb: 3,
                    pl: 1,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {position || "Unspecified Position"}
                </Typography>
              )}

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {candidates.map((candidate) => (
                  <Grid
                    item
                    xs={12}
                    sm={view === "grid" ? 6 : 12}
                    md={view === "grid" ? 4 : 12}
                    key={candidate._id}
                  >
                    <Card
                      sx={{
                        ...styles.card,
                        borderLeft: `4px solid ${candidate.color}`,
                        backgroundColor: "white",
                      }}
                    >
                      <CardContent
                        sx={{
                          ...styles.cardContent,
                          padding: { xs: "16px", sm: "24px" },
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          flexDirection={{ xs: "column", sm: "row" }}
                          gap={2}
                        >
                          <Avatar
                            sx={{
                              ...styles.avatar,
                              bgcolor: "#9e9e9e",
                              color: "white",
                              width: { xs: 40, sm: 56 },
                              height: { xs: 40, sm: 56 },
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          >
                            {(candidate?.name?.[0] || "U").toUpperCase()}
                          </Avatar>
                          <Box flexGrow={1} width={{ xs: "100%", sm: "auto" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                                flexDirection: { xs: "column", sm: "row" },
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight="600"
                                color="#1a2027"
                                sx={{
                                  fontSize: { xs: "1rem", sm: "1.125rem" },
                                  mb: { xs: 0.5, sm: 0 },
                                }}
                              >
                                {candidate.name}
                                {candidate.employeeId && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{
                                      ml: 1,
                                      color: "#1976d2",
                                      backgroundColor: "#e3f2fd",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    {candidate.employeeId}
                                  </Typography>
                                )}
                              </Typography>

                              <Box
                                sx={{
                                  display: { xs: "flex", sm: "none" },
                                  gap: 1,
                                  alignSelf: "flex-end",
                                  mt: { xs: 1, sm: 0 },
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setSelectedCandidate(candidate);
                                  }}
                                  sx={{
                                    color: "#64748b",
                                    "&:hover": {
                                      backgroundColor: "#f1f5f9",
                                    },
                                  }}
                                >
                                  <MoreVert />
                                </IconButton>
                              </Box>
                            </Box>

                            <Typography
                              color="text.secondary"
                              sx={{
                                mb: 1,
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                              }}
                            >
                              {candidate.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontWeight: 500,
                                mb: 1,
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              }}
                            >
                              {candidate.position}
                            </Typography>
                            <Chip
                              label={candidate.status}
                              sx={{
                                bgcolor: candidate.color,
                                color: "white",
                                ...styles.statusChip,
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                height: { xs: "24px", sm: "28px" },
                              }}
                            />
                          </Box>
                          <IconButton
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedCandidate(candidate);
                            }}
                            sx={{
                              color: "#64748b",
                              "&:hover": {
                                backgroundColor: "#f1f5f9",
                              },
                              display: { xs: "none", sm: "flex" },
                              ml: "auto",
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ))}

        {/* Menu for candidate actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              padding: "8px 0",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setDeleteDialogOpen(true);
            }}
            sx={styles.menuItem}
          >
            <Delete sx={{ color: "#ef4444" }} />
            <Typography color="#ef4444">Delete</Typography>
          </MenuItem>
        </Menu>

        {/* Delete confirmation dialog */}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: { xs: "95%", sm: "600px" },
              maxWidth: "600px",
              borderRadius: "20px",
              overflow: "hidden",
              margin: { xs: "16px", sm: "32px" },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Delete Candidate
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{selectedCandidate?.name}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "#64748b",
                "&:hover": { backgroundColor: "#f1f5f9" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteCandidate(selectedCandidate?._id)}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create candidate dialog */}

        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetNewCandidate();
          }}
          sx={{
            "& .MuiDialog-paper": {
              width: { xs: "95%", sm: "600px" },
              maxWidth: "600px",
              borderRadius: "20px",
              overflow: "hidden",
              margin: { xs: "16px", sm: "32px" },
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              pb: 1,
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              borderRadius: "12px 12px 0 0",
              padding: "16px 24px",
            }}
          >
            Add New Candidate
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Name"
                fullWidth
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                fullWidth
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
              />
              <TextField
                label="Position"
                fullWidth
                value={newCandidate.position}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, position: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCandidate.status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Hired">Hired</MenuItem>
                  <MenuItem value="Not-Hired">Not Hired</MenuItem>
                </Select>
              </FormControl>

              {/* Employee Selection Autocomplete - only enabled for Hired status */}
              <Autocomplete
                id="employee-select"
                options={registeredEmployees}
                getOptionLabel={(option) =>
                  `${option.Emp_ID} - ${option.personalInfo?.firstName || ""} ${
                    option.personalInfo?.lastName || ""
                  }`
                }
                value={selectedEmployee}
                onChange={handleEmployeeSelect}
                loading={loadingEmployees}
                disabled={!isEmployeeSelectionEnabled()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      isEmployeeSelectionEnabled()
                        ? "Select Onboarded Employee"
                        : "Employee selection only available for Hired status"
                    }
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingEmployees ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    helperText={
                      !isEmployeeSelectionEnabled() &&
                      "Change status to Hired to enable employee selection"
                    }
                  />
                )}
                sx={{
                  "& .Mui-disabled": {
                    opacity: 0.7,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button
              onClick={() => {
                setCreateDialogOpen(false);
                resetNewCandidate();
              }}
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
              onClick={handleCreateSubmit}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                fontSize: "0.95rem",
                textTransform: "none",
                padding: "8px 32px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
              }}
              disabled={!newCandidate.name || !newCandidate.email}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};



export default RecruitmentCandidate;
