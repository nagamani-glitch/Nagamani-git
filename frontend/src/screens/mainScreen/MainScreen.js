import React from "react";
import { FaChartBar } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Novatrix } from "uvcanvas";
import "./MainScreen.css";

const items = [{ title: "Dashboards", icon: <FaChartBar />, delay: "0.9s" }];

const MainScreen = () => {
  return (
    <div className="hrms-main-wrapper">
      <div className="novatrix-container">
        <Novatrix />
      </div>
      <div className="hrms-content-container">
        <div className="hrms-intro-container">
          <h1 className="hrms-intro-title">
            Welcome to <span className="company-name">DB4Cloud</span> HRMS
          </h1>

          <p className="hrms-intro-text">
            Transform your HR operations with our comprehensive Human Resource
            Management System. DB4Cloud HRMS streamlines your workforce
            management with powerful tools for employee data management,
            attendance tracking, payroll processing, and performance evaluation.
          </p>
          <p className="hrms-intro-text">
            Built for the modern workplace, our cloud-based solution ensures
            secure access to your HR data anytime, anywhere, while maintaining
            the highest standards of data protection and compliance.
          </p>
        </div>
        <div className="hrms-icon-container">
          {items.map((item, index) => (
            <Nav.Link 
              key={index} 
              as={Link} 
              to={`/${item.title}`} 
              className="dashboard-link"
              tabIndex={0}
            >
              <div
                className="hrms-icon-wrapper"
                style={{ animationDelay: item.delay }}
              >
                <div className="hrms-icon-circle">{item.icon}</div>
                <div className="hrms-icon-label">{item.title}</div>
              </div>
            </Nav.Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
