import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestrictLeaves.css';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function RestrictLeaves() {
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
        <div className="restrict-leaves-manager">
            <h1>Restricted Leaves</h1>

            <div className="leave-actions">
                <input
                    type="text"
                    placeholder="Search by title, start date, end date, department, or job position"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setIsAddModalOpen(true)}>
                    {isEditing ? 'Edit Restricted Leave' : 'Create +'}
                </button>
            </div>

            <table className="leave-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Department</th>
                        <th>Job Position</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {restrictLeaves
                        .filter(leave =>
                            leave.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.endDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            leave.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((leave) => (
                            <tr key={leave._id}>
                                <td>{leave.title}</td>
                                <td>{formatDate(leave.startDate)}</td>
                                <td>{formatDate(leave.endDate)}</td>
                                <td>{leave.department}</td>
                                <td>{leave.jobPosition}</td>
                                <td>{leave.description}</td>
                                <td>
                                    <button onClick={() => handleEdit(leave)}>Edit</button>
                                    <button onClick={() => handleDelete(leave._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Restricted Leave' : 'Add Restricted Leave'}</h2>
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
                                Start Date:
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Department:
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="Cloud team">Cloud team</option>
                                    <option value="Development team">Development team</option>
                                </select>
                            </label>
                            <label>
                                Job Position:
                                <select
                                    name="jobPosition"
                                    value={formData.jobPosition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Job Position</option>
                                    <option value="Associate Engineer">Associate Engineer</option>
                                    <option value="Senior Engineer">Senior Engineer</option>
                                    <option value="Manager">Manager</option>
                                </select>
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
                            <button type="submit">{isEditing ? 'Save Changes' : 'Add Restricted Leave'}</button>
                            <button type="button" onClick={() => {
                                setIsAddModalOpen(false);
                                setIsEditing(false);
                                setEditId(null);
                            }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
