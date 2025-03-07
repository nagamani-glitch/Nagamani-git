
import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Badge } from "react-bootstrap";

const NotificationSidebar = ({ show, onClose }) => {
  const sidebarRef = useRef(null); // Create a ref for the sidebar
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your package is out for delivery." },
    { id: 2, message: "Someone liked your post." },
    { id: 3, message: "Don't forget your appointment at 4 PM." },
    { id: 4, message: "Security alert: New login detected." },
    { id: 5, message: "You have a new friend request." },
    { id: 6, message: "Your subscription is about to expire." },
  ]);

  // Function to add a new notification dynamically
  const addNotification = (message) => {
    const newNotification = { id: Date.now(), message }; // Unique ID
    setNotifications((prev) => [...prev, newNotification]);
  };

  // Handle sidebar animation
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.transform = show ? "translateX(0)" : "translateX(100%)";
    }
  }, [show]);

  if (!show) return null;

  return (
 // Add z-index to ensure sidebar appears above other elements
<div
  ref={sidebarRef}
  className="notification-sidebar"
  onClick={onClose}
  style={{
    position: "fixed",
    right: 0,
    top: 0,
    height: "100vh",
    width: "400px",
    backgroundColor: "white",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
    zIndex: 1050, // Increased z-index
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    padding: "15px",
  }}
>

      <div className="p-3">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h5 style={{ marginTop: 30 }}>
            All Notifications
            <Badge bg="danger" pill style={{ marginLeft: "10px" }}>
              {notifications.length}
            </Badge>
          </h5>
          <FaTimes
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              transition: "transform 0.2s ease",
            }}
          />
        </div>

        <div className="notification-content">
          {notifications.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
