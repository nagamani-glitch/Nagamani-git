// import axios from 'axios';
 
// const API_URL = 'http://localhost:5002/api/timesheet';
 
// export const timesheetService = {
//   checkIn: (employeeId, employeeName) => {
//     return axios.post(`${API_URL}/check-in`, { employeeId, employeeName });
//   },
 
//   checkOut: (employeeId, duration) => {
//     return axios.post(`${API_URL}/check-out`, { employeeId, duration });
//   },
 
//   getTodayTimesheet: (employeeId) => {
//     return axios.get(`${API_URL}/today?employeeId=${employeeId}`);
//   },
 
//   getWeeklyTimesheets: (employeeId) => {
//     return axios.get(`${API_URL}/weekly?employeeId=${employeeId}`);
//   },
 
//   getAllTimesheets: () => {
//     return axios.get(`${API_URL}`);
//   },
 
//   getTimesheetById: (id) => {
//     return axios.get(`${API_URL}/${id}`);
//   },
 
//   updateTimesheet: (id, data) => {
//     return axios.put(`${API_URL}/${id}`, data);
//   },
 
//   deleteTimesheet: (id) => {
//     return axios.delete(`${API_URL}/${id}`);
//   }
// };

import axios from 'axios';
 
const API_URL = 'http://localhost:5002/api/timesheet';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};
 
export const timesheetService = {
  checkIn: (employeeId, employeeName) => {
    return axios.post(`${API_URL}/check-in`, 
      { employeeId, employeeName }, 
      getAuthHeaders()
    );
  },
 
  checkOut: (employeeId, duration) => {
    return axios.post(`${API_URL}/check-out`, 
      { employeeId, duration }, 
      getAuthHeaders()
    );
  },
 
  getTodayTimesheet: (employeeId) => {
    return axios.get(
      `${API_URL}/today?employeeId=${employeeId}`, 
      getAuthHeaders()
    );
  },
 
  getWeeklyTimesheets: (employeeId) => {
    return axios.get(
      `${API_URL}/weekly?employeeId=${employeeId}`, 
      getAuthHeaders()
    );
  },
 
  getAllTimesheets: () => {
    return axios.get(`${API_URL}`, getAuthHeaders());
  },
 
  getTimesheetById: (id) => {
    return axios.get(`${API_URL}/${id}`, getAuthHeaders());
  },
 
  updateTimesheet: (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  },
 
  deleteTimesheet: (id) => {
    return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },
  
  getTimesheetsByDateRange: (employeeId, startDate, endDate) => {
    return axios.get(
      `${API_URL}/date-range?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`, 
      getAuthHeaders()
    );
  }
};

