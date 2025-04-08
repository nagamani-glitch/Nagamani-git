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
} from "@mui/material";
import {
  Add,
  Search,
  List,
  GridView,
  FilterList,
  MoreVert,
  Delete,
  GroupWork,
  Person,
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
    <Box sx={styles.root}>
      <Box maxWidth="1800px" margin="0 auto">
        <Paper elevation={0} sx={styles.header}>
          <Typography variant="h6" fontWeight="700" color="#1a2027">
            Recruitment Candidates
          </Typography>
          <Box sx={styles.actionButtons}>
            <TextField
              variant="outlined"
              placeholder="Search candidates..."
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ color: "#94a3b8", mr: 1 }} />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={styles.searchBar}
            />

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, nextView) => nextView && setView(nextView)}
              sx={{ backgroundColor: "white" }}
            >
              <ToggleButton value="list" sx={styles.toggleButton}>
                <List />
              </ToggleButton>
              <ToggleButton value="grid" sx={styles.toggleButton}>
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
              sx={styles.actionButton}
            >
              {filter || "All Status"}
            </Button>

            <Button
              variant="outlined"
              startIcon={<GroupWork />}
              onClick={() => setGroupBy(!groupBy)}
              sx={styles.actionButton}
            >
              {groupBy ? "Ungroup" : "Group by Position"}
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                ...styles.actionButton,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Add Candidate
            </Button>
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
                  sx={{ mb: 3, pl: 1 }}
                >
                  {position || "Unspecified Position"}
                </Typography>
              )}

              <Grid container spacing={3}>
                {candidates.map((candidate) => (
                  <Grid
                    item
                    xs={12}
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
                      <CardContent sx={styles.cardContent}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              ...styles.avatar,
                              bgcolor: "#9e9e9e", // Grey color for all avatars
                              color: "white",
                            }}
                          >
                            {(candidate?.name?.[0] || "U").toUpperCase()}
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color="#1a2027"
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
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                              {candidate.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontWeight: 500,
                                mb: 1,
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
          sx={styles.dialog}
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
          sx={styles.dialog}
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
                color: "#64748b",
                "&:hover": { backgroundColor: "#f1f5f9" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
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
