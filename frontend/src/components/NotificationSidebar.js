// import React from 'react';
// import { Drawer, Box, Typography, IconButton, Divider, Badge } from '@mui/material';
// import { Close, Delete, CheckCircle } from '@mui/icons-material';
// import { useNotifications } from '../context/NotificationContext';

// const NotificationSidebar = ({ show, onClose }) => {
  
//   const { notifications, markAsRead, deleteNotification, clearAll, markAllAsRead, getUserNotifications, getUserUnreadCount } = useNotifications();
 
//   // Get the current user ID from localStorage
//   const userId = localStorage.getItem('userId');

  

//    // Filter notifications to only show those for the current user
//    const userNotifications = getUserNotifications(userId);
//    const userUnreadCount = getUserUnreadCount(userId);
//   // Update the getNotificationStyle function to handle leave request statuses
//   const getNotificationStyle = (type, status) => {
//     const styles = {
//       leave: status === "approved" ? "#e8f5e9" : status === "rejected" ? "#ffebee" : "#e3f2fd",
//       timesheet: "#e3f2fd",
//       performance: "#fff3e0",
//       onboarding: "#f3e5f5",
//       payroll: "#e0f2f1"
//     };
//     return styles[type] || styles.leave;
//   };

//   // Update the formatTime function to handle ISO timestamps
//   const formatTime = (timestamp) => {
//     if (timestamp === "Just now") return timestamp;
    
//     try {
//       const now = new Date();
//       const notificationTime = new Date(timestamp);
//       const diffInSeconds = Math.floor((now - notificationTime) / 1000);
      
//       if (diffInSeconds < 60) return "Just now";
//       if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
//       if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//       return `${Math.floor(diffInSeconds / 86400)} days ago`;
//     } catch (error) {
//       return timestamp; // Fallback to the original value if parsing fails
//     }
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={show}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: { xs: '100%', sm: 400 },
//           padding: 2,
//           boxShadow: 3
//         }
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h6" component="div" 
        
//         >
//           Notifications
       
// <Badge 
//   badgeContent={userUnreadCount} 
//   color="error" 
//   sx={{ ml: 1, paddingRight: "5px" }}
// />

//         </Typography>
//         <Box>
//           <IconButton 
//             size="small" 
//             onClick={markAllAsRead} 
//             title="Mark all as read"
//             sx={{ mr: 1 }}
//           >
//             <CheckCircle fontSize="small" />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             onClick={clearAll} 
//             title="Clear all notifications"
//             sx={{ mr: 1 }}
//           >
//             <Delete fontSize="small" />
//           </IconButton>
//           <IconButton onClick={onClose} size="small">
//             <Close />
//           </IconButton>
//         </Box>
//       </Box>
      
//       <Divider sx={{ mb: 2 }} />
      
//       <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
//         {userNotifications.length > 0 ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             {userNotifications.map((notification) => (
//               <Box
//                 key={notification.id}
//                 sx={{
//                   p: 2,
//                   borderRadius: 2,
//                   backgroundColor: getNotificationStyle(notification.type, notification.status),
//                   opacity: notification.read ? 0.7 : 1,
//                   position: 'relative',
//                   '&:hover': {
//                     boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                   }
//                 }}
//               >
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     {formatTime(notification.time)}
//                   </Typography>
//                   <Box>
//                     {!notification.read && (
//                       <IconButton 
//                         size="small" 
//                         onClick={() => markAsRead(notification.id)}
//                         title="Mark as read"
//                         sx={{ p: 0.5, mr: 0.5 }}
//                       >
//                         <CheckCircle fontSize="small" />
//                       </IconButton>
//                     )}
//                     <IconButton 
//                       size="small" 
//                       onClick={() => deleteNotification(notification.id)}
//                       title="Delete notification"
//                       sx={{ p: 0.5 }}
//                     >
//                       <Delete fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </Box>
//                 <Typography variant="body2">{notification.message}</Typography>
//               </Box>
//             ))}
//           </div>
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 4 }}>
//             <Typography variant="body1" color="text.secondary">
//               No notifications yet
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Drawer>
//   );
// };

// export default NotificationSidebar;

import React, { useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Badge, CircularProgress } from '@mui/material';
import { Close, Delete, CheckCircle } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

const NotificationSidebar = ({ show, onClose }) => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    deleteNotification, 
    clearAll, 
    markAllAsRead, 
    getUserNotifications, 
    getUserUnreadCount 
  } = useNotifications();
 
  // Get the current user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch notifications when the sidebar is opened
  useEffect(() => {
    if (show && userId) {
      fetchNotifications(userId);
    }
  }, [show, userId, fetchNotifications]);

  // Filter notifications to only show those for the current user
  const userNotifications = getUserNotifications(userId);
  const userUnreadCount = getUserUnreadCount(userId);

  // Update the getNotificationStyle function to handle leave request statuses
  const getNotificationStyle = (type, status) => {
    const styles = {
      leave: status === "approved" ? "#e8f5e9" : status === "rejected" ? "#ffebee" : "#e3f2fd",
      timesheet: "#e3f2fd",
      performance: "#fff3e0",
      onboarding: "#f3e5f5",
      payroll: "#e0f2f1"
    };
    return styles[type] || styles.leave;
  };

  // Update the formatTime function to handle ISO timestamps
  const formatTime = (timestamp) => {
    if (timestamp === "Just now") return timestamp;
    
    try {
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - notificationTime) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch (error) {
      return timestamp; // Fallback to the original value if parsing fails
    }
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllAsRead(userId);
    }
  };

  const handleClearAll = () => {
    if (userId) {
      clearAll(userId);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          padding: 2,
          boxShadow: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Notifications
          <Badge 
            badgeContent={userUnreadCount} 
            color="error" 
            sx={{ ml: 1, paddingRight: "5px" }}
          />
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={handleMarkAllAsRead} 
            title="Mark all as read"
            sx={{ mr: 1 }}
          >
            <CheckCircle fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleClearAll} 
            title="Clear all notifications"
            sx={{ mr: 1 }}
          >
            <Delete fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : userNotifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {userNotifications.map((notification) => (
              <Box
                key={notification._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: getNotificationStyle(notification.type, notification.status),
                  opacity: notification.read ? 0.7 : 1,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(notification.time)}
                  </Typography>
                  <Box>
                    {!notification.read && (
                      <IconButton 
                        size="small" 
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                        sx={{ p: 0.5, mr: 0.5 }}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete notification"
                      sx={{ p: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            ))}
          </div>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationSidebar;

