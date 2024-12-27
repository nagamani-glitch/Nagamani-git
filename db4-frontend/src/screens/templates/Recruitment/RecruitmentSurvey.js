import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ExpandMore, Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const RecruitmentSurvey = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newType, setNewType] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  // Fetch survey templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recruitment-survey');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
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
    setNewTemplateName('');
    setNewQuestion('');
    setNewType('');
    setCurrentTemplateId(null);
    setCurrentQuestionId(null);
  };

  const handleAddTemplate = async () => {
    if (newTemplateName && newQuestion && newType) {
      const newTemplate = {
        name: newTemplateName,
        questions: [
          { avatar: newTemplateName.charAt(0).toUpperCase(), question: newQuestion, type: newType },
        ],
      };
      try {
        const { data } = await axios.post('http://localhost:5000/api/recruitment-survey/add', newTemplate);
        setTemplates([...templates, data]); // Add the new template to state
        handleClose();
      } catch (error) {
        console.error('Error adding template:', error);
      }
    } else {
      console.error('Template name, question, and type are required.');
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
      const { data } = await axios.put(`http://localhost:5000/api/recruitment-survey/${currentTemplateId}`, updatedTemplate);
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === currentTemplateId ? { ...template, questions: data.questions } : template
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error saving edited question:', error);
    }
  };

  const handleDeleteQuestion = async (templateId, questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/recruitment-survey/${templateId}/questions/${questionId}`);
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === templateId
            ? {
                ...template,
                questions: template.questions.filter((question) => question._id !== questionId),
              }
            : template
        )
      );
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(`http://localhost:5000/api/recruitment-survey/${templateId}`);
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== templateId)
      );
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Survey Templates</Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          backgroundColor: '#fff',
          padding: '10px 20px',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6">Templates</Typography>
        <IconButton color="primary" onClick={handleClickOpen}>
          <Add />
        </IconButton>
      </Box>

      {templates.map((template) => (
        <Accordion key={template._id} defaultExpanded sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              {template.name} <span style={{ color: '#F44336', marginLeft: 8 }}>{template.questions.length}</span>
            </Typography>
            {/* Delete button for whole template */}
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleDeleteTemplate(template._id)}
              style={{ marginLeft: 'auto' }}
            >
              <Delete />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {template.questions.map((question) => (
                  <TableRow key={question._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar style={{ marginRight: 8, backgroundColor: '#FFC107' }}>{question.avatar}</Avatar>
                        <Typography>{question.question}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditQuestion(template._id, question._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleDeleteQuestion(template._id, question._id)}
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

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={1} page={1} />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Question' : 'Add Recruitment'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            fullWidth
            margin="dense"
            disabled={editing}
          />
          <TextField
            label="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={editing ? handleSaveEdit : handleAddTemplate} color="primary">
            {editing ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentSurvey;
