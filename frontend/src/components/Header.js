import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Badge,
  Toast,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaCog,
  FaBuilding,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome,
} from "react-icons/fa";
import { timesheetService } from "../services/timesheetService";
import "./Header.css";
import { useSidebar } from "../Context";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId") || "EMP123";

  // Timesheet states with refs for cleanup
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const timerIntervalRef = useRef(null);
  const timerStartTimeRef = useRef(null);

  useEffect(() => {
    initializeTimesheet();
    return cleanupTimesheet;
  }, []);

  const initializeTimesheet = async () => {
    try {
      const response = await timesheetService.getTodayTimesheet(employeeId);
      const timesheet = response.data.timesheet;

      if (timesheet && timesheet.status === "active") {
        const checkInTime = new Date(timesheet.checkInTime);
        startTimerWithTime(checkInTime);
      }
    } catch (error) {
      showToastMessage("Failed to load timesheet status");
    }
  };

  const startTimerWithTime = (checkInTime) => {
    setStartTime(checkInTime);
    setIsTimerRunning(true);
    timerStartTimeRef.current = checkInTime;
    localStorage.setItem("checkInTime", checkInTime.toISOString());

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - checkInTime) / 1000);
      setTimer(elapsedSeconds);
    }, 1000);
  };

  const cleanupTimesheet = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleTimerClick = async () => {
    try {
      if (isTimerRunning) {
        await timesheetService.checkOut(employeeId, timer);
        cleanupTimesheet();
        setIsTimerRunning(false);
        setTimer(0);
        setStartTime(null);
        localStorage.removeItem("checkInTime");
        showToastMessage("Successfully checked out");
      } else {
        const response = await timesheetService.checkIn(employeeId);
        const checkInTime = new Date(response.data.checkInTime);
        startTimerWithTime(checkInTime);
        showToastMessage("Successfully checked in");
      }
    } catch (error) {
      showToastMessage("Operation failed. Please try again.");
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProfileToggle = () => setShowProfileMenu((prev) => !prev);
  const handleNotificationsToggle = () => setShowNotifications((prev) => !prev);
  const handleCompaniesToggle = () => setShowCompanies((prev) => !prev);

  const handleClickOutside = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    cleanupTimesheet();
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("checkInTime");
    navigate("/login");
  };


  const getPathIndicator = () => {
    const path = location.pathname.split("/").filter(Boolean);
    return path.map((segment, index) => (
      <span key={index}>
        <span 
          className="path-link" 
          onClick={() => navigate(`/${path.slice(0, index + 1).join('/')}`)}
          style={{ 
            cursor: 'pointer',
            color: '#fff',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {segment.charAt(0).toUpperCase() + segment.slice(1)}
        </span>
        {index < path.length - 1 && " > "}
      </span>
    ));
  };
  

  
  
  return (
    <header className="mb-5">
      <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top">
        <Container fluid>
          <Button variant="link" className="me-3" onClick={toggleSidebar}>
            <FaBars size={28} color="white" />
          </Button>

          <LinkContainer to="/">
            <Navbar.Brand className="brand">
              <img
                src="https://res.cloudinary.com/dfl9rotoy/image/upload/v1741065300/logo2-removebg-preview_p6juhh.png"
                alt="Logo"
                style={{
                  width: "auto",
                  height: "120px", // Increased from 100px to 120px
                  marginLeft: "10px",
                  marginTop: "-5px", // Adjusted from 10px to 5px
                  verticalAlign: "middle", // Changed from inherit to middle
                }}
              />
            </Navbar.Brand>
          </LinkContainer>

          <div className="path-indicator" >{getPathIndicator()}</div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <div className="check-in-out-box">
                <Button
                  className={`timer-button ${isTimerRunning ? "active" : ""}`}
                  onClick={handleTimerClick}
                  title={
                    isTimerRunning ? "Click to check-out" : "Click to check-in"
                  }
                >
                  {isTimerRunning ? (
                    <>
                      <FaSignOutAlt className="me-2 rotate" />
                      <span>{`Checked in ${formatTime(timer)}`}</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2 beat" />
                      <span>Check-in</span>
                    </>
                  )}
                </Button>
              </div>

              <Nav.Link
                className="icon-link ms-3"
                onClick={() => navigate("/")}
              >
                <FaHome size={32} title="Home" />
              </Nav.Link>

              <Nav.Link
                className="icon-link ms-3"
                onClick={() => navigate("/settings")}
              >
                <FaCog size={28} title="Settings" />
              </Nav.Link>

              <Nav.Link
                className="icon-link ms-3"
                onClick={handleNotificationsToggle}
              >
                <FaBell size={28} title="Notifications" />
                <Badge bg="danger" pill className="notification-badge">
                  3
                </Badge>
              </Nav.Link>

              <Nav.Link
                className="icon-link ms-3"
                onClick={handleCompaniesToggle}
              >
                <FaBuilding size={28} title="Companies" />
              </Nav.Link>

              <NavDropdown
                title={<FaUserCircle size={28} color="white" />}
                id="profile-dropdown"
                show={showProfileMenu}
                onClick={handleProfileToggle}
                ref={profileMenuRef}
                align="end"
                className="profile-dropdown ms-3"
              >
                <div className="dropdown-header d-flex align-items-center px-3 py-2">
                  <strong>{employeeId}</strong>
                </div>
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/change-password")}>
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {token ? (
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="logout-item"
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item
                    onClick={() => navigate("/login")}
                    className="login-item"
                  >
                    <FaSignInAlt className="me-2" /> Login
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </header>
  );
};

export default Header;
