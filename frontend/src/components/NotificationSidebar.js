import React, { useEffect, useRef } from "react";
import { FaTimes, FaBell, FaTrash, FaCheck } from "react-icons/fa";
import { Badge, Button } from "react-bootstrap";
import { useNotifications } from '../context/NotificationContext';

const NotificationSidebar = ({ show, onClose }) => {
  const sidebarRef = useRef(null);
  const { notifications, setNotifications } = useNotifications();

  const getNotificationStyle = (type) => {
    const styles = {
      leave: "#e8f5e9",
      timesheet: "#e3f2fd",
      performance: "#fff3e0",
      onboarding: "#f3e5f5",
      payroll: "#e0f2f1"
    };
    return styles[type] || styles.leave;
  };

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filterUnread = () => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => !notification.read)
    );
  };

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.transform = show ? "translateX(0)" : "translateX(100%)";
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={sidebarRef}
      className="notification-sidebar"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "400px",
        backgroundColor: "#ffffff",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
        zIndex: 1050,
        transform: "translateX(100%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "0",
        overflowY: "auto"
      }}
    >
      <div className="notification-header" style={{
        padding: "20px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 1
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaBell size={20} color="#666" />
            <h5 style={{ margin: 0 }}>
              HR Notifications
              <Badge bg="danger" pill style={{ marginLeft: "10px" }}>
                {notifications.filter(n => !n.read).length}
              </Badge>
            </h5>
          </div>
          <FaTimes
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              padding: "5px",
              borderRadius: "50%",
              transition: "all 0.2s ease",
            }}
            onMouseOver={e => e.target.style.backgroundColor = "#f5f5f5"}
            onMouseOut={e => e.target.style.backgroundColor = "transparent"}
          />
        </div>
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          marginTop: "10px" 
        }}>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={filterUnread}
          >
            Unread
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="notification-content" style={{ padding: "10px" }}>
        {notifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: notification.read ? "#fff" : getNotificationStyle(notification.type),
                  border: "1px solid #eee",
                  transition: "all 0.2s ease",
                  position: "relative"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  gap: "10px",
                  alignItems: "center" 
                }}>
                  <span style={{ color: "#666" }}>{notification.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: "5px" }}>
                      {notification.message}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#666",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span>{notification.time}</span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <FaCheck
                          onClick={() => markAsRead(notification.id)}
                          style={{ 
                            cursor: "pointer", 
                            color: notification.read ? "#4CAF50" : "#999" 
                          }}
                        />
                        <FaTrash
                          onClick={() => deleteNotification(notification.id)}
                          style={{ cursor: "pointer", color: "#f44336" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#666"
          }}>
            <FaBell size={40} style={{ marginBottom: "20px", opacity: 0.5 }} />
            <p>No new HR notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSidebar;
