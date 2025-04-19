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
  CircularProgress,
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

  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Add loading state
  const [loading, setLoading] = useState(false);

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

  const handleDeleteClick = (record) => {
    setItemToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${itemToDelete._id}`);
      fetchAttendanceRecords();
      showSnackbar("Record deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showSnackbar("Error deleting record", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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
          {/* <IconButton
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
          </IconButton> */}
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(row)}
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
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            overflow: "auto",
            maxWidth: "100%",
            maxHeight: { xs: 350, sm: 400, md: 450 },
            overflowY: "auto",
            overflowX: "auto",
            mb: 4,
            "& .MuiTableContainer-root": {
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                borderRadius: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 8,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                },
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    fontSize: 14,
                    fontWeight: "bold",
                    padding: theme.spacing(2),
                    whiteSpace: "nowrap",
                    minWidth: 180,
                  }}
                >
                  Employee
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 130 }}>Date</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 150 }}>
                  Check In/Out
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 120 }}>Shift</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 130 }}>
                  Work Type
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 180 }}>Hours</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 120, textAlign: "center" }}>
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <StyledTableRow
                    key={row._id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.05
                        ),
                      },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.1
                        ),
                        transition: "background-color 0.2s ease",
                      },
                      // Hide last border
                      "&:last-child td, &:last-child th": {
                        borderBottom: 0,
                      },
                    }}
                  >
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
                      <Typography variant="body2">
                        {new Date(row.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.day}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.checkIn} - {row.checkOut || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.shift || "-"}
                      </Typography>
                    </TableCell>
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
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(row)}
                          sx={{
                            color: theme.palette.info.main,
                            backgroundColor: alpha(
                              theme.palette.info.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.info.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{
                            color: theme.palette.primary.main,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(row)}
                          sx={{
                            color: theme.palette.error.main,
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <Cancel fontSize="small" />
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
        fullScreen={window.innerWidth < 600} // Full screen on mobile
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "600px" },
            maxWidth: "100%",
            borderRadius: { xs: 0, sm: "20px" },
            margin: { xs: 0, sm: 2 },
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
          Create New Attendance Record
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                  value={newRecord.empId}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, empId: e.target.value })
                  }
                  fullWidth
                  required
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
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, date: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
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
                  label="Day"
                  value={newRecord.day}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, day: e.target.value })
                  }
                  fullWidth
                  required
                  placeholder="e.g. Monday"
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
                  label="Check In"
                  value={newRecord.checkIn}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, checkIn: e.target.value })
                  }
                  fullWidth
                  required
                  placeholder="e.g. 09:00 AM"
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
                  label="Check Out"
                  value={newRecord.checkOut}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, checkOut: e.target.value })
                  }
                  fullWidth
                  placeholder="e.g. 05:00 PM"
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
                  label="Shift"
                  value={newRecord.shift}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, shift: e.target.value })
                  }
                  fullWidth
                  select
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
                  label="Work Type"
                  value={newRecord.workType}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, workType: e.target.value })
                  }
                  fullWidth
                  select
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
                  value={newRecord.comment}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, comment: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
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
            disabled={
              !newRecord.name ||
              !newRecord.empId ||
              !newRecord.date ||
              !newRecord.checkIn
            }
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
            Create Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullScreen={window.innerWidth < 600} // Full screen on mobile
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "600px" },
            maxWidth: "100%",
            borderRadius: { xs: 0, sm: "20px" },
            margin: { xs: 0, sm: 2 },
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
        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          {editRecord && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                    value={editRecord.empId}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, empId: e.target.value })
                    }
                    fullWidth
                    required
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
                    value={editRecord.date}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, date: e.target.value })
                    }
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
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
                    label="Day"
                    value={editRecord.day}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, day: e.target.value })
                    }
                    fullWidth
                    required
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
                    label="Check In"
                    value={editRecord.checkIn}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, checkIn: e.target.value })
                    }
                    fullWidth
                    required
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
                    label="Check Out"
                    value={editRecord.checkOut}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, checkOut: e.target.value })
                    }
                    fullWidth
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
                    label="Shift"
                    value={editRecord.shift}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, shift: e.target.value })
                    }
                    fullWidth
                    select
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
                    label="Work Type"
                    value={editRecord.workType}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, workType: e.target.value })
                    }
                    fullWidth
                    select
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
                    value={editRecord.comment}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, comment: e.target.value })
                    }
                    fullWidth
                    multiline
                    rows={4}
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
          )}
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
            disabled={
              !editRecord?.name ||
              !editRecord?.empId ||
              !editRecord?.date ||
              !editRecord?.checkIn
            }
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
        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setPreviewOpen(false)}
            color="inherit"
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
          <Cancel />
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
            Are you sure you want to delete this attendance record? This action
            cannot be undone.
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {itemToDelete.name ? itemToDelete.name[0] : "?"}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    {itemToDelete.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {itemToDelete.empId}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.date
                      ? new Date(itemToDelete.date).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Day:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.day || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check In:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.checkIn || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check Out:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.checkOut || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Shift:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.shift || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Work Type:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {itemToDelete.workType || "Regular"}
                  </Typography>
                </Grid>
              </Grid>
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
    </Box>
  );
};

export default AttendanceRecords;
