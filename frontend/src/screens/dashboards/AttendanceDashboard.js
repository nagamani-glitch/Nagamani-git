import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserCheck,
  faUserClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./AttendanceDashboard.css";

function AttendanceDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeave: 0,
    attendanceRate: 0,
    averageWorkHours: 0,
    recentAttendance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Updated API URLs to match the ones used in AttendanceRecords.js and TimeOffRequests.js
  const TIMESHEET_API_URL = "http://localhost:5002/api/timesheet";
  const TIME_OFF_API_URL = "http://localhost:5002/api/time-off-requests";
  const EMPLOYEES_API_URL = "http://localhost:5002/api/employees/registered";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);

  //     // Fetch all employees first
  //     const employeesResponse = await axios.get(EMPLOYEES_API_URL);
  //     const employeeData = employeesResponse.data;
  //     setEmployees(employeeData);
      
  //     // Fetch all timesheet records (attendance)
  //     let timesheetResponse;
  //     try {
  //       // Try the /all endpoint first as used in AttendanceRecords.js
  //       timesheetResponse = await axios.get(`${TIMESHEET_API_URL}/all`);
  //     } catch (error) {
  //       console.log("Error fetching from /all endpoint, trying alternative endpoint");
  //       // If /all endpoint fails, try the base endpoint
  //       timesheetResponse = await axios.get(TIMESHEET_API_URL);
  //     }
      
  //     const timesheetData = Array.isArray(timesheetResponse.data) 
  //       ? timesheetResponse.data 
  //       : timesheetResponse.data.timesheets || timesheetResponse.data.data || [];

  //     // Fetch time-off requests
  //     const timeOffResponse = await axios.get(TIME_OFF_API_URL);
  //     const timeOffData = Array.isArray(timeOffResponse.data)
  //       ? timeOffResponse.data
  //       : timeOffResponse.data.requests || timeOffResponse.data.data || [];

  //     // Get today's date in ISO format (YYYY-MM-DD)
  //     const today = new Date().toISOString().split("T")[0];

  //     // Calculate statistics
  //     const totalEmployees = employeeData.length;
      
  //     // Process timesheet data for today
  //     const todayRecords = timesheetData.filter(
  //       (record) => new Date(record.checkInTime).toISOString().split("T")[0] === today
  //     );

  //     const presentToday = todayRecords.length;

  //     const lateToday = todayRecords.filter((record) => {
  //       if (!record.checkInTime) return false;

  //       // Consider employees late if they check in after 9:15 AM (matching AttendanceRecords.js logic)
  //       const checkInTime = new Date(record.checkInTime);
  //       return (
  //         checkInTime.getHours() > 9 ||
  //         (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 15)
  //       );
  //     }).length;

  //     // Get employees on leave from time-off requests
  //     const onLeaveToday = timeOffData.filter((request) => {
  //       const requestDate = new Date(request.date).toISOString().split("T")[0];
  //       return requestDate === today && request.status === "Approved";
  //     }).length;

  //     // Calculate attendance rate (present employees / total employees)
  //     const attendanceRate =
  //       totalEmployees > 0
  //         ? Math.round((presentToday / totalEmployees) * 100)
  //         : 0;

  //     // Calculate average working hours
  //     const workingRecords = timesheetData.filter(
  //       (record) => record.duration && !isNaN(parseFloat(record.duration))
  //     );

  //     const totalWorkHours = workingRecords.reduce(
  //       (sum, record) => sum + (parseFloat(record.duration) / 3600),
  //       0
  //     );

  //     const averageWorkHours =
  //       workingRecords.length > 0
  //         ? (totalWorkHours / workingRecords.length).toFixed(1)
  //         : 0;

  //     // Combine attendance records and time-off requests for recent activity
  //     const enhancedTimesheetData = timesheetData.map(timesheet => {
  //       // Find the employee for this timesheet
  //       const employee = employeeData.find(emp => 
  //         emp._id === timesheet.employeeId || 
  //         emp.Emp_ID === timesheet.employeeId
  //       );
        
  //       // Get employee name
  //       let employeeName = "Unknown Employee";
  //       if (employee) {
  //         if (employee.name) {
  //           employeeName = employee.name;
  //         } else if (employee.personalInfo) {
  //           employeeName = `${employee.personalInfo.firstName || ''} ${employee.personalInfo.lastName || ''}`.trim();
  //         }
  //       }
        
  //       // Determine status
  //       let status = "Absent";
  //       if (timesheet.checkInTime) {
  //         const checkInTime = new Date(timesheet.checkInTime);
  //         if (
  //           checkInTime.getHours() > 9 ||
  //           (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 15)
  //         ) {
  //           status = "Late";
  //         } else if (!timesheet.checkOutTime) {
  //           status = "Checked In";
  //         } else {
  //           status = "Present";
  //         }
  //       }
        
  //       return {
  //         id: timesheet._id,
  //         name: employeeName,
  //         empId: timesheet.employeeId,
  //         date: new Date(timesheet.checkInTime || new Date()),
  //         status: status,
  //         time: timesheet.checkInTime ? new Date(timesheet.checkInTime).toLocaleTimeString() : "-",
  //         type: "attendance",
  //         workType: timesheet.workType || "-",
  //         shift: timesheet.shift || "-",
  //       };
  //     });
      
  //     const enhancedTimeOffData = timeOffData.map(request => {
  //       // Find the employee for this request
  //       const employee = employeeData.find(emp => 
  //         emp._id === request.employeeId || 
  //         emp.Emp_ID === request.employeeId || 
  //         emp._id === request.userId ||
  //         emp.Emp_ID === request.userId
  //       );
        
  //       // Get employee name
  //       let employeeName = request.name || "Unknown Employee";
  //       if (employee && !request.name) {
  //         if (employee.name) {
  //           employeeName = employee.name;
  //         } else if (employee.personalInfo) {
  //           employeeName = `${employee.personalInfo.firstName || ''} ${employee.personalInfo.lastName || ''}`.trim();
  //         }
  //       }
        
  //       return {
  //         id: request._id,
  //         name: employeeName,
  //         empId: request.empId,
  //         date: new Date(request.date),
  //         status: request.status === "Approved"
  //           ? "On Leave"
  //           : request.status === "Pending"
  //           ? "Leave Pending"
  //           : "Leave Rejected",
  //         time: request.checkIn || "-",
  //         type: "timeoff",
  //         workType: request.workType || "-",
  //         shift: request.shift || "-",
  //       };
  //     });

  //     const combinedRecords = [
  //       ...enhancedTimesheetData,
  //       ...enhancedTimeOffData
  //     ];

  //     // Sort by date (most recent first) and take the first 10
  //     const recentAttendance = combinedRecords
  //       .sort((a, b) => b.date - a.date)
  //       .slice(0, 10)
  //       .map((record) => ({
  //         id: record.id,
  //         name: record.name,
  //         empId: record.empId,
  //         status: record.status,
  //         time: record.time,
  //         date: record.date.toLocaleDateString(),
  //         workType: record.workType,
  //         shift: record.shift,
  //       }));

  //     setAttendanceStats({
  //       totalEmployees,
  //       presentToday,
  //       lateToday,
  //       onLeave: onLeaveToday,
  //       attendanceRate,
  //       averageWorkHours,
  //       recentAttendance,
  //     });

  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);

  //     // More detailed error message
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //       console.error("Response status:", error.response.status);
  //       setError(
  //         `Server error: ${error.response.status} - ${
  //           error.response.data.message || "Unknown error"
  //         }`
  //       );
  //     } else if (error.request) {
  //       console.error("No response received:", error.request);
  //       setError(
  //         "No response from server. Please check if the backend is running."
  //       );
  //     } else {
  //       console.error("Error message:", error.message);
  //       setError(`Error: ${error.message}`);
  //     }

  //     setLoading(false);
  //   }
  // };

  // Render mobile view for attendance records
  
  
  // Add this helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Update the fetchDashboardData function to include auth token
