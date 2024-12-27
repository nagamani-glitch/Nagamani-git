// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure you have Bootstrap Icons loaded

// const Header = () => {
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate()
//   const token = localStorage.getItem('token')

//   // Toggle profile dropdown on icon click
//   const handleProfileToggle = () => {
//     setShowProfileMenu(prev => !prev);
//   };

//   // Close dropdown if clicked outside of it
//   const handleClickOutside = (e) => {
//     if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
//       setShowProfileMenu(false);
//     }
//   };

//   useEffect(() => {
//     // Add event listener to detect clicks outside the dropdown
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       // Cleanup the event listener on component unmount
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout=()=>{
//     try{
//     localStorage.removeItem('token')
//       navigate('/')
//   } catch(e){
//     console.log(e)
//   }
//   }

//   return (
//     <header >
//       <Navbar style={{ backgroundColor: 'cadetblue' }} expand="lg" variant="dark" collapseOnSelect>
//         <Container>
//           <LinkContainer to="/">
//             <Navbar.Brand className="title" style={{ marginRight: '10px', fontSize: '1.5rem' }}>
//               DB4Cloud
//             </Navbar.Brand>
//           </LinkContainer>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <LinkContainer to="/home">
//                 <Nav.Link>Home</Nav.Link>
//               </LinkContainer>
//               <LinkContainer to="/hr">
//                 <Nav.Link>HR</Nav.Link>
//               </LinkContainer>
//               {!token && 
//               <LinkContainer to="/login">
//               <Nav.Link>Login</Nav.Link>
//             </LinkContainer>
//               }
              

//               {/* Profile Dropdown */}
//               <NavDropdown 
//                 title={<i className="bi bi-person-circle" style={{ fontSize: '1.3rem', color: 'red'  }}></i>} 
//                 id="profile-dropdown"
//                 show={showProfileMenu} 
//                 onClick={handleProfileToggle} // Toggle dropdown on hover
//                 onMouseLeave={handleProfileToggle} // Close dropdown when leaving
//                 ref={profileMenuRef} 
//               >
//                 <div className='down' style={{height:""}}>
//                 <div className="dropdown-header" style={{ display: 'flex', alignItems: 'center' }}>
//                   <Image
//                     src="https://via.placeholder.com/30"
//                     roundedCircle
//                     alt="Profile"
                    
//                   />
//                   <strong>Username</strong>
//                 </div>
//                 <LinkContainer to="/profile">
//                   <NavDropdown.Item>View Profile</NavDropdown.Item>
//                 </LinkContainer>
//                 <LinkContainer to="/inbox">
//                   <NavDropdown.Item>Inbox</NavDropdown.Item>
//                 </LinkContainer>
//                 <LinkContainer to="/notifications">
//                   <NavDropdown.Item>Notifications</NavDropdown.Item>
//                 </LinkContainer>
//                 <LinkContainer to="/myworkday">
//                   <NavDropdown.Item>My Workday 2.0</NavDropdown.Item>
//                 </LinkContainer>
//                 <LinkContainer to="/favorites">
//                   <NavDropdown.Item>Favorites</NavDropdown.Item>
//                 </LinkContainer>
//                 <NavDropdown.Divider />
//                 <div onClick={handleLogout} style={{ borderRadius:"5px", cursor: 'pointer', padding: '10px',  textAlign:"center"}}>
//                   Sign Out
//                 </div>
//                 </div>
//               </NavDropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </header>
//   );
// };


// export default Header;


// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, NavDropdown, Image, Badge, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaBell, FaCog, FaBuilding, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure you have Bootstrap Icons loaded
import './Header.css'; // Custom CSS for Header
import { useSidebar } from '../Context';
const Header = () => {
  const {toggleSidebar} = useSidebar()
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  //const token = localStorage.getItem('token');

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle profile dropdown on icon click
  const handleProfileToggle = () => {
    setShowProfileMenu(prev => !prev);
  };

  // Toggle notifications dropdown
  const handleNotificationsToggle = () => {
    setShowNotifications(prev => !prev);
  };

  // Toggle companies dropdown
  const handleCompaniesToggle = () => {
    setShowCompanies(prev => !prev);
  };

  // Close dropdowns if clicked outside
  const handleClickOutside = (e) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setShowProfileMenu(false);
    }
    // Add similar logic for other dropdowns if needed
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
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

  // Format current time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Path Indicator Logic
  const getPathIndicator = () => {
    const path = location.pathname.split('/').filter(Boolean);
    return path.map((segment, index) => (
      <span key={index}>
        {segment.charAt(0).toUpperCase() + segment.slice(1)} {index < path.length - 1 && ' > '}
      </span>
    ));
  };

  return (
    <header className='mb-5'>
      <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top">
        <Container fluid>
          {/* Hamburger Menu */}
          <Button variant="link" className="me-3" onClick={toggleSidebar}>
            <FaBars size={24} color="white" />
          </Button>

          {/* Brand */}
          <LinkContainer to="/">
            <Navbar.Brand className="brand">DB4Cloud</Navbar.Brand>
          </LinkContainer>

          {/* Path Indicator */}
          <div className="path-indicator">
            {getPathIndicator()}
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Time Box */}
              <div className="time-box">
                <span className="time-display">{formatTime(currentTime)}</span>
              </div>

              {/* Settings Icon */}
              <Nav.Link className="icon-link" onClick={() => navigate('/settings')}>
                <FaCog size={20} title="Settings" />
              </Nav.Link>

              {/* Notifications Icon */}
              <Nav.Link className="icon-link" onClick={handleNotificationsToggle}>
                <FaBell size={20} title="Notifications" />
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
              <Nav.Link className="icon-link" onClick={handleCompaniesToggle}>
                <FaBuilding size={20} title="Companies" />
              </Nav.Link>
              {showCompanies && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <NavDropdown.Header>Companies</NavDropdown.Header>
                  <NavDropdown.Item href="#action/3.1" active>DB4Cloud</NavDropdown.Item>
                  {/* Add more companies here if needed */}
                </div>
              )}

              {/* Profile Dropdown */}
              <NavDropdown
                title={<FaUserCircle size={24} color="white" />}
                id="profile-dropdown"
                show={showProfileMenu}
                onClick={handleProfileToggle}
                ref={profileMenuRef}
                align="end"
                className="profile-dropdown"
              >
                <div className='dropdown-header d-flex align-items-center px-3 py-2'>
                  <Image
                    src="https://via.placeholder.com/30"
                    roundedCircle
                    alt="Profile"
                    className="me-2"
                  />
                  <strong>Username</strong>
                </div>
                <NavDropdown.Item onClick={() => navigate('/profile')}>My Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/change-password')}>Change Password</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="logout-item">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
