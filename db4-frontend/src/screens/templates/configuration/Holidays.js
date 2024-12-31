import React, { useState, useEffect } from 'react';
import './Holiday.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/holidays';

// API functions
export const fetchHolidays = () => axios.get(API_URL);
export const createHoliday = (holiday) => axios.post(API_URL, holiday);
export const updateHoliday = (id, holiday) => axios.put(`${API_URL}/${id}`, holiday);
export const deleteHoliday = (id) => axios.delete(`${API_URL}/${id}`);
export const fetchFilteredHolidays = (fromDate, toDate, recurring) => {
    const query = new URLSearchParams();
    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);
    if (recurring !== undefined) query.append('recurring', recurring);
    return axios.get(`${API_URL}/filter?${query.toString()}`);
};

const Holidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHolidays = async () => {
            setLoading(true);
            try {
                const response = await fetchHolidays();
                setHolidays(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load holidays');
                console.error('Error loading holidays:', err);
            } finally {
                setLoading(false);
            }
        };

        loadHolidays();
    }, []);

    return (
        <div className="holidays-container">
            <h2>Holidays</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            <div className="holidays-list">
                {holidays.map((holiday) => (
                    <div key={holiday._id} className="holiday-item">
                        <h3>{holiday.name}</h3>
                        <p>Date: {new Date(holiday.date).toLocaleDateString()}</p>
                        <p>Type: {holiday.type}</p>
                        {holiday.description && <p>Description: {holiday.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Holidays;
