// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';

// // Create the context
// const NotificationContext = createContext();

// // Custom hook to use the notification context
// export const useNotifications = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children }) => {
//   // State for notifications
//   const [notifications, setNotifications] = useState(() => {
//     // Try to load notifications from localStorage
//     const savedNotifications = localStorage.getItem('notifications');
//     return savedNotifications ? JSON.parse(savedNotifications) : [];
//   });

// // Calculate unread count
// const unreadCount = notifications.filter(notification => !notification.read).length;

//   // Save notifications to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('notifications', JSON.stringify(notifications));
//   }, [notifications]);
  
//   // Add debug logging to see notifications whenever they change
//   useEffect(() => {
//     console.log("Current notifications:", notifications);
//   }, [notifications]);

//   // Function to add a new notification
//   const addNotification = (message, type = 'info', icon = null, userId = null) => {
//     const iconMap = {
//       leave: <FaCalendarAlt />,
//       timesheet: <FaClock />,
//       performance: <FaFileAlt />,
//       onboarding: <FaUserAlt />
//     };

//     const newNotification = {
//       id: Date.now(), // Use timestamp as unique ID
//       message,
//       time: new Date().toISOString(),
//       type,
//       read: false,
//       icon: icon || iconMap[type] || iconMap.info,
//       userId: userId // Store the user ID if provided
//     };

//     console.log("Adding new notification:", newNotification);
    
//     setNotifications(prev => {
//       const updatedNotifications = [newNotification, ...prev];
//       console.log("Updated notifications array:", updatedNotifications);
//       return updatedNotifications;
//     });
    
//     return newNotification.id;
//   };

//   // Function to add a leave request notification
//   const addLeaveRequestNotification = (employeeName, status, leaveType, startDate, endDate, userId = null) => {
//     const iconMap = {
//       leave: <FaCalendarAlt />,
//       timesheet: <FaClock />,
//       performance: <FaFileAlt />,
//       onboarding: <FaUserAlt />
//     };

//     // Log the parameters to make sure they're correct
//     console.log("Adding leave request notification with params:", {
//       employeeName, status, leaveType, startDate, endDate, userId
//     });

//     const statusText = status === "approved" ? "approved" : "rejected";
//     const message = `Your ${leaveType} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
    
//     const newNotification = {
//       id: Date.now(), // Use timestamp as unique ID
//       message,
//       time: new Date().toISOString(), // Store actual timestamp for proper time display
//       type: "leave",
//       read: false,
//       icon: iconMap.leave,
//       status: status, // Store the status for styling purposes
//       userId: userId // Store the user ID if provided
//     };

//     console.log("Created new leave request notification:", newNotification);

//     setNotifications(prev => {
//       const updatedNotifications = [newNotification, ...prev];
//       console.log("Updated notifications with leave request:", updatedNotifications);
//       return updatedNotifications;
//     });
    
//     return newNotification.id;
//   };

//   // Function to mark a notification as read
//   const markAsRead = (id) => {
//     console.log("Marking notification as read:", id);
    
//     setNotifications(prev => {
//       const updated = prev.map(notification =>
//         notification.id === id
//           ? { ...notification, read: true }
//           : notification
//       );
//       console.log("Updated notifications after marking as read:", updated);
//       return updated;
//     });
//   };

//   // Function to mark all notifications as read
//   const markAllAsRead = () => {
//     console.log("Marking all notifications as read");
    
//     setNotifications(prev => {
//       const updated = prev.map(notification => ({ ...notification, read: true }));
//       console.log("Updated notifications after marking all as read:", updated);
//       return updated;
//     });
//   };

//   // Function to delete a notification
//   const deleteNotification = (id) => {
//     console.log("Deleting notification:", id);
    
//     setNotifications(prev => {
//       const updated = prev.filter(notification => notification.id !== id);
//       console.log("Updated notifications after deletion:", updated);
//       return updated;
//     });
//   };

