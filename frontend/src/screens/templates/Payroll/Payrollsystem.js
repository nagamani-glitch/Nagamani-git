import React, { useState } from "react";
import { 
  AppBar, Tabs, Tab, Box, Typography, Container, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, Select, MenuItem, IconButton, 
  Stack, Divider, Chip, Tooltip 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './Payrollsystem.css';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box className="tab-panel-container">
          {children}
        </Box>
      )}
    </div>
  );
};

const PayrollSystem = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [allowanceData, setAllowanceData] = useState([
    { 
      id: 1, 
      name: "Housing Allowance", 
      amount: "$500", 
      taxable: "Yes", 
      fixed: "No", 
      description: "Monthly housing benefit", 
      category: "Regular",
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Transport Allowance", 
      amount: "$200", 
      taxable: "No", 
      fixed: "Yes", 
      description: "Monthly transport benefit", 
      category: "Travel",
      status: "Active" 
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newAllowance, setNewAllowance] = useState({ 
    name: "", 
    amount: "", 
    taxable: "No", 
    fixed: "No",
    description: "",
    category: "Regular",
    status: "Active"
  });

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleAddAllowance = () => {
    setAllowanceData([...allowanceData, { id: allowanceData.length + 1, ...newAllowance }]);
    setOpenDialog(false);
    setNewAllowance({ 
      name: "", 
      amount: "", 
      taxable: "No", 
      fixed: "No", 
      description: "", 
      category: "Regular",
      status: "Active" 
    });
  };

  const handleDeleteAllowance = (id) => {
    setAllowanceData(allowanceData.filter(item => item.id !== id));
  };

  return (
    <Container className="payroll-container">
      <Paper className="main-paper">
        <AppBar position="static" className="payroll-appbar">
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth"
            className="payroll-tabs"
          >
            <Tab label="Allowance" icon={<AddCircleIcon />} iconPosition="start" className="tab-item" />
            <Tab label="Deductions" icon={<AttachMoneyIcon />} iconPosition="start" className="tab-item" />
            <Tab label="Payslips" icon={<DescriptionIcon />} iconPosition="start" className="tab-item" />
            <Tab label="Contracts" className="tab-item" />
            <Tab label="Federal Tax" className="tab-item" />
          </Tabs>
        </AppBar>

        <TabPanel value={tabIndex} index={0}>
          <Box className="header-container">
            <Typography variant="h5" className="section-title">
              Allowance Management
              <span className="title-badge">{allowanceData.length} Total</span>
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setOpenDialog(true)}
              startIcon={<AddCircleIcon />}
              className="create-button"
            >
              Create Allowance
            </Button>
          </Box>
          
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Taxable</TableCell>
                  <TableCell>Fixed</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allowanceData.map(item => (
                  <TableRow key={item.id} className="table-row">
                    <TableCell className="name-cell">{item.name}</TableCell>
                    <TableCell className="amount-cell">{item.amount}</TableCell>
                    <TableCell>
                      <Chip label={item.category} className={`category-chip ${item.category.toLowerCase()}`} />
                    </TableCell>
                    <TableCell>
                      <Chip label={item.status} className={`status-chip ${item.status.toLowerCase()}`} />
                    </TableCell>
                    <TableCell>{item.taxable}</TableCell>
                    <TableCell>{item.fixed}</TableCell>
                    <TableCell className="description-cell">{item.description}</TableCell>
                    <TableCell className="action-cell">
                      <Tooltip title="Edit">
                        <IconButton className="edit-button">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          className="delete-button"
                          onClick={() => handleDeleteAllowance(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          className="allowance-dialog"
        >
          <DialogTitle className="dialog-title">
            Create New Allowance
          </DialogTitle>
          <Divider />
          <DialogContent className="dialog-content">
            <TextField 
              label="Name" 
              fullWidth 
              className="dialog-field"
              value={newAllowance.name} 
              onChange={(e) => setNewAllowance({ ...newAllowance, name: e.target.value })}
            />
            <TextField 
              label="Amount" 
              fullWidth 
              className="dialog-field"
              value={newAllowance.amount}
              onChange={(e) => setNewAllowance({ ...newAllowance, amount: e.target.value })}
            />
            <Select
              fullWidth
              value={newAllowance.category}
              onChange={(e) => setNewAllowance({ ...newAllowance, category: e.target.value })}
              className="dialog-field"
              label="Category"
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Travel">Travel</MenuItem>
              <MenuItem value="Special">Special</MenuItem>
              <MenuItem value="Bonus">Bonus</MenuItem>
            </Select>
            <Select
              fullWidth
              value={newAllowance.status}
              onChange={(e) => setNewAllowance({ ...newAllowance, status: e.target.value })}
              className="dialog-field"
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <Select
              fullWidth
              value={newAllowance.taxable}
              onChange={(e) => setNewAllowance({ ...newAllowance, taxable: e.target.value })}
              className="dialog-field"
              label="Taxable"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            <Select
              fullWidth
              value={newAllowance.fixed}
              onChange={(e) => setNewAllowance({ ...newAllowance, fixed: e.target.value })}
              className="dialog-field"
              label="Fixed"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            <TextField 
              label="Description" 
              fullWidth 
              multiline
              rows={3}
              className="dialog-field"
              value={newAllowance.description}
              onChange={(e) => setNewAllowance({ ...newAllowance, description: e.target.value })}
            />
          </DialogContent>
          <Divider />
          <DialogActions className="dialog-actions">
            <Button 
              onClick={() => setOpenDialog(false)} 
              color="error" 
              variant="outlined"
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddAllowance} 
              color="primary" 
              variant="contained"
              className="submit-button"
            >
              Add Allowance
            </Button>
          </DialogActions>
        </Dialog>

        {[1, 2, 3, 4].map((index) => (
          <TabPanel value={tabIndex} index={index} key={index}>
            <Typography variant="h5" className="section-title">
              {['Deductions', 'Payslips', 'Contracts', 'Federal Tax'][index - 1]}
            </Typography>
            <Paper className="coming-soon-paper">
              <Typography variant="h6" className="coming-soon-text">
                Feature coming soon...
              </Typography>
            </Paper>
          </TabPanel>
        ))}
      </Paper>
    </Container>
  );
};

export default PayrollSystem;
