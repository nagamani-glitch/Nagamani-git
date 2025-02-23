import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import { Edit, Delete, Search, FilterList, Add } from "@mui/icons-material";
import Popover from "@mui/material/Popover";

import "./Objectives.css";

const API_URL = "http://localhost:5000/api/objectives";

const Objectives = () => {
  const [objectives, setObjectives] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    managers: "",
    assignees: "",
    keyResults: "",
    duration: "",
    archived: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentObjective, setCurrentObjective] = useState(null);
  const [showArchivedTable, setShowArchivedTable] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Add this inside your component, after the existing state declarations
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  //  filter button click handler
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setIsFilterModalOpen(true);
  };

  // Add this new filter close handler
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    loadObjectives();
  }, [selectedTab, searchTerm]);

  const loadObjectives = async () => {
    try {
      const params = {
        searchTerm,
        objectiveType: selectedTab !== "all" ? selectedTab : undefined,
      };
      const response = await axios.get(API_URL, { params });
      setObjectives(response.data);
    } catch (error) {
      console.error("Error loading objectives:", error);
    }
  };

  const filteredObjectives = objectives.filter((obj) => {
    return (
      (selectedTab === "all" ? true : obj.objectiveType === selectedTab) &&
      (searchTerm === "" ||
        obj.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter.managers === "" || obj.managers.toString() === filter.managers) &&
      (filter.assignees === "" ||
        obj.assignees.toString() === filter.assignees) &&
      (filter.keyResults === "" ||
        obj.keyResults.toString() === filter.keyResults) &&
      (filter.duration === "" || obj.duration.includes(filter.duration)) &&
      (filter.archived === "" || obj.archived.toString() === filter.archived)
    );
  });

  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const applyFilter = () => {
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilter({
      managers: "",
      assignees: "",
      keyResults: "",
      duration: "",
      archived: "",
    });
    setIsFilterModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setObjectives(objectives.filter((obj) => obj._id !== id));
      } catch (error) {
        console.error("Error deleting objective:", error);
      }
    }
  };

  const handleArchive = async (id) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/archive`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setObjectives((prevObjectives) =>
        prevObjectives.map((obj) => (obj._id === id ? response.data : obj))
      );
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleAdd = () => {
    const newObjective = {
      title: "",
      managers: "",
      keyResults: "",
      assignees: "",
      duration: "0 Days",
      description: "",
      archived: false,
      objectiveType: "all",
    };
    setCurrentObjective(newObjective);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data according to the schema
      const objectiveData = {
        title: currentObjective.title,
        managers: Number(currentObjective.managers) || 0,
        keyResults: Number(currentObjective.keyResults) || 0,
        assignees: Number(currentObjective.assignees) || 0,
        duration: currentObjective.duration,
        description: currentObjective.description,
        objectiveType: currentObjective.objectiveType || "all",
        archived: false,
      };

      const response = await axios.post(API_URL, objectiveData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setObjectives([...objectives, response.data]);
      setIsCreateModalOpen(false);
      setCurrentObjective(null);
      setSelectedTab(response.data.objectiveType);
    } catch (error) {
      console.error("Error creating objective:", error);
    }
  };

  const handleEdit = (objective) => {
    setCurrentObjective({ ...objective });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/${currentObjective._id}`,
        currentObjective
      );
      setObjectives(
        objectives.map((obj) =>
          obj._id === currentObjective._id ? response.data : obj
        )
      );
      setIsEditModalOpen(false);
      setCurrentObjective(null);
    } catch (error) {
      console.error("Error updating objective:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObjective((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="objectives">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px 32px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Objectives
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <TextField
            placeholder="Search objectives..."
            value={searchTerm}
            onChange={handleSearch}
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
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
            }}
          />

          {/* <Button
            variant="outlined"
            onClick={() => setIsFilterModalOpen(true)}
            startIcon={<FilterList />}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
              textTransform: "none",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Filter
          </Button> */}
          <Button
            variant="outlined"
            onClick={handleFilterClick}
            startIcon={<FilterList />}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
              textTransform: "none",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Filter
          </Button>

          <Button
            variant="contained"
            onClick={handleAdd}
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
          >
            Create
          </Button>
        </Box>
      </Box>

      {/*** Create Modal ***/}

      {isCreateModalOpen && (
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
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
              zIndex: 1,
              position: "relative",
              marginBottom: "0",
              marginTop: "0",
            }}
          >
            Create New Objective
          </DialogTitle>

          <DialogContent
            sx={{
              padding: "32px",
              backgroundColor: "f8fafc",
              marginTop: "20px",
            }}
          >
            <form onSubmit={handleCreateSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 2,
                }}
              >
                <TextField
                  name="title"
                  label="Title"
                  value={currentObjective.title}
                  onChange={handleInputChange}
                  required
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

                <TextField
                  name="duration"
                  label="Duration"
                  value={currentObjective.duration}
                  onChange={handleInputChange}
                  required
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

                <TextField
                  name="managers"
                  label="Managers"
                  value={currentObjective.managers}
                  onChange={handleInputChange}
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

                <TextField
                  name="keyResults"
                  label="Key Results"
                  value={currentObjective.keyResults}
                  onChange={handleInputChange}
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

                <FormControl fullWidth>
                  <InputLabel>Objective Type</InputLabel>
                  <Select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                    required
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="self">Self Objective</MenuItem>
                    <MenuItem value="all">All Objective</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  name="description"
                  label="Description"
                  value={currentObjective.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  mt: 4,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => setIsCreateModalOpen(false)}
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
                  type="submit"
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  Create
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/*** Edit Modal ***/}

      {isEditModalOpen && (
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditDialogOpen(false)}
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
              zIndex: 1,
              position: "relative",
              marginBottom: "0",
              marginTop: "100",
            }}
          >
            Edit Objective
          </DialogTitle>

          <DialogContent
            sx={{
              padding: "32px",
              backgroundColor: "#f8fafc",
              marginTop: "20px",
            }}
          >
            <form onSubmit={handleEditSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 2,
                }}
              >
                <TextField
                  name="title"
                  label="Title"
                  value={currentObjective.title}
                  onChange={handleInputChange}
                  required
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

                <TextField
                  name="duration"
                  label="Duration"
                  value={currentObjective.duration}
                  onChange={handleInputChange}
                  required
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

                <TextField
                  name="managers"
                  label="Managers"
                  value={currentObjective.managers}
                  onChange={handleInputChange}
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

                <TextField
                  name="keyResults"
                  label="Key Results"
                  value={currentObjective.keyResults}
                  onChange={handleInputChange}
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

                <FormControl fullWidth>
                  <InputLabel>Objective Type</InputLabel>
                  <Select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                    required
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <MenuItem value="self">Self Objective</MenuItem>
                    <MenuItem value="all">All Objective</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  name="description"
                  label="Description"
                  value={currentObjective.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  mt: 4,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => setIsEditModalOpen(false)}
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
                  type="submit"
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="tabs">
        <button
          className={selectedTab === "self" ? "active" : ""}
          onClick={() => setSelectedTab("self")}
        >
          Self Objective
        </button>
        <button
          className={selectedTab === "all" ? "active" : ""}
          onClick={() => setSelectedTab("all")}
        >
          All Objective
        </button>
        <button onClick={() => setShowArchivedTable(!showArchivedTable)}>
          {showArchivedTable ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
          margin: "24px 32px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8fafc",
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Title
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Managers
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Key Results
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Assignees
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Duration
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredObjectives
              .filter((obj) => !obj.archived)
              .map((obj) => (
                <tr
                  key={obj._id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <td style={{ padding: "16px" }}>{obj.title}</td>
                  <td style={{ padding: "16px" }}>{obj.managers} Managers</td>
                  <td style={{ padding: "16px" }}>
                    {obj.keyResults} Key results
                  </td>
                  <td style={{ padding: "16px" }}>{obj.assignees} Assignees</td>
                  <td style={{ padding: "16px" }}>{obj.duration}</td>
                  <td style={{ padding: "16px" }}>{obj.description}</td>
                  <td style={{ padding: "16px" }}>{obj.objectiveType}</td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(obj)}
                          size="small"
                          sx={{
                            backgroundColor: "info.lighter",
                            "&:hover": { backgroundColor: "info.light" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <button onClick={() => handleArchive(obj._id)}>📥</button>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(obj._id)}
                          size="small"
                          sx={{
                            backgroundColor: "error.lighter",
                            "&:hover": { backgroundColor: "error.light" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Box>

      {/* Archive tABLE */}

      {showArchivedTable && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden",
            margin: "24px 32px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              padding: "16px 24px",
              fontWeight: 600,
            }}
          >
            Archived Objectives
          </Typography>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Managers
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Key Results
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Assignees
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Duration
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {objectives
                .filter((obj) => obj.archived)
                .map((obj) => (
                  <tr
                    key={obj._id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <td style={{ padding: "16px" }}>{obj.title}</td>
                    <td style={{ padding: "16px" }}>{obj.managers} Managers</td>
                    <td style={{ padding: "16px" }}>
                      {obj.keyResults} Key results
                    </td>
                    <td style={{ padding: "16px" }}>
                      {obj.assignees} Assignees
                    </td>
                    <td style={{ padding: "16px" }}>{obj.duration}</td>
                    <td style={{ padding: "16px" }}>{obj.description}</td>
                    <td style={{ padding: "16px" }}>{obj.objectiveType}</td>
                    <td style={{ padding: "16px" }}>
                      <Box sx={{ display: "flex", gap: "8px" }}>
                        <Tooltip title="Unarchive">
                          <IconButton
                            onClick={() => handleArchive(obj._id)}
                            size="small"
                            sx={{
                              backgroundColor: "info.lighter",
                              "&:hover": { backgroundColor: "info.light" },
                            }}
                          >
                            {/* <FilterList fontSize="small" /> */}
                            <button onClick={() => handleArchive(obj._id)}>
                              🔄
                            </button>
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(obj._id)}
                            size="small"
                            sx={{
                              backgroundColor: "error.lighter",
                              "&:hover": { backgroundColor: "error.light" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      )}

      {isFilterModalOpen && (
        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: "400px",
              borderRadius: "16px",
              mt: 1,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filter Objectives
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Select
                value={filter.managers}
                onChange={(e) => handleFilterChange("managers", e.target.value)}
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Managers"}
              >
                <MenuItem value="">All Managers</MenuItem>
                <MenuItem value="1">1 Manager</MenuItem>
                <MenuItem value="2">2 Managers</MenuItem>
                <MenuItem value="3">3 Managers</MenuItem>
              </Select>

              <Select
                value={filter.assignees}
                onChange={(e) =>
                  handleFilterChange("assignees", e.target.value)
                }
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Assignees"}
              >
                <MenuItem value="">All Assignees</MenuItem>
                <MenuItem value="1">1 Assignee</MenuItem>
                <MenuItem value="2">2 Assignees</MenuItem>
                <MenuItem value="3">3 Assignees</MenuItem>
              </Select>

              <Select
                value={filter.keyResults}
                onChange={(e) =>
                  handleFilterChange("keyResults", e.target.value)
                }
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Key Results"}
              >
                <MenuItem value="">All Results</MenuItem>
                <MenuItem value="1">1 Result</MenuItem>
                <MenuItem value="2">2 Results</MenuItem>
                <MenuItem value="3">3 Results</MenuItem>
              </Select>

              <Select
                value={filter.archived}
                onChange={(e) => handleFilterChange("archived", e.target.value)}
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Archive Status"}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="true">Archived</MenuItem>
                <MenuItem value="false">Not Archived</MenuItem>
              </Select>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                fullWidth
                onClick={resetFilter}
                sx={{
                  border: "2px solid #1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    border: "2px solid #64b5f6",
                    backgroundColor: "#e3f2fd",
                  },
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Clear All
              </Button>

              <Button
                fullWidth
                onClick={applyFilter}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Box>
        </Popover>
      )}
    </div>
  );
};

export default Objectives;
