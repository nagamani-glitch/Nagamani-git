import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import isWeekend from "date-fns/isWeekend";
import addDays from "date-fns/addDays";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const LEAVE_TYPES = [
  { value: "annual", label: "Annual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "earned", label: "Earned Leave" },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
];

const API_URL = "http://localhost:5000/api/leave-requests";

// Mock employee data - replace with actual authentication
const EMPLOYEE = {
  code: "EMP001",
  name: "John Doe",
  department: "Engineering",
};

const MyLeaveRequests = () => {
  const [tabValue, setTabValue] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    leaveType: "annual",
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
    halfDay: false,
    halfDayType: "morning",
  });

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveBalance();
    fetchLeaveStatistics();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employee/${EMPLOYEE.code}`);
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      showSnackbar("Error fetching leave requests", "error");
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/balance/${EMPLOYEE.code}`);
      setLeaveBalance(response.data);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      showSnackbar("Error fetching leave balance", "error");
    }
  };

  const fetchLeaveStatistics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/statistics/${EMPLOYEE.code}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching leave statistics:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setFormData({
      leaveType: "annual",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      halfDay: false,
      halfDayType: "morning",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const handleInputChange = (field, value) => {
  //   setFormData({
  //     ...formData,
  //     [field]: value
  //   });
  // };
  const handleInputChange = (field, value) => {
    if (field === "halfDay" && value === true) {
      // If half day is selected, set end date equal to start date
      setFormData({
        ...formData,
        [field]: value,
        endDate: formData.startDate,
      });
    } else if (field === "startDate" && formData.halfDay) {
      // If changing start date while half day is selected, update end date too
      setFormData({
        ...formData,
        [field]: value,
        endDate: value,
      });
    } else {
      // Normal case
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const calculateBusinessDays = (start, end, isHalfDay) => {
    if (isHalfDay) return 0.5;

    let count = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      if (!isWeekend(currentDate)) {
        count++;
      }
      currentDate = addDays(currentDate, 1);
    }

    return count;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const numberOfDays = calculateBusinessDays(
        formData.startDate,
        formData.endDate,
        formData.halfDay
      );

      const leaveData = {
        employeeCode: EMPLOYEE.code,
        employeeName: EMPLOYEE.name,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        halfDay: formData.halfDay,
        halfDayType: formData.halfDayType,
        numberOfDays,
      };

      await axios.post(API_URL, leaveData);

      setOpenDialog(false);
      fetchLeaveRequests();
      fetchLeaveBalance();
      fetchLeaveStatistics();
      showSnackbar("Leave request submitted successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      showSnackbar(
        error.response?.data?.message || "Error submitting leave request",
        "error"
      );
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      fetchLeaveRequests();
      fetchLeaveBalance();
      fetchLeaveStatistics();
      showSnackbar("Leave request deleted successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error deleting leave request:", error);
      showSnackbar("Error deleting leave request", "error");
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Chip label="Approved" color="success" size="small" />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const getLeaveTypeName = (type) => {
    const leaveType = LEAVE_TYPES.find((t) => t.value === type);
    return leaveType ? leaveType.label : type;
  };

  // Fix for the error: Convert object to array for chart data
  const getMonthlyChartData = (statistics) => {
    if (
      !statistics ||
      !statistics.statistics ||
      !statistics.statistics.monthlyUsage
    ) {
      return [];
    }

    // Convert the monthlyUsage object to an array of objects
    return Object.entries(statistics.statistics.monthlyUsage).map(
      ([month, days]) => ({
        month,
        days,
      })
    );
  };

  // Fix for the error: Convert object to array for chart data
  const getLeaveTypeChartData = (statistics) => {
    if (
      !statistics ||
      !statistics.statistics ||
      !statistics.statistics.leaveTypeUsage
    ) {
      return [];
    }

    // Convert the leaveTypeUsage object to an array of objects
    return Object.entries(statistics.statistics.leaveTypeUsage).map(
      ([type, days]) => ({
        type: getLeaveTypeName(type),
        days,
        value: days, // For pie chart
      })
    );
  };

  const getAvailableBalance = (type) => {
    if (!leaveBalance) return 0;

    const balance = leaveBalance[type];
    return balance ? balance.total - balance.used - balance.pending : 0;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#1a237e" }}>
            My Leave Requests
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Request Leave
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Dashboard" />
          <Tab label="My Requests" />
          <Tab label="Leave Balance" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Usage by Month
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {statistics ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getMonthlyChartData(statistics)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar
                            dataKey="days"
                            fill="#8884d8"
                            name="Days Taken"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upcoming Leaves
                  </Typography>
                  {statistics &&
                  statistics.upcomingLeaves &&
                  statistics.upcomingLeaves.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {statistics.upcomingLeaves.map((leave) => (
                            <TableRow key={leave._id}>
                              <TableCell>
                                {getLeaveTypeName(leave.leaveType)}
                              </TableCell>
                              <TableCell>
                                {new Date(leave.startDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {new Date(leave.endDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{leave.numberOfDays}</TableCell>
                              <TableCell>
                                {getStatusChip(leave.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      No upcoming leaves
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Type Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {statistics ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getLeaveTypeChartData(statistics)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="type"
                            label={({ type, value }) => `${type}: ${value}`}
                          >
                            {getLeaveTypeChartData(statistics).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Leave Balance Summary
                  </Typography>
                  {leaveBalance ? (
                    <Box>
                      {LEAVE_TYPES.map((type) => {
                        const balance = leaveBalance[type.value];
                        if (!balance) return null;

                        const total = balance.total;
                        const used = balance.used;
                        const pending = balance.pending;
                        const available = total - used - pending;
                        const usedPercentage = (used / total) * 100;
                        const pendingPercentage = (pending / total) * 100;

                        return (
                          <Box key={type.value} sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {type.label}
                              </Typography>
                              <Typography variant="body2">
                                {available} / {total} days
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                position: "relative",
                                height: 8,
                                bgcolor: "#eee",
                                borderRadius: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  height: "100%",
                                  width: `${usedPercentage}%`,
                                  bgcolor: "#f44336",
                                  borderRadius: "4px 0 0 4px",
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: `${usedPercentage}%`,
                                  top: 0,
                                  height: "100%",
                                  width: `${pendingPercentage}%`,
                                  bgcolor: "#ff9800",
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Used: {used} days
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Pending: {pending} days
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              My Leave Requests
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : leaveRequests.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Leave Type</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          {getLeaveTypeName(request.leaveType)}
                        </TableCell>
                        <TableCell>
                          {new Date(request.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(request.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{request.numberOfDays}</TableCell>
                        <TableCell>
                          <Tooltip title={request.reason}>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 150,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {request.reason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(request.status)}
                          {request.rejectionReason && (
                            <Tooltip
                              title={`Reason: ${request.rejectionReason}`}
                            >
                              <InfoIcon
                                fontSize="small"
                                color="error"
                                sx={{ ml: 1, verticalAlign: "middle" }}
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteRequest(request._id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  No leave requests found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ mt: 2 }}
                >
                  Request Leave
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Leave Balance
            </Typography>
            {leaveBalance ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Leave Type</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Used</TableCell>
                      <TableCell>Pending</TableCell>
                      <TableCell>Available</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {LEAVE_TYPES.map((type) => {
                      const balance = leaveBalance[type.value];
                      if (!balance) return null;

                      return (
                        <TableRow key={type.value}>
                          <TableCell>{type.label}</TableCell>
                          <TableCell>{balance.total}</TableCell>
                          <TableCell>{balance.used}</TableCell>
                          <TableCell>{balance.pending}</TableCell>
                          <TableCell>
                            {balance.total - balance.used - balance.pending}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Request Leave</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => handleInputChange("leaveType", e.target.value)}
                fullWidth
                margin="normal"
                helperText={`Available balance: ${getAvailableBalance(
                  formData.leaveType
                )} days`}
              >
                {LEAVE_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* In the Dialog content section, modify the date picker section
              to conditionally render the end date picker */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleInputChange("startDate", date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disablePast
                />

                {!formData.halfDay && (
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleInputChange("endDate", date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    disablePast
                    minDate={formData.startDate}
                  />
                )}
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.halfDay}
                    onChange={(e) =>
                      handleInputChange("halfDay", e.target.checked)
                    }
                  />
                }
                label="Half Day"
                sx={{ mt: 2 }}
              />
              {formData.halfDay && (
                <TextField
                  select
                  label="Half Day Type"
                  value={formData.halfDayType}
                  onChange={(e) =>
                    handleInputChange("halfDayType", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                </TextField>
              )}
              <TextField
                label="Reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Number of days:{" "}
                  {calculateBusinessDays(
                    formData.startDate,
                    formData.endDate,
                    formData.halfDay
                  )}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!formData.reason || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default MyLeaveRequests;
