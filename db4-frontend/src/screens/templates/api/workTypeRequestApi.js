import axios from 'axios';

const API_URL = `http://localhost:5000/api/work-type-requests`;

export const fetchWorkTypeRequests = () => axios.get(API_URL);
export const createWorkTypeRequest = (data) => {
    console.log('Sending data:', data);
    return axios.post(API_URL, data);
  };
export const updateWorkTypeRequest = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteWorkTypeRequest = (id) => axios.delete(`${API_URL}/${id}`);
export const approveWorkTypeRequest = (id) => axios.put(`${API_URL}/${id}/approve`);
export const rejectWorkTypeRequest = (id) => axios.put(`${API_URL}/${id}/reject`);
