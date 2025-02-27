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
      } else {
        await createHoliday(formattedValues);
      }
      await loadHolidays(); // Refresh the list
      setShowModal(false);
      resetForm();
      setEditingHoliday(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save holiday");
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id);
      loadHolidays();
    } catch (err) {
      setError("Failed to delete holiday");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 2, backgroundColor: "#ffffff" }}
      >
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
                background: "#1976d2",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Holidays Management
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search holidays..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
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
                  setEditingHoliday(null);
                  setShowModal(true);
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

        <Grid container spacing={3} ref={holidaysRef}>
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
                        <Typography variant="h6">{holiday.name}</Typography>
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
                          onClick={() => handleDelete(holiday._id)}
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

        <Dialog
          open={showModal}
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

          <DialogContent sx={{ padding: "32px" }}>
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
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      sx={{ mt: 4 }}
                    >
                      <Button
                        onClick={() => setShowModal(false)}
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
                        disabled={isSubmitting}
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
      </Paper>
    </Container>
  );
}
