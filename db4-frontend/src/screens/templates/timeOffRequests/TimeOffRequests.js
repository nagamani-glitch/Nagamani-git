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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [requests, setRequests] = useState([]);
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/time-off-requests/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete request");

      showSnackbar("Request deleted successfully");
      fetchRequests();
    } catch (error) {
      showSnackbar("Error deleting request", "error");
    }
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            alignItems: "center",
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary">
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
            }}
          >
            Create Request
          </Button>
        </Box>

        <Box sx={{ p: 3, backgroundColor: "background.default" }}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: '200px' }}
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
              sx={{ width: '150px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {statusOptions.filter(option => option !== 'All').map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Box>
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
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Employee
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Check In/Out
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Shift
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Work Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Min Hours
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    At Work
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Overtime
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      width: "120px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow
                    key={request._id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {request.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.empId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {new Date(request.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.day}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTime fontSize="small" color="primary" />{" "}
                          {request.checkIn}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTime fontSize="small" color="error" />{" "}
                          {request.checkOut}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.shift}
                        size="small"
                        sx={{
                          backgroundColor: "grey.100",
                          color: "grey.800",
                          fontWeight: 500,
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
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {request.minHour}h
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {request.atWork}h
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="success.main"
                      >
                        +{request.overtime}h
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
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
                        <Tooltip title="Delete" arrow>
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
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* Create/Edit Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 24 } }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.lighter",
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {editMode ? "Edit Request" : "Create New Request"}
          </Typography>
          <IconButton
            onClick={() => setCreateOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
  <Grid container spacing={3} sx={{ mt: 0.5 }}>
    <Grid item xs={12} md={6}>
      <TextField
        name="name"
        label="Employee Name"
        fullWidth
        required
        value={formData.name}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        name="empId"
        label="Employee ID"
        fullWidth
        required
        value={formData.empId}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        name="date"
        label="Date"
        type="date"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={formData.date}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        name="day"
        label="Day"
        fullWidth
        required
        value={formData.day}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        name="checkIn"
        label="Check In Time"
        type="time"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={formData.checkIn}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        name="checkOut"
        label="Check Out Time"
        type="time"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={formData.checkOut}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        select
        name="shift"
        label="Shift"
        fullWidth
        required
        value={formData.shift}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      >
        {shiftOptions.map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        select
        name="workType"
        label="Work Type"
        fullWidth
        required
        value={formData.workType}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      >
        {workTypeOptions.map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField
        name="minHour"
        label="Minimum Hours"
        type="number"
        fullWidth
        required
        value={formData.minHour}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">h</InputAdornment>
        }}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField
        name="atWork"
        label="At Work"
        type="number"
        fullWidth
        required
        value={formData.atWork}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">h</InputAdornment>
        }}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField
        name="overtime"
        label="Overtime"
        type="number"
        fullWidth
        value={formData.overtime}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">h</InputAdornment>
        }}
        sx={{ mb: 1 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        select
        name="status"
        label="Status"
        fullWidth
        required
        value={formData.status}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      >
        {statusOptions.filter(option => option !== 'All').map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12}>
      <TextField
        name="comment"
        label="Comment"
        fullWidth
        multiline
        rows={3}
        value={formData.comment}
        onChange={handleInputChange}
        sx={{ mb: 1 }}
      />
    </Grid>
  </Grid>
</DialogContent>

        <DialogActions
          sx={{ p: 3, borderTop: 1, borderColor: "divider", gap: 2 }}
        >
          <Button
            onClick={() => setCreateOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.empId || !formData.date}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 24 } }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.lighter",
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Request Details
          </Typography>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Employee
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedRequest.empId}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Date(selectedRequest.date).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedRequest.day}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Check In
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.checkIn}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Check Out
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.checkOut}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Shift
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.shift}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Work Type
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.workType}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Status
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                  size="small"
                  sx={{ mt: 1, fontWeight: 500 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Minimum Hours
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.minHour}h
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  At Work
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.atWork}h
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Overtime
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.overtime}h
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Comment
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.comment}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2, boxShadow: 2 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeOffRequests;
