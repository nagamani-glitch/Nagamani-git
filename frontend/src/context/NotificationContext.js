import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import { io } from 'socket.io-client';
// Add this constant at the top of the file, after the imports
const API_URL = 'http://localhost:5000/api';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Memoize the fetchNotifications function to prevent it from changing on every render
  const fetchNotifications = useCallback(async (userId) => {
    if (!userId) return Promise.resolve([]);
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
      setNotifications(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prev => {
        return prev.map(notification =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        );
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      await axios.put(`http://localhost:5000/api/notifications/user/${userId}/read-all`);
      
      // Update local state
      setNotifications(prev => {
        return prev.map(notification => ({ ...notification, read: true }));
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Function to add a new notification
  const addNotification = useCallback(async (message, type = 'info', icon = null, userId = null) => {
    if (!userId) {
      console.error('User ID is required to add a notification');
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/notifications', {
        message,
        type,
        userId
      });
      
      const newNotification = response.data;
      
      // Update local state
      setNotifications(prev => [newNotification, ...prev]);
      
      return newNotification._id;
    } catch (error) {
      console.error('Error adding notification:', error);
      return null;
    }
  }, []);

  // Function to add a leave request notification
  const addLeaveRequestNotification = useCallback(async (employeeName, status, leaveType, startDate, endDate, userId = null) => {
    if (!userId) {
      console.error('User ID is required to add a leave request notification');
      return null;
    }

    const statusText = status === "approved" ? "approved" : "rejected";
    const message = `Your ${leaveType} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
    
    try {
      const response = await axios.post('http://localhost:5000/api/notifications', {
        message,
        type: 'leave',
        status,
        userId
      });
      
      const newNotification = response.data;
      
      // Update local state
      setNotifications(prev => [newNotification, ...prev]);
      
      return newNotification._id;
    } catch (error) {
      console.error('Error adding leave request notification:', error);
      return null;
    }
  }, []);

  // Function to add a resignation notification
  const addResignationNotification = useCallback(async (employeeName, status, userId = null) => {
    if (!userId) {
      console.error('User ID is required to add a resignation notification');
      return null;
    }

    // Enhanced logging
    console.log("Adding resignation notification with params:", {
      employeeName, 
      status, 
      userId,
      currentNotifications: notifications.length
    });

    const statusText = status === "approved" ? "approved" : "rejected";
    const message = `Your resignation request has been ${statusText}`;
    
    try {
      const response = await axios.post('http://localhost:5000/api/notifications', {
        message,
        type: 'leave',
        status,
        userId
      });
      
      const newNotification = response.data;
      console.log("Created new resignation notification:", newNotification);
      
      // Update local state
      setNotifications(prev => {
        const updatedNotifications = [newNotification, ...prev];
        console.log("Updated notifications with resignation notification:", updatedNotifications);
        return updatedNotifications;
      });
      
      return newNotification._id;
    } catch (error) {
      console.error('Error adding resignation notification:', error);
      return null;
    }
  }, [notifications.length]);

  // Function to add a time off notification
  const addTimeOffNotification = useCallback(async (date, status, userId) => {
    try {
      if (!userId) {
        console.error("Cannot send notification: No user ID provided");
        return;
      }

      const message = `Your time off request for ${new Date(date).toLocaleDateString()} has been ${status}`;
      
      // Create notification in database
      const response = await axios.post('http://localhost:5000/api/notifications', {
        message,
        type: 'timesheet',
        status,
        userId
      });
      
      console.log("Time off notification created:", response.data);
      
      // Add to local state
      setNotifications(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      console.error("Error creating time off notification:", error);
      return null;
    }
  }, []);

  // Add this function to the NotificationContext
  const addShiftRequestNotification = useCallback(async (employeeName, status, requestedShift, startDate, endDate, userId = null) => {
    if (!userId) {
      console.error('User ID is required to add a shift request notification');
      return null;
    }

    const statusText = status === "Approved" ? "approved" : "rejected";
    const message = `Your ${requestedShift} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
    
    try {
      const response = await axios.post('http://localhost:5000/api/notifications', {
        message,
        type: 'shift',
        status,
        userId
      });
      
      const newNotification = response.data;
      
      // Update local state
      setNotifications(prev => [newNotification, ...prev]);
      
      return newNotification._id;
    } catch (error) {
      console.error('Error adding shift request notification:', error);
      return null;
    }
  }, []);

  // Add this function to the NotificationContext
const addWorkTypeRequestNotification = useCallback(async (employeeName, status, requestedWorktype, startDate, endDate, userId = null) => {
  if (!userId) {
    console.error('User ID is required to add a work type request notification');
    return null;
  }

  const statusText = status === "approved" ? "approved" : "rejected";
  const message = `Your ${requestedWorktype} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
  
  try {
    const response = await axios.post('http://localhost:5000/api/notifications', {
      message,
      type: 'worktype',
      status,
      userId
    });
    
    const newNotification = response.data;
    
    // Update local state
    setNotifications(prev => [newNotification, ...prev]);
    
    return newNotification._id;
  } catch (error) {
    console.error('Error adding work type request notification:', error);
    return null;
  }
}, []);

// Add this function to the NotificationContext
const addRotatingWorktypeNotification = useCallback(async (employeeName, status, requestedWorktype, startDate, endDate, userId = null) => {
  if (!userId) {
    console.error('User ID is required to add a rotating worktype notification');
    return null;
  }

  const statusText = status === "Approved" ? "approved" : "rejected";
  const message = `Your ${requestedWorktype} worktype request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
  
  try {
    const response = await axios.post('http://localhost:5000/api/notifications', {
      message,
      type: 'rotating-worktype',
      status: status.toLowerCase(),
      userId
    });
    
    const newNotification = response.data;
    
    // Update local state
    setNotifications(prev => [newNotification, ...prev]);
    
    return newNotification._id;
  } catch (error) {
    console.error('Error adding rotating worktype notification:', error);
    return null;
  }
}, []);



  // Function to delete a notification
  const deleteNotification = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      
      // Update local state
      setNotifications(prev => {
        return prev.filter(notification => notification._id !== id);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  // Function to clear all notifications
  const clearAll = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/notifications/user/${userId}/clear-all`);
      
      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  }, []);

  // Function to get notifications for a specific user
  const getUserNotifications = useCallback((userId) => {
    if (!userId) return [];
    
    return notifications.filter(notification => 
      notification.userId === userId
    );
  }, [notifications]);

  // Function to get unread count for a specific user
  const getUserUnreadCount = useCallback((userId) => {
    if (!userId) return 0;
    
    return notifications.filter(notification => 
      notification.userId === userId && !notification.read
    ).length;
  }, [notifications]);

  // Set up polling for new notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Fetch notifications immediately when the user logs in
    fetchNotifications(userId);
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications(userId);
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    console.log('Setting up WebSocket connection for user:', userId);

    // Connect to WebSocket
    const socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    // Handle connection events for debugging
    socket.on('connect', () => {
      console.log('Socket connected successfully');
      
      // Join a room specific to this user
      socket.emit('join', { userId });
      console.log('Joined room:', userId);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    // Listen for new notifications
    socket.on('new-notification', (notification) => {
      console.log('Received new notification via socket:', notification);
      
      // Add the notification to our state
      setNotifications(prev => {
        // Check if we already have this notification (by ID)
        const exists = prev.some(n => n._id === notification._id);
        if (exists) {
          return prev;
        }
        return [notification, ...prev];
      });
    });
    
    // Clean up on unmount
    return () => {
      console.log('Cleaning up socket connection');
      socket.disconnect();
    };
  }, []);

const sendRotatingShiftNotification = async (userId, message, status, relatedId) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications`,
      {
        userId,
        message,
        type: 'rotating-shift',
        status,
        relatedId,
        read: false,
        time: new Date()
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error sending rotating shift notification:", error);
    throw error;
  }
};

// And update the markRotatingShiftNotificationAsRead function
const markRotatingShiftNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    if (response.status === 200) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  } catch (error) {
    console.error("Error marking rotating shift notification as read:", error);
  }
};




  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      loading,
      fetchNotifications,
      unreadCount,
      getUserUnreadCount,
      addNotification,
      addLeaveRequestNotification,
      addResignationNotification,
      addTimeOffNotification,
      addShiftRequestNotification,
      addWorkTypeRequestNotification,
      markRotatingShiftNotificationAsRead,
      sendRotatingShiftNotification,
      addRotatingWorktypeNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      getUserNotifications,
      
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
