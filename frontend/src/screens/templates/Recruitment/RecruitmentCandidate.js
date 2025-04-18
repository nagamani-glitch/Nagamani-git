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
  Container,
  Tooltip,
} from "@mui/material";
import {
  Search,
  List,
  GridView,
  FilterList,
  MoreVert,
  Delete,
  GroupWork,
  Add,
} from "@mui/icons-material";
import axios from "axios";

// Standardized theme-based styling
const styles = {
  container: {
    padding: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  contentContainer: {
    maxWidth: {
      xs: "100%",
      sm: "100%",
      md: "1200px",
      lg: "1400px",
      xl: "1600px",
    },
    margin: "0 auto",
    width: "100%",
    padding: { xs: 1, sm: 2, md: 2 }, // Add consistent padding
  },

  pageTitle: {
    mb: 3,
    color: "#1976d2",
    fontWeight: 600,
    letterSpacing: 0.5,
    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
  },
  // headerPaper: {
  //   padding: { xs: 2, sm: 3 },
  //   marginBottom: 3,
  //   borderRadius: 2,
  //   boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  // },
  // Update the header paper style:
  headerPaper: {
    padding: { xs: 1.5, sm: 3 }, // Reduce padding on mobile
    marginBottom: 3,
    borderRadius: 2,
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },

  // searchField: {
  //   width: { xs: "100%", sm: "280px" },
  //   "& .MuiOutlinedInput-root": {
  //     borderRadius: 2,
  //     "&:hover fieldset": {
  //       borderColor: "#1976d2",
  //     },
  //   },
  // },
  // Update the search field style:
  searchField: {
    width: { xs: "100%", sm: "280px" },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
    },
    "& .MuiInputBase-input": {
      padding: { xs: "8px 10px", sm: "8px 14px" }, // Smaller padding on mobile
    },
  },

  actionButtonsContainer: {
    display: "flex",
    gap: 2,
    flexWrap: { xs: "wrap", md: "nowrap" },
    justifyContent: { xs: "space-between", sm: "flex-end" },
    marginLeft: { sm: "auto" },
  },
  toggleButtonGroup: {
    height: 40,
    backgroundColor: "white",
    "& .MuiToggleButton-root": {
      border: "1px solid rgba(0, 0, 0, 0.12)",
    },
  },
  toggleButton: {
    "&.Mui-selected": {
      backgroundColor: alpha("#1976d2", 0.1),
      color: "#1976d2",
    },
  },
  // actionButton: {
  //   height: 40,
  //   whiteSpace: "nowrap",
  //   borderColor: "#1976d2",
  //   color: "#1976d2",
  //   fontSize: { xs: "0.8rem", sm: "0.875rem" },
  //   padding: { xs: "6px 12px", sm: "6px 16px" },
  // },
  // addButton: {
  //   height: 40,
  //   background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
  //   color: "white",
  //   "&:hover": {
  //     background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
  //   },
  //   whiteSpace: "nowrap",
  //   fontSize: { xs: "0.8rem", sm: "0.875rem" },
  //   padding: { xs: "6px 12px", sm: "6px 16px" },
  // },

  // Update these button styles in the styles object:

  actionButton: {
    height: 40,
    whiteSpace: "nowrap", // Prevent text wrapping
    borderColor: "#1976d2",
    color: "#1976d2",
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    padding: { xs: "6px 8px", sm: "6px 16px" }, // Adjust padding for different screen sizes
    minWidth: { xs: "auto", sm: "120px" }, // Ensure minimum width on larger screens
    "& .MuiButton-startIcon": {
      marginRight: { xs: 4, sm: 8 }, // Adjust icon spacing
    },
    textTransform: "none", // Prevent uppercase transformation
  },

  addButton: {
    height: 40,
    background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
    color: "white",
    "&:hover": {
      background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
    },
    whiteSpace: "nowrap", // Prevent text wrapping
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    padding: { xs: "6px 8px", sm: "6px 16px" }, // Adjust padding for different screen sizes
    minWidth: { xs: "auto", sm: "140px" }, // Ensure minimum width on larger screens
    "& .MuiButton-startIcon": {
      marginRight: { xs: 4, sm: 8 }, // Adjust icon spacing
    },
    textTransform: "none", // Prevent uppercase transformation
  },

  sectionTitle: {
    fontWeight: 600,
    color: "#1a2027",
    mb: 2,
    pl: 1,
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
  },

  // Update card and content styles
  card: {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "white",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
  },
  cardContent: {
    padding: { xs: "16px", sm: "20px", md: "20px", lg: "24px" },
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:last-child": {
      paddingBottom: { xs: "16px", sm: "20px", md: "20px", lg: "24px" },
    },
  },
  // cardHeader: {
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   gap: { xs: 1.5, sm: 2, md: 2, lg: 2.5 },
  //   width: "100%",
  //   mb: { xs: 1.5, sm: 2, md: 2, lg: 2.5 },
  // },
  cardHeader: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
    alignItems: { xs: "flex-start", sm: "flex-start" },
    gap: { xs: 2, sm: 3 },
    width: "100%",
    mb: 2,
    position: "relative", // Add position relative
  },

  avatar: {
    bgcolor: "#9e9e9e",
    color: "white",
    width: { xs: 50, sm: 56, md: 60 },
    height: { xs: 50, sm: 56, md: 60 },
    fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem" },
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexShrink: 0, // Prevent avatar from shrinking
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flexGrow: 1,
  },
  // nameContainer: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   width: "100%",
  //   mb: { xs: 1.5, md: 2 },
  //   position: "relative", // Add position relative for absolute positioning
  // },

  // nameContainer: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   width: "100%",
  //   mb: { xs: 1.5, md: 2 },
  //   position: "relative", // Add position relative for absolute positioning
  //   minHeight: "32px", // Ensure minimum height for the container
  // },
  nameContainer: {
    display: "flex",
    width: "100%",
    mb: { xs: 1.5, md: 2 },
    position: "relative", // Keep position relative
  },
  // candidateName: {
  //   fontWeight: 600,
  //   color: "#1a2027",
  //   fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" },
  //   lineHeight: 1.3,
  //   paddingRight: "36px", // Increased padding to make room for the action button
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   width: "100%", // Take full width
  //   display: "-webkit-box",
  //   WebkitLineClamp: 2, // Show max 2 lines
  //   WebkitBoxOrient: "vertical",
  //   whiteSpace: "normal", // Allow wrapping to 2 lines
  // },

  // candidateName: {
  //   fontWeight: 600,
  //   color: "#1a2027",
  //   fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" },
  //   lineHeight: 1.3,
  //   paddingRight: "36px", // Increased padding to make room for the action button
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   width: "100%", // Take full width
  //   display: "-webkit-box",
  //   WebkitLineClamp: 2, // Show max 2 lines
  //   WebkitBoxOrient: "vertical",
  //   whiteSpace: "normal", // Allow wrapping to 2 lines
  // },
  candidateName: {
    fontWeight: 600,
    color: "#1a2027",
    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" },
    lineHeight: 1.3,
    paddingRight: "40px", // Increased padding even more
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    whiteSpace: "normal",
  },
  employeeIdContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 0.5,
  },
  employeeId: {
    color: "#1976d2",
    backgroundColor: "#e3f2fd",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: { xs: "0.7rem", md: "0.75rem" },
    display: "inline-block",
    marginTop: 0.5,
  },
  candidateEmail: {
    color: "text.secondary",
    mb: { xs: 1, sm: 1.5, md: 1.5, lg: 2 },
    fontSize: { xs: "0.85rem", sm: "0.875rem", md: "0.875rem", lg: "0.9rem" },
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", // Force single line with ellipsis
  },
  candidatePosition: {
    color: "#64748b",
    fontWeight: 500,
    mb: { xs: 1.5, sm: 2, md: 2, lg: 2.5 },
    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.8rem", lg: "0.85rem" },
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", // Force single line with ellipsis
  },
  statusChipContainer: {
    marginTop: "auto", // Push to bottom
    paddingTop: 1,
  },
  statusChip: {
    fontWeight: 600,
    borderRadius: "8px",
    padding: "6px 12px",
    height: "auto",
    minHeight: "28px",
    fontSize: { xs: "0.75rem", md: "0.8rem" },
    display: "inline-flex",
  },

  // menuButton: {
  //   color: "#64748b",
  //   padding: 0.5,
  //   position: "absolute", // Position absolutely
  //   right: -8, // Align to right
  //   top: -8, // Align to top
  //   "&:hover": {
  //     backgroundColor: "rgba(0,0,0,0.04)",
  //   },
  //   zIndex: 2, // Ensure it's above other content
  // },
  // menuButton: {
  //   color: "#64748b",
  //   padding: { xs: 1, sm: 0.5 }, // Larger touch target on mobile
  //   position: "absolute", // Position absolutely
  //   right: { xs: -12, sm: -8 }, // More space on mobile
  //   top: { xs: -12, sm: -8 }, // More space on mobile
  //   "&:hover": {
  //     backgroundColor: "rgba(0,0,0,0.04)",
  //   },
  //   zIndex: 2, // Ensure it's above other content
  //   width: { xs: "40px", sm: "32px" }, // Larger clickable area on mobile
  //   height: { xs: "40px", sm: "32px" }, // Larger clickable area on mobile
  // },
  menuButton: {
    color: "#64748b",
    padding: 0,
    position: "absolute", // Keep position absolute
    right: 0, // Align to right edge of container
    top: 0, // Align to top of container
    zIndex: 10, // Higher z-index to ensure visibility
    minWidth: "36px", // Ensure minimum width
    minHeight: "36px", // Ensure minimum height
  },
  menuButtonIcon: {
    fontSize: { xs: "1.3rem", sm: "1.1rem" }, // Larger icon on mobile
    color: "#475569", // Darker color for better visibility
  },

  dialogTitle: {
    fontWeight: 600,
    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
    color: "white",
    padding: "20px 24px",
  },
  dialogContent: {
    padding: "24px",
  },
  dialogActions: {
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    gap: 2,
  },
  formField: {
    marginBottom: 2,
  },
  cancelButton: {
    border: "2px solid #1976d2",
    color: "#1976d2",
    "&:hover": {
      border: "2px solid #64b5f6",
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
    },
    textTransform: "none",
    borderRadius: "8px",
    padding: "6px 16px",
    fontWeight: 600,
  },
  submitButton: {
    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
    fontSize: "0.95rem",
    textTransform: "none",
    padding: "8px 24px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
    },
  },
  deleteButton: {
    background: "linear-gradient(45deg, #f44336, #ff7961)",
    fontSize: "0.95rem",
    textTransform: "none",
    padding: "8px 24px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #d32f2f, #f44336)",
    },
  },
  snackbar: {
    "& .MuiAlert-root": {
      borderRadius: "8px",
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
        const position = candidate.position || "Unspecified Position";
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
    <Box sx={styles.container}>
      <Container disableGutters sx={styles.contentContainer}>
        <Typography variant="h4" sx={styles.pageTitle}>
          Recruitment Candidates
        </Typography>

        {/* Header with search and actions */}
        <Paper elevation={0} sx={styles.headerPaper}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            width="100%"
          >
            {/* Search field */}
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
              sx={styles.searchField}
            />

            {/* Action buttons for larger screens */}
            <Box sx={styles.actionButtonsContainer}>
              {/* View toggle */}
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, nextView) => nextView && setView(nextView)}
                size="small"
                sx={styles.toggleButtonGroup}
              >
                <ToggleButton value="list" sx={styles.toggleButton}>
                  <List />
                </ToggleButton>
                <ToggleButton value="grid" sx={styles.toggleButton}>
                  <GridView />
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Filter button */}
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

              {/* Group button - hidden on xs screens */}
              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  ...styles.actionButton,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {groupBy ? "Ungroup" : "Group by Position"}
              </Button>

              {/* Add button - hidden on xs screens */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  ...styles.addButton,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Add Candidate
              </Button>
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                width: "100%",
                gap: 1, // Reduce gap between buttons
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  ...styles.actionButton,
                  flex: 1,
                  minWidth: "unset",
                  justifyContent: "center",
                  padding: "6px 4px", // Reduce padding
                  fontSize: "0.7rem", // Smaller font size
                  "& .MuiButton-startIcon": {
                    marginRight: 4, // Reduce icon spacing
                    "& svg": {
                      fontSize: "1rem", // Smaller icon
                    },
                  },
                }}
              >
                {groupBy ? "Ungroup" : "Group"}
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  ...styles.addButton,
                  flex: 1,
                  minWidth: "unset",
                  justifyContent: "center",
                  padding: "6px 4px", // Reduce padding
                  fontSize: "0.7rem", // Smaller font size
                  "& .MuiButton-startIcon": {
                    marginRight: 4, // Reduce icon spacing
                    "& svg": {
                      fontSize: "1rem", // Smaller icon
                    },
                  },
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Candidates grid/list */}
        {Object.entries(groupedCandidates).map(([position, candidates]) => (
          <Fade in={true} timeout={500} key={position}>
            <Box mb={4}>
              {/* Position heading (only when grouped) */}
              {groupBy && (
                <Typography variant="h5" sx={styles.sectionTitle}>
                  {position}
                </Typography>
              )}

              {/* Candidates grid */}
              <Grid container spacing={{ xs: 2, sm: 2, md: 2.5, lg: 3 }}>
                {candidates.map((candidate) => (
                  <Grid
                    item
                    xs={12}
                    sm={view === "grid" ? 6 : 12}
                    md={view === "grid" ? 6 : 12} // Change from 4 to 6 columns at md breakpoint
                    lg={view === "grid" ? 4 : 12} // Use 4 columns only at lg and above
                    xl={view === "grid" ? 3 : 12}
                    key={candidate._id}
                  >
                    <Card
                      sx={{
                        ...styles.card,
                        borderLeft: `4px solid ${candidate.color || "#9e9e9e"}`,
                      }}
                    >
                      <CardContent sx={styles.cardContent}>
                        {/* Card header with absolute positioned menu button */}
                        <Box sx={styles.cardHeader}>
                          {/* Menu button - positioned absolutely in the top-right corner */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedCandidate(candidate);
                            }}
                            sx={styles.menuButton}
                            aria-label="More options"
                          >
                            <MoreVert sx={styles.menuButtonIcon} />
                          </IconButton>

                          {/* Avatar */}
                          <Avatar sx={styles.avatar}>
                            {(candidate?.name?.[0] || "U").toUpperCase()}
                          </Avatar>

                          {/* Card content */}
                          <Box sx={styles.cardBody}>
                            {/* Name */}
                            <Box sx={styles.nameContainer}>
                              <Tooltip
                                title={candidate.name || "Unnamed Candidate"}
                                placement="top"
                              >
                                <Typography
                                  variant="h6"
                                  sx={styles.candidateName}
                                >
                                  {candidate.name || "Unnamed Candidate"}
                                </Typography>
                              </Tooltip>
                            </Box>

                            {/* Employee ID if available */}
                            {candidate.employeeId && (
                              <Box sx={{ mb: 1.5 }}>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={styles.employeeId}
                                >
                                  {candidate.employeeId}
                                </Typography>
                              </Box>
                            )}

                            {/* Email */}
                            <Tooltip
                              title={candidate.email || "No email provided"}
                              placement="top"
                            >
                              <Typography sx={styles.candidateEmail}>
                                {candidate.email || "No email provided"}
                              </Typography>
                            </Tooltip>

                            {/* Position */}
                            <Tooltip
                              title={
                                candidate.position || "No position specified"
                              }
                              placement="top"
                            >
                              <Typography sx={styles.candidatePosition}>
                                {candidate.position || "No position specified"}
                              </Typography>
                            </Tooltip>

                            {/* Status chip */}
                            <Box sx={styles.statusChipContainer}>
                              <Chip
                                label={candidate.status || "Unknown"}
                                sx={{
                                  ...styles.statusChip,
                                  bgcolor: candidate.color || "#9e9e9e",
                                  color: "white",
                                }}
                              />
                            </Box>
                          </Box>
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
          PaperProps={{ sx: styles.menuPaper }}
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
          <DialogTitle
            sx={{
              ...styles.dialogTitle,
              background: "linear-gradient(45deg, #f44336, #ff7961)",
            }}
          >
            Delete Candidate
          </DialogTitle>
          <DialogContent sx={styles.dialogContent}>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{selectedCandidate?.name}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteCandidate(selectedCandidate?._id)}
              variant="contained"
              color="error"
              sx={styles.deleteButton}
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
          <DialogTitle sx={styles.dialogTitle}>Add New Candidate</DialogTitle>
          <DialogContent sx={styles.dialogContent}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Name"
                fullWidth
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                sx={styles.formField}
              />
              <TextField
                label="Email"
                fullWidth
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
                sx={styles.formField}
              />
              <TextField
                label="Position"
                fullWidth
                value={newCandidate.position}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, position: e.target.value })
                }
                sx={styles.formField}
              />
              <FormControl fullWidth sx={styles.formField}>
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
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={() => {
                setCreateDialogOpen(false);
                resetNewCandidate();
              }}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              variant="contained"
              sx={styles.submitButton}
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
          sx={styles.snackbar}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RecruitmentCandidate;
