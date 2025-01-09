import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const validationSchema = Yup.object().shape({
    week: Yup.string().required('Week selection is required'),
    day: Yup.string().required('Day selection is required')
});

const modalAnimation = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 300
        }
    },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        y: 20,
        transition: {
            duration: 0.2
        }
    }
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    searchInput: {
        width: '400px',
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
    },
    modal: {
        position: 'fixed',
        top: '30%',
        left: '30%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        zIndex: 1000,
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 999
    },
    select: {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        backgroundColor: 'white',
        marginBottom: '1rem',
        cursor: 'pointer'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#2d3748',
        fontWeight: '600',
        fontSize: '0.95rem'
    },
    button: (color) => ({
        padding: '0.75rem 1.5rem',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        letterSpacing: '0.025em',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
    }),
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 0.75rem',
        marginTop: '1rem',
        tableLayout: 'fixed'
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontWeight: '600',
        width: 'calc(100% / 3)',
        fontSize: '0.95rem',
        textAlign: 'center',
        alignItems: 'center'
    },
    td: {
        padding: '1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        width: 'calc(100% / 3)',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        Aligntext: 'center'
    },
    errorMessage: {
        color: '#e53e3e',
        fontSize: '0.875rem',
        marginTop: '0.375rem',
        fontWeight: '500'
    }
};

export default function CompanyHolidays() {
    const [companyHolidays, setCompanyHolidays] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        gsap.from('.holiday-item', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            stagger: 0.2,
            ease: "power3.out"
        });

        fetchCompanyHolidays();
    }, []);

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
            if (isEditing) {
                await axios.put(`${apiBaseURL}/api/companyHolidays/${editId}`, values);
            } else {
                await axios.post(`${apiBaseURL}/api/companyHolidays`, values);
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
        <motion.div style={styles.container}>
            <h1 style={{ 
                color: '#2d3748', 
                marginBottom: '2rem', 
                fontSize: '1.875rem', 
                fontWeight: '700' 
            }}>
                Company Holidays
            </h1>

            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem',
                alignItems: 'center' 
            }}>
                <input
                    type="text"
                    placeholder="Search company holidays..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 6px 10px rgba(0,0,0,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setIsEditing(false);
                        setIsAddModalOpen(true);
                    }}
                    style={styles.button('#3498db')}
                >
                    Create Holiday
                </motion.button>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <div style={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)} />
                        <motion.div {...modalAnimation} style={styles.modal}>
                            <h2 style={{ 
                                marginBottom: '1.5rem', 
                                color: '#2d3748',
                                fontSize: '1.5rem',
                                fontWeight: '700'
                            }}>
                                {isEditing ? 'Edit Company Holiday' : 'Add Company Holiday'}
                            </h2>
                            
                            <Formik
                                initialValues={{
                                    week: '',
                                    day: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={styles.label}>Based on Week</label>
                                            <Field
                                                as="select"
                                                name="week"
                                                style={styles.select}
                                            >
                                                <option value="">Select Week</option>
                                                <option value="First">First</option>
                                                <option value="Second">Second</option>
                                                <option value="Third">Third</option>
                                                <option value="Fourth">Fourth</option>
                                                <option value="Fifth">Fifth</option>
                                                <option value="All Weeks">All Weeks</option>
                                            </Field>
                                            <ErrorMessage 
                                                name="week" 
                                                component="div" 
                                                style={styles.errorMessage} 
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={styles.label}>Based on Day</label>
                                            <Field
                                                as="select"
                                                name="day"
                                                style={styles.select}
                                            >
                                                <option value="">Select Day</option>
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thursday">Thursday</option>
                                                <option value="Friday">Friday</option>
                                                <option value="Saturday">Saturday</option>
                                                <option value="Sunday">Sunday</option>
                                            </Field>
                                            <ErrorMessage 
                                                name="day" 
                                                component="div" 
                                                style={styles.errorMessage} 
                                            />
                                        </div>

                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '1rem', 
                                            justifyContent: 'flex-end',
                                            marginTop: '2rem' 
                                        }}>
                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting}
                                                whileHover={{ scale: 1.02, boxShadow: '0 6px 10px rgba(0,0,0,0.15)' }}
                                                whileTap={{ scale: 0.98 }}
                                                style={styles.button('#2ecc71')}
                                            >
                                                {isEditing ? 'Update' : 'Create'}
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddModalOpen(false);
                                                    setIsEditing(false);
                                                    setEditId(null);
                                                }}
                                                whileHover={{ scale: 1.02, boxShadow: '0 6px 10px rgba(0,0,0,0.15)' }}
                                                whileTap={{ scale: 0.98 }}
                                                style={styles.button('#e74c3c')}
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

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Week</th>
                            <th style={styles.th}>Day</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyHolidays
                            .filter(holiday =>
                                holiday.week.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                holiday.day.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((holiday) => (
                                <tr key={holiday._id} className="holiday-item">
                                    <td style={styles.td}>{holiday.week}</td>
                                    <td style={styles.td}>{holiday.day}</td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleEdit(holiday)}
                                                style={styles.button('#3498db')}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(holiday._id)}
                                                style={styles.button('#e74c3c')}
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
