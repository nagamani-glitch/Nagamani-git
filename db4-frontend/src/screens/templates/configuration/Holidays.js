import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchHolidays, createHoliday, updateHoliday, deleteHoliday } from '../api/holidays';

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

const Holidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const holidaysRef = useRef(null);

    useEffect(() => {
        gsap.from('.holiday-item', {
            duration: 0.8,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            ease: "power3.out"
        });

        loadHolidays();
    }, []);

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
        try {
            let response;
            if (editingHoliday) {
                response = await updateHoliday(editingHoliday._id, values);
                setHolidays(holidays.map(h => h._id === editingHoliday._id ? response.data : h));
            } else {
                response = await createHoliday(values);
                setHolidays([...holidays, response.data]);
            }
            resetForm();
            setShowModal(false);
            setEditingHoliday(null);
            
            gsap.from(holidaysRef.current.lastChild, {
                duration: 0.5,
                opacity: 0,
                y: -20,
                ease: "back.out"
            });
        } catch (err) {
            setError(editingHoliday ? 'Failed to update holiday' : 'Failed to create holiday');
        }
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteHoliday(id);
            gsap.to(`[data-id="${id}"]`, {
                duration: 0.5,
                opacity: 0,
                x: -100,
                ease: "power2.out",
                onComplete: () => setHolidays(holidays.filter(h => h._id !== id))
            });
        } catch (err) {
            setError('Failed to delete holiday');
        }
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };

    const modalStyle = {
        position: 'fixed',
        top: '10%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        zIndex: 1000,
        width: '90%',
        maxWidth: '500px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)'
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 999
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        transition: 'border-color 0.3s ease',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#34495e',
        fontWeight: '500'
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={containerStyle}
        >
            <h2 style={{ color: '#333', marginBottom: '2rem' }}>Holidays</h2>
            
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            
            <motion.div 
                className="filter-container"
                whileHover={{ scale: 1.02 }}
                style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}
            >
                <input
                    type="text"
                    placeholder="Filter holidays..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    style={{
                        width: '1000px',
                        height: '50px',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        outline: 'none'
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingHoliday(null);
                        setShowModal(true);
                    }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Create Holiday
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <>
                        <div style={modalOverlayStyle} onClick={() => setShowModal(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            style={modalStyle}
                        >
                            <h3 style={{ 
                                marginBottom: '1.5rem', 
                                color: '#2c3e50',
                                borderBottom: '2px solid #eee',
                                paddingBottom: '0.5rem'
                            }}>
                                {editingHoliday ? 'Edit Holiday' : 'Create New Holiday'}
                            </h3>
                            
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
                                    <Form style={formStyle}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={labelStyle}>Holiday Name</label>
                                            <Field
                                                name="name"
                                                type="text"
                                                style={inputStyle}
                                            />
                                            <ErrorMessage 
                                                name="name" 
                                                component="div" 
                                                style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }} 
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={labelStyle}>Start Date</label>
                                            <Field
                                                name="startDate"
                                                type="date"
                                                style={inputStyle}
                                            />
                                            <ErrorMessage 
                                                name="startDate" 
                                                component="div" 
                                                style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }} 
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={labelStyle}>End Date</label>
                                            <Field
                                                name="endDate"
                                                type="date"
                                                style={inputStyle}
                                            />
                                            <ErrorMessage 
                                                name="endDate" 
                                                component="div" 
                                                style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem' }} 
                                            />
                                        </div>

                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            color: '#34495e'
                                        }}>
                                            <Field type="checkbox" name="recurring" />
                                            Recurring Holiday
                                        </label>

                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '1rem', 
                                            justifyContent: 'flex-end',
                                            marginTop: '2rem' 
                                        }}>
                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    backgroundColor: '#2ecc71',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {editingHoliday ? 'Update Holiday' : 'Create Holiday'}
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(false);
                                                    setEditingHoliday(null);
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    backgroundColor: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                Cancel
                                            </motion.button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div ref={holidaysRef} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {holidays
                    .filter(holiday => holiday.name.toLowerCase().includes(filterQuery.toLowerCase()))
                    .map((holiday) => (
                        <motion.div
                            key={holiday._id}
                            data-id={holiday._id}
                            className="holiday-item"
                            whileHover={{ scale: 1.02 }}
                            style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{holiday.name}</h3>
                            <p style={{ color: '#34495e', marginBottom: '0.5rem' }}>
                                Start: {new Date(holiday.startDate).toLocaleDateString()}
                            </p>
                            <p style={{ color: '#34495e', marginBottom: '0.5rem' }}>
                                End: {new Date(holiday.endDate).toLocaleDateString()}
                            </p>
                            <p style={{ color: '#34495e', marginBottom: '1rem' }}>
                                Recurring: {holiday.recurring ? 'Yes' : 'No'}
                            </p>
                            
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEdit(holiday)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(holiday._id)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
            </div>
        </motion.div>
    );
};

export default Holidays;

