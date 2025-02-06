import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import { Search, Add, Edit, Delete } from "@mui/icons-material";


import {
  fetchWorkTypeRequests,
  createWorkTypeRequest,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest,
} from "../api/workTypeRequestApi";

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

  // const handleBulkDelete = async () => {
  //   try {
  //     const promises = selectedAllocations.map((id) =>
  //       deleteWorkTypeRequest(id)
  //     );
  //     await Promise.all(promises);
  //     await loadWorkTypeRequests();
  //     setSelectedAllocations([]);
  //     setShowSelectionButtons(false);
  //   } catch (error) {
  //     console.error("Error bulk deleting requests:", error);
  //   }
  // };

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

  const handleDelete = async (id) => {
    try {
      await deleteWorkTypeRequest(id);
      setShiftRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== id)
      );
    } catch (error) {
      console.error("Error deleting work type request:", error);
    }
  };
  return (
    <Box>
      <Box sx={{ padding: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h3" fontWeight="800">
            Work Type Requests
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Search Employee"
              size="small"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" onClick={handleActionsClick}>
              Actions
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="error"
              onClick={() => setCreateDialogOpen(true)}
            >
              Create
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: "green", borderColor: "green" }}
            onClick={handleSelectAll}
          >
            Select All Shifts
          </Button>
          {showSelectionButtons && (
            <>
              <Button
                variant="outlined"
                sx={{ color: "grey.500", borderColor: "grey.500" }}
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "maroon", borderColor: "maroon" }}
              >
                {selectedAllocations.length} Selected
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleBulkApprove}>Approve Selected</MenuItem>
        <MenuItem onClick={handleBulkReject}>Reject Selected</MenuItem>
        <MenuItem onClick={() => handleDelete(selectedAllocations)}>
          Delete Selected
        </MenuItem>
      </Menu>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            sx={{ color: "green" }}
            onClick={() => setFilterStatus("Approved")}
          >
            ● Approved
          </Button>
          <Button
            sx={{ color: "red" }}
            onClick={() => setFilterStatus("Rejected")}
          >
            ● Rejected
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Work Type Requests" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSelectAll();
                    } else {
                      handleUnselectAll();
                    }
                  }}
                  checked={
                    selectedAllocations.length === shiftRequests.length &&
                    shiftRequests.length > 0
                  }
                />
              </TableCell> */}
              <TableCell>Select</TableCell> 
              <TableCell>Employee</TableCell>
              <TableCell>Requested Work Type</TableCell>
              <TableCell>Previous/Current Work Type</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Requested Till</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Confirmation</TableCell>
              <TableCell>Action</TableCell>
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
                <TableRow
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
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
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
                            emp.id % 2 === 0
                              ? "primary.main"
                              : "secondary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1,
                        }}
                      >
                        {emp.employee?.[0] || "U"}
                      </Box>
                      {emp.employee || "Unknown"}
                    </Box>
                  </TableCell>
                  <TableCell>{emp.requestedShift}</TableCell>
                  <TableCell>{emp.currentShift}</TableCell>
                  <TableCell>{emp.requestedDate}</TableCell>
                  <TableCell>{emp.requestedTill}</TableCell>
                  <TableCell
                    sx={{ color: emp.status === "Approved" ? "green" : "red" }}
                  >
                    {emp.status}
                  </TableCell>
                  <TableCell>{emp.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="success"
                      onClick={() => handleApprove(emp._id)}
                    >
                      ✔
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleReject(emp._id)}
                    >
                      ✖
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(emp)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(emp._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Work Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Employee"
              name="employee"
              fullWidth
              select
              value={formData.employee}
              onChange={handleFormChange}
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
            />
            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={4}
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
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateShift}
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
      >
        <DialogTitle>Edit Work Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {/* Same form fields as Create Dialog */}
            <TextField
              label="Employee"
              name="employee"
              fullWidth
              select
              value={formData.employee}
              onChange={handleFormChange}
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
            />
            <TextField
              label="Requested Till"
              name="requestedTill"
              type="date"
              value={formData.requestedTill}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkTypeRequest;