//   // Function to clear all notifications
//   const clearAll = () => {
//     console.log("Clearing all notifications");
//     setNotifications([]);
//   };

//   // Function to get notifications for a specific user
//   const getUserNotifications = (userId) => {
//     if (!userId) return notifications;
    
//     const userNotifications = notifications.filter(notification => 
//       !notification.userId || notification.userId === userId
//     );
    
//     console.log(`Filtered notifications for user ${userId}:`, userNotifications);
//     return userNotifications;
//   };

// // Add this function to NotificationContext.js
// const addResignationNotification = (employeeName, status, userId = null) => {
//   const iconMap = {
//     leave: <FaCalendarAlt />,
//     timesheet: <FaClock />,
//     performance: <FaFileAlt />,
//     onboarding: <FaUserAlt />
//   };

//   // Log the parameters to make sure they're correct
//   console.log("Adding resignation notification with params:", {
//     employeeName, status, userId
//   });

//   const statusText = status === "approved" ? "approved" : "rejected";
//   const message = `Your resignation request has been ${statusText}`;
  
//   const newNotification = {
//     id: Date.now(), // Use timestamp as unique ID
//     message,
//     time: new Date().toISOString(), // Store actual timestamp for proper time display
//     type: "leave", // Using leave type for styling
//     read: false,
//     icon: iconMap.leave,
//     status: status, // Store the status for styling purposes
//     userId: userId // Store the user ID if provided
//   };

//   console.log("Created new resignation notification:", newNotification);

//   setNotifications(prev => {
//     const updatedNotifications = [newNotification, ...prev];
//     console.log("Updated notifications with resignation notification:", updatedNotifications);
//     return updatedNotifications;
//   });
  
//   return newNotification.id;
// };

// const getUserUnreadCount = (userId) => {
//   if (!userId) return unreadCount;
  
//   const userUnreadCount = notifications.filter(notification => 
//     (!notification.userId || notification.userId === userId) && !notification.read
//   ).length;
  
//   return userUnreadCount;
// };


//   return (
//     <NotificationContext.Provider value={{ 
//       notifications, 
//       setNotifications, 
//       unreadCount,
//       getUserUnreadCount,
//       addNotification,
//       addLeaveRequestNotification,
//       addResignationNotification,
//       markAsRead,
//       markAllAsRead,
//       deleteNotification,
//       clearAll,
//       getUserNotifications
//     }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };



import React, { createContext, useState, useContext, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import { io } from 'socket.io-client';

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

  // Fetch notifications from the server for the current user
  const fetchNotifications = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Connect to WebSocket
    const socket = io('http://localhost:5000');
    
    // Join a room specific to this user
    socket.emit('join', { userId });
    
    // Listen for new notifications
    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to add a new notification
  const addNotification = async (message, type = 'info', icon = null, userId = null) => {
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
  };

  // Function to add a leave request notification
  const addLeaveRequestNotification = async (employeeName, status, leaveType, startDate, endDate, userId = null) => {
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
  };

  // Function to add a resignation notification
  const addResignationNotification = async (employeeName, status, userId = null) => {
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
  };

  // Function to mark a notification as read
  const markAsRead = async (id) => {
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
  };

  // Function to mark all notifications as read
  const markAllAsRead = async (userId) => {
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
  };

  // Function to delete a notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      
      // Update local state
      setNotifications(prev => {
        return prev.filter(notification => notification._id !== id);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Function to clear all notifications
  const clearAll = async (userId) => {
    if (!userId) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/notifications/user/${userId}/clear-all`);
      
      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // Function to get notifications for a specific user
  const getUserNotifications = (userId) => {
    if (!userId) return [];
    
    return notifications.filter(notification => 
      notification.userId === userId
    );
  };

  // Function to get unread count for a specific user
  const getUserUnreadCount = (userId) => {
    if (!userId) return 0;
    
    return notifications.filter(notification => 
      notification.userId === userId && !notification.read
    ).length;
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
