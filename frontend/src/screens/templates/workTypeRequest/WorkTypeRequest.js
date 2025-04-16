import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Menu,
  Tab,
  Checkbox,
  Typography,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Search, Add, Edit, Delete, FilterList } from "@mui/icons-material";
import {
  fetchWorkTypeRequests,
  createWorkTypeRequest,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest,
} from "../api/workTypeRequestApi";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
  padding: theme.spacing(2),
  whiteSpace: "nowrap",
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
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
  // Hide last border
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const employees = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  employeeCode: `#EMP${i + 1}`,
  requestedShift: i % 2 === 0 ? "First Shift" : "Second Shift",
  currentShift: "Regular Shift",
  requestedDate: "Nov. 7, 2024",
  requestedTill: "Nov. 9, 2024",
  status: i % 2 === 0 ? "Approved" : "Rejected",
  description: "Request for shift adjustment",
  comment: "Needs urgent consideration",
}));
const WorkTypeRequest = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedAllocations, setSelectedAllocations] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isPermanentRequest, setIsPermanentRequest] = useState(false);
  const [showSelectionButtons, setShowSelectionButtons] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftRequests, setShiftRequests] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({
    employee: "",
    requestShift: "",
    requestedDate: "",
    requestedTill: "",
    description: "",
  });

  // Add these state variables at the top of the component with other state declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace the existing handleDelete function with this:
  const handleDeleteClick = (shift, e) => {
    if (e) e.stopPropagation();
    setDeleteType("single");
    setItemToDelete(shift);
    setDeleteDialogOpen(true);
  };

  // Add a function for bulk delete confirmation
  const handleBulkDeleteClick = () => {
    setDeleteType("bulk");
    setItemToDelete({
      count: selectedAllocations.length,
      ids: [...selectedAllocations],
    });
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  // Add this function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Add this function to handle the confirmed deletion
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      if (deleteType === "single" && itemToDelete) {
        await deleteWorkTypeRequest(itemToDelete._id);
        setShiftRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== itemToDelete._id)
        );
        showSnackbar("Work type request deleted successfully");
      } else if (
        deleteType === "bulk" &&
        itemToDelete &&
        itemToDelete.ids.length > 0
      ) {
        const promises = itemToDelete.ids.map((id) =>
          deleteWorkTypeRequest(id)
        );
        await Promise.all(promises);
        setShiftRequests((prevRequests) =>
          prevRequests.filter((req) => !itemToDelete.ids.includes(req._id))
        );
        setSelectedAllocations([]);
        setShowSelectionButtons(false);
        showSnackbar(`${itemToDelete.count} requests deleted successfully`);
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      showSnackbar(
        `Error deleting ${deleteType === "single" ? "request" : "requests"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a showSnackbar function if it doesn't exist
  const showSnackbar = (message, severity = "success") => {
    // Implement snackbar functionality here if needed
    console.log(`${severity}: ${message}`);
  };

  useEffect(() => {
    loadWorkTypeRequests();
  }, []);

  const loadWorkTypeRequests = async () => {
    try {
      const response = await fetchWorkTypeRequests();
      setShiftRequests(response.data);
    } catch (error) {
      console.error("Error loading work type requests:", error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const promises = selectedAllocations.map((id) =>
        approveWorkTypeRequest(id)
      );
      await Promise.all(promises);
      await loadWorkTypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
    } catch (error) {
      console.error("Error bulk approving requests:", error);
    }
  };

  const handleBulkReject = async () => {
    try {
      const promises = selectedAllocations.map((id) =>
        rejectWorkTypeRequest(id)
      );
      await Promise.all(promises);
      await loadWorkTypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
    } catch (error) {
      console.error("Error bulk rejecting requests:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionsClick = (event) => setAnchorEl(event.currentTarget);

  const handleSelectAll = () => {
    const allIds = shiftRequests.map((req) => req._id);
    setSelectedAllocations(allIds);
    setShowSelectionButtons(true);
  };

  const handleUnselectAll = () => {
    setSelectedAllocations([]);
    setShowSelectionButtons(false);
  };

  const handleApprove = async (id) => {
    try {
      const response = await approveWorkTypeRequest(id);
      setShiftRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === id ? response.data : req))
      );
    } catch (error) {
      console.error("Error approving work type request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectWorkTypeRequest(id);
      setShiftRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === id ? response.data : req))
      );
    } catch (error) {
      console.error("Error rejecting work type request:", error);
    }
  };

  const handleCreateShift = async () => {
    try {
      const requestData = {
        employee: formData.employee,
        requestedShift: formData.requestShift,
        currentShift: "Regular Shift",
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isPermanentRequest,
        status: "Pending",
      };

      const response = await createWorkTypeRequest(requestData);
      setShiftRequests((prev) => [...prev, response.data]);
      setCreateDialogOpen(false);
      setFormData({
        employee: "",
        requestShift: "",
        requestedDate: "",
        requestedTill: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating work type request:", error);
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      employee: shift.employee,
      requestShift: shift.requestedShift,
      requestedDate: shift.requestedDate,
      requestedTill: shift.requestedTill,
      description: shift.description,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updateWorkTypeRequest(editingShift._id, formData);
      setShiftRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === editingShift._id ? response.data : req
        )
      );
      setEditDialogOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error("Error updating work type request:", error);
    }
  };


  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            color: theme.palette.primary.main,
            fontWeight: 600,
            letterSpacing: 0.5,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Work Type Requests
        </Typography>

        <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
            sx={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <SearchTextField
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "300px" },
                marginRight: { xs: 0, sm: "auto" },
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
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 1 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleActionsClick}
                disabled={!selectedAllocations.length}
                sx={{
                  height: { xs: "auto", sm: 40 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Actions
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  height: { xs: "auto", sm: 50 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  },
                }}
              >
                Create Request
              </Button>
            </Box>
          </Box>
        </StyledPaper>

       

        {/* Selection Buttons with responsive layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
            mt: { xs: 2, sm: 2 },
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "green",
              borderColor: "green",
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={handleSelectAll}
          >
            Select All Shifts
          </Button>
          {showSelectionButtons && (
            <>
              <Button
                variant="outlined"
                sx={{
                  color: "grey.500",
                  borderColor: "grey.500",
                  width: { xs: "100%", sm: "auto" },
                }}
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "maroon",
                  borderColor: "maroon",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {selectedAllocations.length} Selected
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: { xs: 200, sm: 250 },
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleBulkApprove} sx={{ py: 1.5 }}>
          Approve Selected
        </MenuItem>
        <MenuItem onClick={handleBulkReject} sx={{ py: 1.5 }}>
          Reject Selected
        </MenuItem>
        
        <MenuItem onClick={handleBulkDeleteClick} sx={{ py: 1.5 }}>
          Delete Selected
        </MenuItem>
      </Menu>

      {/* Status Filter Buttons with responsive layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 2,
        }}
      >
        <Button
          sx={{
            color: "green",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setFilterStatus("Approved")}
        >
          ● Approved
        </Button>
        <Button
          sx={{
            color: "red",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setFilterStatus("Rejected")}
        >
          ● Rejected
        </Button>
        <Button
          sx={{
            color: "orange",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setFilterStatus("Pending")}
        >
          ● Pending
        </Button>
        <Button
          sx={{
            color: "gray",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setFilterStatus("all")}
        >
          ● All
        </Button>
      </Box>

      {/* Tabs with responsive styling */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 2,
          "& .MuiTabs-flexContainer": {
            flexDirection: { xs: "column", sm: "row" },
          },
          "& .MuiTab-root": {
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.875rem", sm: "0.875rem", md: "1rem" },
          },
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Work Type Requests" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: 350, sm: 400, md: 450 },
          overflowY: "auto",
          overflowX: "auto",
          mx: 0,
          borderRadius: 2,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
                padding="checkbox"
                sx={{ position: "sticky", left: 0, zIndex: 3 }}
              >
                <Checkbox
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                  onChange={(e) => {
                    if (e.target.checked) handleSelectAll();
                    else handleUnselectAll();
                  }}
                  checked={
                    selectedAllocations.length === shiftRequests.length &&
                    shiftRequests.length > 0
                  }
                />
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 180 }}>Employee</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 150 }}>
                Requested Work Type
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 150 }}>
                Current Work Type
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 130 }}>
                Requested Date
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 130 }}>
                Requested Till
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 100 }}>Status</StyledTableCell>
              <StyledTableCell sx={{ minWidth: 150 }}>
                Description
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 120, textAlign: "center" }}>
                Confirmation
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: 100, textAlign: "center" }}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shiftRequests
              .filter((req) => {
                const employeeName = req?.employee || "";
                return (
                  employeeName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  (filterStatus === "all" || req.status === filterStatus)
                );
              })
              .map((emp) => (
                <StyledTableRow
                  key={emp._id}
                  hover
                  onClick={() => {
                    if (selectedAllocations.includes(emp._id)) {
                      setSelectedAllocations((prev) =>
                        prev.filter((id) => id !== emp._id)
                      );
                      if (selectedAllocations.length <= 1) {
                        setShowSelectionButtons(false);
                      }
                    } else {
                      setSelectedAllocations((prev) => [...prev, emp._id]);
                      setShowSelectionButtons(true);
                    }
                  }}
                  selected={selectedAllocations.includes(emp._id)}
                  sx={{
                    cursor: "pointer",
                    ...(selectedAllocations.includes(emp._id) && {
                      backgroundColor: alpha(theme.palette.primary.light, 0.15),
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.2
                        ),
                      },
                    }),
                  }}
                >
                  <TableCell
                    padding="checkbox"
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: selectedAllocations.includes(emp._id)
                        ? alpha(theme.palette.primary.light, 0.15)
                        : emp._id % 2 === 0
                        ? alpha(theme.palette.primary.light, 0.05)
                        : "inherit",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.2
                        ),
                      },
                    }}
                  >
                    <Checkbox
                      checked={selectedAllocations.includes(emp._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedAllocations((prev) => [...prev, emp._id]);
                          setShowSelectionButtons(true);
                        } else {
                          setSelectedAllocations((prev) =>
                            prev.filter((id) => id !== emp._id)
                          );
                          if (selectedAllocations.length <= 1) {
                            setShowSelectionButtons(false);
                          }
                        }
                      }}
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor:
                            emp._id % 2 === 0
                              ? alpha(theme.palette.primary.main, 0.8)
                              : alpha(theme.palette.secondary.main, 0.8),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          flexShrink: 0,
                        }}
                      >
                        {emp.employee?.[0] || "U"}
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {emp.employee}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {emp.employeeCode || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {emp.requestedShift}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{emp.currentShift}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {emp.requestedDate
                        ? new Date(emp.requestedDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {emp.requestedTill
                        ? new Date(emp.requestedTill).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        backgroundColor:
                          emp.status === "Approved"
                            ? alpha("#4caf50", 0.1)
                            : emp.status === "Rejected"
                            ? alpha("#f44336", 0.1)
                            : alpha("#ff9800", 0.1),
                        color:
                          emp.status === "Approved"
                            ? "#2e7d32"
                            : emp.status === "Rejected"
                            ? "#d32f2f"
                            : "#e65100",
                      }}
                    >
                      {emp.status}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {emp.description}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <IconButton
                        size="small"
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(emp._id);
                        }}
                        disabled={emp.status === "Approved"}
                        sx={{
                          backgroundColor: alpha("#4caf50", 0.1),
                          "&:hover": {
                            backgroundColor: alpha("#4caf50", 0.2),
                          },
                          "&.Mui-disabled": {
                            backgroundColor: alpha("#e0e0e0", 0.3),
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          ✓
                        </Typography>
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(emp._id);
                        }}
                        disabled={emp.status === "Rejected"}
                        sx={{
                          backgroundColor: alpha("#f44336", 0.1),
                          "&:hover": {
                            backgroundColor: alpha("#f44336", 0.2),
                          },
                          "&.Mui-disabled": {
                            backgroundColor: alpha("#e0e0e0", 0.3),
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          ✕
                        </Typography>
                      </IconButton>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(emp);
                        }}
                        sx={{
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
                        color="error"
                        onClick={(e) => handleDeleteClick(emp, e)}
                        sx={{
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.2
                            ),
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}

            {/* Empty state message when no records match filters */}
            {shiftRequests.filter((req) => {
              const employeeName = req?.employee || "";
              return (
                employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus === "all" || req.status === filterStatus)
              );
            }).length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No work type requests found matching your filters.
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    sx={{ mt: 1 }}
                  >
                    Clear filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Delete color="inherit" />
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
            {deleteType === "bulk"
              ? `Are you sure you want to delete ${itemToDelete?.count} selected requests?`
              : "Are you sure you want to delete this work type request?"}
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              {deleteType === "bulk" ? (
                <>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    Bulk Deletion
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    You are about to delete {itemToDelete.count} work type
                    requests. This action cannot be undone.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    Work Type Request Details:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "#fff",
                      borderRadius: 1,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <strong>Employee:</strong> {itemToDelete.employee}
                    <br />
                    <strong>Requested Work Type:</strong>{" "}
                    {itemToDelete.requestedShift}
                    <br />
                    <strong>Current Work Type:</strong>{" "}
                    {itemToDelete.currentShift}
                    <br />
                    <strong>Date Range:</strong>{" "}
                    {itemToDelete.requestedDate &&
                      new Date(
                        itemToDelete.requestedDate
                      ).toLocaleDateString()}{" "}
                    -{" "}
                    {itemToDelete.requestedTill &&
                      new Date(itemToDelete.requestedTill).toLocaleDateString()}
                    <br />
                    <strong>Status:</strong> {itemToDelete.status}
                  </Typography>
                </>
              )}
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

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
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
          Create Work Request
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Employee"
              name="employee"
              fullWidth
              select
              value={formData.employee}
              onChange={handleFormChange}
              sx={{
                mt: 2,
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
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.name}>
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Request Work Type"
              name="requestShift"
              value={formData.requestShift}
              onChange={handleFormChange}
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
              <MenuItem value="Morning Shift">Morning Shift</MenuItem>
              <MenuItem value="Evening Shift">Evening Shift</MenuItem>
              <MenuItem value="Night Shift">Night Shift</MenuItem>
            </TextField>

            <TextField
              label="Requested Date"
              name="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={handleFormChange}
              fullWidth
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

            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
              fullWidth
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

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
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

            <FormControlLabel
              control={
                <Switch
                  checked={isPermanentRequest}
                  onChange={(e) => setIsPermanentRequest(e.target.checked)}
                />
              }
              label="Permanent Request"
            />
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
            onClick={() => setCreateDialogOpen(false)}
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
            onClick={handleCreateShift}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
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
          Edit Work Request
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Employee"
              name="employee"
              fullWidth
              select
              value={formData.employee}
              onChange={handleFormChange}
              sx={{
                mt: 2,
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
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.name}>
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Request Work Type"
              name="requestShift"
              value={formData.requestShift}
              onChange={handleFormChange}
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
              <MenuItem value="Morning Shift">Morning Shift</MenuItem>
              <MenuItem value="Evening Shift">Evening Shift</MenuItem>
              <MenuItem value="Night Shift">Night Shift</MenuItem>
            </TextField>

            <TextField
              label="Requested Date"
              name="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={handleFormChange}
              fullWidth
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

            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
              fullWidth
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

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
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
            onClick={() => setEditDialogOpen(false)}
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
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkTypeRequest;