const fetchDashboardData = async () => {
  try {
    setLoading(true);

    // Get the authentication token
    const token = getAuthToken();
    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };

    // Fetch all employees with auth token
    const employeesResponse = await axios.get(EMPLOYEES_API_URL, authHeader);
    const employeeData = employeesResponse.data;
    setEmployees(employeeData);
    
    // Fetch all timesheet records with auth token
    let timesheetResponse;
    try {
      // Try the /all endpoint first as used in AttendanceRecords.js
      timesheetResponse = await axios.get(`${TIMESHEET_API_URL}/all`, authHeader);
    } catch (error) {
      console.log("Error fetching from /all endpoint, trying alternative endpoint");
      // If /all endpoint fails, try the base endpoint
      timesheetResponse = await axios.get(TIMESHEET_API_URL, authHeader);
    }
    
    // Fetch time-off requests with auth token
    const timeOffResponse = await axios.get(TIME_OFF_API_URL, authHeader);
    
    // Rest of the function remains the same
  } catch (error) {
    // Error handling remains the same
  }
};


  const renderMobileAttendanceCards = () => {
    if (attendanceStats.recentAttendance.length === 0) {
      return (
        <div className="text-center p-3">
          No recent attendance records found
        </div>
      );
    }

    return attendanceStats.recentAttendance.map((record) => (
      <div key={record.id} className="mobile-attendance-card">
        <div className="mobile-card-header">
          <div className="mobile-card-name">{record.name}</div>
          <span
            className={`status-badge status-${record.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {record.status}
          </span>
        </div>
        <div className="mobile-card-details">
          <div className="mobile-card-row">
            <span className="mobile-card-label">ID:</span>
            <span className="mobile-card-value">{record.empId}</span>
          </div>
          <div className="mobile-card-row">
            <span className="mobile-card-label">Date:</span>
            <span className="mobile-card-value">{record.date}</span>
          </div>
          <div className="mobile-card-row">
            <span className="mobile-card-label">Time:</span>
            <span className="mobile-card-value">{record.time}</span>
          </div>
          {record.shift && record.shift !== "-" && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">Shift:</span>
              <span className="mobile-card-value">{record.shift}</span>
            </div>
          )}
          {record.workType && record.workType !== "-" && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">Work Type:</span>
              <span className="mobile-card-value">{record.workType}</span>
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Container fluid className="attendance-dashboard-content">
          <h2 className="page-title">Attendance Dashboard</h2>
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading attendance data...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <Container fluid className="attendance-dashboard-content">
          <h2 className="page-title">Attendance Dashboard</h2>
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Container fluid className="attendance-dashboard-content">
        <h2 className="page-title">Attendance Dashboard</h2>

        <Row className="stats-cards-att">
          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">
                    {attendanceStats.totalEmployees}
                  </h2>
                  <p className="total-employees-label">Total Employees</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card present-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">
                    {attendanceStats.presentToday}
                  </h2>
                  <p className="stat-label">Present Today</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card late-card">
              <Card.Body>
              <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUserClock}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.lateToday}</h2>
                  <p className="stat-label">Late Today</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card leave-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.onLeave}</h2>
                  <p className="stat-label">On Leave</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6} md={12} sm={12} xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Attendance Rate</h5>
              </Card.Header>
              <Card.Body>
                <div className="attendance-rate-container">
                  <div className="attendance-rate-circle">
                    <div className="attendance-rate-inner">
                      <h2 className="attendance-rate-number">
                        {attendanceStats.attendanceRate}%
                      </h2>
                    </div>
                  </div>
                  <div className="attendance-rate-details">
                    <div className="attendance-detail">
                      <span className="detail-label">Present:</span>
                      <span className="detail-value">
                        {attendanceStats.presentToday}
                      </span>
                    </div>
                    <div className="attendance-detail">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">
                        {attendanceStats.totalEmployees}
                      </span>
                    </div>
                    <div className="attendance-detail">
                      <span className="detail-label">On Leave:</span>
                      <span className="detail-value">
                        {attendanceStats.onLeave}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={12} sm={12} xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Working Hours</h5>
              </Card.Header>
              <Card.Body>
                <div className="working-hours-container">
                  <div className="working-hours-circle">
                    <div className="working-hours-inner">
                      <h2 className="working-hours-number">
                        {attendanceStats.averageWorkHours}
                      </h2>
                      <p className="hours-label">hours</p>
                    </div>
                  </div>
                  <div className="working-hours-details">
                    <p className="working-hours-description">
                      Average working hours per employee
                    </p>
                    <div className="working-hours-stats">
                      <div className="hours-stat">
                        <span className="hours-stat-label">Target:</span>
                        <span className="hours-stat-value">8.0 hours</span>
                      </div>
                      <div className="hours-stat">
                        <span className="hours-stat-label">Variance:</span>
                        <span
                          className={`hours-stat-value ${
                            parseFloat(attendanceStats.averageWorkHours) >= 8
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {(
                            parseFloat(attendanceStats.averageWorkHours) - 8
                          ).toFixed(1)}{" "}
                          hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Recent Attendance</h5>
              </Card.Header>
              <Card.Body>
                {isMobile ? (
                  <div className="mobile-attendance-list">
                    {renderMobileAttendanceCards()}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover attendance-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          {isDesktop && <th>Work Type</th>}
                          {isDesktop && <th>Shift</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStats.recentAttendance.length > 0 ? (
                          attendanceStats.recentAttendance.map((record) => (
                            <tr key={record.id}>
                              <td>{record.name}</td>
                              <td>{record.empId}</td>
                              <td>{record.date}</td>
                              <td>{record.time}</td>
                              <td>
                                <span
                                  className={`status-badge status-${record.status
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              {isDesktop && <td>{record.workType}</td>}
                              {isDesktop && <td>{record.shift}</td>}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isDesktop ? 7 : 5} className="text-center">
                              No recent attendance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AttendanceDashboard;

