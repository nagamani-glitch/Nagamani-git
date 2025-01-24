import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchHolidays, createHoliday, updateHoliday, deleteHoliday } from '../api/holidays';
import { 
    Container, Paper, Typography, TextField, IconButton, Box,
    Button, Modal, Card, CardContent, Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Event as EventIcon
} from '@mui/icons-material';

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Holiday name is required')
        .min(3, 'Name must be at least 3 characters'),
    startDate: Yup.date()
        .required('Start date is required')
        .min(new Date(), 'Start date cannot be in the past'),
    endDate: Yup.date()
        .required('End date is required')
        .min(
            Yup.ref('startDate'),
            'End date must be after start date'
        )
        .test('duration', 'Holiday duration must not exceed 14 days', function(endDate) {
            const startDate = this.parent.startDate;
            if (!startDate || !endDate) return true;
            const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
            return duration <= 14;
        }),
    recurring: Yup.boolean()
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

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const holidaysRef = useRef(null);

    useEffect(() => {
        loadHolidays();
    }, []);

    const toSentenceCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const loadHolidays = async () => {
        setLoading(true);
        try {
            const response = await fetchHolidays();
            setHolidays(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load holidays');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        const formattedValues = {
            ...values,
            name: toSentenceCase(values.name)
        };

        try {
            if (editingHoliday) {
                await updateHoliday(editingHoliday._id, formattedValues);
            } else {
                await createHoliday(formattedValues);
            }
            loadHolidays();
            setShowModal(false);
            resetForm();
            setEditingHoliday(null);
        } catch (err) {
            setError('Failed to save holiday');
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
            setError('Failed to delete holiday');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
                <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
                    Holidays Management
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search holidays..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
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
                                setEditingHoliday(null);
                                setShowModal(true);
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

                {loading && <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>}
                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                <Grid container spacing={3} ref={holidaysRef}>
                    {holidays
                        .filter(holiday => 
                            holiday.name.toLowerCase().includes(filterQuery.toLowerCase())
                        )
                        .map((holiday) => (
                            <Grid item xs={12} sm={6} md={4} key={holiday._id}>
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
                                                <Typography variant="h6">{holiday.name}</Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                Start: {new Date(holiday.startDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                End: {new Date(holiday.endDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                                Recurring: {holiday.recurring ? 'Yes' : 'No'}
                                            </Typography>

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
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                </Grid>

                <Modal open={showModal} onClose={() => setShowModal(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                        </Typography>
                        
                        <Formik
                            initialValues={editingHoliday || {
                                name: '',
                                startDate: '',
                                endDate: '',
                                recurring: false
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="name"
                                        label="Holiday Name"
                                        sx={{ mb: 2 }}
                                    />
                                    <ErrorMessage name="name" component="div" className="error" />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        type="date"
                                        name="startDate"
                                        label="Start Date"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ mb: 2 }}
                                    />
                                    <ErrorMessage name="startDate" component="div" className="error" />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        type="date"
                                        name="endDate"
                                        label="End Date"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ mb: 2 }}
                                    />
                                    <ErrorMessage name="endDate" component="div" className="error" />

                                    <Box sx={{ mb: 3 }}>
                                        <Field
                                            type="checkbox"
                                            name="recurring"
                                            id="recurring"
                                        />
                                        <label htmlFor="recurring" style={{ marginLeft: '8px' }}>
                                            Recurring Holiday
                                        </label>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {editingHoliday ? 'Update' : 'Create'}
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
