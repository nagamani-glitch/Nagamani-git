import React, { createContext, useState, useContext, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState(() => {
    // Try to load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Add debug logging to see notifications whenever they change
  useEffect(() => {
    console.log("Current notifications:", notifications);
  }, [notifications]);

  // Function to add a new notification
  const addNotification = (message, type = 'info', icon = null, userId = null) => {
    const iconMap = {
      leave: <FaCalendarAlt />,
      timesheet: <FaClock />,
      performance: <FaFileAlt />,
      onboarding: <FaUserAlt />
    };

    const newNotification = {
      id: Date.now(), // Use timestamp as unique ID
      message,
      time: new Date().toISOString(),
      type,
      read: false,
      icon: icon || iconMap[type] || iconMap.info,
      userId: userId // Store the user ID if provided
    };

    console.log("Adding new notification:", newNotification);
    
    setNotifications(prev => {
      const updatedNotifications = [newNotification, ...prev];
      console.log("Updated notifications array:", updatedNotifications);
      return updatedNotifications;
    });
    
    return newNotification.id;
  };

  // Function to add a leave request notification
  const addLeaveRequestNotification = (employeeName, status, leaveType, startDate, endDate, userId = null) => {
    const iconMap = {
      leave: <FaCalendarAlt />,
      timesheet: <FaClock />,
      performance: <FaFileAlt />,
      onboarding: <FaUserAlt />
    };

    // Log the parameters to make sure they're correct
    console.log("Adding leave request notification with params:", {
      employeeName, status, leaveType, startDate, endDate, userId
    });

    const statusText = status === "approved" ? "approved" : "rejected";
    const message = `Your ${leaveType} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
    
    const newNotification = {
      id: Date.now(), // Use timestamp as unique ID
      message,
      time: new Date().toISOString(), // Store actual timestamp for proper time display
      type: "leave",
      read: false,
      icon: iconMap.leave,
      status: status, // Store the status for styling purposes
      userId: userId // Store the user ID if provided
    };

    console.log("Created new leave request notification:", newNotification);

    setNotifications(prev => {
      const updatedNotifications = [newNotification, ...prev];
      console.log("Updated notifications with leave request:", updatedNotifications);
      return updatedNotifications;
    });
    
    return newNotification.id;
  };

  // Function to mark a notification as read
  const markAsRead = (id) => {
    console.log("Marking notification as read:", id);
    
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      );
      console.log("Updated notifications after marking as read:", updated);
      return updated;
    });
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
    
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      console.log("Updated notifications after marking all as read:", updated);
      return updated;
    });
  };

  // Function to delete a notification
  const deleteNotification = (id) => {
    console.log("Deleting notification:", id);
    
    setNotifications(prev => {
      const updated = prev.filter(notification => notification.id !== id);
      console.log("Updated notifications after deletion:", updated);
      return updated;
    });
  };

  // Function to clear all notifications
  const clearAll = () => {
    console.log("Clearing all notifications");
    setNotifications([]);
  };

  // Function to get notifications for a specific user
  const getUserNotifications = (userId) => {
    if (!userId) return notifications;
    
    const userNotifications = notifications.filter(notification => 
      !notification.userId || notification.userId === userId
    );
    
    console.log(`Filtered notifications for user ${userId}:`, userNotifications);
    return userNotifications;
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      setNotifications, 
      unreadCount,
      addNotification,
      addLeaveRequestNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      getUserNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
