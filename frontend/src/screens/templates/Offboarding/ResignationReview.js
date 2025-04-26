import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  Close,
  CheckCircle,
  Cancel,
  AccessTime,
  ThumbUp,
  ThumbDown,
  Email,
  Visibility,
  Send,
  Delete,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ResignationReview = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState("Pending");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isHR, setIsHR] = useState(false);

  // First, add a new state for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resignationToDelete, setResignationToDelete] = useState(null);

  // Get current user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCurrentUser(userId);
    }
  }, []);

  // Fetch current user details
  const fetchCurrentUser = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/by-user/${userId}`
      );
      setCurrentUser(response.data.data);

      //   // Check if user is HR (you might need to adjust this logic based on your system)
      //   const isHRUser = response.data.data.joiningDetails?.department === 'HR' ||
      //                   response.data.data.joiningDetails?.initialDesignation?.includes('HR');
      //   setIsHR(isHRUser);

      //   if (!isHRUser) {
      //     setError("You don't have permission to access this page. Only HR personnel can review resignations.");
      //   }
      setIsHR(true);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setSnackbar({
        open: true,
        message: "Error fetching user information",
        severity: "error",
      });
    }
  };

  //   useEffect(() => {
  //     if (isHR) {
  //       fetchResignations();
  //     }
  //   }, [isHR, selectedTab]);
  useEffect(() => {
    // Remove the isHR condition for testing
    // if (isHR) {
    fetchResignations();
    // }
  }, [selectedTab]); // Keep the selectedTab dependency

  //   const fetchResignations = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get("http://localhost:5000/api/resignations");

  //       // Filter based on tab
  //       let filteredData = response.data;
  //       if (selectedTab === 1) { // Pending
  //         filteredData = response.data.filter(item => item.status === "Requested" || item.status === "Pending");
  //       } else if (selectedTab === 2) { // Approved
  //         filteredData = response.data.filter(item => item.status === "Approved");
  //       } else if (selectedTab === 3) { // Rejected
  //         filteredData = response.data.filter(item => item.status === "Rejected");
  //       }

  //       setResignations(filteredData);
  //       setError(null);
  //     } catch (err) {
  //       setError("Failed to fetch resignations");
  //       console.error("Error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // First, let's modify the fetchResignations function to include employee data
  const fetchResignations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/resignations"
      );

      // Get employee data for each resignation
      const resignationsWithEmployeeData = await Promise.all(
        response.data.map(async (resignation) => {
          if (resignation.userId) {
            try {
              // Fetch employee data using the userId
              const employeeResponse = await axios.get(
                `http://localhost:5000/api/employees/by-user/${resignation.userId}`
              );
              const employeeData = employeeResponse.data.data;

              // Add Emp_ID to the resignation object
              return {
                ...resignation,
                employeeId: employeeData?.Emp_ID || "Not available",
              };
            } catch (err) {
              console.error("Error fetching employee data:", err);
              return {
                ...resignation,
                employeeId: "Not available",
              };
            }
          }
          return {
            ...resignation,
            employeeId: "Not available",
          };
        })
      );

      // Filter based on tab
      let filteredData = resignationsWithEmployeeData;
      if (selectedTab === 1) {
        // Pending
        filteredData = resignationsWithEmployeeData.filter(
          (item) => item.status === "Requested" || item.status === "Pending"
        );
      } else if (selectedTab === 2) {
        // Approved
        filteredData = resignationsWithEmployeeData.filter(
          (item) => item.status === "Approved"
        );
      } else if (selectedTab === 3) {
        // Rejected
        filteredData = resignationsWithEmployeeData.filter(
          (item) => item.status === "Rejected"
        );
      }

      setResignations(filteredData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch resignations");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenReview = (resignation) => {
    setSelectedResignation(resignation);
    setReviewStatus(resignation.status);
    setReviewNotes(resignation.reviewNotes || "");
    setReviewDialogOpen(true);
  };

  // Add these handler functions for delete functionality
  const handleDeleteClick = (resignation) => {
    setResignationToDelete(resignation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/resignations/${resignationToDelete._id}`
      );

      setSnackbar({
        open: true,
        message: "Resignation deleted successfully",
        severity: "success",
      });

      setDeleteDialogOpen(false);
      setResignationToDelete(null);
      fetchResignations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting resignation:", error);
      setSnackbar({
        open: true,
        message: "Error deleting resignation",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setResignationToDelete(null);
  };

  const handleCloseReview = () => {
    setReviewDialogOpen(false);
    setSelectedResignation(null);
    setReviewNotes("");
  };

//   const handleReviewSubmit = async () => {
//     if (!selectedResignation) return;

//     try {
//       setLoading(true);

//       const response = await axios.put(
//         `http://localhost:5000/api/resignations/${selectedResignation._id}`,
//         {
//           status: reviewStatus,
//           reviewNotes: reviewNotes,
//           reviewedBy: `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`,
//           reviewedAt: new Date(),
//         }
//       );

//       // Update local state
//       setResignations(
//         resignations.map((item) =>
//           item._id === selectedResignation._id ? response.data : item
//         )
//       );

//       setSnackbar({
//         open: true,
//         message: `Resignation ${
//           reviewStatus === "Approved" ? "approved" : "rejected"
//         } successfully`,
//         severity: "success",
//       });

//       handleCloseReview();
//       fetchResignations(); // Refresh the list
//     } catch (error) {
//       console.error("Error updating resignation status:", error);
//       setSnackbar({
//         open: true,
//         message: "Error updating resignation status",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

const handleReviewSubmit = async () => {
    if (!selectedResignation) return;
  
    try {
      setLoading(true);
  
      const response = await axios.put(
        `http://localhost:5000/api/resignations/${selectedResignation._id}`,
        {
          status: reviewStatus,
          reviewNotes: reviewNotes,
          reviewedBy: `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`,
          reviewedAt: new Date(),
        }
      );
  
      // Update local state
      setResignations(
        resignations.map((item) =>
          item._id === selectedResignation._id ? response.data : item
        )
      );
  
      setSnackbar({
        open: true,
        message: `Resignation ${
          reviewStatus === "Approved" ? "approved" : "rejected"
        } successfully`,
        severity: "success",
      });
  
      // Send notification email about the status update
      await sendStatusNotification(response.data);
  
      handleCloseReview();
      fetchResignations(); // Refresh the list
    } catch (error) {
      console.error("Error updating resignation status:", error);
      setSnackbar({
        open: true,
        message: "Error updating resignation status",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

const handleSendEmail = async (resignation) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/resignations/email", {
        name: resignation.name,
        email: resignation.email,
        position: resignation.position,
        status: resignation.status,
        description: resignation.description,
        reviewNotes: resignation.reviewNotes,
      });
  
      setSnackbar({
        open: true,
        message: `Notification email sent to ${resignation.name}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSnackbar({
        open: true,
        message: "Failed to send email",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this function to send notification after review
const sendStatusNotification = async (resignation) => {
    try {
      await axios.post("http://localhost:5000/api/resignations/email", {
        name: resignation.name,
        email: resignation.email,
        position: resignation.position,
        status: resignation.status,
        description: resignation.description,
        reviewNotes: resignation.reviewNotes,
        reviewedBy: resignation.reviewedBy,
        reviewedAt: resignation.reviewedAt
      });
  
      setSnackbar({
        open: true,
        message: `Status notification email sent to ${resignation.name}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending status notification:", error);
      setSnackbar({
        open: true,
        message: "Failed to send status notification email",
        severity: "error",
      });
    }
  };
  
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return {
          bg: "#e6f7ff",
          color: "#1890ff",
          icon: <CheckCircle fontSize="small" />,
        };
      case "Rejected":
        return {
          bg: "#fff1f0",
          color: "#ff4d4f",
          icon: <Cancel fontSize="small" />,
        };
      case "Pending":
        return {
          bg: "#fff7e6",
          color: "#fa8c16",
          icon: <AccessTime fontSize="small" />,
        };
      default:
        return {
          bg: "#f0f5ff",
          color: "#2f54eb",
          icon: <Email fontSize="small" />,
        };
    }
  };

  // Filter resignations based on search term
  const filteredResignations = resignations.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && resignations.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading resignations...
        </Typography>
      </Box>
    );
  }

  if (error && !isHR) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <StyledPaper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Resignation Review
          </Typography>

          <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 300 },
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </Box>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  All
                </Box>
                <Chip
                  label={resignations.length}
                  size="small"
                  sx={{ height: 20, fontSize: "0.75rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  Pending
                </Box>
                <Chip
                  label={
                    resignations.filter(
                      (r) => r.status === "Requested" || r.status === "Pending"
                    ).length
                  }
                  size="small"
                  color="warning"
                  sx={{ height: 20, fontSize: "0.75rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  Approved
                </Box>
                <Chip
                  label={
                    resignations.filter((r) => r.status === "Approved").length
                  }
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: "0.75rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  Rejected
                </Box>
                <Chip
                  label={
                    resignations.filter((r) => r.status === "Rejected").length
                  }
                  size="small"
                  color="error"
                  sx={{ height: 20, fontSize: "0.75rem" }}
                />
              </Box>
            }
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {filteredResignations.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No resignation letters found
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3, maxWidth: 500 }}
            >
              {searchTerm
                ? "No results match your search criteria. Try adjusting your search."
                : "There are no resignation letters to review at this time."}
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Submitted On
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reviewed By</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResignations.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => handleOpenReview(row)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "#1976d2",
                            width: 36,
                            height: 36,
                            mr: 1.5,
                          }}
                        >
                          {row.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => handleOpenReview(row)}>
                      {row.position}
                    </TableCell>
                    <TableCell onClick={() => handleOpenReview(row)}>
                      <Chip
                        icon={getStatusColor(row.status).icon}
                        label={row.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(row.status).bg,
                          color: getStatusColor(row.status).color,
                          fontWeight: 500,
                          border: `1px solid ${
                            getStatusColor(row.status).color
                          }`,
                        }}
                      />
                    </TableCell>
                    <TableCell onClick={() => handleOpenReview(row)}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={() => handleOpenReview(row)}>
                      {row.employeeId || "Not available"}
                    </TableCell>
                    <TableCell onClick={() => handleOpenReview(row)}>
                      {row.reviewedBy || "Not reviewed yet"}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          flexWrap: "nowrap",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenReview(row)}
                          sx={{ mr: 0.5 }}
                          title="Review"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleSendEmail(row)}
                          sx={{ mr: 0.5 }}
                          title="Notify"
                        >
                          <Send fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(row)}
                          title="Delete"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledPaper>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        {selectedResignation && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Review Resignation Letter</Typography>
              <IconButton
                onClick={handleCloseReview}
                size="small"
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{ bgcolor: "#1976d2", width: 48, height: 48, mr: 2 }}
                  >
                    {selectedResignation.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedResignation.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedResignation.position}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={getStatusColor(selectedResignation.status).icon}
                  label={selectedResignation.status}
                  sx={{
                    backgroundColor: getStatusColor(selectedResignation.status)
                      .bg,
                    color: getStatusColor(selectedResignation.status).color,
                    fontWeight: 500,
                    border: `1px solid ${
                      getStatusColor(selectedResignation.status).color
                    }`,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    <strong>Email:</strong> {selectedResignation.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <strong>Submitted:</strong>{" "}
                    {new Date(
                      selectedResignation.createdAt
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Resignation Letter
              </Typography>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#f9f9f9",
                  mb: 3,
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedResignation.description,
                  }}
                />
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Review Decision
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Review Notes"
                    multiline
                    rows={4}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    fullWidth
                    placeholder="Add your comments, feedback, or reasons for approval/rejection..."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleCloseReview}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                variant="contained"
                color={
                  reviewStatus === "Approved"
                    ? "success"
                    : reviewStatus === "Rejected"
                    ? "error"
                    : "primary"
                }
                startIcon={
                  reviewStatus === "Approved" ? (
                    <ThumbUp />
                  ) : reviewStatus === "Rejected" ? (
                    <ThumbDown />
                  ) : (
                    <AccessTime />
                  )
                }
                sx={{ borderRadius: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : reviewStatus === "Approved" ? (
                  "Approve Resignation"
                ) : reviewStatus === "Rejected" ? (
                  "Reject Resignation"
                ) : (
                  "Mark as Pending"
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ bgcolor: "#f44336", color: "white" }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete this resignation letter?
          </Typography>
          {resignationToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Employee: {resignationToDelete.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Status: {resignationToDelete.status}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Submitted:{" "}
                {new Date(resignationToDelete.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Delete />
              )
            }
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResignationReview;
