 import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaBell, FaCog, FaBuilding, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaHome } from 'react-icons/fa';
import './Header.css';
import { useSidebar } from '../Context';

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  // Check-In/Check-Out State
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerClick = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      setStartTime(new Date());
      setIsTimerRunning(true);
      setTimer(0);
    }
  };

  const handleProfileToggle = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleNotificationsToggle = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleCompaniesToggle = () => {
    setShowCompanies((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };

  const getPathIndicator = () => {
    const path = location.pathname.split('/').filter(Boolean);
    return path.map((segment, index) => (
      <span key={index}>
        {segment.charAt(0).toUpperCase() + segment.slice(1)} {index < path.length - 1 && ' > '}
      </span>
    ));
  };

  return (
    <header className="mb-5">
      <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top">
        <Container fluid>
          {/* Hamburger Menu */}
          <Button variant="link" className="me-3" onClick={toggleSidebar}>
            <FaBars size={28} color="white" />
          </Button>

          {/* Brand */}
          <LinkContainer to="/">
            <Navbar.Brand className="brand">DB4Cloud</Navbar.Brand>
          </LinkContainer>

          {/* Path Indicator */}
          {/* //<div className="path-indicator">{getPathIndicator()}</div> */}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Check In/Check Out Button */}
              <div className="check-in-out-box">
                <Button
                  className={`timer-button ${isTimerRunning ? 'active' : ''}`}
                  onClick={handleTimerClick}
                  title={isTimerRunning ? 'Click to check-out' : 'Click to check-in'}
                >
                  {isTimerRunning ? (
                    <>
                      <FaSignOutAlt size={28} className="me-2 rotate" />
                      <span>{`Checked in... ${formatTime(timer)}`}</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt size={28} className="me-2 beat" />
                      <span>Check-in</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Home Icon */}
              <Nav.Link className="icon-link ms-3" onClick={() => navigate('/home')}>
                <FaHome size={32} title="Home" />
              </Nav.Link>

              {/* Settings Icon */}
              <Nav.Link className="icon-link ms-3" onClick={() => navigate('/settings')}>
                <FaCog size={28} title="Settings" />
              </Nav.Link>

              {/* Notifications Icon */}
              <Nav.Link className="icon-link ms-3" onClick={handleNotificationsToggle}>
                <FaBell size={28} title="Notifications" />
                <Badge bg="danger" pill className="notification-badge">3</Badge>
              </Nav.Link>
              {showNotifications && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <NavDropdown.Header>Notifications</NavDropdown.Header>
                  <NavDropdown.Item href="#action/3.1">New comment on your post</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">You have a meeting at 3 PM</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">New follower: John Doe</NavDropdown.Item>
                </div>
              )}

              {/* Companies Icon */}
              <Nav.Link className="icon-link ms-3" onClick={handleCompaniesToggle}>
                <FaBuilding size={28} title="Companies" />
              </Nav.Link>
              {showCompanies && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <NavDropdown.Header>Companies</NavDropdown.Header>
                  <NavDropdown.Item href="#action/3.1" active>DB4Cloud</NavDropdown.Item>
                </div>
              )}

              {/* Profile Dropdown */}
              <NavDropdown
                title={<FaUserCircle size={28} color="white" />}
                id="profile-dropdown"
                show={showProfileMenu}
                onClick={handleProfileToggle}
                ref={profileMenuRef}
                align="end"
                className="profile-dropdown ms-3"
              >
                <div className='dropdown-header d-flex align-items-center px-3 py-2'>
                  <strong>Username</strong>
                </div>
                <NavDropdown.Item onClick={() => navigate('/profile')}>My Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/change-password')}>Change Password</NavDropdown.Item>
                <NavDropdown.Divider />
                {token ? (
                  <NavDropdown.Item onClick={handleLogout} className="logout-item">
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                )
                : (
                    <NavDropdown.Item onClick={() => navigate('/login')} className="login-item">
                      <FaSignInAlt className="me-2" /> Login
                    </NavDropdown.Item>
                  )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
