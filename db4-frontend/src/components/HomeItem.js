// src/components/HomeItem.js
import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomeItem.css';

const HomeItem = ({ title, icon }) => {
  return (
    <Col xs={6} sm={4} md={4} lg={3} className="d-flex justify-content-center">
      <Nav.Link as={Link} to={`/${title}`}>
        <div className="dashboard-item">
          <div className="icon-container">
            <img src={icon} alt={title} className="dashboard-icon" />
          </div>
          <p className="dashboard-title">{title}</p>
        </div>
      </Nav.Link>
    </Col>
  );
};

export default HomeItem;
