import Notification from '../models/Notification.js';

// // Get notifications for a specific user
// export const getUserNotifications = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const notifications = await Notification.find({ 
//       userId: userId 
//     }).sort({ time: -1 });
    
//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update the getUserNotifications function to include better error handling
export const getUserNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Add logging to debug
      console.log(`Fetching notifications for user: ${userId}`);
      
      const notifications = await Notification.find({ 
        userId: userId 
      }).sort({ time: -1 });
      
      console.log(`Found ${notifications.length} notifications for user ${userId}`);
      
      res.json(notifications);
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Create a new notification
// export const createNotification = async (req, res) => {
//   try {
//     const { message, type, status, userId } = req.body;
    
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const notification = new Notification({
//       message,
//       type,
//       status,
//       userId
//     });
    
//     const savedNotification = await notification.save();
//     res.status(201).json(savedNotification);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// In the createNotification function:
export const createNotification = async (req, res) => {
    try {
      const { message, type, status, userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const notification = new Notification({
        message,
        type,
        status,
        userId
      });
      
      const savedNotification = await notification.save();
      
      // Emit the new notification to the user's room
      req.app.get('io').to(userId).emit('new-notification', savedNotification);
      
      res.status(201).json(savedNotification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { userId: userId, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear all notifications for a user
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.deleteMany({ userId: userId });
    
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
