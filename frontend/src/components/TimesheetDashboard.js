// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
// import { timesheetService } from '../services/timesheetService';
// import { FaClock, FaUserClock, FaChartLine, FaHistory, FaRegCalendarCheck, FaRegClock } from 'react-icons/fa';
// import './TimesheetDashboard.css';

// const TimesheetDashboard = () => {
//   const [todayTimesheet, setTodayTimesheet] = useState(null);
//   const [weeklyTimesheets, setWeeklyTimesheets] = useState([]);
//   const [weeklyStats, setWeeklyStats] = useState({
//     totalHours: 0,
//     averageDaily: 0,
//     onTimePercentage: 0,
//     overtime: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const employeeId = localStorage.getItem('employeeId') || 'EMP123';

//   useEffect(() => {
//     fetchTimesheetData();
//     const interval = setInterval(fetchTimesheetData, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchTimesheetData = async () => {
//     try {
//       setLoading(true);
//       const todayResponse = await timesheetService.getTodayTimesheet(employeeId);
//       const weeklyResponse = await timesheetService.getWeeklyTimesheets(employeeId);
      
//       setTodayTimesheet(todayResponse.data.timesheet);
//       setWeeklyTimesheets(weeklyResponse.data.timesheets);
//       calculateWeeklyStats(weeklyResponse.data.timesheets);
//     } catch (error) {
//       console.error('Failed to fetch timesheet data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateWeeklyStats = (timesheets) => {
//     if (!timesheets.length) return;

//     const totalSeconds = timesheets.reduce((acc, curr) => acc + (curr.duration || 0), 0);
//     const daysWorked = timesheets.length;
//     const standardDaySeconds = 8 * 3600;

//     const onTimeCount = timesheets.filter(timesheet => {
//       const checkInTime = new Date(timesheet.checkInTime);
//       return checkInTime.getHours() <= 9 && checkInTime.getMinutes() <= 15;
//     }).length;

//     const overtimeSeconds = timesheets.reduce((acc, curr) => {
//       return acc + Math.max(0, (curr.duration || 0) - standardDaySeconds);
//     }, 0);

//     setWeeklyStats({
//       totalHours: formatDuration(totalSeconds),
//       averageDaily: formatDuration(totalSeconds / daysWorked),
//       onTimePercentage: Math.round((onTimeCount / timesheets.length) * 100),
//       overtime: formatDuration(overtimeSeconds)
//     });
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       active: 'primary',
//       completed: 'success',
//       pending: 'warning',
//       late: 'danger'
//     };
//     return <Badge bg={statusColors[status] || 'secondary'} className="status-badge">{status}</Badge>;
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" variant="primary" size="lg" />
//         <p className="loading-text">Loading timesheet data...</p>
//       </div>
//     );
//   }

//   return (
//     <Container fluid className="timesheet-dashboard">
//       <div className="dashboard-header">
//         <div className="header-content">
//           <FaClock className="header-icon pulse" />
//           <div>
//             <h1>Timesheet Dashboard</h1>
//             <p className="header-subtitle">Track your time, boost your productivity</p>
//           </div>
//         </div>
//       </div>

