// import axios from 'axios';
 
// const API_URL = 'http://localhost:5000/api/timesheet';
 
// export const timesheetService = {
//   checkIn: (employeeId) => {
//     return axios.post(`${API_URL}/check-in`, { employeeId });
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
 
const API_URL = 'http://localhost:5000/api/timesheet';
 
export const timesheetService = {
  checkIn: (employeeId, employeeName) => {
    return axios.post(`${API_URL}/check-in`, { employeeId, employeeName });
  },
 
  checkOut: (employeeId, duration) => {
    return axios.post(`${API_URL}/check-out`, { employeeId, duration });
  },
 
  getTodayTimesheet: (employeeId) => {
    return axios.get(`${API_URL}/today?employeeId=${employeeId}`);
  },
 
  getWeeklyTimesheets: (employeeId) => {
    return axios.get(`${API_URL}/weekly?employeeId=${employeeId}`);
  },
 
  getAllTimesheets: () => {
    return axios.get(`${API_URL}`);
  },
 
  getTimesheetById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },
 
  updateTimesheet: (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
  },
 
  deleteTimesheet: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  }
};
