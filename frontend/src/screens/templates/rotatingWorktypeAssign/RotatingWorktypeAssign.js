import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Alert,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/rotating-worktype/shifts";

const employees = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  employeeCode: `#EMP${i + 1}`,
  requestedWorktype: i % 2 === 0 ? "Full Time" : "Part Time",
  currentWorktype: "Regular",
  requestedDate: "2024-02-07",
  requestedTill: "2024-02-09",
  status: i % 2 === 0 ? "Approved" : "Rejected",
  description: "Request for worktype adjustment",
}));

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

const RotatingWorktypeAssign = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedAllocations, setSelectedAllocations] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWorktype, setEditingWorktype] = useState(null);
  const [isPermanentRequest, setIsPermanentRequest] = useState(false);
  const [showSelectionButtons, setShowSelectionButtons] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [worktypeRequests, setWorktypeRequests] = useState([]);
  const [allocatedWorktypes, setAllocatedWorktypes] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    requestWorktype: "",
    requestedDate: "",
    requestedTill: "",
    description: "",
  });

  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "worktype" or "bulk"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorktypeRequests();
  }, [tabValue]);

  const loadWorktypeRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { isAllocated: tabValue === 1 },
      });
      if (tabValue === 0) {
        setWorktypeRequests(response.data);
      } else {
        setAllocatedWorktypes(response.data);
      }
    } catch (error) {
      console.error("Error loading worktype requests:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowClick = (id) => {
    const newSelected = selectedAllocations.includes(id)
      ? selectedAllocations.filter((item) => item !== id)
      : [...selectedAllocations, id];
    setSelectedAllocations(newSelected);
    setShowSelectionButtons(newSelected.length > 0);
  };

  const handleSelectAll = () => {
    const currentData = tabValue === 0 ? worktypeRequests : allocatedWorktypes;
    const allIds = currentData.map((req) => req._id);
    setSelectedAllocations(allIds);
    setShowSelectionButtons(true);
  };

  const handleUnselectAll = () => {
    setSelectedAllocations([]);
    setShowSelectionButtons(false);
  };

  const handleBulkApprove = async () => {
    try {
      await axios.post(`${API_URL}/bulk-approve`, {
        ids: selectedAllocations,
        isAllocated: tabValue === 1,
      });
      await loadWorktypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error bulk approving worktypes:", error);
    }
  };

  const handleBulkReject = async () => {
    try {
      await axios.post(`${API_URL}/bulk-reject`, {
        ids: selectedAllocations,
        isAllocated: tabValue === 1,
      });
      await loadWorktypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error bulk rejecting worktypes:", error);
    }
  };

  // Replace the existing handleDelete function with this:
  const handleDeleteClick = (worktype, e) => {
    e.stopPropagation();
    setDeleteType("worktype");
    setItemToDelete(worktype);
    setDeleteDialogOpen(true);
  };

  // Add a function for bulk delete confirmation
  const handleBulkDeleteClick = () => {
    setDeleteType("bulk");
    setItemToDelete({
      count: selectedAllocations.length,
      type: tabValue === 0 ? "requests" : "allocations",
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

      if (deleteType === "worktype" && itemToDelete) {
        await axios.delete(`${API_URL}/${itemToDelete._id}`);
        await loadWorktypeRequests();
        console.log("Worktype request deleted successfully");
      } else if (deleteType === "bulk" && selectedAllocations.length > 0) {
        await Promise.all(
          selectedAllocations.map((id) => axios.delete(`${API_URL}/${id}`))
        );
        await loadWorktypeRequests();
        setSelectedAllocations([]);
        setShowSelectionButtons(false);
        console.log(
          `${selectedAllocations.length} ${itemToDelete.type} deleted successfully`
        );
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorktypeRequests();
  }, [tabValue]);

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedAllocations.map((id) => axios.delete(`${API_URL}/${id}`))
      );
      await loadWorktypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error bulk deleting worktypes:", error);
    }
  };

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_URL}/${id}/approve`);
      await loadWorktypeRequests();
    } catch (error) {
      console.error("Error approving worktype:", error);
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_URL}/${id}/reject`);
      await loadWorktypeRequests();
    } catch (error) {
      console.error("Error rejecting worktype:", error);
    }
  };

  const handleCreateWorktype = async () => {
    try {
      const selectedEmployee = employees.find(
        (emp) => emp.name === formData.employee
      );
      const worktypeData = {
        name: formData.employee,
        employeeCode: selectedEmployee?.employeeCode,
        requestedWorktype: formData.requestWorktype,
        currentWorktype: "Regular",
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isPermanentRequest,
        isAllocated: tabValue === 1,
      };

      await axios.post(API_URL, worktypeData);
      await loadWorktypeRequests();
      setCreateDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error creating worktype:", error);
    }
  };

  const handleEdit = (worktype, e) => {
    e.stopPropagation();
    setEditingWorktype(worktype);
    setFormData({
      employee: worktype.name,
      requestWorktype: worktype.requestedWorktype,
      requestedDate: new Date(worktype.requestedDate)
        .toISOString()
        .split("T")[0],
      requestedTill: new Date(worktype.requestedTill)
        .toISOString()
        .split("T")[0],
      description: worktype.description,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const selectedEmployee = employees.find(
        (emp) => emp.name === formData.employee
      );
      const updatedData = {
        name: formData.employee,
        employeeCode: selectedEmployee?.employeeCode,
        requestedWorktype: formData.requestWorktype,
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isAllocated: tabValue === 1,
      };

      await axios.put(`${API_URL}/${editingWorktype._id}`, updatedData);
      await loadWorktypeRequests();
      setEditDialogOpen(false);
      setEditingWorktype(null);
      resetFormData();
    } catch (error) {
      console.error("Error updating worktype:", error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/${id}`);
      await loadWorktypeRequests();
    } catch (error) {
      console.error("Error deleting worktype:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      employee: "",
      requestWorktype: "",
      requestedDate: "",
      requestedTill: "",
      description: "",
    });
    setIsPermanentRequest(false);
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
          {tabValue === 0
            ? "Rotating Work Type Requests"
            : "Allocated Work Types"}
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
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  height: { xs: "auto", sm: 40 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  },
                }}
              >
                Create {tabValue === 0 ? "Request" : "Allocation"}
              </Button>
            </Box>
          </Box>
        </StyledPaper>

        {/* Selection Buttons */}
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
            Select All {tabValue === 0 ? "Requests" : "Allocations"}
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
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
              my: 0.5,
              borderRadius: 1,
              mx: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleBulkApprove}
          sx={{
            color: theme.palette.success.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.success.main, 0.1),
            },
          }}
        >
          <Typography variant="body2">Approve Selected</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleBulkReject}
          sx={{
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <Typography variant="body2">Reject Selected</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleBulkDelete}
          sx={{
            color: theme.palette.error.dark,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.dark, 0.1),
            },
          }}
        >
          <Typography variant="body2">Delete Selected</Typography>
        </MenuItem>
      </Menu>

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

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => {
          setTabValue(newValue);
          setSelectedAllocations([]);
          setShowSelectionButtons(false);
          setFilterStatus("all");
        }}
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
        <Tab label="Allocated Work Types" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: 350, sm: 400, md: 450 },
          overflowY: "auto",
          overflowX: "auto",
          mx: { xs: 0, sm: 0 },
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
                    selectedAllocations.length ===
                      (tabValue === 0
                        ? worktypeRequests.length
                        : allocatedWorktypes.length) &&
                    (tabValue === 0
                      ? worktypeRequests.length > 0
                      : allocatedWorktypes.length > 0)
                  }
                />
              </StyledTableCell>
              <StyledTableCell>Employee</StyledTableCell>
              <StyledTableCell>Requested Work Type</StyledTableCell>
              <StyledTableCell>Current Work Type</StyledTableCell>
              <StyledTableCell>Requested Date</StyledTableCell>
              <StyledTableCell>Requested Till</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell align="center">Confirmation</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 0 ? worktypeRequests : allocatedWorktypes)
              .filter((request) => {
                const employeeName = request?.name || "";
                return (
                  employeeName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  (filterStatus === "all" || request.status === filterStatus)
                );
              })
              .map((request) => (
                <StyledTableRow
                  key={request._id}
                  hover
                  onClick={() => handleRowClick(request._id)}
                  selected={selectedAllocations.includes(request._id)}
                  sx={{
                    cursor: "pointer",
                    ...(selectedAllocations.includes(request._id) && {
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
                      backgroundColor: selectedAllocations.includes(request._id)
                        ? alpha(theme.palette.primary.light, 0.15)
                        : request._id % 2 === 0
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
                      checked={selectedAllocations.includes(request._id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSelected = selectedAllocations.includes(
                          request._id
                        )
                          ? selectedAllocations.filter(
                              (id) => id !== request._id
                            )
                          : [...selectedAllocations, request._id];
                        setSelectedAllocations(newSelected);
                        setShowSelectionButtons(newSelected.length > 0);
                      }}
                      onChange={() => {}}
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor:
                            request._id % 2 === 0
                              ? alpha(theme.palette.primary.main, 0.8)
                              : alpha(theme.palette.secondary.main, 0.8),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          mr: 1,
                        }}
                      >
                        {request.name?.[0] || "U"}
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.employeeCode}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {request.requestedWorktype}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {request.currentWorktype}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {new Date(request.requestedDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {new Date(request.requestedTill).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
                          request.status === "Approved"
                            ? alpha("#4caf50", 0.1)
                            : request.status === "Rejected"
                            ? alpha("#f44336", 0.1)
                            : alpha("#ff9800", 0.1),
                        color:
                          request.status === "Approved"
                            ? "#2e7d32"
                            : request.status === "Rejected"
                            ? "#d32f2f"
                            : "#e65100",
                      }}
                    >
                      {request.status}
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
                      {request.description}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <IconButton
                        size="small"
                        color="success"
                        onClick={(e) => handleApprove(request._id, e)}
                        disabled={request.status === "Approved"}
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
                        onClick={(e) => handleReject(request._id, e)}
                        disabled={request.status === "Rejected"}
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
                        onClick={(e) => handleEdit(request, e)}
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
                        onClick={(e) => handleDeleteClick(request, e)}
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
            {(tabValue === 0 ? worktypeRequests : allocatedWorktypes).length ===
              0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      No records found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "Try adjusting your search or filters"
                        : filterStatus !== "all"
                        ? `No ${filterStatus.toLowerCase()} requests found`
                        : tabValue === 0
                        ? "No worktype requests available"
                        : "No allocated worktypes available"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Delete />
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
              ? `Are you sure you want to delete ${selectedAllocations.length} selected ${itemToDelete?.type}?`
              : "Are you sure you want to delete this worktype request?"}
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
                    You are about to delete {selectedAllocations.length}{" "}
                    {itemToDelete.type}. This action cannot be undone.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    Worktype Request Details:
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
                    <strong>Employee:</strong> {itemToDelete.name} (
                    {itemToDelete.employeeCode})<br />
                    <strong>Requested Worktype:</strong>{" "}
                    {itemToDelete.requestedWorktype}
                    <br />
                    <strong>Date Range:</strong>{" "}
                    {new Date(itemToDelete.requestedDate).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(itemToDelete.requestedTill).toLocaleDateString()}
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
        onClose={() => {
          setCreateDialogOpen(false);
          resetFormData();
        }}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "600px" },
            maxWidth: "600px",
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
          Create {tabValue === 0 ? "Work Type Request" : "Work Type Allocation"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              select
              label="Employee"
              name="employee"
              value={formData.employee}
              onChange={handleFormChange}
              fullWidth
              required
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
                  {emp.name} ({emp.employeeCode})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Requested Work Type"
              name="requestWorktype"
              value={formData.requestWorktype}
              onChange={handleFormChange}
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
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>

            <TextField
              label="Requested Date"
              name="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={handleFormChange}
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

            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
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

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
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
                  color="primary"
                />
              }
              label="Permanent Request"
              sx={{ mt: 1 }}
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
            onClick={() => {
              setCreateDialogOpen(false);
              resetFormData();
            }}
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
            onClick={handleCreateWorktype}
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
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}

      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingWorktype(null);
          resetFormData();
        }}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "600px" },
            maxWidth: "600px",
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
          Edit {tabValue === 0 ? "Work Type Request" : "Work Type Allocation"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              select
              label="Employee"
              name="employee"
              value={formData.employee}
              onChange={handleFormChange}
              fullWidth
              required
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
                  {emp.name} ({emp.employeeCode})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Requested Work Type"
              name="requestWorktype"
              value={formData.requestWorktype}
              onChange={handleFormChange}
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
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>

            <TextField
              label="Requested Date"
              name="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={handleFormChange}
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

            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
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

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
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
            onClick={() => {
              setEditDialogOpen(false);
              setEditingWorktype(null);
              resetFormData();
            }}
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

export default RotatingWorktypeAssign;
