import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Search,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

const API_URL = 'http://localhost:5000/api/rotating-worktype/shifts';

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

const RotatingWorktypeAssign = () => {
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
  useEffect(() => {
    loadWorktypeRequests();
  }, [tabValue]);

  const loadWorktypeRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { isAllocated: tabValue === 1 }
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

  const handleActionsClick = (event) => setAnchorEl(event.currentTarget);

  const handleRowClick = (id) => {
    const newSelected = selectedAllocations.includes(id)
      ? selectedAllocations.filter(item => item !== id)
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
        isAllocated: tabValue === 1 
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
        isAllocated: tabValue === 1 
      });
      await loadWorktypeRequests();
      setSelectedAllocations([]);
      setShowSelectionButtons(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error bulk rejecting worktypes:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedAllocations.map(id => 
        axios.delete(`${API_URL}/${id}`)
      ));
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
      const selectedEmployee = employees.find(emp => emp.name === formData.employee);
      const worktypeData = {
        name: formData.employee,
        employeeCode: selectedEmployee?.employeeCode,
        requestedWorktype: formData.requestWorktype,
        currentWorktype: "Regular",
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isPermanentRequest,
        isAllocated: tabValue === 1
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
      requestedDate: new Date(worktype.requestedDate).toISOString().split('T')[0],
      requestedTill: new Date(worktype.requestedTill).toISOString().split('T')[0],
      description: worktype.description,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const selectedEmployee = employees.find(emp => emp.name === formData.employee);
      const updatedData = {
        name: formData.employee,
        employeeCode: selectedEmployee?.employeeCode,
        requestedWorktype: formData.requestWorktype,
        requestedDate: formData.requestedDate,
        requestedTill: formData.requestedTill,
        description: formData.description,
        isAllocated: tabValue === 1
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
    <Box>
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {tabValue === 0 ? "Rotating Work Type Requests" : "Allocated Worktypes"}
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
            <Button 
              variant="outlined" 
              onClick={handleActionsClick}
              disabled={!selectedAllocations.length}
            >
              Actions
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="error"
              onClick={() => setCreateDialogOpen(true)}
            >
              Create {tabValue === 0 ? "Request" : "Allocation"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: "green", borderColor: "green" }}
            onClick={handleSelectAll}
          >
            Select All {tabValue === 0 ? "Requests" : "Allocations"}
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
        <MenuItem onClick={handleBulkDelete}>Delete Selected</MenuItem>
      </Menu>

      <Box sx={{ display: "flex", gap: 2, mb: 2, ml: 4 }}>
        <Button sx={{ color: "green" }} onClick={() => setFilterStatus("Approved")}>
          ● Approved
        </Button>
        <Button sx={{ color: "red" }} onClick={() => setFilterStatus("Rejected")}>
          ● Rejected
        </Button>
        <Button sx={{ color: "orange" }} onClick={() => setFilterStatus("Pending")}>
          ● Pending
        </Button>
        <Button sx={{ color: "gray" }} onClick={() => setFilterStatus("all")}>
          ● All
        </Button>
      </Box>

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
        sx={{ ml: 4 }}
      >
        <Tab label="Work Type Requests" />
        <Tab label="Allocated Worktypes" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", mx: 4 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) handleSelectAll();
                    else handleUnselectAll();
                  }}
                  checked={
                    selectedAllocations.length === (tabValue === 0 ? worktypeRequests.length : allocatedWorktypes.length) &&
                    (tabValue === 0 ? worktypeRequests.length > 0 : allocatedWorktypes.length > 0)
                  }
                />
              </TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Requested Work Type</TableCell>
              <TableCell>Current Work Type</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Requested Till</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Confirmation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 0 ? worktypeRequests : allocatedWorktypes)
              .filter((request) => {
                const employeeName = request?.name || "";
                return employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (filterStatus === "all" || request.status === filterStatus);
              })
              .map((request) => (
                <TableRow
                  key={request._id}
                  hover
                  onClick={() => handleRowClick(request._id)}
                  selected={selectedAllocations.includes(request._id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllocations.includes(request._id)}
                      onChange={() => handleRowClick(request._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: request._id % 2 === 0 ? "primary.main" : "secondary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1,
                        }}
                      >
                        {request.name?.[0] || "U"}
                      </Box>
                      {request.name} ({request.employeeCode})
                    </Box>
                  </TableCell>
                  <TableCell>{request.requestedWorktype}</TableCell>
                  <TableCell>{request.currentWorktype}</TableCell>
                  <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.requestedTill).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: request.status === "Approved" ? "green" : request.status === "Rejected" ? "red" : "orange" }}>
                    {request.status}
                  </TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="success" 
                      onClick={(e) => handleApprove(request._id, e)}
                      disabled={request.status === "Approved"}
                    >
                      ✔
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={(e) => handleReject(request._id, e)}
                      disabled={request.status === "Rejected"}
                    >
                      ✖
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={(e) => handleEdit(request, e)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={(e) => handleDelete(request._id, e)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {tabValue === 0 ? "Create Worktype Request" : "Create Allocated Worktype"}
        </DialogTitle>
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
                  {emp.name} ({emp.employeeCode})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Request Work Type"
              name="requestWorktype"
              value={formData.requestWorktype}
              onChange={handleFormChange}
              fullWidth
              select
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
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
            {tabValue === 0 && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isPermanentRequest}
                    onChange={(e) => setIsPermanentRequest(e.target.checked)}
                  />
                }
                label="Permanent Request"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateWorktype}
            disabled={!formData.employee || !formData.requestWorktype || !formData.requestedDate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {tabValue === 0 ? "Edit Worktype Request" : "Edit Allocated Worktype"}
        </DialogTitle>
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
                  {emp.name} ({emp.employeeCode})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Request Work Type"
              name="requestWorktype"
              value={formData.requestWorktype}
              onChange={handleFormChange}
              fullWidth
              select
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
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
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveEdit}
            disabled={!formData.employee || !formData.requestWorktype || !formData.requestedDate}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RotatingWorktypeAssign;
