import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Button, Modal, Card, CardContent
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { 
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon 
} from '@mui/icons-material';
import { ToggleButtonGroup, ToggleButton } from '@mui/lab';


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

export default function FaqPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [editingFaq, setEditingFaq] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryTitle, setCategoryTitle] = useState('');

    const fetchFaqs = useCallback(async () => {
        if (!categoryId) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqs/category/${categoryId}`);
            setFaqs(data);
            setFilteredFaqs(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching FAQs:', err.response?.data || err.message);
            setError('Failed to fetch FAQs.');
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    const fetchCategoryTitle = async () => {
        if (!categoryId) {
            console.error('Category ID is missing.');
            setCategoryTitle('Unknown Category');
            return;
        }
    
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqCategories/${categoryId}`);
            if (data?.title) {
                setCategoryTitle(data.title);
            } else {
                console.warn('Category data is missing or invalid:', data);
                setCategoryTitle('Unknown Category');
            }
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                console.error('Category not found:', err.response?.data || err.message);
                setCategoryTitle('Category Not Found');
            } else {
                console.error('Error fetching category:', err.message);
                setCategoryTitle('Error Loading Category');
            }
        }
    };
    

    useEffect(() => {
        fetchCategoryTitle();
        fetchFaqs();
    }, [fetchFaqs]);

    const toSentenceCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = faqs.filter((faq) =>
            faq.question.toLowerCase().includes(query)
        );
        setFilteredFaqs(filtered);
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: toSentenceCase(value) });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditingFaq({ ...editingFaq, [name]: toSentenceCase(value) });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            setError('Category ID is missing.');
            return;
        }
        if (!formData.question || !formData.answer) {
            setError('Both question and answer are required.');
            return;
        }

        try {
            console.log('Adding FAQ:', { ...formData, categoryId });
            const { data: newFaq } = await axios.post(`${apiBaseURL}/api/faqs/category/${categoryId}`, formData);
            setFaqs([...faqs, newFaq]);
            setFilteredFaqs([...faqs, newFaq]);
            setIsAddModalOpen(false);
            setFormData({ question: '', answer: '' });
            setError(null);
        } catch (err) {
            console.error('Error adding FAQ:', err.response?.data || err.message);
            setError('Failed to add FAQ.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editingFaq) return;

        try {
            console.log('Editing FAQ:', editingFaq);
            const { data: updatedFaq } = await axios.put(`${apiBaseURL}/api/faqs/${editingFaq._id}`, editingFaq);
            const updatedFaqs = faqs.map((faq) => (faq._id === editingFaq._id ? updatedFaq : faq));
            setFaqs(updatedFaqs);
            setFilteredFaqs(updatedFaqs);
            setIsEditModalOpen(false);
            setEditingFaq(null);
            setError(null);
        } catch (err) {
            console.error('Error editing FAQ:', err.response?.data || err.message);
            setError('Failed to edit FAQ.');
        }
    };

    const handleDelete = async (faqId) => {
        try {
            console.log('Deleting FAQ ID:', faqId);
            await axios.delete(`${apiBaseURL}/api/faqs/${faqId}`);
            const updatedFaqs = faqs.filter((faq) => faq._id !== faqId);
            setFaqs(updatedFaqs);
            setFilteredFaqs(updatedFaqs);
            setError(null);
        } catch (err) {
            console.error('Error deleting FAQ:', err.response?.data || err.message);
            setError('Failed to delete FAQ.');
        }
    };

    const [viewType, setViewType] = useState('grid');

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/faq-category')}
                        sx={{ mr: 2 }}
                    >
                        Back to Categories
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {categoryTitle || 'Loading...'} - FAQs
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={handleSearchChange}
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
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <ToggleButtonGroup
                            value={viewType}
                            exclusive
                            onChange={handleViewChange}
                            sx={{ mr: 2 }}
                        >
                            <ToggleButton 
                                value="list" 
                                aria-label="list view"
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2563eb'
                                        }
                                    }
                                }}
                            >
                                <ViewListIcon />
                            </ToggleButton>
                            <ToggleButton 
                                value="grid" 
                                aria-label="grid view"
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2563eb'
                                        }
                                    }
                                }}
                            >
                                <ViewModuleIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setIsAddModalOpen(true)}
                                sx={{
                                    backgroundColor: '#3b82f6',
                                    '&:hover': { backgroundColor: '#2563eb' },
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Add FAQ
                            </Button>
                        </motion.div>
                    </Box>
                </Box>

                {loading && <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>}
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box sx={{ 
                    display: viewType === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    flexDirection: viewType === 'grid' ? 'unset' : 'column',
                    gap: 2 
                }}>
                    {filteredFaqs.map((faq) => (
                        <motion.div
                            key={faq._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    '&:hover': { boxShadow: 6 },
                                    transition: 'box-shadow 0.3s'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">{faq.question}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                onClick={() => {
                                                    setEditingFaq(faq);
                                                    setIsEditModalOpen(true);
                                                }}
                                                sx={{
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: '#2563eb' }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(faq._id)}
                                                sx={{
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: '#dc2626' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ mt: 2, color: 'text.secondary' }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </Box>

                <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Add FAQ</Typography>
                        <form onSubmit={handleAddSubmit}>
                            <TextField
                                fullWidth
                                label="Question"
                                name="question"
                                value={formData.question}
                                onChange={handleAddChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleAddChange}
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
                                    Add
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>

                <Modal open={isEditModalOpen && !!editingFaq} onClose={() => setIsEditModalOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Edit FAQ</Typography>
                        <form onSubmit={handleEditSubmit}>
                            <TextField
                                fullWidth
                                label="Question"
                                name="question"
                                value={editingFaq?.question || ''}
                                onChange={handleEditChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Answer"
                                name="answer"
                                value={editingFaq?.answer || ''}
                                onChange={handleEditChange}
                                multiline
                                rows={4}
                                sx={{ mb: 3 }}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit">
                                    Save
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </Paper>
        </Container>
    );
}