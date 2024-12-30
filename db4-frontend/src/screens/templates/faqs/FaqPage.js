import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./FaqPage.css";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function FaqPage() {
    const { categoryId } = useParams();
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [editingFaq, setEditingFaq] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch FAQs by category ID
    const fetchFaqs = useCallback(async () => {
        if (!categoryId) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqs/category/${categoryId}`);
            setFaqs(data);
            setFilteredFaqs(data); // Set filteredFAQs to initial data
            setError(null);
        } catch (err) {
            console.error('Error fetching FAQs:', err);
            setError('Failed to fetch FAQs.');
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter FAQs based on the query
        const filtered = faqs.filter((faq) =>
            faq.question.toLowerCase().includes(query)
        );
        setFilteredFaqs(filtered);
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingFaq({ ...editingFaq, [name]: value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: newFaq } = await axios.post(`${apiBaseURL}/api/faqs/category/${categoryId}`, formData);
            setFaqs([...faqs, newFaq]);
            setFilteredFaqs([...faqs, newFaq]);
            setIsAddModalOpen(false);
            setFormData({ question: '', answer: '' });
            setError(null);
        } catch (err) {
            console.error('Error adding FAQ:', err);
            setError('Failed to add FAQ.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedFaq } = await axios.put(`${apiBaseURL}/api/faqs/${editingFaq._id}`, editingFaq);
            const updatedFaqs = faqs.map((faq) => (faq._id === editingFaq._id ? updatedFaq : faq));
            setFaqs(updatedFaqs);
            setFilteredFaqs(updatedFaqs);
            setIsEditModalOpen(false);
            setEditingFaq(null);
            setError(null);
        } catch (err) {
            console.error('Error editing FAQ:', err);
            setError('Failed to edit FAQ.');
        }
    };

    const handleDelete = async (faqId) => {
        try {
            await axios.delete(`${apiBaseURL}/api/faqs/${faqId}`);
            const updatedFaqs = faqs.filter((faq) => faq._id !== faqId);
            setFaqs(updatedFaqs);
            setFilteredFaqs(updatedFaqs);
            setError(null);
        } catch (err) {
            console.error('Error deleting FAQ:', err);
            setError('Failed to delete FAQ.');
        }
    };

    return (
        <div className="faq-page">
            <h1>FAQs</h1>
            <div className="header-actions">
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="create-button" onClick={() => setIsAddModalOpen(true)}>
                    + Create
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <ul>
                {filteredFaqs.map((faq) => (
                    <li
                        key={faq._id}
                        onClick={() => {
                            const updatedFaqs = filteredFaqs.map((item) =>
                                item._id === faq._id
                                    ? { ...item, expanded: !item.expanded }
                                    : { ...item, expanded: false }
                            );
                            setFilteredFaqs(updatedFaqs);
                        }}
                        className={faq.expanded ? 'expanded' : ''}
                    >
                        <h3>{faq.question}</h3>
                        <div className="answer">{faq.answer}</div>
                        <div className="action-buttons">
                            <button
                                className="edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFaq(faq);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(faq._id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Add FAQ Modal */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add FAQ</h2>
                        <form onSubmit={handleAddSubmit}>
                            <label>
                                Question:
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleAddChange}
                                    required
                                />
                            </label>
                            <label>
                                Answer:
                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleAddChange}
                                    required
                                />
                            </label>
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit FAQ Modal */}
            {isEditModalOpen && editingFaq && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit FAQ</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Question:
                                <input
                                    type="text"
                                    name="question"
                                    value={editingFaq.question}
                                    onChange={handleEditChange}
                                    required
                                />
                            </label>
                            <label>
                                Answer:
                                <textarea
                                    name="answer"
                                    value={editingFaq.answer}
                                    onChange={handleEditChange}
                                    required
                                />
                            </label>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
