import axios from 'axios';

const API_URL = 'http://localhost:5002/api/holidays';

// Fetch all holidays
export const fetchHolidays = () => axios.get(API_URL);

// Create a new holiday
export const createHoliday = (holiday) => {
    // Ensure the payload aligns with the schema
    const { name, startDate, endDate, recurring } = holiday;
    return axios.post(API_URL, { name, startDate, endDate, recurring });
};

// Update a holiday by ID
export const updateHoliday = (id, holiday) => {
    // Ensure the payload aligns with the schema
    const { name, startDate, endDate, recurring } = holiday;
    return axios.put(`${API_URL}/${id}`, { name, startDate, endDate, recurring });
};

// Delete a holiday by ID
export const deleteHoliday = (id) => axios.delete(`${API_URL}/${id}`);

// Fetch filtered holidays
export const fetchFilteredHolidays = (fromDate, toDate, recurring) => {
    const query = new URLSearchParams();
    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);
    if (recurring !== undefined) query.append('recurring', recurring);
    return axios.get(`${API_URL}/filter?${query.toString()}`);
};

// // api/holiday.js
// import axios from 'axios';

// const API_URL = 'http://localhost:5002/api/holidays';

// // Fetch all holidays
// export const fetchHolidays = () => axios.get(API_URL);

// // Create a new holiday
// export const createHoliday = (holiday) => axios.post(API_URL, holiday);

// // Update a holiday by ID
// export const updateHoliday = (id, holiday) => axios.put(`${API_URL}/${id}`, holiday);

// // Delete a holiday by ID
// export const deleteHoliday = (id) => axios.delete(`${API_URL}/${id}`);

// // Fetch filtered holidays
// export const fetchFilteredHolidays = (fromDate, toDate, recurring) => {
//     const query = new URLSearchParams();
//     if (fromDate) query.append('fromDate', fromDate);
//     if (toDate) query.append('toDate', toDate);
//     if (recurring !== undefined) query.append('recurring', recurring);
//     return axios.get(`${API_URL}/filter?${query.toString()}`);
// };
