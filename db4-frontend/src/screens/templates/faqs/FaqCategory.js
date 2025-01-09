import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FiMoreVertical } from 'react-icons/fi';
// import "./FaqCategory.css";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
    top: '30%',
    left: '25%',
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

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    transition: 'border-color 0.3s ease',
    outline: 'none'
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
        gsap.from(".faq-category-manager", { opacity: 0.8, duration: 1, y: -50 });
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowActions(null);
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqCategories`);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching FAQ categories:', err.response?.data || err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={containerStyle}
            className="faq-category-manager"
        >
            <h1 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>FAQ Categories</h1>

            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem',
                justifyContent: 'space-between' 
            }}>
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingCategoryId(null);
                        setIsAddModalOpen(true);
                    }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Create Category
                </motion.button>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem' 
            }}>
                {categories
                    .filter(category => 
                        category?.title?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((category) => (
                        <motion.div
                            key={category._id}
                            whileHover={{ scale: 1.02 }}
                            style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                setShowActions(showActions === category._id ? null : category._id);
                            }}
                            >
                                <FiMoreVertical size={20} />
                            </motion.div>
                                
                                {showActions === category._id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{
                                            position: 'absolute',
                                            right: '0',
                                            top: '25px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            padding: '0.5rem',
                                            zIndex: 10
                                        }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => openEditModal(category)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '0.5rem 1rem',
                                                marginBottom: '0.5rem',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleDelete(category._id)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{category.title}</h3>
                            <p style={{ color: '#34495e', marginBottom: '1rem' }}>{category.description}</p>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/faq/${category._id}`)}
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
                                View FAQs
                            </motion.button>
                        </motion.div>
                    ))}
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 999
                            }}
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            style={modalStyle}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                        >
                            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
                                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                {errorMessage && (
                                    <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{errorMessage}</p>
                                )}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Description:
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, minHeight: '100px' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#2ecc71',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {editingCategoryId ? 'Update' : 'Create'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsAddModalOpen(false)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
