import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Button, Card, CardContent, Grid, FormControl,
    InputLabel, Select, MenuItem, Stack, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Event as EventIcon,
    Close
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

function RestrictLeaves() {
    const [restrictLeaves, setRestrictLeaves] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        department: '',
        jobPosition: '',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        

        fetchRestrictLeaves();
    }, []);

    const fetchRestrictLeaves = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/restrictLeaves`);
            setRestrictLeaves(data);
        } catch (err) {
            console.error('Error fetching restricted leaves:', err);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Apply sentence case only for text fields
        const transformedValue = ['title', 'description'].includes(name) 
            ? toSentenceCase(value)
            : value;
        setFormData({ ...formData, [name]: transformedValue });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format dates before submitting
        const formattedFormData = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),  // Convert to ISO format
            endDate: new Date(formData.endDate).toISOString()       // Convert to ISO format
        };
        
        try {
            if (isEditing) {
                await axios.put(`${apiBaseURL}/api/restrictLeaves/${editId}`, formattedFormData);
                console.log(`Updated restricted leave with ID: ${editId}`);
            } else {
                await axios.post(`${apiBaseURL}/api/restrictLeaves`, formattedFormData);
                console.log(`Added new restricted leave`);
            }
            fetchRestrictLeaves();
            setIsAddModalOpen(false);
            setFormData({
                title: '',
                startDate: '',
                endDate: '',
                department: '',
                jobPosition: '',
                description: ''
            });
            setIsEditing(false);
            setEditId(null);
        } catch (err) {
            console.error('Error creating/updating restricted leave:', err);
        }
    };
    
    
    const handleEdit = (leave) => {
        setFormData({
            title: leave.title,
            startDate: formatDateForInput(leave.startDate),  // Format for the input field
            endDate: formatDateForInput(leave.endDate),      // Format for the input field
            department: leave.department,
            jobPosition: leave.jobPosition,
            description: leave.description
        });
        setEditId(leave._id);
        setIsEditing(true);
        setIsAddModalOpen(true);
    };
    
    // Function to format date for input type="date"
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseURL}/api/restrictLeaves/${id}`);
            console.log(`Deleted restricted leave with ID: ${id}`);
            fetchRestrictLeaves();
        } catch (err) {
            console.error('Error deleting restricted leave:', err);
        }
    };

    const toSentenceCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
             


<Box sx={{
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: '24px 32px',
    marginBottom: '24px'
}}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            background: "#1976d2",
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Restricted Leaves Management
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField 
                placeholder="Search restricted leaves..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                    width: '300px',
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        '&:hover fieldset': {
                            borderColor: '#1976d2',
                        }
                    }
                }}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
            />
            
            <Button
                onClick={() => {
                    setFormData({
                        title: '',
                        startDate: '',
                        endDate: '',
                        department: '',
                        jobPosition: '',
                        description: ''
                    });
                    setIsAddModalOpen(true);
                    setIsEditing(false);
                }}
                startIcon={<AddIcon />}
                sx={{
                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                    color: 'white',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    },
                    textTransform: 'none',
                    borderRadius: '8px',
                    height: '40px',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)'
                }}
                variant="contained"
            >
                Add Restricted Leave
            </Button>
        </Stack>
    </Stack>
</Box>


                <Grid container spacing={3}>
                    {restrictLeaves
                        .filter(leave =>
                            leave.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((leave) => (
                            <Grid item xs={12} sm={6} md={4} key={leave._id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card sx={{ 
                                        height: '100%',
                                        '&:hover': { boxShadow: 6 },
                                        transition: 'box-shadow 0.3s'
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <EventIcon sx={{ mr: 1, color: '#3b82f6' }} />
                                                <Typography variant="h6">{leave.title}</Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                Start: {formatDate(leave.startDate)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                End: {formatDate(leave.endDate)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                Department: {leave.department}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                Position: {leave.jobPosition}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                                Description: {leave.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    onClick={() => handleEdit(leave)}
                                                    sx={{
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#2563eb' }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(leave._id)}
                                                    sx={{
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#dc2626' }
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
    open={isAddModalOpen}
    maxWidth="md"
    fullWidth
    PaperProps={{
        sx: {
            width: '700px',
            maxWidth: '90vw',
            borderRadius: '20px',
            overflow: 'hidden',
        },
    }}
>
    <DialogTitle
        sx={{
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600,
            padding: '24px 32px',
            position: 'relative',
        }}
    >
        {isEditing ? 'Edit Restricted Leave' : 'Add Restricted Leave'}
        <IconButton
            onClick={() => setIsAddModalOpen(false)}
            sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
            }}
        >
            <Close />
        </IconButton>
    </DialogTitle>

    <DialogContent sx={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{mt:2}}>
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        }
                    }}
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Stack>

                <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        sx={{
                            borderRadius: '8px',
                        }}
                    >
                        <MenuItem value="Cloud team">Cloud team</MenuItem>
                        <MenuItem value="Development team">Development team</MenuItem>
                        <MenuItem value="HR team">HR team</MenuItem>
                        <MenuItem value="All team">All team</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Job Position</InputLabel>
                    <Select
                        name="jobPosition"
                        value={formData.jobPosition}
                        onChange={handleChange}
                        required
                        sx={{
                            borderRadius: '8px',
                        }}
                    >
                        <MenuItem value="Associate Engineer">Associate Engineer</MenuItem>
                        <MenuItem value="Senior Engineer">Senior Engineer</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Hr">HR</MenuItem>
                        <MenuItem value="All">For All</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        }
                    }}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button
                        onClick={() => setIsAddModalOpen(false)}
                        sx={{
                            border: '2px solid #1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                border: '2px solid #64b5f6',
                                backgroundColor: '#e3f2fd',
                            },
                            borderRadius: '8px',
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
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                            },
                            borderRadius: '8px',
                            px: 4,
                            py: 1,
                            fontWeight: 600,
                        }}
                    >
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Stack>
            </Stack>
        </form>
    </DialogContent>
</Dialog>


                {/* <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {isEditing ? 'Edit Restricted Leave' : 'Add Restricted Leave'}
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
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
                                type="date"
                                label="Start Date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                                required
                            />

                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                                required
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Department</InputLabel>
                                <Select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="Cloud team">Cloud team</MenuItem>
                                    <MenuItem value="Development team">Development team</MenuItem>
                                    <MenuItem value="HR team">HR team</MenuItem>
                                    <MenuItem value="All team">All team</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Job Position</InputLabel>
                                <Select
                                    name="jobPosition"
                                    value={formData.jobPosition}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="Associate Engineer">Associate Engineer</MenuItem>
                                    <MenuItem value="Senior Engineer">Senior Engineer</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                    <MenuItem value="Hr">HR</MenuItem>
                                    <MenuItem value="All">For All</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                sx={{ mb: 3 }}
                                required
                            />

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal> */}
            </Paper>
        </Container>
    );
}

export default RestrictLeaves;