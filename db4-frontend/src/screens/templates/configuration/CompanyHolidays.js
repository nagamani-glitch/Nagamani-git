import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompanyHolidays.css';

// Set API base URL from environment variable
const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function CompanyHolidays() {
    const [companyHolidays, setCompanyHolidays] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ week: '', day: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCompanyHolidays();
    }, []);

    // Fetch company holidays
    const fetchCompanyHolidays = async () => {
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/companyHolidays`);
            setCompanyHolidays(data);
        } catch (err) {
            console.error('Error fetching company holidays:', err);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${apiBaseURL}/api/companyHolidays/${editId}`, formData);
                console.log(`Updated holiday with ID: ${editId}`);
            } else {
                await axios.post(`${apiBaseURL}/api/companyHolidays`, formData);
                console.log(`Added new holiday`);
            }
            fetchCompanyHolidays();
            setIsAddModalOpen(false);
            setFormData({ week: '', day: '' });
            setIsEditing(false);
            setEditId(null);
        } catch (err) {
            console.error('Error creating/updating company holiday:', err);
        }
    };

    // Handle edit action
    const handleEdit = (holiday) => {
        setFormData({ week: holiday.week, day: holiday.day });
        setEditId(holiday._id);  // Make sure the correct ID is being set
        setIsEditing(true);
        setIsAddModalOpen(true);
    };

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiBaseURL}/api/companyHolidays/${id}`);
            console.log(`Deleted holiday with ID: ${id}`);
            fetchCompanyHolidays();
        } catch (err) {
            console.error('Error deleting company holiday:', err.message);
        }
    };

    return (
        <div className="company-holiday-manager">
            <h1>Company Holidays</h1>

            <div className="holiday-actions">
                <input
                    type="text"
                    placeholder="Search by day or week"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setIsAddModalOpen(true)}>
                    {isEditing ? 'Edit Company Holiday' : 'Add New Company Holiday'}
                </button>
            </div>

            <table className="holiday-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Day</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companyHolidays
                        .filter(holiday =>
                            holiday.week.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            holiday.day.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((holiday) => (
                            <tr key={holiday._id}>
                                <td>{holiday.week}</td>
                                <td>{holiday.day}</td>
                                <td>
                                    <button onClick={() => handleEdit(holiday)}>Edit</button>
                                    <button onClick={() => handleDelete(holiday._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Company Holiday' : 'Add Company Holiday'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Based on Week:
                                <select name="week" value={formData.week} onChange={handleChange} required>
                                    <option value="">Select Week</option>
                                    <option value="First">First</option>
                                    <option value="Second">Second</option>
                                    <option value="Third">Third</option>
                                    <option value="Fourth">Fourth</option>
                                    <option value="Fifth">Fifth</option>
                                    <option value="All Weeks">All Weeks</option>
                                </select>
                            </label>
                            <label>
                                Based on Day:
                                <select name="day" value={formData.day} onChange={handleChange} required>
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </label>
                            <button type="submit">{isEditing ? 'Save Changes' : 'Add Holiday'}</button>
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
