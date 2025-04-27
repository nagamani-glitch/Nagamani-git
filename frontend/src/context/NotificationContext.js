// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { FaCalendarAlt, FaClock, FaFileAlt, FaUserAlt } from 'react-icons/fa';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// // Create the context
// const NotificationContext = createContext();

// // Custom hook to use the notification context
// export const useNotifications = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children }) => {
//   // State for notifications
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Calculate unread count
//   const unreadCount = notifications.filter(notification => !notification.read).length;

// //   // Update the fetchNotifications function to properly return a promise
// // const fetchNotifications = async (userId) => {
// //   if (!userId) return Promise.resolve([]);
  
// //   setLoading(true);
// //   try {
// //     const response = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
// //     setNotifications(response.data);
// //     return response.data; // Return the data for promise chaining
// //   } catch (error) {
// //     console.error('Error fetching notifications:', error);
// //     return []; // Return empty array on error
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // In NotificationContext.js, memoize the fetchNotifications function:
// const fetchNotifications = useCallback(async (userId) => {
//   if (!userId) return Promise.resolve([]);
  
//   setLoading(true);
//   try {
//     const response = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
//     setNotifications(response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     return [];
//   } finally {
//     setLoading(false);
//   }
// }, []);

// // In NotificationSidebar.js, update the useEffect:
// useEffect(() => {
//   let isMounted = true;
//   let timeoutId = null;
  
//   if (show && userId) {
//     setLocalLoading(true);
    
//     fetchNotifications(userId)
//       .then(() => {
//         if (isMounted) {
//           timeoutId = setTimeout(() => {
//             setLocalLoading(false);
//           }, 300);
//         }
//       })
//       .catch(() => {
//         if (isMounted) {
//           setLocalLoading(false);
//         }
//       });
//   } else {
//     setLocalLoading(false);
//   }
  
//   return () => {
//     isMounted = false;
//     if (timeoutId) clearTimeout(timeoutId);
//   };
// }, [show, userId]); // Remove fetchNotifications from dependencies



//   // Set up polling for new notifications
//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     if (!userId) return;

//     // Fetch notifications immediately when the user logs in
//     fetchNotifications(userId);
    
//     // Set up polling every 30 seconds
//     const intervalId = setInterval(() => {
//       fetchNotifications(userId);
//     }, 30000);
    
//     // Clean up on unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   // Set up WebSocket connection for real-time notifications
//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     if (!userId) return;

//     // Connect to WebSocket
//     const socket = io('http://localhost:5000');
    
//     // Join a room specific to this user
//     socket.emit('join', { userId });
    
//     // Listen for new notifications
//     socket.on('new-notification', (notification) => {
//       setNotifications(prev => [notification, ...prev]);
//     });
    
//     // Clean up on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Function to add a new notification
//   const addNotification = async (message, type = 'info', icon = null, userId = null) => {
//     if (!userId) {
//       console.error('User ID is required to add a notification');
//       return null;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/notifications', {
//         message,
//         type,
//         userId
//       });
      
//       const newNotification = response.data;
      
//       // Update local state
//       setNotifications(prev => [newNotification, ...prev]);
      
//       return newNotification._id;
//     } catch (error) {
//       console.error('Error adding notification:', error);
//       return null;
//     }
//   };

//   // Function to add a leave request notification
//   const addLeaveRequestNotification = async (employeeName, status, leaveType, startDate, endDate, userId = null) => {
//     if (!userId) {
//       console.error('User ID is required to add a leave request notification');
//       return null;
//     }

//     const statusText = status === "approved" ? "approved" : "rejected";
//     const message = `Your ${leaveType} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been ${statusText}`;
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/notifications', {
//         message,
//         type: 'leave',
//         status,
//         userId
//       });
      
//       const newNotification = response.data;
      
//       // Update local state
//       setNotifications(prev => [newNotification, ...prev]);
      
//       return newNotification._id;
//     } catch (error) {
//       console.error('Error adding leave request notification:', error);
//       return null;
//     }
//   };

//   // Function to add a resignation notification
//   const addResignationNotification = async (employeeName, status, userId = null) => {
//     if (!userId) {
//       console.error('User ID is required to add a resignation notification');
//       return null;
//     }

//     // Enhanced logging
//     console.log("Adding resignation notification with params:", {
//       employeeName, 
//       status, 
//       userId,
//       currentNotifications: notifications.length
//     });

//     const statusText = status === "approved" ? "approved" : "rejected";
//     const message = `Your resignation request has been ${statusText}`;
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/notifications', {
//         message,
//         type: 'leave',
//         status,
//         userId
//       });
      
//       const newNotification = response.data;
//       console.log("Created new resignation notification:", newNotification);
      
//       // Update local state
//       setNotifications(prev => {
//         const updatedNotifications = [newNotification, ...prev];
//         console.log("Updated notifications with resignation notification:", updatedNotifications);
//         return updatedNotifications;
//       });
      
//       return newNotification._id;
//     } catch (error) {
//       console.error('Error adding resignation notification:', error);
//       return null;
//     }
//   };

//   // Function to mark a notification as read
//   const markAsRead = async (id) => {
//     try {
//       await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      
//       // Update local state
//       setNotifications(prev => {
//         return prev.map(notification =>
//           notification._id === id
//             ? { ...notification, read: true }
//             : notification
//         );
//       });
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Function to mark all notifications as read
//   const markAllAsRead = async (userId) => {
//     if (!userId) return;
    
//     try {
//       await axios.put(`http://localhost:5000/api/notifications/user/${userId}/read-all`);
      
//       // Update local state
//       setNotifications(prev => {
//         return prev.map(notification => ({ ...notification, read: true }));
//       });
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   // Function to delete a notification
//   const deleteNotification = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      
//       // Update local state
//       setNotifications(prev => {
//         return prev.filter(notification => notification._id !== id);
//       });
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   // Function to clear all notifications
//   const clearAll = async (userId) => {
//     if (!userId) return;
    
//     try {
//       await axios.delete(`http://localhost:5000/api/notifications/user/${userId}/clear-all`);
      
//       // Update local state
//       setNotifications([]);
//     } catch (error) {
//       console.error('Error clearing all notifications:', error);
//     }
//   };

//   // Function to get notifications for a specific user
//   const getUserNotifications = (userId) => {
//     if (!userId) return [];
    
//     return notifications.filter(notification => 
//       notification.userId === userId
//     );
//   };

//   // Function to get unread count for a specific user
//   const getUserUnreadCount = (userId) => {
//     if (!userId) return 0;
    
//     return notifications.filter(notification => 
//       notification.userId === userId && !notification.read
//     ).length;
//   };

//   return (
//     <NotificationContext.Provider value={{ 
//       notifications, 
//       loading,
//       fetchNotifications,
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


import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
