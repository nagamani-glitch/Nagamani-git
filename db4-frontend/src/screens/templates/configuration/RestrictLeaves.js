import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
        top: '10%',
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
        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e0 #f8fafc',
        '&::-webkit-scrollbar': {
            width: '8px'
        },
        '&::-webkit-scrollbar-track': {
            background: '#f8fafc'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e0',
            borderRadius: '4px'
        }
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
    formField: {
        marginBottom: '1.5rem',
        position: 'relative'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#2d3748',
        fontWeight: '600',
        fontSize: '0.95rem'
    },
    input: {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        backgroundColor: 'white',
        marginBottom: '1rem'
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
    textarea: {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        backgroundColor: 'white',
        marginBottom: '1rem',
        minHeight: '100px',
        resize: 'vertical'
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
        justifyContent: 'center',
        gap: '0.5rem'
    }),
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 0.5rem',
        marginTop: '1rem'
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontWeight: '600',
        fontSize: '0.95rem'
    },
    td: {
        padding: '1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0'
    },
    actionButtons: {
        display: 'flex',
        gap: '0.5rem'
    }
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
        gsap.from('.leave-item', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            stagger: 0.2,
            ease: "power3.out"
        });

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
        setFormData({ ...formData, [name]: value });
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

    return (
        <motion.div style={styles.container}>
            <h1 style={{ 
                color: '#2d3748', 
                marginBottom: '2rem', 
                fontSize: '1.875rem', 
                fontWeight: '700' 
            }}>
                Restricted Leaves
            </h1>

            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem',
                alignItems: 'center' 
            }}>
                <input
                    type="text"
                    placeholder="Search restricted leaves..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 6px 10px rgba(0,0,0,0.15)' }}
                    whileTap={{ scale: 0.98 }}
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
                    style={styles.button('#3498db')}
                >
                    Create Restricted Leave
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
                                {isEditing ? 'Edit Restricted Leave' : 'Add Restricted Leave'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formField}>
                                    <label style={styles.label}>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formField}>
                                    <label style={styles.label}>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formField}>
                                    <label style={styles.label}>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formField}>
                                    <label style={styles.label}>Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Cloud team">Cloud team</option>
                                        <option value="Development team">Development team</option>
                                    </select>
                                </div>

                                <div style={styles.formField}>
                                    <label style={styles.label}>Job Position</label>
                                    <select
                                        name="jobPosition"
                                        value={formData.jobPosition}
                                        onChange={handleChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Select Job Position</option>
                                        <option value="Associate Engineer">Associate Engineer</option>
                                        <option value="Senior Engineer">Senior Engineer</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>

                                <div style={styles.formField}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        style={styles.textarea}
                                        required
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
                                        whileHover={{ scale: 1.02, boxShadow: '0 6px 10px rgba(0,0,0,0.15)' }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.button('#2ecc71')}
                                    >
                                        {isEditing ? 'Update' : 'Submit'}
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
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Start Date</th>
                            <th style={styles.th}>End Date</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Job Position</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restrictLeaves
                            .filter(leave =>
                                leave.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                leave.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((leave) => (
                                <tr key={leave._id} className="leave-item">
                                    <td style={styles.td}>{leave.title}</td>
                                    <td style={styles.td}>{formatDate(leave.startDate)}</td>
                                    <td style={styles.td}>{formatDate(leave.endDate)}</td>
                                    <td style={styles.td}>{leave.department}</td>
                                    <td style={styles.td}>{leave.jobPosition}</td>
                                    <td style={styles.td}>{leave.description}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleEdit(leave)}
                                                style={styles.button('#3498db')}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(leave._id)}
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

export default RestrictLeaves;




