import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  Container,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  FilterList,
  Search,
  Visibility,
  Close,
  Edit,
  Delete,
  Add,
  AccessTime,
} from "@mui/icons-material";

const TimeOffRequests = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const statusOptions = ["Pending", "Approved", "Rejected", "All"];
  const shiftOptions = ["Morning", "Evening", "Night"];
  const workTypeOptions = ["On-Site", "Remote", "Hybrid"];

  const initialFormState = {
    name: "",
    empId: "",
    date: "",
    day: "",
    checkIn: "",
    checkOut: "",
    shift: "",
    workType: "",
    minHour: "",
    atWork: "",
    overtime: "",
    comment: "",
    status: "Pending",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, filterStatus]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/time-off-requests?searchTerm=${searchTerm}&status=${filterStatus}`
      );
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      showSnackbar("Error fetching requests", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateNew = () => {
    setFormData(initialFormState);
    setEditMode(false);
    setCreateOpen(true);
  };
  const handleSave = async () => {
    try {
      const requiredFields = [
        "name",
        "empId",
        "date",
        "day",
        "checkIn",
        "checkOut",
        "shift",
        "workType",
        "minHour",
        "atWork",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(", ")}`);
      }

      const formattedData = {
        ...formData,
        minHour: Number(formData.minHour),
        atWork: Number(formData.atWork),
        overtime: Number(formData.overtime) || 0,
        date: new Date(formData.date).toISOString(),
      };

      const url = editMode
        ? `http://localhost:5000/api/time-off-requests/${selectedRequest._id}`
        : "http://localhost:5000/api/time-off-requests";

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      showSnackbar(
        editMode
          ? "Request updated successfully"
          : "Request created successfully"
      );
      fetchRequests();
      setCreateOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData(request);
    setEditMode(true);
    setCreateOpen(true);
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/time-off-requests/${id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to delete request");

  //     showSnackbar("Request deleted successfully");
  //     fetchRequests();
  //   } catch (error) {
  //     showSnackbar("Error deleting request", "error");
  //   }
  // };

  // Replace the existing handleDelete function with these functions
  const handleDeleteClick = (request) => {
    setItemToDelete(request);
    setDeleteDialogOpen(true);
  };

  // const handleConfirmDelete = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `http://localhost:5000/api/time-off-requests/${itemToDelete._id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to delete request");

  //     showSnackbar("Request deleted successfully");
  //     fetchRequests();
  //     setDeleteDialogOpen(false);
  //     setItemToDelete(null);
  //   } catch (error) {
  //     showSnackbar("Error deleting request", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/time-off-requests/${itemToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete request");

      showSnackbar("Request deleted successfully");
      fetchRequests();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showSnackbar("Error deleting request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handlePreview = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/time-off-requests/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch request details");
      const data = await response.json();
      setSelectedRequest(data);
      setPreviewOpen(true);
    } catch (error) {
      showSnackbar("Error fetching request details", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Approved: "success",
      Rejected: "error",
    };
    return colors[status] || "default";
  };

  // Render mobile card view for requests
  const renderRequestCard = (request) => (
    <Card
      sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      key={request._id}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {request.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {request.empId}
            </Typography>
          </Box>
          <Chip
            label={request.status}
            color={getStatusColor(request.status)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Date:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date(request.date).toLocaleDateString()} ({request.day})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Check In/Out:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {request.checkIn} - {request.checkOut}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Shift:
            </Typography>
            <Chip
              label={request.shift}
              size="small"
              sx={{
                backgroundColor: "grey.100",
                color: "grey.800",
                fontWeight: 500,
                height: "22px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Work Type:
            </Typography>
            <Chip
              label={request.workType}
              size="small"
              sx={{
                backgroundColor: "grey.50",
                color: "grey.700",
                fontWeight: 500,
                height: "22px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Hours:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Min: {request.minHour}h | At Work: {request.atWork}h | OT: +
              {request.overtime}h
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Tooltip title="View Details" arrow>
            <IconButton
              color="primary"
              onClick={() => handlePreview(request._id)}
              size="small"
              sx={{
                backgroundColor: "primary.lighter",
                "&:hover": { backgroundColor: "primary.light" },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" arrow>
            <IconButton
              color="info"
              onClick={() => handleEdit(request)}
              size="small"
              sx={{
                backgroundColor: "info.lighter",
                "&:hover": { backgroundColor: "info.light" },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Delete" arrow>
            <IconButton
              color="error"
              onClick={() => handleDelete(request._id)}
              size="small"
              sx={{
                backgroundColor: "error.lighter",
                "&:hover": { backgroundColor: "error.light" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Delete" arrow>
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(request)}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            p: isMobile ? 2 : 3,
            borderBottom: 1,
            borderColor: "divider",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            color="primary"
          >
            Time Off Requests
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Create Request
          </Button>
        </Box>

        <Box
          sx={{ p: isMobile ? 2 : 3, backgroundColor: "background.default" }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            <TextField
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: isMobile ? "100%" : "200px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              value={filterStatus}
              onChange={handleFilterChange}
              size="small"
              sx={{ width: isMobile ? "100%" : "150px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {statusOptions
                .filter((option) => option !== "All")
                .map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          {isMobile ? (
            // Mobile view - card layout
            <Stack spacing={2}>
              {requests.length > 0 ? (
                requests.map((request) => renderRequestCard(request))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No requests found
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            // Desktop/Tablet view - table layout
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                maxHeight: "65vh",
                borderRadius: 2,
                "& .MuiTableCell-root": {
                  borderColor: "divider",
                },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Employee
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Check In/Out
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Shift
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Work Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Hours
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {request.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.empId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {new Date(request.date).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.day}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {request.checkIn} - {request.checkOut}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.shift}
                            size="small"
                            sx={{
                              backgroundColor: "grey.100",
                              color: "grey.800",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.workType}
                            size="small"
                            sx={{
                              backgroundColor: "grey.50",
                              color: "grey.700",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              Min: {request.minHour}h | At Work:{" "}
                              {request.atWork}h
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Overtime: +{request.overtime}h
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Details" arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handlePreview(request._id)}
                                size="small"
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                color="info"
                                onClick={() => handleEdit(request)}
                                size="small"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(request._id)}
                                size="small"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(request)}
                                size="small"
                                sx={{
                                  backgroundColor: "error.lighter",
                                  "&:hover": { backgroundColor: "error.light" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No requests found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Time Off Request Details</Typography>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.empId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(selectedRequest.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Day
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.day}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Check In
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.checkIn}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Check Out
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.checkOut}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shift
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.shift}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Work Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.workType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Minimum Hours
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.minHour} hours
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  At Work
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.atWork} hours
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Overtime
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.overtime} hours
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                  sx={{ mt: 1 }}
                />
              </Grid>
              {selectedRequest.comment && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Comment
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.comment}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
          {selectedRequest && (
            <Button
              onClick={() => {
                setPreviewOpen(false);
                handleEdit(selectedRequest);
              }}
              variant="contained"
              color="primary"
              startIcon={<Edit />}
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: editMode ? "info.main" : "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {editMode ? "Edit Time Off Request" : "Create Time Off Request"}
          </Typography>
          <IconButton
            onClick={() => setCreateOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Day"
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g. Monday"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check In"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g. 09:00 AM"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check Out"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g. 05:00 PM"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Shift"
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {shiftOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Work Type"
                name="workType"
                value={formData.workType}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {workTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Minimum Hours"
                name="minHour"
                type="number"
                value={formData.minHour}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">hours</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="At Work"
                name="atWork"
                type="number"
                value={formData.atWork}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">hours</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Overtime"
                name="overtime"
                type="number"
                value={formData.overtime}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">hours</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            {editMode && (
              <Grid item xs={12}>
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {statusOptions
                    .filter((option) => option !== "All")
                    .map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setCreateOpen(false)}
            variant="outlined"
            color={editMode ? "info" : "primary"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color={editMode ? "info" : "primary"}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "500px" },
            maxWidth: "500px",
            borderRadius: "20px",
            overflow: "hidden",
            margin: { xs: "8px", sm: "32px" },
          },
        }}
        TransitionComponent={Fade}
        TransitionProps={{
          timeout: 300,
        }}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "center",
            alignItems: "center",
            "& .MuiPaper-root": {
              margin: { xs: "16px", sm: "32px" },
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #ff7961)",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Delete color="white" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: "24px", sm: "32px" },
            backgroundColor: "#f8fafc",
            paddingTop: { xs: "24px", sm: "32px" },
          }}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this time off request? This action
            cannot be undone.
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#2c3e50">
                Employee: {itemToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Employee ID: {itemToDelete.empId}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(itemToDelete.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day: {itemToDelete.day}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Check In: {itemToDelete.checkIn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check Out: {itemToDelete.checkOut}
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={itemToDelete.status}
                  color={getStatusColor(itemToDelete.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={itemToDelete.shift}
                  size="small"
                  sx={{
                    backgroundColor: "grey.100",
                    color: "grey.800",
                    mr: 1,
                  }}
                />
                <Chip
                  label={itemToDelete.workType}
                  size="small"
                  sx={{
                    backgroundColor: "grey.50",
                    color: "grey.700",
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "16px 24px", sm: "24px 32px" },
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              background: "linear-gradient(45deg, #f44336, #ff7961)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
              },
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeOffRequests;
