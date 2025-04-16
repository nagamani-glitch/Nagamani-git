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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import "./AttendanceDashboard.css";

function AttendanceDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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
  
  const ATTENDANCE_API_URL = "http://localhost:5000/api/attendance";
  const TIME_OFF_API_URL = "http://localhost:5000/api/time-off-requests";
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all attendance records
      const attendanceResponse = await axios.get(ATTENDANCE_API_URL);
      const attendanceData = attendanceResponse.data;
      
      // Fetch time-off requests
      const timeOffResponse = await axios.get(TIME_OFF_API_URL);
      const timeOffData = timeOffResponse.data;
      
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate statistics
      const totalEmployees = getUniqueEmployeeCount(attendanceData);
      const todayRecords = attendanceData.filter(record => 
        new Date(record.date).toISOString().split('T')[0] === today
      );
      
      const presentToday = todayRecords.filter(record => 
        record.checkIn && record.checkIn !== "-"
      ).length;
      
      const lateToday = todayRecords.filter(record => {
        if (!record.checkIn || record.checkIn === "-") return false;
        
        // Consider employees late if they check in after 9:30 AM
        const checkInTime = record.checkIn;
        const [hours, minutes] = checkInTime.split(':').map(Number);
        return (hours > 9 || (hours === 9 && minutes > 30));
      }).length;
      
      // Get employees on leave from time-off requests
      const onLeaveToday = timeOffData.filter(request => {
        const requestDate = new Date(request.date).toISOString().split('T')[0];
        return requestDate === today && request.status === "Approved";
      }).length;
      
      // Calculate attendance rate (present employees / total employees)
      const attendanceRate = totalEmployees > 0 
        ? Math.round((presentToday / totalEmployees) * 100) 
        : 0;
      
      // Calculate average working hours
      const workingRecords = attendanceData.filter(record => 
        record.atWork && record.atWork !== "-" && !isNaN(parseFloat(record.atWork))
      );
      
      const totalWorkHours = workingRecords.reduce((sum, record) => 
        sum + parseFloat(record.atWork), 0
      );
      
      const averageWorkHours = workingRecords.length > 0 
        ? (totalWorkHours / workingRecords.length).toFixed(1) 
        : 0;
      
      // Combine attendance records and time-off requests for recent activity
      const combinedRecords = [
        ...attendanceData.map(record => ({
          id: record._id,
          name: record.name,
          empId: record.empId,
          date: new Date(record.date),
          status: getAttendanceStatus(record),
          time: record.checkIn !== "-" ? record.checkIn : "-",
          type: "attendance",
          workType: record.workType || "-",
          shift: record.shift || "-"
        })),
        ...timeOffData.map(request => ({
          id: request._id,
          name: request.name,
          empId: request.empId,
          date: new Date(request.date),
          status: request.status === "Approved" ? "On Leave" : 
                 request.status === "Pending" ? "Leave Pending" : "Leave Rejected",
          time: request.checkIn || "-",
          type: "timeoff",
          workType: request.workType || "-",
          shift: request.shift || "-"
        }))
      ];
      
      // Sort by date (most recent first) and take the first 10
      const recentAttendance = combinedRecords
        .sort((a, b) => b.date - a.date)
        .slice(0, 10)
        .map(record => ({
          id: record.id,
          name: record.name,
          empId: record.empId,
          status: record.status,
          time: record.time,
          date: record.date.toLocaleDateString(),
          workType: record.workType,
          shift: record.shift
        }));
      
      setAttendanceStats({
        totalEmployees,
        presentToday,
        lateToday,
        onLeave: onLeaveToday,
        attendanceRate,
        averageWorkHours,
        recentAttendance,
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      // More detailed error message
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please check if the backend is running.");
      } else {
        console.error("Error message:", error.message);
        setError(`Error: ${error.message}`);
      }
      
      setLoading(false);
    }
  };
  
  // Helper function to get unique employee count
  const getUniqueEmployeeCount = (records) => {
    const uniqueEmployees = new Set();
    records.forEach(record => {
      if (record.empId) {
        uniqueEmployees.add(record.empId);
      }
    });
    return uniqueEmployees.size;
  };
  
  // Helper function to determine attendance status
  const getAttendanceStatus = (record) => {
    if (!record.checkIn || record.checkIn === "-") {
      return record.comment && record.comment.toLowerCase().includes('leave') 
        ? "On Leave" 
        : "Absent";
    }
    
    // Check if employee was late
    const checkInTime = record.checkIn;
    if (checkInTime) {
      const [hours, minutes] = checkInTime.split(':').map(Number);
      if (hours > 9 || (hours === 9 && minutes > 30)) {
        return "Late";
      }
    }
    
    return "Present";
  };

  // Render mobile view for attendance records
  const renderMobileAttendanceCards = () => {
    if (attendanceStats.recentAttendance.length === 0) {
      return (
        <div className="text-center p-3">No recent attendance records found</div>
      );
    }

    return attendanceStats.recentAttendance.map((record) => (
      <div key={record.id} className="mobile-attendance-card">
        <div className="mobile-card-header">
          <div className="mobile-card-name">{record.name}</div>
          <span className={`status-badge status-${record.status.toLowerCase().replace(/\s+/g, '-')}`}>
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
                  <FontAwesomeIcon icon={faUsers} className="stat-icon-improved" />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.totalEmployees}</h2>
                  <p className="total-employees-label">Total Employees</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card present-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon icon={faUserCheck} className="stat-icon-improved" />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.presentToday}</h2>
                  <p className="stat-label">Present Today</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card late-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon icon={faUserClock} className="stat-icon-improved" />
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
                  <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon-improved" />
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
          <Col lg={6} md={6} sm={12} xs={12}>
            <Card className="mb-4 mb-lg-0">
              <Card.Header>Attendance Rate</Card.Header>
              <Card.Body>
                <div className="attendance-rate">
                  <div className="rate-circle" style={{"--rate": attendanceStats.attendanceRate}}>
                    <span className="rate-percentage">{attendanceStats.attendanceRate}%</span>
                  </div>
                  <p>Average attendance rate this month</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6} md={6} sm={12} xs={12}>
            <Card>
              <Card.Header>Average Working Hours</Card.Header>
              <Card.Body>
                <div className="working-hours">
                  <h3>{attendanceStats.averageWorkHours} hrs</h3>
                  <p>Average working hours per day this month</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                <span className="recent-attendance-title">Recent Attendance & Time-Off Requests</span>
                <button 
                  className="btn btn-sm btn-outline-primary mt-2 mt-sm-0" 
                  onClick={fetchDashboardData}
                >
                                   Refresh
                </button>
              </Card.Header>
              
              <Card.Body className="p-0 p-sm-3">
                {/* Table view for tablet and desktop */}
                <div className={`table-responsive ${isMobile ? 'd-none' : ''}`}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Employee ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th className={isDesktop ? '' : 'd-none'}>Time</th>
                        <th className={isDesktop ? '' : 'd-none'}>Shift</th>
                        <th className={isDesktop ? '' : 'd-none'}>Work Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceStats.recentAttendance.length > 0 ? (
                        attendanceStats.recentAttendance.map((record) => (
                          <tr key={record.id}>
                            <td>{record.name}</td>
                            <td>{record.empId}</td>
                            <td>{record.date}</td>
                            <td>
                              <span className={`status-badge status-${record.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className={isDesktop ? '' : 'd-none'}>{record.time}</td>
                            <td className={isDesktop ? '' : 'd-none'}>{record.shift}</td>
                            <td className={isDesktop ? '' : 'd-none'}>{record.workType}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isDesktop ? 7 : 4} className="text-center">
                            No recent attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Card view for mobile */}
                <div className={`mobile-attendance-cards ${isMobile ? '' : 'd-none'}`}>
                  {renderMobileAttendanceCards()}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AttendanceDashboard;
 
