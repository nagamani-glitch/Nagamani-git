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
            width: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          Create Attendance Record
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={newRecord.name}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, name: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1976d2",
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setCreateOpen(false)}
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
            onClick={handleCreateRecord}
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
          sx: {
            width: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          Edit Attendance Record
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            marginTop: "20px",
          }}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={editRecord?.name || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, name: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1976d2",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  fullWidth
                  value={editRecord?.empId || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, empId: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editRecord?.date || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, date: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-In Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editRecord?.checkIn || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, checkIn: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Check-Out Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={editRecord?.checkOut || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, checkOut: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Shift"
                  fullWidth
                  value={editRecord?.shift || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, shift: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  value={editRecord?.workType || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, workType: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
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
                  value={editRecord?.minHour || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, minHour: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="At Work"
                  fullWidth
                  value={editRecord?.atWork || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, atWork: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Overtime"
                  fullWidth
                  value={editRecord?.overtime || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, overtime: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Comment"
                  fullWidth
                  multiline
                  rows={2}
                  value={editRecord?.comment || ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, comment: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setEditOpen(false)}
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
            onClick={handleUpdateRecord}
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
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            "& .MuiTextField-root": {
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fff",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                },
                "&.Mui-focused": {
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              },
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              borderBottom: `2px solid ${theme.palette.primary.light}`,
              paddingBottom: 1,
            }}
          >
            Filter Options
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            label="Employee"
            value={filterValues.employee}
            onChange={(e) => handleFilterChange("employee", e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                padding: "12px 14px",
              },
            }}
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
            sx={{
              "& .MuiSelect-select": {
                padding: "12px 14px",
              },
            }}
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
            sx={{
              "& .MuiSelect-select": {
                padding: "12px 14px",
              },
            }}
          >
            <MenuItem value="">All Shifts</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setFilterValues({
                employee: "",
                workType: "",
                shift: "",
              });
              fetchAttendanceRecords();
              handleFilterClose();
            }}
            sx={{
              mt: 2,
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              textTransform: "none",
              borderRadius: 2,
              padding: "10px 0",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
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
            sx={{ color: "#1976d2" }}
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
