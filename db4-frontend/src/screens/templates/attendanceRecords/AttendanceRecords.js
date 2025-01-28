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
    borderRadius: 8,
    marginTop: 8,
    minWidth: 240,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const AttendanceRecords = () => {
  const theme = useTheme();
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
  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        Attendance Records
      </Typography>

      <StyledPaper>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <SearchTextField
            placeholder="Search records..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: "auto",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{
                height: 40,
                whiteSpace: "nowrap",
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
              }}
            >
              Create Record
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Employee</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Day</StyledTableCell>
              <StyledTableCell>Check-In</StyledTableCell>
              <StyledTableCell>Check-Out</StyledTableCell>
              <StyledTableCell>Shift</StyledTableCell>
              <StyledTableCell>Work Type</StyledTableCell>
              <StyledTableCell>Min Hour</StyledTableCell>
              <StyledTableCell>At Work</StyledTableCell>
              <StyledTableCell>Overtime</StyledTableCell>
              <StyledTableCell>Comment</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row._id}>
                <TableCell sx={{ fontWeight: 500 }}>
                  {row.name} ({row.empId})
                </TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>{row.checkOut || "-"}</TableCell>
                <TableCell>{row.shift || "-"}</TableCell>
                <TableCell>{row.workType || "-"}</TableCell>
                <TableCell>{row.minHour || "-"}</TableCell>
                <TableCell>{row.atWork || "-"}</TableCell>
                <TableCell>{row.overtime || "-"}</TableCell>
                <TableCell>{row.comment || "-"}</TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
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
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* For creating the Attendance record */}

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            "& .MuiDialogContent-root": {
              padding: 3,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            fontSize: 18,
            padding: 2,
          }}
        >
          Create Attendance Record
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap={2.5}
            sx={{
              "& .MuiTextField-root": {
                backgroundColor: "background.paper",
                borderRadius: 1,
              },
            }}
          >
            <Grid container spacing={2}>
              {/* Create Form Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={newRecord.name}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  fullWidth
                  value={newRecord.empId}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, empId: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, date: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-In Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newRecord.checkIn}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, checkIn: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-Out Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newRecord.checkOut}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, checkOut: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Shift"
                  fullWidth
                  value={newRecord.shift}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, shift: e.target.value })
                  }
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Work Type"
                  fullWidth
                  value={newRecord.workType}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, workType: e.target.value })
                  }
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Minimum Hours"
                  type="number"
                  fullWidth
                  value={newRecord.minHour}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, minHour: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="At Work (Hours)"
                  fullWidth
                  value={newRecord.atWork}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, atWork: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Overtime (Hours)"
                  fullWidth
                  value={newRecord.overtime}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, overtime: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Comment"
                  fullWidth
                  multiline
                  rows={2}
                  value={newRecord.comment}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, comment: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateRecord}
            variant="contained"
            sx={{ px: 4 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* For edit the attendance record */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Attendance Record</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={2}>
            {/* Edit Form Fields */}
            <TextField
              label="Name"
              fullWidth
              value={editRecord?.name || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, name: e.target.value })
              }
            />
            <TextField
              label="Employee ID"
              fullWidth
              value={editRecord?.empId || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, empId: e.target.value })
              }
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editRecord?.date || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, date: e.target.value })
              }
            />
            <TextField
              label="Check-In Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editRecord?.checkIn || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, checkIn: e.target.value })
              }
            />
            <TextField
              label="Check-Out Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editRecord?.checkOut || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, checkOut: e.target.value })
              }
            />
            <TextField
              select
              label="Shift"
              fullWidth
              value={editRecord?.shift || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, shift: e.target.value })
              }
            >
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </TextField>
            <TextField
              select
              label="Work Type"
              fullWidth
              value={editRecord?.workType || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, workType: e.target.value })
              }
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>
            <TextField
              label="Minimum Hours"
              type="number"
              fullWidth
              value={editRecord?.minHour || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, minHour: e.target.value })
              }
            />
            <TextField
              label="At Work"
              fullWidth
              value={editRecord?.atWork || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, atWork: e.target.value })
              }
            />
            <TextField
              label="Overtime"
              fullWidth
              value={editRecord?.overtime || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, overtime: e.target.value })
              }
            />
            <TextField
              label="Comment"
              fullWidth
              multiline
              rows={2}
              value={editRecord?.comment || ""}
              onChange={(e) =>
                setEditRecord({ ...editRecord, comment: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateRecord}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <FilterMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Filter by
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            label="Employee"
            value={filterValues.employee}
            onChange={(e) => handleFilterChange("employee", e.target.value)}
          >
            <MenuItem value="">All Employees</MenuItem>
            {[
              ...new Set(
                rows.map((record) => `${record.name} (${record.empId})`)
              ),
            ].map((emp) => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Work Type"
            value={filterValues.workType}
            onChange={(e) => handleFilterChange("workType", e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Shift"
            value={filterValues.shift}
            onChange={(e) => handleFilterChange("shift", e.target.value)}
          >
            <MenuItem value="">All Shifts</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </TextField>

          <Button
            fullWidth
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
          >
            Reset Filters
          </Button>
        </Box>
      </FilterMenu>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Attendance Details
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ color: "white" }}
          >
            <Cancel />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {previewData && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    fontSize: 24,
                  }}
                >
                  {previewData.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {previewData.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Employee ID: {previewData.empId}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  Date: {new Date(previewData.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">Day: {previewData.day}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Check In/Out
                </Typography>
                <Typography variant="body1">
                  Check In: {previewData.checkIn}
                </Typography>
                <Typography variant="body1">
                  Check Out: {previewData.checkOut || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Work Details
                </Typography>
                <Typography variant="body1">
                  Shift: {previewData.shift || "-"}
                </Typography>
                <Typography variant="body1">
                  Work Type: {previewData.workType || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Hours
                </Typography>
                <Typography variant="body1">
                  Min Hours: {previewData.minHour || "-"}
                </Typography>
                <Typography variant="body1">
                  At Work: {previewData.atWork || "-"}
                </Typography>
                <Typography variant="body1">
                  Overtime: {previewData.overtime || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Additional Info
                </Typography>
                <Typography variant="body1">
                  Comment: {previewData.comment || "-"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: 3,
        }}
        onClick={() => setCreateOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default AttendanceRecords;
