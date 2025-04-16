import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
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
  Fab,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  InputAdornment,
  MenuItem,
  Menu,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  FilterList,
  Add,
  Visibility,
  Cancel,
  Edit,
  Search,
} from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const FilterMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
    marginTop: 12,
    minWidth: 280,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
    border: "1px solid rgba(25, 118, 210, 0.12)",
  },
  "& .MuiMenuItem-root": {
    padding: "12px 16px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  },
}));

const AttendanceRecords = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editRecord, setEditRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({
    name: "",
    empId: "",
    date: "",
    checkIn: "",
    checkOut: "",
    shift: "",
    workType: "",
    minHour: "",
    atWork: "",
    overtime: "",
    comment: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({
    employee: "",
    workType: "",
    shift: "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const API_URL = "http://localhost:5000/api/attendance";

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: "bold",
    padding: theme.spacing(2),
    "&.MuiTableCell-body": {
      color: theme.palette.text.primary,
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: alpha(theme.palette.primary.light, 0.05),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
      transition: "background-color 0.2s ease",
    },
  }));
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      setRows(response.data);
    } catch (error) {
      showSnackbar("Error fetching attendance records", "error");
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    try {
      const response = await axios.get(
        `${API_URL}/search?searchTerm=${e.target.value}`
      );
      setRows(response.data);
    } catch (error) {
      showSnackbar("Error searching records", "error");
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = async (name, value) => {
    const newFilterValues = {
      ...filterValues,
      [name]: value,
    };
    setFilterValues(newFilterValues);

    try {
      const params = new URLSearchParams();
      if (newFilterValues.employee)
        params.append("employee", newFilterValues.employee);
      if (newFilterValues.workType)
        params.append("workType", newFilterValues.workType);
      if (newFilterValues.shift) params.append("shift", newFilterValues.shift);

      const response = await axios.get(
        `${API_URL}/filter?${params.toString()}`
      );
      setRows(response.data);
    } catch (error) {
      showSnackbar("Error applying filters", "error");
    }
  };

  const handleCreateRecord = async () => {
    try {
      const formattedData = {
        ...newRecord,
        date: new Date(newRecord.date).toISOString(),
        minHour: Number(newRecord.minHour) || 0,
      };

      const response = await axios.post(API_URL, formattedData);
      if (response.data) {
        setCreateOpen(false);
        fetchAttendanceRecords();
        showSnackbar("Attendance record created successfully");
        setNewRecord({
          name: "",
          empId: "",
          date: "",
          checkIn: "",
          checkOut: "",
          shift: "",
          workType: "",
          minHour: "",
          atWork: "",
          overtime: "",
          comment: "",
        });
      }
    } catch (error) {
      showSnackbar("Error creating record", "error");
    }
  };

  const handleEdit = (row) => {
    setEditRecord({
      ...row,
      date: new Date(row.date).toISOString().split("T")[0],
    });
    setEditOpen(true);
  };

  const handleUpdateRecord = async () => {
    try {
      const formattedData = {
        ...editRecord,
        date: new Date(editRecord.date).toISOString(),
        minHour: Number(editRecord.minHour) || 0,
      };

      await axios.put(`${API_URL}/${editRecord._id}`, formattedData);
      setEditOpen(false);
      fetchAttendanceRecords();
      showSnackbar("Record updated successfully");
    } catch (error) {
      showSnackbar("Error updating record", "error");
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAttendanceRecords();
      showSnackbar("Record deleted successfully");
    } catch (error) {
      showSnackbar("Error deleting record", "error");
    }
  };

  const handlePreview = (row) => {
    setPreviewData(row);
    setPreviewOpen(true);
  };

  // Render mobile card view for attendance records
  const renderAttendanceCard = (row) => (
    <Card
      key={row._id}
      sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              {row.name[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {row.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.empId}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={row.workType || "Regular"}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Date:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date(row.date).toLocaleDateString()} ({row.day})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Check In/Out:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {row.checkIn} - {row.checkOut || "-"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Shift:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {row.shift || "-"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Hours:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Min: {row.minHour || "-"} | At Work: {row.atWork || "-"} | OT:{" "}
              {row.overtime || "-"}
            </Typography>
          </Box>

          {row.comment && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Comment:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontStyle: "italic" }}>
                {row.comment}
              </Typography>
            </Box>
          )}
        </Stack>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <IconButton
            size="small"
            onClick={() => handlePreview(row)}
            sx={{
              color: theme.palette.info.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.info.main, 0.1),
              },
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(row)}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteRecord(row._id)}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            <Cancel />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: isMobile ? "1.75rem" : "2.125rem",
        }}
      >
        Attendance Records
      </Typography>

      <StyledPaper sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <SearchTextField
            placeholder="Search records..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{
              width: isMobile ? "100%" : { xs: "100%", sm: "300px" },
              marginRight: isMobile ? 0 : "auto",
              mb: isMobile ? 2 : 0,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{ display: "flex", gap: 1, width: isMobile ? "100%" : "auto" }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{
                height: 40,
                whiteSpace: "nowrap",
                flex: isMobile ? 1 : "none",
              }}
            >
              Filters
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
              sx={{
                height: 40,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
                flex: isMobile ? 1 : "none",
              }}
            >
              New Record
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      {isMobile ? (
        // Mobile view - card layout
        <Box>
          {rows.length > 0 ? (
            rows.map((row) => renderAttendanceCard(row))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No attendance records found
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        // Desktop/Tablet view - table layout
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, .08)",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="attendance records table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Employee</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Check In/Out</StyledTableCell>
                <StyledTableCell>Shift</StyledTableCell>
                <StyledTableCell>Work Type</StyledTableCell>
                <StyledTableCell>Hours</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <StyledTableRow key={row._id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {row.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.empId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {row.checkIn} - {row.checkOut || "-"}
                    </TableCell>
                    <TableCell>{row.shift || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.workType || "Regular"}
                        size="small"
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.light,
                            0.1
                          ),
                          color: theme.palette.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Min: {row.minHour || "-"} | At Work: {row.atWork || "-"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Overtime: {row.overtime || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(row)}
                          sx={{
                            color: theme.palette.info.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.info.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRecord(row._id)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Filter Menu */}
      <FilterMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            Filter Records
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Employee Name"
              value={filterValues.employee}
              onChange={(e) => handleFilterChange("employee", e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Work Type"
              value={filterValues.workType}
              onChange={(e) => handleFilterChange("workType", e.target.value)}
              size="small"
              fullWidth
              select
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>
            <TextField
              label="Shift"
              value={filterValues.shift}
              onChange={(e) => handleFilterChange("shift", e.target.value)}
              size="small"
              fullWidth
              select
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterValues({
                  employee: "",
                  workType: "",
                  shift: "",
                });
                fetchAttendanceRecords();
                handleFilterClose();
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Stack>
        </Box>
      </FilterMenu>

      {/* Create Record Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            fontWeight: 600,
          }}
        >
          Create New Attendance Record
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                value={newRecord.name}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, name: e.target.value })
                }
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                value={newRecord.empId}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, empId: e.target.value })
                }
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={newRecord.date}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, date: e.target.value })
                }
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Day"
                value={newRecord.day}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, day: e.target.value })
                }
                fullWidth
                required
                placeholder="e.g. Monday"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check In"
                value={newRecord.checkIn}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkIn: e.target.value })
                }
                fullWidth
                required
                placeholder="e.g. 09:00 AM"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check Out"
                value={newRecord.checkOut}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkOut: e.target.value })
                }
                fullWidth
                placeholder="e.g. 05:00 PM"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Shift"
                value={newRecord.shift}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, shift: e.target.value })
                }
                fullWidth
                select
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Work Type"
                value={newRecord.workType}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, workType: e.target.value })
                }
                fullWidth
                select
              >
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Minimum Hours"
                type="number"
                value={newRecord.minHour}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, minHour: e.target.value })
                }
                fullWidth
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
                type="number"
                value={newRecord.atWork}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, atWork: e.target.value })
                }
                fullWidth
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
                type="number"
                value={newRecord.overtime}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, overtime: e.target.value })
                }
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
                value={newRecord.comment}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, comment: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateRecord}
            variant="contained"
            color="primary"
          >
            Create Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            fontWeight: 600,
          }}
        >
          Edit Attendance Record
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
          {editRecord && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee Name"
                  value={editRecord.name}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, name: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  value={editRecord.empId}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, empId: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  value={editRecord.date}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, date: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Day"
                  value={editRecord.day}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, day: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check In"
                  value={editRecord.checkIn}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, checkIn: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check Out"
                  value={editRecord.checkOut}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, checkOut: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Shift"
                  value={editRecord.shift}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, shift: e.target.value })
                  }
                  fullWidth
                  select
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Work Type"
                  value={editRecord.workType}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, workType: e.target.value })
                  }
                  fullWidth
                  select
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Minimum Hours"
                  type="number"
                  value={editRecord.minHour}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, minHour: e.target.value })
                  }
                  fullWidth
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
                  type="number"
                  value={editRecord.atWork}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, atWork: e.target.value })
                  }
                  fullWidth
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
                  type="number"
                  value={editRecord.overtime}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, overtime: e.target.value })
                  }
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
                  value={editRecord.comment}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, comment: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRecord}
            variant="contained"
            color="primary"
          >
            Update Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.info.main,
            color: "white",
            fontWeight: 600,
          }}
        >
          Attendance Record Details
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3, pt: isMobile ? 2 : 3 }}>
          {previewData && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.empId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(previewData.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Day
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.day}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Check In
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.checkIn}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Check Out
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.checkOut || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shift
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.shift || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Work Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.workType || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Minimum Hours
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.minHour || "-"} hours
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  At Work
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.atWork || "-"} hours
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Overtime
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {previewData.overtime || "-"} hours
                </Typography>
              </Grid>
              {previewData.comment && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Comment
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {previewData.comment}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewOpen(false)} color="inherit">
            Close
          </Button>
          {previewData && (
            <Button
              onClick={() => {
                setPreviewOpen(false);
                handleEdit(previewData);
              }}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, .2)",
          }}
          onClick={() => setCreateOpen(true)}
        >
          <Add />
        </Fab>
      )}

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
    </Box>
  );
};

export default AttendanceRecords;
