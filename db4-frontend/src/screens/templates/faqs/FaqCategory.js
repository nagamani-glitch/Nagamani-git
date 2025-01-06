import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./FaqCategory.css";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function FaqCategory() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        console.log("API Base URL:", apiBaseURL); // Debugging: Ensure base URL is correct
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/faqCategories`);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching FAQ categories:', err.response ? err.response.data : err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (!formData.name.trim()) {
            setErrorMessage('Category name is required.');
            return;
        }

        try {
            console.log("Submitting form data:", formData); // Debugging payload
            await axios.post(`${apiBaseURL}/api/faqCategories`, formData);
            fetchCategories(); // Refresh categories
            setIsAddModalOpen(false);
            setFormData({ name: '', description: '' }); // Reset form
            setErrorMessage(null); // Clear any previous errors
        } catch (err) {
            console.error('Error creating category:', err.response ? err.response.data : err.message);
            setErrorMessage(err.response?.data?.error || 'Failed to create category.');
        }
    };

    return (
        <div className="faq-category-manager">
            <h1>FAQ Categories</h1>

            <div className="category-actions">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setIsAddModalOpen(true)}>
                    Create Category
                </button>
            </div>

            <table className="category-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories
                        .filter(category =>
                            category.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button onClick={() => navigate(`/faq/${category._id}`)}>
                                        View FAQs
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add FAQ Category</h2>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <button type="submit">Add Category</button>
                            <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
