import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const Interview = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [candidate, setCandidate] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter]);

  const fetchInterviews = () => {
    const url = "http://localhost:5000/api/interviews";
    axios
      .get(url)
      .then((response) => {
        let filteredData = response.data;
        if (statusFilter !== "All") {
          filteredData = response.data.filter(
            (item) => item.status === statusFilter
          );
        }
        setData(filteredData);
      })
      .catch((error) => console.error("Error fetching interviews:", error));
  };

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditMode(true);
      setSelectedRow(row);
      setCandidate(row.candidate);
      setInterviewer(row.interviewer);
      setDate(row.date);
      setTime(row.time);
      setDescription(row.description);
      setStatus(row.status);
    } else {
      setEditMode(false);
      setCandidate("");
      setInterviewer("");
      setDate("");
      setTime("");
      setDescription("");
      setStatus("");
    }
    setOpenDialog(true);
  };
  const handleSave = () => {
    const interviewData = {
      candidate,
      interviewer,
      date,
      time,
      description,
      status: status || "Scheduled",
    };
    if (editMode && selectedRow) {
      axios
        .put(
          `http://localhost:5000/api/interviews/${selectedRow._id}`,
          interviewData
        )
        .then((response) => {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === selectedRow._id ? response.data : item
            )
          );
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error updating interview:", error));
    } else {
      axios
        .post("http://localhost:5000/api/interviews", interviewData)
        .then((response) => {
          setData([...data, response.data]);
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error adding interview:", error));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/interviews/${id}`)
      .then(() => setData(data.filter((item) => item._id !== id)))
      .catch((error) => console.error("Error deleting interview:", error));
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f8f9fa",
        borderRadius: 2,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography

        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#1a237e",
          marginBottom: 4,
          borderBottom: "2px solid #1a237e",

          paddingBottom: 2,
        }}
      >
        Interview Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <TextField
          label="Search Candidate"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px" }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{ height: "56px" }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: "#1a237e",
              "&:hover": { backgroundColor: "#0d47a1" },
              height: "56px",
            }}
          >
            Add Interview
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: "0 0 5px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Candidate
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Interviewer
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{ color: "#000000", fontWeight: "bold", fontSize: "16px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .filter((item) =>
                item.candidate.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{row.candidate}</TableCell>
                  <TableCell>{row.interviewer}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor:
                          row.status === "Completed"
                            ? "#e8f5e9"
                            : row.status === "Scheduled"
                            ? "#e3f2fd"
                            : "#ffebee",
                        color:
                          row.status === "Completed"
                            ? "#2e7d32"
                            : row.status === "Scheduled"
                            ? "#1565c0"
                            : "#c62828",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "medium",
                      }}
                    >
                      {row.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog(row)}
                      sx={{ color: "#1a237e" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row._id)}
                      sx={{ color: "#c62828" }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Pagination
          count={Math.ceil(data.length / 10)}
          color="primary"
          sx={{ "& .MuiPaginationItem-root": { fontSize: "1.1rem" } }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1a237e", color: "white" }}>
          {editMode ? "Edit Interview" : "Add Interview"}
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <TextField
            label="Candidate"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2.5 }}
          />
          <TextField
            label="Interviewer"
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#fff",
            backgroundColor: "#1a237e",

          }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#1a237e",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interview;
