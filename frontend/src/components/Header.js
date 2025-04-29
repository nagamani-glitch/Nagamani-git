import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import { useNavigate, useLocation , Link} from "react-router-dom";
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
// First, get all the hooks and context values
const { toggleSidebar } = useSidebar();
const { getUserUnreadCount } = useNotifications();
const navigate = useNavigate();
const location = useLocation();

// Then declare all your state variables
const [showProfileMenu, setShowProfileMenu] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
const [showCompanies, setShowCompanies] = useState(false);
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
const [timer, setTimer] = useState(0);
const [isTimerRunning, setIsTimerRunning] = useState(false);
const [startTime, setStartTime] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);
const [navExpanded, setNavExpanded] = useState(false);
const [profileData, setProfileData] = useState(null);
const [profileLoading, setProfileLoading] = useState(false);

// Create refs
const profileMenuRef = useRef(null);
const navbarCollapseRef = useRef(null);
const timerIntervalRef = useRef(null);
const timerStartTimeRef = useRef(null);

// Get data from localStorage
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const employeeId = profileData?.Emp_ID || localStorage.getItem("employeeId") || "EMP123";

// Now you can safely use userId
const userUnreadCount = getUserUnreadCount(userId);


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        return; // Don't fetch if not logged in
      }
      
      try {
        setProfileLoading(true);
        // Use the by-user endpoint from employeesRouter.js
        const response = await axios.get(`http://localhost:5002/api/employees/by-user/${userId}`);
        
        if (response.data.success) {
          setProfileData(response.data.data);
          
          // Store employee ID in localStorage if not already there
          if (response.data.data.Emp_ID) {
            localStorage.setItem("employeeId", response.data.data.Emp_ID);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  // Get profile image URL
const getProfileImageUrl = () => {
  if (profileData?.personalInfo?.employeeImage) {
    const imagePath = profileData.personalInfo.employeeImage;
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `http://localhost:5002${imagePath}`;
    }
  }
  return null;
};
 
// Add this function to toggle the notification sidebar
 const toggleNotificationSidebar = () => {
  setShowNotificationSidebar(!showNotificationSidebar);
};


// Get user display name
const getUserDisplayName = () => {
  if (profileData?.personalInfo) {
    const { firstName, lastName } = profileData.personalInfo;
    return `${firstName || ''} ${lastName || ''}`.trim() || employeeId;
  }
  return employeeId;
};

  


  // Add this useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // const handleTimerClick = async () => {
  //   if (isLoading) return;

  //   setIsLoading(true);
  //   try {
  //     if (isTimerRunning) {
  //       // Calculate duration in seconds
  //       const checkInTime = new Date(startTime);
  //       const checkOutTime = new Date();
  //       const durationInSeconds = Math.floor(
  //         (checkOutTime - checkInTime) / 1000
  //       );

  //       // Log out with duration
  //       await timesheetService.checkOut(employeeId, durationInSeconds);
  //       cleanupTimesheet();
  //       setIsTimerRunning(false);
  //       setTimer(0);
  //       setStartTime(null);
  //       localStorage.removeItem("checkInTime");
  //       showToastMessage("Successfully logged out");
  //     } else {
  //       // Log in
  //       const response = await timesheetService.checkIn(employeeId);
  //       const checkInTime = new Date(response.data.checkInTime);
  //       startTimerWithTime(checkInTime);
  //       showToastMessage("Successfully logged in");
  //     }
  //   } catch (error) {
  //     console.error("Timesheet operation failed:", error);
  //     showToastMessage("Operation failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  // Inside the handleTimerClick function in Header.js


  const handleTimerClick = async () => {
  if (isLoading) return;

  setIsLoading(true);
  try {
    if (isTimerRunning) {
      // Calculate duration in seconds
      const checkInTime = new Date(startTime);
      const checkOutTime = new Date();
      const durationInSeconds = Math.floor(
        (checkOutTime - checkInTime) / 1000
      );

      // Log out with duration
      await timesheetService.checkOut(employeeId, durationInSeconds);
      cleanupTimesheet();
      setIsTimerRunning(false);
      setTimer(0);
      setStartTime(null);
      localStorage.removeItem("checkInTime");
      showToastMessage("Successfully logged out");
    } else {
      // Get employee name from profile data
      const employeeName = getUserDisplayName();
      
      // Log in with employee name
      const response = await timesheetService.checkIn(employeeId, employeeName);
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

  // Replace the handleNavToggle function with this more direct approach
  const handleNavToggle = () => {
    setNavExpanded(!navExpanded);

    // If we're closing the navbar, also close the profile menu
    if (navExpanded) {
      setShowProfileMenu(false);
    }
  };

  // Replace the closeNavbar function with this more direct approach
  const closeNavbar = () => {
    setNavExpanded(false);

    // Direct DOM manipulation to ensure the navbar closes
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      // If the navbar is expanded, click the toggle button to collapse it
      if (navbarToggler) {
        navbarToggler.click();
      } else {
        // Fallback: manually remove the 'show' class
        navbarCollapse.classList.remove("show");
      }
    }
  };

  const handleProfileToggle = (e) => {
    // Prevent event propagation to avoid immediate closing on mobile
    e.stopPropagation();
    setShowProfileMenu((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfileMenu(false);
    }
  };

  // Add this function to handle dropdown item clicks
  const handleDropdownItemClick = (callback) => {
    // Close the dropdown first
    setShowProfileMenu(false);
    // Close the navbar on mobile
    closeNavbar();
    // Then execute the callback (like navigation)
    if (callback) callback();
  };

  // Add this useEffect to handle clicks outside the navbar
  useEffect(() => {
    function handleClickOutside(event) {
      // If the navbar is expanded and the click is outside the navbar
      if (
        navExpanded &&
        !event.target.closest(".navbar-collapse") &&
        !event.target.closest(".navbar-toggler")
      ) {
        closeNavbar();
      }

      // Close profile menu when clicking outside
      if (
        showProfileMenu &&
        !event.target.closest(".profile-dropdown-container") &&
        !event.target.closest(".custom-dropdown-menu")
      ) {
        setShowProfileMenu(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [navExpanded, showProfileMenu]);

  const handleLogout = () => {
    cleanupTimesheet();
    setProfileData(null); // Clear profile data
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("userId");
    localStorage.removeItem("checkInTime");
    navigate("/login");
  };
  

  const getPathIndicator = () => {
    const path = location.pathname.split("/").filter(Boolean);

    // Special case for sensitive routes
    if (path.includes("reset-password")) {
      return (
        <span>
          <span
            className="path-link"
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              color: "#fff",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Home
          </span>
          {" > "}
          <span
            className="path-link"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Reset Password
          </span>
        </span>
      );
    }

    // Regular path handling for other routes
    return path.map((segment, index) => {
      // Format the segment for display (capitalize, replace hyphens with spaces)
      let displaySegment = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Truncate very long segments (like tokens)
      if (displaySegment.length > 20) {
        displaySegment = displaySegment.substring(0, 10) + "...";
      }

      return (
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
            {displaySegment}
          </span>
          {index < path.length - 1 && " > "}
        </span>
      );
    });
  };

  return (
    <>
      <NotificationSidebar
        show={showNotificationSidebar}
        onClose={() => setShowNotificationSidebar(false)}
      />
      <header className="mb-5">
      <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top" expanded={navExpanded} onToggle={handleNavToggle} ref={navbarCollapseRef}>
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
            <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse-container">
              <Nav className="ms-auto align-items-center">
                <div className="d-flex align-items-center">
                  <div className="check-in-out-box">
                    <Button
                      className={`timer-button ${
                        isTimerRunning ? "active" : ""
                      }`}
                      onClick={() => {
                        handleTimerClick();
                        closeNavbar();
                      }}
                      title={
                        isTimerRunning
                          ? "Click to Check-out"
                          : "Click to Check-in"
                      }
                      aria-label={isTimerRunning ? "Check out" : "Check in"}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : isTimerRunning ? (
                        <>
                          <div className="timer-icon-container">
                            <FaSignOutAlt className="timer-icon rotate" />
                          </div>
                          <div className="timer-content">
                            <span className="timer-label">Check-out</span>
                            <span className="timer-value">{`${formatTime(
                              timer
                            )}`}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="timer-icon-container">
                            <FaSignInAlt className="timer-icon beat" />
                          </div>
                          <div className="timer-content">
                            <span className="timer-label">Check-in</span>
                          </div>
                        </>
                      )}
                    </Button>
                  </div>

                  <Nav.Link
                    className="icon-link ms-3"
                    onClick={() => {
                      navigate("/");
                      closeNavbar();
                    }}
                  >
                    <FaHome size={32} title="Home" />
                  </Nav.Link>
                  <Nav.Link
                    className="icon-link ms-3 position-relative"
                    onClick={toggleNotificationSidebar}
                    title="Notifications"
                  >
                    <FaBell size={24} />
                    {userUnreadCount > 0 && (
  <Badge
    pill
    bg="danger"
    className="position-absolute"
    style={{
      top: "-5px",
      right: "-5px",
      fontSize: "0.6rem",
      padding: "0.25em 0.4em",
    }}
  >
    {userUnreadCount > 99 ? "99+" : userUnreadCount}
  </Badge>

                    )}
                  </Nav.Link>
                  <div className="profile-dropdown-container">
                    {/* Use a custom implementation for mobile/tablet */}
                    {windowWidth <= 1024 ? (
                      <>
                        <div
        className="profile-dropdown-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setShowProfileMenu(!showProfileMenu);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {profileLoading ? (
          <Spinner animation="border" size="sm" variant="light" />
        ) : getProfileImageUrl() ? (
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid white",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/default-avatar.png`;
            }}
          />
        ) : (
          <FaUserCircle size={28} color="white" />
        )}
      </div>

      {showProfileMenu && (
        <div className="custom-dropdown-menu">
          <div className="dropdown-header d-flex align-items-center px-3 py-2">
            <strong>{getUserDisplayName()}</strong>
            {profileData?.Emp_ID && (
              <small className="ms-2 text-muted">({profileData.Emp_ID})</small>
            )}
          </div>
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                setShowProfileMenu(false);
                                closeNavbar();
                                navigate("Dashboards/profile");
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <FaUserCircle
                                  style={{
                                    fontSize: "24px",
                                    marginBottom: "5px",
                                  }}
                                />
                                <span>My Profile</span>
                              </div>
                            </div>
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                setShowProfileMenu(false);
                                closeNavbar();
                                navigate("/reset-password");
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <FaCog
                                  style={{
                                    fontSize: "24px",
                                    marginBottom: "5px",
                                  }}
                                />
                                <span>Change Password</span>
                              </div>
                            </div>
                            {token ? (
                              <div
                                className="dropdown-item logout-item"
                                onClick={() => {
                                  setShowProfileMenu(false);
                                  closeNavbar();
                                  handleLogout();
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <FaSignOutAlt
                                    style={{
                                      fontSize: "24px",
                                      marginBottom: "5px",
                                    }}
                                  />
                                  <span>Logout</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="dropdown-item login-item"
                                onClick={() => {
                                  setShowProfileMenu(false);
                                  closeNavbar();
                                  navigate("/login");
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <FaSignInAlt
                                    style={{
                                      fontSize: "24px",
                                      marginBottom: "5px",
                                    }}
                                  />
                                  <span>Login</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      // Use Bootstrap NavDropdown for desktop
                      <NavDropdown
      title={
        profileLoading ? (
          <Spinner animation="border" size="sm" variant="light" />
        ) : getProfileImageUrl() ? (
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid white",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/default-avatar.png`;
            }}
          />
        ) : (
          <FaUserCircle size={28} color="white" />
        )
      }
      id="profile-dropdown"
      show={showProfileMenu}
      onClick={handleProfileToggle}
      ref={profileMenuRef}
      align="end"
      className="profile-dropdown ms-3"
      menuVariant="dark"
    >
      <div className="dropdown-header d-flex align-items-center px-3 py-2">
        <strong>{getUserDisplayName()}</strong>
        {profileData?.Emp_ID && (
          <small className="ms-2 text-muted">({profileData.Emp_ID})</small>
        )}
      </div>
                        <NavDropdown.Item
                          onClick={() =>
                            handleDropdownItemClick(() => navigate("/Dashboards/profile"))
                          }
                        >
                          My Profile
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          onClick={() =>
                            handleDropdownItemClick(() =>
                              navigate("/reset-password")
                            )
                          }
                        >
                          Change Password
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        {token ? (
                          <NavDropdown.Item
                            onClick={() =>
                              handleDropdownItemClick(handleLogout)
                            }
                            className="logout-item"
                          >
                            <FaSignOutAlt className="me-2" /> Logout
                          </NavDropdown.Item>
                        ) : (
                          <NavDropdown.Item
                            onClick={() =>
                              handleDropdownItemClick(() => navigate("/login"))
                            }
                            className="login-item"
                          >
                            <FaSignInAlt className="me-2" /> Login
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}
                  </div>
                </div>
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

