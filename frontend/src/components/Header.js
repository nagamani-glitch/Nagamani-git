import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Badge,
  Toast,
  Spinner,
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
  FaVolumeUp,
} from "react-icons/fa";
import { timesheetService } from "../services/timesheetService";
import "./Header.css";
import { useSidebar } from "../Context";
import NotificationSidebar from "./NotificationSidebar";
import { useNotifications } from "../context/NotificationContext";

const Header = () => {
  const { unreadCount } = useNotifications();
  const { toggleSidebar } = useSidebar();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  //const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId") || "EMP123";
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const timerIntervalRef = useRef(null);
  const timerStartTimeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
      console.error("Error initializing timesheet:", error);
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
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isTimerRunning) {
        // Log out
        await timesheetService.checkOut(employeeId);
        cleanupTimesheet();
        setIsTimerRunning(false);
        setTimer(0);
        setStartTime(null);
        localStorage.removeItem("checkInTime");
        showToastMessage("Successfully logged out");
      } else {
        // Log in
        const response = await timesheetService.checkIn(employeeId);
        const checkInTime = new Date(response.data.checkInTime);
        startTimerWithTime(checkInTime);
        showToastMessage("Successfully logged in");
      }
    } catch (error) {
      console.error("Timesheet operation failed:", error);
      showToastMessage("Operation failed. Please try again.");
    } finally {
      setIsLoading(false);
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
  // const handleNotificationsToggle = () => setShowNotifications((prev) => !prev);
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
          onClick={() => navigate(`/${path.slice(0, index + 1).join("/")}`)}
          style={{
            cursor: "pointer",
            color: "#fff",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {segment.charAt(0).toUpperCase() + segment.slice(1)}
        </span>
        {index < path.length - 1 && " > "}
      </span>
    ));
  };
  return (
    <>
      <NotificationSidebar
        show={showNotificationSidebar}
        onClose={() => setShowNotificationSidebar(false)}
      />
      <header className="mb-5">
        <Navbar
          className="custom-navbar"
          expand="lg"
          variant="dark"
          fixed="top"
        >
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
                    maxHeight: "80px",
                    marginLeft: "0",
                    verticalAlign: "middle",
                  }}
                  className="responsive-logo"
                />
              </Navbar.Brand>
            </LinkContainer>

            <div className="path-indicator">{getPathIndicator()}</div>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <div className="check-in-out-box">
                  <Button
                    className={`timer-button ${isTimerRunning ? "active" : ""}`}
                    onClick={handleTimerClick}
                    title={
                      isTimerRunning ? "Click to log-out" : "Click to log-in"
                    }
                    aria-label={isTimerRunning ? "Log out" : "Log in"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : isTimerRunning ? (
                      <>
                        <FaSignOutAlt className="me-2 rotate" />
                        <span>{`Logged in ${formatTime(timer)}`}</span>
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2 beat" />
                        <span>Log-in</span>
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
                  onClick={() => {
                    setShowNotificationSidebar(true);
                  }}
                >
                  <FaBell size={28} title="Notifications" />
                  <Badge
                    bg="danger"
                    pill
                    className="notification-badge"
                    style={{ marginTop: "10px", marginRight: "30px" }}
                  >
                    {unreadCount}
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
                  <NavDropdown.Item
                    onClick={() => navigate("/change-password")}
                  >
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
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </header>
    </>
  );
};

export default Header;
