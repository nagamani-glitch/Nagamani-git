import React, { useState, useEffect } from 'react';
import { fetchHolidays, createHoliday, updateHoliday, deleteHoliday, fetchFilteredHolidays } from '../api/holidays'; // Ensure `fetchFilteredHolidays` is defined in your backend API
import './Holiday.css';

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', recurring: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filter, setFilter] = useState({ fromDate: '', toDate: '', recurring: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHolidaysData();
    }, []);

    // Fetch holidays from the server
    const fetchHolidaysData = async () => {
        try {
            const { data } = await fetchHolidays();
            setHolidays(data);
            setError(null);  // Reset error on successful fetch
        } catch (err) {
            console.error('Error fetching holidays:', err);
            setError('Error fetching holidays. Please try again later.');
        }
    };

    // for date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    // Handle form submission for adding/updating holiday
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedHoliday) {
                await updateHoliday(selectedHoliday._id, formData);
            } else {
                await createHoliday(formData);
            }
            fetchHolidaysData();
            clearForm();
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Error saving holiday:', err);
            setError('Error saving holiday. Please try again later.');
        }
    };

    // Clear form data and selected holiday
    const clearForm = () => {
        setFormData({ name: '', startDate: '', endDate: '', recurring: false });
        setSelectedHoliday(null);
    };

    // Populate form with selected holiday data for editing
    const handleEdit = (holiday) => {
        setSelectedHoliday(holiday);
        setFormData({
            name: holiday.name,
            startDate: new Date(holiday.startDate).toISOString().substr(0, 10),
            endDate: new Date(holiday.endDate).toISOString().substr(0, 10),
            recurring: holiday.recurring
        });
        setIsAddModalOpen(true);
    };

    // Handle holiday deletion
    const handleDelete = async (id) => {
        try {
            await deleteHoliday(id);
            fetchHolidaysData();
        } catch (err) {
            console.error('Error deleting holiday:', err);
            setError('Error deleting holiday. Please try again later.');
        }
    };

    // Fetch filtered holidays from backend
    const handleFilterSubmit = async () => {
        try {
            const { data } = await fetchFilteredHolidays(filter.fromDate, filter.toDate, filter.recurring);
            setHolidays(data);
            setIsFilterModalOpen(false);
            setError(null);  // Reset error on successful fetch
        } catch (err) {
            console.error('Error filtering holidays:', err);
            setError('Error applying filter. Please try again later.');
        }
    };

    // Clear filter and reset holidays to original state
    const clearFilter = () => {
        setFilter({ fromDate: '', toDate: '', recurring: null });
        fetchHolidaysData();  // Fetch and display original holiday list
        setIsFilterModalOpen(false);  // Close filter modal
    };

    return (
        <div className="holiday-manager">
            <h1>Holidays</h1>

            {error && <div className="error-message">{error}</div>} {/* Display error message */}

            <div className="holiday-actions">
                <input
                    type="text"
                    placeholder="Search by holiday name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setIsFilterModalOpen(true)}>Filter</button>
                <button onClick={() => setIsAddModalOpen(true)}>Add New Holiday</button>
            </div>

            <table className="holiday-table">
                <thead>
                    <tr>
                        <th>Holiday Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Recurring</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.filter(holiday => holiday.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((holiday) => (
                        <tr key={holiday._id}>
                            <td>{holiday.name}</td>
                            <td>{formatDate(new Date(holiday.startDate).toLocaleDateString())}</td>
                            <td>{formatDate(new Date(holiday.endDate).toLocaleDateString())}</td>
                            <td>{holiday.recurring ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleEdit(holiday)}>Edit</button>
                                <button onClick={() => handleDelete(holiday._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add/Edit Holiday Modal */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Holiday Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
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
                                Recurring:
                                <input
                                    type="checkbox"
                                    name="recurring"
                                    checked={formData.recurring}
                                    onChange={handleChange}
                                />
                            </label>
                            <button type="submit">{selectedHoliday ? 'Update' : 'Add'} Holiday</button>
                            <button type="button" onClick={() => { clearForm(); setIsAddModalOpen(false); }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Filter Holidays</h2>
                        <label>
                            From Date:
                            <input
                                type="date"
                                value={filter.fromDate}
                                onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
                            />
                        </label>
                        <label>
                            To Date:
                            <input
                                type="date"
                                value={filter.toDate}
                                onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
                            />
                        </label>
                        <label>
                            Recurring:
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name="recurring"
                                        value="yes"
                                        checked={filter.recurring === true}
                                        onChange={() => setFilter({ ...filter, recurring: true })}
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="recurring"
                                        value="no"
                                        checked={filter.recurring === false}
                                        onChange={() => setFilter({ ...filter, recurring: false })}
                                    />
                                    No
                                </label>
                            </div>
                        </label>

                        <button onClick={handleFilterSubmit}>Apply Filter</button>
                        <button onClick={() => setIsFilterModalOpen(false)}>Cancel</button>
                        <button onClick={clearFilter}>Clear Filter</button> {/* Clear Filter Button */}
                    </div>
                </div>
            )}
        </div>
    );
}