//       <Row className="mt-4 g-4">
//         <Col lg={6}>
//           <Card className="today-summary animated-card">
//             <Card.Header>
//               <FaUserClock className="card-icon" />
//               <h4>Today's Summary</h4>
//             </Card.Header>
//             <Card.Body>
//               {todayTimesheet ? (
//                 <div className="summary-grid">
//                   <div className="summary-item">
//                     <div className="item-label">
//                       <FaRegCalendarCheck />
//                       <span>Status</span>
//                     </div>
//                     {getStatusBadge(todayTimesheet.status)}
//                   </div>
//                   <div className="summary-item">
//                     <div className="item-label">
//                       <FaRegClock />
//                       <span>Check-in Time</span>
//                     </div>
//                     <span className="time-value">
//                       {new Date(todayTimesheet.checkInTime).toLocaleTimeString()}
//                     </span>
//                   </div>
//                   {todayTimesheet.checkOutTime && (
//                     <div className="summary-item">
//                       <div className="item-label">
//                         <FaRegClock />
//                         <span>Check-out Time</span>
//                       </div>
//                       <span className="time-value">
//                         {new Date(todayTimesheet.checkOutTime).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   )}
//                   {todayTimesheet.duration > 0 && (
//                     <div className="summary-item total-duration">
//                       <div className="item-label">
//                         <FaClock />
//                         <span>Total Duration</span>
//                       </div>
//                       <span className="duration-value">
//                         {formatDuration(todayTimesheet.duration)}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="no-data-container">
//                   <FaUserClock size={48} />
//                   <p>No timesheet record for today</p>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={6}>
//           <Card className="weekly-stats animated-card">
//             <Card.Header>
//               <FaChartLine className="card-icon" />
//               <h4>Weekly Performance</h4>
//             </Card.Header>
//             <Card.Body>
//               <div className="stats-grid">
//                 <div className="stat-card">
//                   <div className="stat-circle">
//                     <h5>Total Hours</h5>
//                     <p>{weeklyStats.totalHours}</p>
//                   </div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-circle">
//                     <h5>Daily Average</h5>
//                     <p>{weeklyStats.averageDaily}</p>
//                   </div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-circle">
//                     <h5>Punctuality</h5>
//                     <p>{weeklyStats.onTimePercentage}%</p>
//                   </div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-circle">
//                     <h5>Overtime</h5>
//                     <p>{weeklyStats.overtime}</p>
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mt-4">
//         <Col>
//           <Card className="weekly-timesheet animated-card">
//             <Card.Header>
//               <FaHistory className="card-icon" />
//               <h4>Weekly Timesheet History</h4>
//             </Card.Header>
//             <Card.Body className="table-responsive">
//               <Table hover className="custom-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Check-in</th>
//                     <th>Check-out</th>
//                     <th>Duration</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {weeklyTimesheets.map((timesheet, index) => (
//                     <tr 
//                       key={index} 
//                       className={`timesheet-row ${timesheet.status === 'active' ? 'active-row' : ''}`}
//                     >
//                       <td className="date-cell">
//                         {new Date(timesheet.checkInTime).toLocaleDateString('en-US', {
//                           weekday: 'short',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </td>
//                       <td>{new Date(timesheet.checkInTime).toLocaleTimeString()}</td>
//                       <td>
//                         {timesheet.checkOutTime 
//                           ? new Date(timesheet.checkOutTime).toLocaleTimeString() 
//                           : '-'
//                         }
//                       </td>
//                       <td className="duration-cell">{formatDuration(timesheet.duration || 0)}</td>
//                       <td>{getStatusBadge(timesheet.status)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TimesheetDashboard;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { timesheetService } from '../services/timesheetService';
import { FaClock, FaUserClock, FaChartLine, FaHistory, FaRegCalendarCheck, FaRegClock, FaCalendarAlt, FaStopwatch } from 'react-icons/fa';
import './TimesheetDashboard.css';

