import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Button, Modal, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
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
                <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
                    Company Holidays
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search holidays..."
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
                                setIsEditing(false);
                                setInitialValues({ week: '', day: '' });
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
                            Add Holiday
                        </Button>
                    </motion.div>
                </Box>

                <TableContainer component={Paper} elevation={0}>
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
                </TableContainer>

                <Modal 
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
                </Modal>
            </Paper>
        </Container>
    );
}
