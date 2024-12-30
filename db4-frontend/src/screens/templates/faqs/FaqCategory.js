import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./FaqCategory.css";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function FaqCategory() {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
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
        try {
            await axios.post(`${apiBaseURL}/api/faqCategories`, formData);
            fetchCategories();
            setIsAddModalOpen(false);
            setFormData({ title: '', description: '' });
        } catch (err) {
            console.error('Error creating category:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="faq-category-manager">
            <h1>FAQ Categories</h1>

            <div className="category-actions">
                <input
                    type="text"
                    placeholder="Search by title"
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
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories
                        .filter(category =>
                            category.title.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((category) => (
                            <tr key={category._id}>
                                <td>{category.title}</td>
                                <td>{category.description}</td>
                                <td>
                                <button onClick={() => window.location.href = `/faq/${category._id}`}>
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
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
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
