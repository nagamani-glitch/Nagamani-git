import React, { createContext, useState, useContext } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Leave request approved for John Doe",
      time: "2 mins ago",
      type: "leave",
      read: false,
      icon: <FaCalendarAlt />
    },
    { 
      id: 2, 
      message: "New timesheet submission from Sarah Smith",
      time: "10 mins ago", 
      type: "timesheet",
      read: false,
      icon: <FaClock />
    },
    { 
      id: 3, 
      message: "Performance review due for Development Team",
      time: "1 hour ago",
      type: "performance",
      read: false,
      icon: <FaFileAlt />
    },
    { 
      id: 4, 
      message: "New employee onboarding: Mike Johnson starts next week",
      time: "2 hours ago",
      type: "onboarding",
      read: false,
      icon: <FaUserAlt />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
