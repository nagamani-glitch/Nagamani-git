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
} from "@mui/material";
import {
  FilterList,
  GroupWork,
  Add,
  Visibility,
  Cancel,
  Edit,
  Search,
} from "@mui/icons-material";
 
// Styled Components
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
 
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  padding: theme.spacing(1, 3),
}));
 
const AttendanceRecords = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupByOpen, setGroupByOpen] = useState(false);
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
    shift: "",
    workType: "",
    minHour: "",
    comment: "",
  });
 
  const API_URL = "http://localhost:5000/api/attendance";
  // Styled Table Components
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
          shift: "",
          workType: "",
          minHour: "",
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <SearchTextField
            placeholder="Search records..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />
 
          <Box display="flex" gap={2}>
            <ActionButton
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterOpen(true)}
            >
              Filter
            </ActionButton>
 
            <ActionButton
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              Create Record
            </ActionButton>
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
                <TableCell align="center">
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.info.main }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(row)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRecord(row._id)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <Cancel />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
 
            <Dialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Edit Attendance Record</DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} pt={2}>
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
                    label="Shift"
                    fullWidth
                    value={editRecord?.shift || ""}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, shift: e.target.value })
                    }
                  />
                  <TextField
                    label="Work Type"
                    fullWidth
                    value={editRecord?.workType || ""}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, workType: e.target.value })
                    }
                  />
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
          </TableBody>
        </Table>
      </TableContainer>
 
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            fontSize: 18,
          }}
        >
          Create Attendance Record
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Form fields remain the same but with enhanced spacing */}
            <TextField
              label="Name"
              fullWidth
              value={newRecord.name}
              onChange={(e) =>
                setNewRecord({ ...newRecord, name: e.target.value })
              }
            />
            <TextField
              label="Employee ID"
              fullWidth
              value={newRecord.empId}
              onChange={(e) =>
                setNewRecord({ ...newRecord, empId: e.target.value })
              }
            />
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
            <TextField
              label="Shift"
              fullWidth
              value={newRecord.shift}
              onChange={(e) =>
                setNewRecord({ ...newRecord, shift: e.target.value })
              }
            />
            <TextField
              label="Work Type"
              fullWidth
              value={newRecord.workType}
              onChange={(e) =>
                setNewRecord({ ...newRecord, workType: e.target.value })
              }
            />
            <TextField
              label="Minimum Hours"
              type="number"
              fullWidth
              value={newRecord.minHour}
              onChange={(e) =>
                setNewRecord({ ...newRecord, minHour: e.target.value })
              }
            />
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateRecord}
            variant="contained"
            sx={{ px: 3 }}
          >
            Create
          </Button>
        </DialogActions>
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