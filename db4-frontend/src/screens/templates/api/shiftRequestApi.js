import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shift-requests';

export const fetchShiftRequests = () => axios.get(API_URL);
export const createShiftRequest = (data) => {
    console.log('Sending data:', data);
    return axios.post(API_URL, data);
  };
export const updateShiftRequest = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteShiftRequest = (id) => axios.delete(`${API_URL}/${id}`);
export const approveShiftRequest = (id) => axios.put(`${API_URL}/${id}/approve`);
export const rejectShiftRequest = (id) => axios.put(`${API_URL}/${id}/reject`);
