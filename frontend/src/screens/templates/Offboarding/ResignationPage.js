import React, { useState, useEffect } from "react";
import { FaList, FaTh, FaEnvelope } from "react-icons/fa";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  Stack,
  TextField,
  ButtonGroup,
  IconButton,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Popover,
  Avatar,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Email,
  WorkOutline,
  EmailOutlined,
  Visibility,
} from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";
import { Close } from "@mui/icons-material";

import "./ResignationPage.css";

const ResignationPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/resignations"
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch resignations");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newResignation, setNewResignation] = useState({
    name: "",
    email: "",
    title: "",
    status: "Requested",
    description: "",
  });

  const handleEditClick = (res) => {
    setShowCreatePopup(true);
    setIsEditing(true);
    setCurrentId(res._id);
    setNewResignation({
      name: res.name,
      email: res.email,
      title: res.position,
      status: res.status,
      description: res.description,
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resignations/${id}`);
      await fetchResignations();
    } catch (error) {
      console.error("Error deleting resignation:", error);
      setError("Failed to delete resignation");
    }
  };

  const handleCreateClick = () => {
    setShowCreatePopup(true);
    setIsEditing(false);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setNewResignation((prev) => ({ ...prev, description: content }));
  };

  const handleClosePopup = () => {
    setShowCreatePopup(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: "",
    });
  };

  const handleSendEmail = async (employee) => {
    try {
      await axios.post("http://localhost:5000/api/resignations", {
        name: employee.name,
        email: employee.email,
        position: employee.position,
        status: employee.status,
        description: employee.description,
      });
      alert(`Resignation email sent successfully from ${employee.email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send email");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const applyFilter = (status) => {
    setSelectedStatus(status);
    setFilterOpen(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const resignationData = {
        name: newResignation.name,
        email: newResignation.email,
        position: newResignation.title,
        status: newResignation.status,
        description: newResignation.description,
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/resignations/${currentId}`,
          resignationData
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/resignations",
          resignationData
        );
      }

      await fetchResignations();
      handleClosePopup();
    } catch (error) {
      console.error("Error saving resignation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterOpen(!filterOpen);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterOpen(false);
  };

  const handlePreview = (item) => {
    setPreviewData(item);
    setPreviewOpen(true);
  };

  return (
    <div className="resignation-letters">
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
              // background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              background: "#1976d2",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Resignations
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search by name or email"
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
                startAdornment: (
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
            />

            <ButtonGroup variant="outlined" sx={{ height: "40px" }}>
              <IconButton
                onClick={() => handleViewChange("list")}
                sx={{
                  color: viewMode === "list" ? "#1976d2" : "#64748b",
                  borderColor: "#1976d2",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <FaList />
              </IconButton>
              <IconButton
                onClick={() => handleViewChange("grid")}
                sx={{
                  color: viewMode === "grid" ? "#1976d2" : "#64748b",
                  borderColor: "#1976d2",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <FaTh />
              </IconButton>
            </ButtonGroup>

            <Button
              onClick={toggleFilter}
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
              variant="outlined"
            >
              Filter
            </Button>

            <Button
              onClick={handleCreateClick}
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

      {/*** Filter Popup ***/}

      <Popover
        open={filterOpen}
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
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            Filter Resignations
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Button
              onClick={() => applyFilter("")}
              variant={selectedStatus === "" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              All
            </Button>
            <Button
              onClick={() => applyFilter("Approved")}
              variant={selectedStatus === "Approved" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Approved
            </Button>
            <Button
              onClick={() => applyFilter("Requested")}
              variant={
                selectedStatus === "Requested" ? "contained" : "outlined"
              }
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Requested
            </Button>
            <Button
              onClick={() => applyFilter("Rejected")}
              variant={selectedStatus === "Rejected" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Rejected
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/* Create Resignation Popup */}

      <Dialog
        open={showCreatePopup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "700px",
            maxWidth: "90vw",
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
            position: "relative",
          }}
        >
          {isEditing ? "Edit Resignation" : "Create Resignation"}
          <IconButton
            onClick={handleClosePopup}
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
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={newResignation.name}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={newResignation.email}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Position"
              name="title"
              value={newResignation.title}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={newResignation.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Requested">Requested</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                "& .quill": {
                  height: "200px",
                  marginBottom: "60px", // Add margin to create space for buttons
                },
                "& .ql-container": {
                  minHeight: "150px",
                },
              }}
            >
              <Typography sx={{ mb: 1, color: "#475569" }}>
                Resignation Letter
              </Typography>
              <ReactQuill
                theme="snow"
                value={newResignation.description}
                onChange={handleDescriptionChange}
                modules={modules}
                placeholder="Write your resignation letter..."
              />
            </Box>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{
                mt: 2, // Reduced top margin
                position: "relative",
                zIndex: 1,
              }}
            >
              <Button
                onClick={handleClosePopup}
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

              <LoadingButton
                onClick={handleSave}
                loading={isSaving}
                variant="contained"
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
                {isEditing ? "Update" : "Save"}
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/** List and card view **/}

      {viewMode === "list" ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden",
            margin: "24px 0",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Position
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#475569", py: 2 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f8fafc" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ fontWeight: 550, color: "#d013d1" }}>
                      {item.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailOutlined sx={{ fontSize: 16, color: "#2563eb" }} />
                      <Typography sx={{ color: "#2563eb" }}>
                        {item.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <WorkOutline sx={{ fontSize: 16, color: "#64748b" }} />
                      <Typography sx={{ color: "#64748b" }}>
                        {item.position}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderColor:
                          item.status === "Approved"
                            ? "#22c55e"
                            : item.status === "Rejected"
                            ? "#ef4444"
                            : item.status === "Requested"
                            ? "#f59e0b"
                            : "#e2e8f0",
                        color:
                          item.status === "Approved"
                            ? "#16a34a"
                            : item.status === "Rejected"
                            ? "#dc2626"
                            : item.status === "Requested"
                            ? "#d97706"
                            : "#64748b",
                        backgroundColor:
                          item.status === "Approved"
                            ? "#f0fdf4"
                            : item.status === "Rejected"
                            ? "#fef2f2"
                            : item.status === "Requested"
                            ? "#fefce8"
                            : "#f8fafc",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "300px",
                      "& div": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        color: "#64748b",
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleEditClick(item)}
                        size="small"
                        sx={{
                          color: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handleSendEmail(item)}
                        size="small"
                        sx={{
                          color: "#0ea5e9",
                          "&:hover": {
                            backgroundColor: "#e0f2fe",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Email fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handlePreview(item)}
                        size="small"
                        sx={{
                          color: "#0ea5e9",
                          "&:hover": {
                            backgroundColor: "#e0f2fe",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDeleteClick(item._id)}
                        size="small"
                        sx={{
                          color: "#ef4444",
                          "&:hover": {
                            backgroundColor: "#fee2e2",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
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
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ padding: "24px" }}>
          {filteredData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardHeader
                  sx={{
                    p: 3,
                    pb: 2,
                    "& .MuiCardHeader-title": {
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#d013d1",
                    },
                  }}
                  title={
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#d013d1", fontWeight: 600 }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#2563eb",
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <EmailOutlined sx={{ fontSize: 16 }} />
                        {item.email}
                      </Typography>
                    </Box>
                  }
                  action={
                    <Chip
                      label={item.status}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderColor:
                          item.status === "Approved"
                            ? "#22c55e"
                            : item.status === "Rejected"
                            ? "#ef4444"
                            : item.status === "Requested"
                            ? "#f59e0b"
                            : "#e2e8f0",
                        color:
                          item.status === "Approved"
                            ? "#16a34a"
                            : item.status === "Rejected"
                            ? "#dc2626"
                            : item.status === "Requested"
                            ? "#d97706"
                            : "#64748b",
                        backgroundColor:
                          item.status === "Approved"
                            ? "#f0fdf4"
                            : item.status === "Rejected"
                            ? "#fef2f2"
                            : item.status === "Requested"
                            ? "#fefce8"
                            : "#f8fafc",
                      }}
                    />
                  }
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    pt: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#0f172a",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <WorkOutline sx={{ fontSize: 18, color: "#64748b" }} />
                    {item.position}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      color: "#475569",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      "& > div": {
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      },
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    p: 3,
                    pt: 2,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <Button
                    startIcon={<Email sx={{ fontSize: 18 }} />}
                    onClick={() => handleSendEmail(item)}
                    size="small"
                    sx={{
                      color: "#0ea5e9",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#e0f2fe",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Send Email
                  </Button>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => handleEditClick(item)}
                      size="small"
                      sx={{
                        color: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>

                    <IconButton
                      onClick={() => handlePreview(item)}
                      size="small"
                      sx={{
                        color: "#0ea5e9",
                        "&:hover": {
                          backgroundColor: "#e0f2fe",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(item._id)}
                      size="small"
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          backgroundColor: "#fee2e2",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/**pREVIEW PAGE */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "700px",
            maxWidth: "90vw",
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
            position: "relative",
            marginBottom: 5,
          }}
        >
          Resignation Letter Preview
          <IconButton
            onClick={() => setPreviewOpen(false)}
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
        <DialogContent sx={{ p: 4 }}>
          {previewData && (
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "primary.main",
                    fontSize: "1.5rem",
                  }}
                >
                  {previewData.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#d013d1",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {previewData.name}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailOutlined sx={{ fontSize: 16, color: "#2563eb" }} />
                      <Typography
                        sx={{ color: "#2563eb", fontSize: "0.875rem" }}
                      >
                        {previewData.email}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkOutline sx={{ fontSize: 16, color: "#64748b" }} />
                      <Typography
                        sx={{ color: "#64748b", fontSize: "0.875rem" }}
                      >
                        {previewData.position}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>

              <Chip
                label={previewData.status}
                variant="outlined"
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  fontWeight: 600,
                  borderColor:
                    previewData.status === "Approved"
                      ? "#22c55e"
                      : previewData.status === "Rejected"
                      ? "#ef4444"
                      : previewData.status === "Requested"
                      ? "#f59e0b"
                      : "#e2e8f0",
                  color:
                    previewData.status === "Approved"
                      ? "#16a34a"
                      : previewData.status === "Rejected"
                      ? "#dc2626"
                      : previewData.status === "Requested"
                      ? "#d97706"
                      : "#64748b",
                  backgroundColor:
                    previewData.status === "Approved"
                      ? "#f0fdf4"
                      : previewData.status === "Rejected"
                      ? "#fef2f2"
                      : previewData.status === "Requested"
                      ? "#fefce8"
                      : "#f8fafc",
                }}
              />

              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  "& > div": {
                    color: "#475569",
                    fontSize: "0.875rem",
                    lineHeight: 1.8,
                  },
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: previewData.description }}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default ResignationPage;
