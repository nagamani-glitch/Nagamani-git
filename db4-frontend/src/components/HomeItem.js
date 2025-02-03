// // src/components/HomeItem.js
// import React from 'react';
// import { Col, Nav } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import './HomeItem.css';

// const HomeItem = ({ title, icon }) => {
//   return (
//     <Col xs={6} sm={4} md={4} lg={3} className="d-flex justify-content-center">
//       <Nav.Link as={Link} to={`/${title}`}>
//         <div className="dashboard-item">
//           <div className="icon-container">
//             <img src={icon} alt={title} className="dashboard-icon" />
//           </div>
//           <p className="dashboard-title">{title}</p>
//         </div>
//       </Nav.Link>
//     </Col>
   
//   );
// };

// export default HomeItem;


import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChartBar, FaBook } from 'react-icons/fa';
import './HomeItem.css';

const HomeItem = ({ title, icon }) => {
  const items = [
    { title: "My Workspace", icon: <i className="fas fa-chart-bar"></i>, color: '#3498db', delay: '1s' },
    { title: "Dashboards", icon: <FaChartBar />, color: '#e74c3c', delay: '0.9s' },
    { title: "Directory", icon: <FaBook />, color: '#2ecc71', delay: '0.5s' },
  ];

  return (
    <div className="main-container">
      <div className="home-content mt-5">
        <div className="icon-grid">
          {items.map((item, index) => (
            <Nav.Link key={index} as={Link} to={`/${item.title}`}>
              <div className="icon-item" style={{ animationDelay: item.delay }}>
                <div 
                  className="icon-circle" 
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div className="icon-title">{item.title}</div>
              </div>
            </Nav.Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeItem;
