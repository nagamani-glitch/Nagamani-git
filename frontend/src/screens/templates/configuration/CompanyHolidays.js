import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Button, Modal, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, MenuItem, Stack,FormHelperText, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Search,Close
} from '@mui/icons-material';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const validationSchema = Yup.object().shape({
    week: Yup.string().required('Week selection is required'),
    day: Yup.string().required('Day selection is required')
});

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

export default function CompanyHolidays() {
    const [companyHolidays, setCompanyHolidays] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [initialValues, setInitialValues] = useState({ week: '', day: '' });

    useEffect(() => {
        fetchCompanyHolidays();
    }, []);

    const toSentenceCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const fetchCompanyHolidays = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/companyHolidays`);
            setCompanyHolidays(data);
        } catch (err) {
            console.error('Error fetching company holidays:', err);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const formattedValues = {
                week: toSentenceCase(values.week),
                day: toSentenceCase(values.day)
            };
    
            if (isEditing) {
                await axios.put(`${apiBaseURL}/api/companyHolidays/${editId}`, formattedValues);
            } else {
                await axios.post(`${apiBaseURL}/api/companyHolidays`, formattedValues);
            }
            fetchCompanyHolidays();
            setIsAddModalOpen(false);
            resetForm();
            setIsEditing(false);
            setEditId(null);
        } catch (err) {
            console.error('Error creating/updating company holiday:', err);
        }
    };

    const handleEdit = (holiday) => {
        setEditId(holiday._id);
        setIsEditing(true);
        setInitialValues({ week: holiday.week, day: holiday.day });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBaseURL}/api/companyHolidays/${id}`);
            fetchCompanyHolidays();
        } catch (err) {
            console.error('Error deleting company holiday:', err);
        }
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
            // background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            background: "#1976d2",
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Company Holidays
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField 
                placeholder="Search holidays..." 
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
                    startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                }}
            />
            
            <Button
                onClick={() => {
                    setIsEditing(false);
                    setInitialValues({ week: '', day: '' });
                    setIsAddModalOpen(true);
                }}
                startIcon={<Add />}
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
                Add Holiday
            </Button>
        </Stack>
    </Stack>
</Box>

{/* table */}

<Box sx={{
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    margin: '24px 0'
}}>
    <Table sx={{ minWidth: 650 }}>
        <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Week</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Day</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569', py: 2 }}>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {companyHolidays
                .filter(holiday =>
                    holiday.week.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    holiday.day.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((holiday) => (
                    <TableRow 
                        key={holiday._id}
                        sx={{ 
                            '&:hover': { backgroundColor: '#f8fafc' },
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        <TableCell sx={{ color: '#d013d1', fontWeight: 500 }}>
                            {holiday.week}
                        </TableCell>
                        <TableCell sx={{ color: '#2563eb', fontWeight: 500 }}>
                            {holiday.day}
                        </TableCell>
                        <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <IconButton 
                                    onClick={() => handleEdit(holiday)}
                                    size="small"
                                    sx={{ 
                                        color: '#1976d2',
                                        '&:hover': { 
                                            backgroundColor: '#e3f2fd',
                                            transform: 'translateY(-1px)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    onClick={() => handleDelete(holiday._id)}
                                    size="small"
                                    sx={{ 
                                        color: '#ef4444',
                                        '&:hover': { 
                                            backgroundColor: '#fee2e2',
                                            transform: 'translateY(-1px)'
                                        },
                                        transition: 'all 0.2s ease'
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


                {/* <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Week</TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Day</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companyHolidays
                                .filter(holiday =>
                                    holiday.week.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    holiday.day.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((holiday) => (
                                    <motion.tr
                                        key={holiday._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        component={motion.tr}
                                        whileHover={{ backgroundColor: '#f8fafc' }}
                                    >
                                        <TableCell>{holiday.week}</TableCell>
                                        <TableCell>{holiday.day}</TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    onClick={() => handleEdit(holiday)}
                                                    sx={{
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#2563eb' }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(holiday._id)}
                                                    sx={{
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#dc2626' }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}


{/* create holiday */}

<Dialog 
    open={isAddModalOpen} 
    maxWidth="md"
    fullWidth
    PaperProps={{
        sx: {
            width: '700px',
            maxWidth: '90vw',
            borderRadius: '20px',
            overflow: 'hidden'
        }
    }}
>
    <DialogTitle
        sx={{
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600,
            padding: '24px 32px',
            position: 'relative'
        }}
    >
        {isEditing ? 'Edit Holiday' : 'Add Holiday'}
        <IconButton
            onClick={() => {
                setIsAddModalOpen(false);
                setIsEditing(false);
                setEditId(null);
            }}
            sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white'
            }}
        >
            <Close />
        </IconButton>
    </DialogTitle>

    <DialogContent sx={{ padding: '32px' }}>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <Stack spacing={3} sx={{mt:2}}>
                        <FormControl fullWidth error={touched.week && errors.week}>
                            <InputLabel>Week</InputLabel>
                            <Field
                                as={Select}
                                name="week"
                                label="Week"
                                sx={{ borderRadius: '8px' }}
                            >
                                {['First', 'Second', 'Third', 'Fourth', 'Fifth', 'All Weeks'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Field>
                            {touched.week && errors.week && (
                                <FormHelperText>{errors.week}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={touched.day && errors.day}>
                            <InputLabel>Day</InputLabel>
                            <Field
                                as={Select}
                                name="day"
                                label="Day"
                                sx={{ borderRadius: '8px' }}
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Field>
                            {touched.day && errors.day && (
                                <FormHelperText>{errors.day}</FormHelperText>
                            )}
                        </FormControl>

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
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                sx={{
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                                    },
                                    borderRadius: '8px',
                                    px: 4,
                                    py: 1,
                                    fontWeight: 600
                                }}
                            >
                                {isEditing ? 'Update' : 'Add'}
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    </DialogContent>
</Dialog>

                {/* <Modal 
                    open={isAddModalOpen} 
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setIsEditing(false);
                        setEditId(null);
                    }}
                >
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {isEditing ? 'Edit Holiday' : 'Add Holiday'}
                        </Typography>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <Field
                                        as={TextField}
                                        select
                                        fullWidth
                                        name="week"
                                        label="Week"
                                        error={touched.week && errors.week}
                                        helperText={touched.week && errors.week}
                                        sx={{ mb: 2 }}
                                    >
                                        {['First', 'Second', 'Third', 'Fourth', 'Fifth', 'All Weeks'].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    <Field
                                        as={TextField}
                                        select
                                        fullWidth
                                        name="day"
                                        label="Day"
                                        error={touched.day && errors.day}
                                        helperText={touched.day && errors.day}
                                        sx={{ mb: 3 }}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Field>
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
                                            disabled={isSubmitting}
                                        >
                                            {isEditing ? 'Update' : 'Add'}
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Modal> */}
            </Paper>
        </Container>
    );
}
