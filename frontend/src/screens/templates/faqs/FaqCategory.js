import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, Paper, Typography, TextField, IconButton, Box,
  Button, Modal, Card, CardContent, Grid
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4
};

export default function FaqCategory() {
      const [categories, setCategories] = useState([]);
      const navigate = useNavigate();
      const [isAddModalOpen, setIsAddModalOpen] = useState(false);
      const [formData, setFormData] = useState({
          title: '',
          description: ''
      });
      const [searchTerm, setSearchTerm] = useState('');
      const [errorMessage, setErrorMessage] = useState(null);
      const [showActions, setShowActions] = useState(null);
      const [editingCategoryId, setEditingCategoryId] = useState(null);

      useEffect(() => {
          fetchCategories();
      }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqCategories`);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching FAQ categories:', err.response?.data || err.message);
        }
    };

    const toSentenceCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = toSentenceCase(value);
        setFormData({ ...formData, [name]: formattedValue });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setErrorMessage('Category title is required.');
            return;
        }

        try {
            if (editingCategoryId) {
                await axios.put(`${apiBaseURL}/api/faqCategories/${editingCategoryId}`, formData);
                setEditingCategoryId(null);
            } else {
                await axios.post(`${apiBaseURL}/api/faqCategories`, formData);
            }
            fetchCategories();
            setIsAddModalOpen(false);
            setFormData({ title: '', description: '' });
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to save category.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseURL}/api/faqCategories/${id}`);
            fetchCategories();
            setShowActions(null);
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const openEditModal = (category) => {
        setFormData({ title: category.title, description: category.description });
        setEditingCategoryId(category._id);
        setIsAddModalOpen(true);
        setShowActions(null);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
                <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
                    FAQ Categories
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: '#6b7280', mr: 1 }} />
                        }}
                        sx={{
                            maxWidth: '70%',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#3b82f6'
                                }
                            }
                        }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingCategoryId(null);
                                setIsAddModalOpen(true);
                            }}
                            sx={{
                                backgroundColor: '#3b82f6',
                                '&:hover': { backgroundColor: '#2563eb' },
                                borderRadius: 2,
                                px: 3,
                                py: 1
                            }}
                        >
                            Create Category
                        </Button>
                    </motion.div>
                </Box>

                <Grid container spacing={3}>
                    {categories
                        .filter(category => 
                            category?.title?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category._id}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card sx={{ position: 'relative', height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                                <IconButton onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowActions(showActions === category._id ? null : category._id);
                                                }}>
                                                    <MoreVertIcon />
                                                </IconButton>

                                                <AnimatePresence>
                                                    {showActions === category._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            style={{
                                                                position: 'absolute',
                                                                right: 0,
                                                                top: '100%',
                                                                backgroundColor: 'white',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                                zIndex: 10
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton
                                                                    onClick={() => openEditModal(category)}
                                                                    sx={{
                                                                        backgroundColor: '#3b82f6',
                                                                        color: 'white',
                                                                        '&:hover': { backgroundColor: '#2563eb' }
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => handleDelete(category._id)}
                                                                    sx={{
                                                                        backgroundColor: '#ef4444',
                                                                        color: 'white',
                                                                        '&:hover': { backgroundColor: '#dc2626' }
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Box>

                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                {category.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                                {category.description}
                                            </Typography>
                                            <Button
    variant="contained"
    onClick={() => navigate(`/Dashboards/faq/${category._id}`)}
    sx={{
        mt: 'auto',
        backgroundColor: '#3b82f6',
        '&:hover': { backgroundColor: '#2563eb' }
    }}
>
    View FAQs
</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                </Grid>

                <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                sx={{ mb: 3 }}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit">
                                    {editingCategoryId ? 'Update' : 'Create'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </Paper>
        </Container>
    );
}

