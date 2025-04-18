import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../api/holidays";
import {
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Add,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search,
  Event as EventIcon,
  Close,
} from "@mui/icons-material";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Holiday name is required")
    .min(3, "Name must be at least 3 characters"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .test(
      "duration",
      "Holiday duration must not exceed 14 days",
      function (endDate) {
        const startDate = this.parent.startDate;
        if (!startDate || !endDate) return true;
        const duration =
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        return duration <= 14;
      }
    ),
  recurring: Yup.boolean(),
});

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const holidaysRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Add delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadHolidays();
  }, []);

  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidays();
      setHolidays(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formattedValues = {
      ...values,
      name: toSentenceCase(values.name),
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday._id, formattedValues);
        showSnackbar("Holiday updated successfully");
      } else {
        await createHoliday(formattedValues);
        showSnackbar("Holiday created successfully");
      }
      await loadHolidays(); // Refresh the list
      setShowModal(false);
      resetForm();
      setEditingHoliday(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save holiday");
      showSnackbar("Failed to save holiday", "error");
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setShowModal(true);
  };

  // Replace direct delete with confirmation dialog
  const handleDeleteClick = (holiday) => {
    setHolidayToDelete(holiday);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setHolidayToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!holidayToDelete) return;
    
    try {
      setLoading(true);
      await deleteHoliday(holidayToDelete._id);
      await loadHolidays();
      showSnackbar("Holiday deleted successfully");
    } catch (err) {
      setError("Failed to delete holiday");
      showSnackbar("Failed to delete holiday", "error");
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: isMobile ? 1 : 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Paper
        elevation={3}
        sx={{ p: isMobile ? 2 : 3, borderRadius: 2, backgroundColor: "#ffffff" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: isMobile ? "16px" : isTablet ? "20px 24px" : "24px 32px",
            marginBottom: "24px",
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={isMobile ? 2 : 0}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 600,
                background: "#1976d2",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: isMobile ? 1 : 0,
              }}
            >
              Holidays Management
            </Typography>

            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={isMobile ? 1 : 2} 
              alignItems={isMobile ? "stretch" : "center"}
              width={isMobile ? "100%" : "auto"}
            >
              <TextField
                placeholder="Search holidays..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                size="small"
                fullWidth={isMobile}
                sx={{
                  width: isMobile ? "100%" : isTablet ? "200px" : "300px",
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
                  setEditingHoliday(null);
                  setShowModal(true);
                }}
                startIcon={<Add />}
                fullWidth={isMobile}
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
                Add Holiday
              </Button>
            </Stack>
          </Stack>
        </Box>

        {loading && (
          <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={isMobile ? 2 : 3} ref={holidaysRef}>
          {holidays
            .filter((holiday) =>
              holiday.name.toLowerCase().includes(filterQuery.toLowerCase())
            )
            .map((holiday) => (
              <Grid item xs={12} sm={6} md={4} key={holiday._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      "&:hover": { boxShadow: 6 },
                      transition: "box-shadow 0.3s",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <EventIcon sx={{ mr: 1, color: "#3b82f6" }} />
                        <Typography 
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{ 
                            wordBreak: "break-word",
                            overflowWrap: "break-word"
                          }}
                        >
                          {holiday.name}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "text.secondary" }}
                      >
                        Start:{" "}
                        {new Date(holiday.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "text.secondary" }}
                      >
                        End: {new Date(holiday.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "text.secondary" }}
                      >
                        Recurring: {holiday.recurring ? "Yes" : "No"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          onClick={() => handleEdit(holiday)}
                          sx={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            "&:hover": { backgroundColor: "#2563eb" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(holiday)}
                          sx={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            "&:hover": { backgroundColor: "#dc2626" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
        </Grid>

        {/* Add Holiday Dialog */}
        <Dialog
          open={showModal}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              width: isMobile ? "100%" : isTablet ? "600px" : "700px",
              maxWidth: "90vw",
              borderRadius: isMobile ? "0" : "20px",
              overflow: "hidden",
              margin: isMobile ? 0 : undefined,
              height: isMobile ? "100%" : undefined,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              fontWeight: 600,
              padding: isMobile ? "16px 20px" : "24px 32px",
              position: "relative",
            }}
          >
            {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
            <IconButton
              onClick={() => setShowModal(false)}
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

          <DialogContent sx={{ padding: isMobile ? "20px" : "32px" }}>
            <Formik
              initialValues={
                editingHoliday || {
                  name: "",
                  startDate: "",
                  endDate: "",
                  recurring: false,
                }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    <Field name="name">
                      {({ field, meta }) => (
                        <Box>
                          <TextField
                            {...field}
                            fullWidth
                            label="Holiday Name"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Field>

                    <Field name="startDate">
                      {({ field, meta }) => (
                        <Box>
                          <TextField
                            {...field}
                            fullWidth
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Field>

                    <Field name="endDate">
                      {({ field, meta }) => (
                        <Box>
                          <TextField
                            {...field}
                            fullWidth
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Field>

                    <Stack
                      direction={isMobile ? "column" : "row"}
                      spacing={2}
                      justifyContent={isMobile ? "stretch" : "flex-end"}
                      sx={{ mt: 4 }}
                    >
                      <Button
                        onClick={() => setShowModal(false)}
                        fullWidth={isMobile}
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
                          order: isMobile ? 1 : 0,
                          mt: isMobile ? 1 : 0,
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        fullWidth={isMobile}
                        sx={{
                          background:
                            "linear-gradient(45deg, #1976d2, #64b5f6)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #1565c0, #42a5f5)",
                          },
                          borderRadius: "8px",
                          px: 4,
                          py: 1,
                          fontWeight: 600,
                          order: isMobile ? 0 : 1,
                        }}
                      >
                        {editingHoliday ? "Update" : "Create"}
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

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
            <DeleteIcon />
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
              Are you sure you want to delete this holiday?
            </Alert>
            {holidayToDelete && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                <Typography variant="body1" fontWeight={600} color="#2c3e50">
                  Holiday: {holidayToDelete.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Start Date: {new Date(holidayToDelete.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Date: {new Date(holidayToDelete.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recurring: {holidayToDelete.recurring ? "Yes" : "No"}
                </Typography>
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
      </Paper>
    </Container>
  );
}

