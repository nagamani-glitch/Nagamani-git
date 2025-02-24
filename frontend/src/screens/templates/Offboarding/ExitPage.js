import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
} from "@mui/icons-material";

import "./ExitPage.css";

const ExitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  //const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const [offboardingStages, setOffboardingStages] = useState([
    { stageName: "Notice Period", employees: [], expanded: false },
    { stageName: "Exit Interview", employees: [], expanded: false },
    { stageName: "Work Handover", employees: [], expanded: false },
  ]);

  const [newData, setNewData] = useState({
    employeeName: "",
    noticePeriod: "",
    startDate: "",
    endDate: "",
    stage: "Notice Period",
    taskStatus: "0/0",
    description: "",
    manager: "",
    interviewDate: "",
    interviewer: "",
    feedback: "",
    handoverTo: "",
    projectDocuments: "",
    pendingTasks: "",
  });

  const fetchOffboardings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/offboarding");
      const offboardings = response.data;
      const updatedStages = offboardingStages.map((stage) => ({
        ...stage,
        employees: offboardings.filter((emp) => emp.stage === stage.stageName),
      }));
      setOffboardingStages(updatedStages);
    } catch (error) {
      console.error("Error fetching offboardings:", error);
    }
  };

  useEffect(() => {
    fetchOffboardings();
  }, []);

  const handleEditClick = (employee) => {
    setEditMode(true);
    setEditData(employee);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/offboarding/${editData._id}`,
          editData
        );
      } else {
        await axios.post("http://localhost:5000/api/offboarding", newData);
      }
      await fetchOffboardings();
      setCreateOpen(false);
      setEditMode(false);
      setEditData(null);
      setNewData({
        employeeName: "",
        noticePeriod: "",
        startDate: "",
        endDate: "",
        stage: "Notice Period",
        taskStatus: "0/0",
        description: "",
        manager: "",
        interviewDate: "",
        interviewer: "",
        feedback: "",
        handoverTo: "",
        projectDocuments: "",
        pendingTasks: "",
      });
    } catch (error) {
      console.error("Error saving offboarding:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/offboarding/${id}`);
      await fetchOffboardings();
    } catch (error) {
      console.error("Error deleting offboarding:", error);
    }
  };

  const handleExpand = (index) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === index ? { ...stage, expanded: !stage.expanded } : stage
      )
    );
  };

  const filteredStages = offboardingStages.map((stage) => ({
    ...stage,
    employees: stage.employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="home-page">
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "24px 32px",
          marginBottom: "24px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Offboarding
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
            />

            <Button
              onClick={() => {
                setCreateOpen(true);
                setEditMode(false);
                setEditData(null);
              }}
              startIcon={<Add />}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
              variant="contained"
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>

      {createOpen && (
        <Dialog
          open={createOpen}
          onClose={() => {
            setCreateOpen(false);
            setEditMode(false);
            setEditData(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: "700px",
              maxWidth: "90vw",
              borderRadius: "20px",
              overflow: "hidden",
              margin: "16px",
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
              position: "relative",
            }}
          >
            {editMode ? "Edit Offboarding" : "New Offboarding"}
            <IconButton
              onClick={() => {
                setCreateOpen(false);
                setEditMode(false);
                setEditData(null);
              }}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: "32px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <Stack spacing={3} mt={2}>
                <TextField
                  label="Employee Name"
                  value={
                    editMode ? editData.employeeName : newData.employeeName
                  }
                  onChange={(e) =>
                    editMode
                      ? setEditData({
                          ...editData,
                          employeeName: e.target.value,
                        })
                      : setNewData({ ...newData, employeeName: e.target.value })
                  }
                  required
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Stage</InputLabel>
                  <Select
                    value={editMode ? editData.stage : newData.stage}
                    onChange={(e) =>
                      editMode
                        ? setEditData({ ...editData, stage: e.target.value })
                        : setNewData({ ...newData, stage: e.target.value })
                    }
                    required
                    label="Stage"
                  >
                    <MenuItem value="Notice Period">Notice Period</MenuItem>
                    <MenuItem value="Exit Interview">Exit Interview</MenuItem>
                    <MenuItem value="Work Handover">Work Handover</MenuItem>
                  </Select>
                </FormControl>

                {(editMode ? editData.stage : newData.stage) ===
                  "Notice Period" && (
                  <>
                    <TextField
                      label="Notice Period Duration"
                      value={
                        editMode ? editData.noticePeriod : newData.noticePeriod
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              noticePeriod: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              noticePeriod: e.target.value,
                            })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      type="date"
                      label="Start Date"
                      value={
                        editMode
                          ? editData.startDate?.split("T")[0]
                          : newData.startDate
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              startDate: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              startDate: e.target.value,
                            })
                      }
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      type="date"
                      label="End Date"
                      value={
                        editMode
                          ? editData.endDate?.split("T")[0]
                          : newData.endDate
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              endDate: e.target.value,
                            })
                          : setNewData({ ...newData, endDate: e.target.value })
                      }
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </>
                )}

                {(editMode ? editData.stage : newData.stage) ===
                  "Exit Interview" && (
                  <>
                    <TextField
                      label="Notice Period Duration"
                      value={
                        editMode ? editData.noticePeriod : newData.noticePeriod
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              noticePeriod: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              noticePeriod: e.target.value,
                            })
                      }
                      required
                      fullWidth
                    />

                    <TextField
                      type="date"
                      label="Interview Date"
                      value={
                        editMode
                          ? editData.interviewDate?.split("T")[0]
                          : newData.interviewDate
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              interviewDate: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              interviewDate: e.target.value,
                            })
                      }
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Interviewer"
                      value={
                        editMode ? editData.interviewer : newData.interviewer
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              interviewer: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              interviewer: e.target.value,
                            })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Feedback"
                      value={editMode ? editData.feedback : newData.feedback}
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              feedback: e.target.value,
                            })
                          : setNewData({ ...newData, feedback: e.target.value })
                      }
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </>
                )}

                {(editMode ? editData.stage : newData.stage) ===
                  "Work Handover" && (
                  <>
                    <TextField
                      label="Notice Period Duration"
                      value={
                        editMode ? editData.noticePeriod : newData.noticePeriod
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              noticePeriod: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              noticePeriod: e.target.value,
                            })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Handover To"
                      value={
                        editMode ? editData.handoverTo : newData.handoverTo
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              handoverTo: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              handoverTo: e.target.value,
                            })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Project Documents"
                      value={
                        editMode
                          ? editData.projectDocuments
                          : newData.projectDocuments
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              projectDocuments: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              projectDocuments: e.target.value,
                            })
                      }
                      multiline
                      rows={4}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Pending Tasks"
                      value={
                        editMode ? editData.pendingTasks : newData.pendingTasks
                      }
                      onChange={(e) =>
                        editMode
                          ? setEditData({
                              ...editData,
                              pendingTasks: e.target.value,
                            })
                          : setNewData({
                              ...newData,
                              pendingTasks: e.target.value,
                            })
                      }
                      multiline
                      rows={4}
                      required
                      fullWidth
                    />
                  </>
                )}

                <TextField
                  label="Manager"
                  value={editMode ? editData.manager : newData.manager}
                  onChange={(e) =>
                    editMode
                      ? setEditData({ ...editData, manager: e.target.value })
                      : setNewData({ ...newData, manager: e.target.value })
                  }
                  required
                  fullWidth
                />

                <TextField
                  label="Additional Notes"
                  value={editMode ? editData.description : newData.description}
                  onChange={(e) =>
                    editMode
                      ? setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      : setNewData({ ...newData, description: e.target.value })
                  }
                  multiline
                  rows={4}
                  fullWidth
                />

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 4 }}
                >
                  <Button
                    onClick={() => {
                      setCreateOpen(false);
                      setEditMode(false);
                      setEditData(null);
                    }}
                    sx={{
                      border: "2px solid #1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        border: "2px solid #64b5f6",
                        backgroundColor: "#e3f2fd",
                      },
                      borderRadius: "8px",
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    sx={{
                      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      },
                      borderRadius: "8px",
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    {editMode ? "Update" : "Save"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="offboarding-list">
        <Box sx={{ padding: "0 32px" }}>
          {filteredStages.map((stage, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                mb: 3,
              }}
            >
              <Box
                onClick={() => handleExpand(index)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  cursor: "pointer",
                  borderBottom: stage.expanded ? "1px solid #e2e8f0" : "none",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1976d2" }}
                >
                  {stage.stageName}
                </Typography>
                <IconButton size="small">
                  {stage.expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Box>

              {stage.expanded && (
                <Box sx={{ p: 3 }}>
                  {stage.employees.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Employee
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Notice Period
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Start Date
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              End Date
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Task Status
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Manager
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: "#475569" }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stage.employees.map((emp) => (
                            <TableRow
                              key={emp._id}
                              sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                            >
                              <TableCell>{emp.employeeName}</TableCell>
                              <TableCell>{emp.noticePeriod}</TableCell>
                              <TableCell>
                                {new Date(emp.startDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {new Date(emp.endDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{emp.taskStatus}</TableCell>
                              <TableCell>{emp.manager}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <IconButton
                                    onClick={() => handleEditClick(emp)}
                                    size="small"
                                    sx={{
                                      color: "#1976d2",
                                      "&:hover": { backgroundColor: "#e3f2fd" },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDelete(emp._id)}
                                    size="small"
                                    sx={{
                                      color: "#ef4444",
                                      "&:hover": { backgroundColor: "#fee2e2" },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#64748b",
                        py: 4,
                      }}
                    >
                      No employees in this stage.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default ExitPage;
