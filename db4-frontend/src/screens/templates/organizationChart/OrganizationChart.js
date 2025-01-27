import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  Snackbar,
  Alert,
  InputLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteIcon from "@mui/icons-material/Delete";

const OrganizationChart = () => {
  const [treeData, setTreeData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    title: "",
    parentId: "",
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchOrganizationChart();
  }, []);

  const fetchOrganizationChart = async () => {
    try {
      const response = await axios.get(`${API_URL}/organization-chart`);
      setTreeData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching organization chart:", error);
      setIsLoading(false);
      setAlert({
        open: true,
        message: "Error loading organization chart",
        severity: "error",
      });
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post(`${API_URL}/positions`, {
        name: newEmployee.name,
        title: newEmployee.title,
        parentId: newEmployee.parentId,
      });

      await fetchOrganizationChart();
      setIsDialogOpen(false);
      setNewEmployee({ name: "", title: "", parentId: "" });
      setAlert({
        open: true,
        message: "Position added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding position:", error);
      setAlert({
        open: true,
        message: "Error adding position",
        severity: "error",
      });
    }
  };

  const handleUpdatePosition = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/positions/${id}`, updatedData);
      await fetchOrganizationChart();
      setAlert({
        open: true,
        message: "Position updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating position:", error);
      setAlert({
        open: true,
        message: "Error updating position",
        severity: "error",
      });
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await axios.delete(`${API_URL}/positions/${id}`);
      await fetchOrganizationChart();
      setAlert({
        open: true,
        message: "Position deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting position:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Error deleting position",
        severity: "error",
      });
    }
  };

  const getAllNodes = (node, nodes = []) => {
    if (!node) return nodes;
    nodes.push({ _id: node._id, name: node.name, title: node.title });
    if (node.children) {
      node.children.forEach((child) => getAllNodes(child, nodes));
    }
    return nodes;
  };

  const renderTreeNode = (node, level = 0) => {
    if (!node) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: level * 0.2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, 
              ${
                level === 0
                  ? "rgba(33, 150, 243, 0.95)"
                  : "rgba(25, 118, 210, 0.95)"
              } 0%,
              ${
                level === 0
                  ? "rgba(30, 136, 229, 0.90)"
                  : "rgba(30, 136, 229, 0.90)"
              } 100%)`,
            padding: "24px",
            borderRadius: "16px",
            color: "white",
            minWidth: "280px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {node.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {node.title}
          </Typography>
          {level !== 0 && (
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() =>
                  handleUpdatePosition(node._id, {
                    name: node.name,
                    title: node.title,
                  })
                }
                sx={{ color: "white" }}
              >
                <BusinessIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeletePosition(node._id)}
                sx={{ color: "white" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {node.children && node.children.length > 0 && (
          <>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "50px" }}
              transition={{ duration: 0.4 }}
              style={{
                width: "3px",
                background:
                  "linear-gradient(to bottom, #1976d2 30%, rgba(25, 118, 210, 0.2))",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                display: "flex",
                gap: "40px",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "5%",
                  width: "90%",
                  height: "3px",
                  background:
                    "linear-gradient(to right, rgba(25, 118, 210, 0.2), #1976d2, rgba(25, 118, 210, 0.2))",
                  zIndex: 1,
                },
              }}
            >
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </Box>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AccountTreeIcon sx={{ fontSize: 40 }} />
            Organization Chart
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsDialogOpen(true)}
            startIcon={<PersonAddIcon />}
            sx={{
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
              padding: "12px 24px",
            }}
          >
            Add Position
          </Button>
        </Box>
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Typography>Loading organization chart...</Typography>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                border: "2px solid rgba(25, 118, 210, 0.3)",
                borderRadius: "20px",
                padding: "60px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 12px 40px rgba(25, 118, 210, 0.1)",
                overflowX: "auto",
                position: "relative",
                backgroundImage: `
                linear-gradient(rgba(25, 118, 210, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(25, 118, 210, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "20px 20px",
                backgroundPosition: "-1px -1px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.5)",
                  zIndex: 0,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                  minWidth: "fit-content",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {treeData && renderTreeNode(treeData)}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
            color: "white",
          }}
        >
          Add New Position
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Title"
              value={newEmployee.title}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, title: e.target.value })
              }
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Select Manager</InputLabel>
              <Select
                value={newEmployee.parentId}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, parentId: e.target.value })
                }
                label="Select Manager"
              >
                {treeData &&
                  getAllNodes(treeData).map((node) => (
                    <MenuItem key={node._id} value={node._id}>
                      {node.name} - {node.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddEmployee}
            variant="contained"
            disabled={
              !newEmployee.name || !newEmployee.title || !newEmployee.parentId
            }
          >
            Add Position
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrganizationChart;
