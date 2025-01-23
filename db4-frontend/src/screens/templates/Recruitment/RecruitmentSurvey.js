import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Paper,
} from "@mui/material";
import { ExpandMore, Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const RecruitmentSurvey = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/recruitment-survey"
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleClickOpen = () => {
    setEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTemplateName("");
    setNewQuestion("");
    setNewType("");
    setCurrentTemplateId(null);
    setCurrentQuestionId(null);
  };

  const handleAddTemplate = async () => {
    if (newTemplateName && newQuestion && newType) {
      const newTemplate = {
        name: newTemplateName,
        questions: [
          {
            avatar: newTemplateName.charAt(0).toUpperCase(),
            question: newQuestion,
            type: newType,
          },
        ],
      };
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/recruitment-survey/add",
          newTemplate
        );
        setTemplates([...templates, data]);
        handleClose();
      } catch (error) {
        console.error("Error adding template:", error);
      }
    }
  };

  const handleEditQuestion = (templateId, questionId) => {
    const template = templates.find((t) => t._id === templateId);
    const question = template.questions.find((q) => q._id === questionId);
    setNewTemplateName(template.name);
    setNewQuestion(question.question);
    setNewType(question.type);
    setCurrentTemplateId(templateId);
    setCurrentQuestionId(questionId);
    setEditing(true);
    setOpen(true);
  };
  const handleSaveEdit = async () => {
    const updatedTemplate = {
      name: newTemplateName,
      questions: [
        { _id: currentQuestionId, question: newQuestion, type: newType },
      ],
    };

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/recruitment-survey/${currentTemplateId}`,
        updatedTemplate
      );
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === currentTemplateId
            ? { ...template, questions: data.questions }
            : template
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error saving edited question:", error);
    }
  };

  const handleDeleteQuestion = async (templateId, questionId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/recruitment-survey/${templateId}/questions/${questionId}`
      );
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === templateId
            ? {
                ...template,
                questions: template.questions.filter(
                  (question) => question._id !== questionId
                ),
              }
            : template
        )
      );
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/recruitment-survey/${templateId}`
      );
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== templateId)
      );
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#2c3e50", fontWeight: 600, mb: 3 }}
        >
          Survey Templates
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            backgroundColor: "#fff",
            padding: "15px 25px",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#34495e" }}>
            Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleClickOpen}
            sx={{
              backgroundColor: "#3498db",
              "&:hover": { backgroundColor: "#2980b9" },
            }}
          >
            Add Template
          </Button>
        </Box>

        {templates.map((template) => (
          <Accordion
            key={template._id}
            defaultExpanded
            sx={{
              mb: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "&:before": { display: "none" },
              borderRadius: "8px !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Box display="flex" alignItems="center" width="100%">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#2c3e50" }}
                >
                  {template.name}
                  <span
                    style={{
                      color: "#e74c3c",
                      marginLeft: 12,
                      backgroundColor: "#fff",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: "0.8rem",
                    }}
                  >
                    {template.questions.length}
                  </span>
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteTemplate(template._id)}
                  sx={{ ml: "auto" }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                      Question
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {template.questions.map((question) => (
                    <TableRow
                      key={question._id}
                      sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: "#3498db",
                              width: 35,
                              height: 35,
                              fontSize: "0.9rem",
                            }}
                          >
                            {question.avatar}
                          </Avatar>
                          <Typography sx={{ color: "#2c3e50" }}>
                            {question.question}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#7f8c8d" }}>
                        {question.type}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEditQuestion(template._id, question._id)
                          }
                          sx={{ color: "#3498db", mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDeleteQuestion(template._id, question._id)
                          }
                          sx={{ color: "#e74c3c" }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #eee",
            color: "#2c3e50",
            fontWeight: 600,
          }}
        >
          {editing ? "Edit Question" : "Add Recruitment"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            fullWidth
            margin="dense"
            disabled={editing}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
          <Button onClick={handleClose} sx={{ color: "#7f8c8d" }}>
            Cancel
          </Button>
          <Button
            onClick={editing ? handleSaveEdit : handleAddTemplate}
            variant="contained"
            sx={{
              bgcolor: "#3498db",
              "&:hover": { bgcolor: "#2980b9" },
            }}
          >
            {editing ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentSurvey;