const TimesheetDashboard = () => {
  const [todayTimesheet, setTodayTimesheet] = useState(null);
  const [weeklyTimesheets, setWeeklyTimesheets] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    totalHours: 0,
    averageDaily: 0,
    onTimePercentage: 0,
    overtime: 0
  });
  const [todayLoading, setTodayLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const employeeId = localStorage.getItem('employeeId') || 'EMP123';

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  useEffect(() => {
    fetchTimesheetData();
    
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchTimesheetData();
      }
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTimesheetData = async () => {
    try {
      setTodayLoading(true);
      const todayResponse = await timesheetService.getTodayTimesheet(employeeId);
      setTodayTimesheet(todayResponse.data.timesheet);
      setTodayLoading(false);

      setWeeklyLoading(true);
      const weeklyResponse = await timesheetService.getWeeklyTimesheets(employeeId);
      setWeeklyTimesheets(weeklyResponse.data.timesheets);
      calculateWeeklyStats(weeklyResponse.data.timesheets);
      setWeeklyLoading(false);
    } catch (error) {
      console.error('Failed to fetch timesheet data:', error);
      setTodayLoading(false);
      setWeeklyLoading(false);
    }
  };

  const calculateWeeklyStats = (timesheets) => {
    if (!timesheets.length) return;

    const totalSeconds = timesheets.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const daysWorked = timesheets.length;
    const standardDaySeconds = 8 * 3600;

    const onTimeCount = timesheets.filter(timesheet => {
      const checkInTime = new Date(timesheet.checkInTime);
      return checkInTime.getHours() <= 9 && checkInTime.getMinutes() <= 15;
    }).length;

    const overtimeSeconds = timesheets.reduce((acc, curr) => {
      return acc + Math.max(0, (curr.duration || 0) - standardDaySeconds);
    }, 0);

    setWeeklyStats({
      totalHours: formatDuration(totalSeconds),
      averageDaily: formatDuration(totalSeconds / daysWorked),
      onTimePercentage: Math.round((onTimeCount / timesheets.length) * 100),
      overtime: formatDuration(overtimeSeconds)
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'primary',
      completed: 'success',
      pending: 'warning',
      late: 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'} className="status-badge">{status}</Badge>;
  };

  if (todayLoading && weeklyLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="loading-text">Loading timesheet data...</p>
      </div>
    );
  }

  return (
    <Container fluid className="timesheet-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaClock className="header-icon pulse" />
          </div>
          <div className="header-text">
            <h1>Timesheet Dashboard</h1>
            <p className="header-subtitle">Track your time, boost your productivity</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="quick-stat">
            <FaCalendarAlt />
            <span>Week {getWeekNumber(new Date())}</span>
          </div>
          <div className="quick-stat">
            <FaStopwatch />
            <span>{weeklyStats.totalHours} This Week</span>
          </div>
        </div>
      </div>

      <Row className="mt-4 g-4">
        <Col lg={6}>
          <Card className="today-summary animated-card">
            <Card.Header>
              <FaUserClock className="card-icon" />
              <h4>Today's Summary</h4>
            </Card.Header>
            <Card.Body>
              {todayTimesheet ? (
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="item-label">
                      <FaRegCalendarCheck />
                      <span>Status</span>
                    </div>
                    {getStatusBadge(todayTimesheet.status)}
                  </div>
                  <div className="summary-item">
                    <div className="item-label">
                      <FaRegClock />
                      <span>Check-in Time</span>
                    </div>
                    <span className="time-value">
                      {new Date(todayTimesheet.checkInTime).toLocaleTimeString()}
                    </span>
                  </div>
                  {todayTimesheet.checkOutTime && (
                    <div className="summary-item">
                      <div className="item-label">
                        <FaRegClock />
                        <span>Check-out Time</span>
                      </div>
                      <span className="time-value">
                        {new Date(todayTimesheet.checkOutTime).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {todayTimesheet.duration > 0 && (
                    <div className="summary-item total-duration">
                      <div className="item-label">
                        <FaClock />
                        <span>Total Duration</span>
                      </div>
                      <span className="duration-value">
                        {formatDuration(todayTimesheet.duration)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-data-container">
                  <FaUserClock size={48} />
                  <p>No timesheet record for today</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="weekly-stats animated-card">
            <Card.Header>
              <FaChartLine className="card-icon" />
              <h4>Weekly Performance</h4>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-circle">
                    <h5>Total Hours</h5>
                    <p>{weeklyStats.totalHours}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-circle">
                    <h5>Daily Average</h5>
                    <p>{weeklyStats.averageDaily}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-circle">
                    <h5>Punctuality</h5>
                    <p>{weeklyStats.onTimePercentage}%</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-circle">
                    <h5>Overtime</h5>
                    <p>{weeklyStats.overtime}</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="weekly-timesheet animated-card">
            <Card.Header>
              <FaHistory className="card-icon" />
              <h4>Weekly Timesheet History</h4>
            </Card.Header>
            <Card.Body className="table-responsive">
              <Table hover className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyTimesheets.map((timesheet, index) => (
                    <tr 
                      key={index} 
                      className={`timesheet-row ${timesheet.status === 'active' ? 'active-row' : ''}`}
                    >
                      <td className="date-cell">
                        {new Date(timesheet.checkInTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>{new Date(timesheet.checkInTime).toLocaleTimeString()}</td>
                      <td>
                        {timesheet.checkOutTime 
                          ? new Date(timesheet.checkOutTime).toLocaleTimeString() 
                          : '-'
                        }
                      </td>
                      <td className="duration-cell">{formatDuration(timesheet.duration || 0)}</td>
                      <td>{getStatusBadge(timesheet.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TimesheetDashboard;
