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
import Sidebar from "../templates/sidebar/Sidebar";
import "./AttendanceDashboard.css";

function AttendanceDashboard() {
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
  
  const API_URL = "http://localhost:5000/api/attendance";
  
  useEffect(() => {
    fetchAttendanceData();
  }, []);
  
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch all attendance records
      const response = await axios.get(API_URL);
      const attendanceData = response.data;
      
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
      
      const onLeave = todayRecords.filter(record => 
        (!record.checkIn || record.checkIn === "-") && record.comment && record.comment.toLowerCase().includes('leave')
      ).length;
      
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
      
      // Get recent attendance (last 5 records)
      const recentAttendance = attendanceData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(record => ({
          id: record._id,
          name: record.name,
          status: getAttendanceStatus(record),
          time: record.checkIn !== "-" ? record.checkIn : "-"
        }));
      
      setAttendanceStats({
        totalEmployees,
        presentToday,
        lateToday,
        onLeave,
        attendanceRate,
        averageWorkHours,
        recentAttendance,
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      
      // More detailed error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("No response from server. Please check if the backend is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Container fluid>
            <h2 className="page-title">Attendance Dashboard</h2>
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading attendance data...</p>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Container fluid>
            <h2 className="page-title">Attendance Dashboard</h2>
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Container fluid className="attendance-dashboard">
          <h2 className="page-title">Attendance Dashboard</h2>
          
          <Row className="stats-cards">
            <Col md={3}>
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
            
            <Col md={3}>
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
            
            <Col md={3}>
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
            
            <Col md={3}>
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
            <Col md={6}>
              <Card>
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
            
            <Col md={6}>
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
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Recent Attendance</span>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={fetchAttendanceData}
                  >
                    Refresh
                  </button>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStats.recentAttendance.length > 0 ? (
                          attendanceStats.recentAttendance.map((employee) => (
                            <tr key={employee.id}>
                              <td>{employee.name}</td>
                              <td>
                                <span className={`status-badge ${employee.status.toLowerCase().replace(' ', '-')}`}>
                                  {employee.status}
                                </span>
                              </td>
                              <td>{employee.time}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">No recent attendance records found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    
     

    </div>
  );
}

export default AttendanceDashboard;
