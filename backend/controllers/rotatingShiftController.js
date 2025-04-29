import RotatingShift from '../models/RotatingShift.js';
import Notification from '../models/Notification.js';

export const getAllShifts = async (req, res) => {
  try {
    const { isForReview, userId } = req.query;
    
    // Build the query object
    const queryObj = {};
    
    // Add isForReview filter if provided
    if (isForReview === 'true' || isForReview === 'false') {
      queryObj.isForReview = isForReview === 'true';
    }
    
    // Add userId filter if provided
    if (userId) {
      queryObj.userId = userId;
    }
    
    const shifts = await RotatingShift.find(queryObj).sort('-createdAt');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserShifts = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const shifts = await RotatingShift.find({ userId }).sort('-createdAt');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const createShift = async (req, res) => {
//   try {
//     // Ensure userId is included in the request
//     if (!req.body.userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const newShift = new RotatingShift({
//       ...req.body,
//       isForReview: true,
//       isAllocated: req.body.isAllocated || false
//     });
    
//     const savedShift = await newShift.save();
//     res.status(201).json(savedShift);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const createShift = async (req, res) => {
  try {
    // Make sure userId is included in the request body
    if (!req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const newShift = new RotatingShift(req.body);
    const savedShift = await newShift.save();
    
    // Create notification for admin/HR about new request
    // You would need to get admin/HR user IDs from your system
    const adminIds = await getAdminUserIds(); // Implement this function based on your user system
    
    for (const adminId of adminIds) {
      await createNotification(
        req,
        adminId,
        `New rotating shift request from ${savedShift.name} (${savedShift.employeeCode})`,
        'pending',
        savedShift._id
      );
    }
    
    res.status(201).json(savedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const updateShift = async (req, res) => {
//   try {
//     // Find the shift first to check ownership
//     const rotatingShift = await RotatingShift.findById(req.params.id);
    
//     if (!rotatingShift) {
//       return res.status(404).json({ message: 'Shift request not found' });
//     }
    
//     // Check if the user owns this request (if userId is provided in the request)
//     if (req.body.userId && rotatingShift.userId !== req.body.userId) {
//       return res.status(403).json({ message: 'You can only update your own requests' });
//     }
    
//     const updatedShift = await RotatingShift.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
    
//     res.status(200).json(updatedShift);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteShift = async (req, res) => {
//   try {
//     // Find the shift first to check ownership
//     const rotatingShift = await RotatingShift.findById(req.params.id);
    
//     if (!rotatingShift) {
//       return res.status(404).json({ message: 'Shift request not found' });
//     }
    
//     // Check if the user owns this request (if userId is provided in the query)
//     if (req.query.userId && rotatingShift.userId !== req.query.userId) {
//       return res.status(403).json({ message: 'You can only delete your own requests' });
//     }
    
//     await RotatingShift.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Shift deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Update the deleteShift function

export const updateShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    const updatedShift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Notify the user that their request was updated
    if (shift.userId) {
      await createNotification(
        req,
        shift.userId,
        `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been updated`,
        'updated',
        updatedShift._id
      );
    }
    
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    await RotatingShift.findByIdAndDelete(req.params.id);
    
    // Notify the user that their request was deleted
    if (shift.userId) {
      await createNotification(
        req,
        shift.userId,
        `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been deleted`,
        'deleted',
        null
      );
    }
    
    res.status(200).json({ message: 'Shift request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// export const approveShift = async (req, res) => {
//   try {
//     const shift = await RotatingShift.findById(req.params.id);
    
//     if (!shift) {
//       return res.status(404).json({ message: 'Shift request not found' });
//     }
    
//     const updatedShift = await RotatingShift.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'Approved',
//         isForReview: false,
//         reviewedBy: req.body.reviewedBy || 'Admin',
//         reviewedAt: new Date(),
//         reviewComment: req.body.reviewComment || ''
//       },
//       { new: true }
//     );
    
//     // Create notification for the user
//     if (shift.userId) {
//       try {
//         const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been approved`;
        
//         const notification = new Notification({
//           message: notificationMessage,
//           type: 'shift',
//           userId: shift.userId,
//           status: 'approved',
//           read: false,
//           time: new Date()
//         });
        
//         await notification.save();
        
//         // Get the io instance from the request app
//         const io = req.app.get('io');
        
//         if (io) {
//           // Emit to the specific user's room
//           io.to(shift.userId).emit('new-notification', notification);
//           console.log(`Socket notification emitted to user ${shift.userId}`);
//         }
//       } catch (notificationError) {
//         console.error('Error creating notification:', notificationError);
//       }
//     }
    
//     res.status(200).json(updatedShift);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const rejectShift = async (req, res) => {
//   try {
//     const shift = await RotatingShift.findById(req.params.id);
    
//     if (!shift) {
//       return res.status(404).json({ message: 'Shift request not found' });
//     }
    
//     const updatedShift = await RotatingShift.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'Rejected',
//         isForReview: false,
//         reviewedBy: req.body.reviewedBy || 'Admin',
//         reviewedAt: new Date(),
//         reviewComment: req.body.reviewComment || ''
//       },
//       { new: true }
//     );
    
//     // Create notification for the user
//     if (shift.userId) {
//       try {
//         const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been rejected`;
        
//         const notification = new Notification({
//           message: notificationMessage,
//           type: 'shift',
//           userId: shift.userId,
//           status: 'rejected',
//           read: false,
//           time: new Date()
//         });
        
//         await notification.save();
        
//         // Get the io instance from the request app
//         const io = req.app.get('io');
        
//         if (io) {
//           // Emit to the specific user's room
//           io.to(shift.userId).emit('new-notification', notification);
//           console.log(`Socket notification emitted to user ${shift.userId}`);
//         }
//       } catch (notificationError) {
//         console.error('Error creating notification:', notificationError);
//       }
//     }
    
//     res.status(200).json(updatedShift);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const bulkApprove = async (req, res) => {
//   try {
//     const { ids } = req.body;
    
//     // Get all shifts to be approved for notifications
//     const shifts = await RotatingShift.find({ _id: { $in: ids } });
    
//     await RotatingShift.updateMany(
//       { _id: { $in: ids } },
//       { 
//         status: 'Approved',
//         isForReview: false,
//         reviewedBy: req.body.reviewedBy || 'Admin',
//         reviewedAt: new Date()
//       }
//     );
    
//     // Create notifications for each user
//     for (const shift of shifts) {
//       if (shift.userId) {
//         try {
//           const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been approved`;
          
//           const notification = new Notification({
//             message: notificationMessage,
//             type: 'shift',
//             userId: shift.userId,
//             status: 'approved',
//             read: false,
//             time: new Date()
//           });
          
//           await notification.save();
          
//           // Get the io instance from the request app
//           const io = req.app.get('io');
          
//           if (io) {
//             // Emit to the specific user's room
//             io.to(shift.userId).emit('new-notification', notification);
//           }
//         } catch (notificationError) {
//           console.error('Error creating notification:', notificationError);
//         }
//       }
//     }
    
//     res.status(200).json({ message: 'Shifts approved successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const bulkReject = async (req, res) => {
//   try {
//     const { ids } = req.body;
    
//     // Get all shifts to be rejected for notifications
//     const shifts = await RotatingShift.find({ _id: { $in: ids } });
    
//     await RotatingShift.updateMany(
//       { _id: { $in: ids } },
//       { 
//         status: 'Rejected',
//         isForReview: false,
//         reviewedBy: req.body.reviewedBy || 'Admin',
//         reviewedAt: new Date()
//       }
//     );
    
//     // Create notifications for each user
//     for (const shift of shifts) {
//       if (shift.userId) {
//         try {
//           const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been rejected`;
          
//           const notification = new Notification({
//             message: notificationMessage,
//             type: 'shift',
//             userId: shift.userId,
//             status: 'rejected',
//             read: false,
//             time: new Date()
//           });
          
//           await notification.save();
          
//           // Get the io instance from the request app
//           const io = req.app.get('io');
          
//           if (io) {
//             // Emit to the specific user's room
//             io.to(shift.userId).emit('new-notification', notification);
//           }
//         } catch (notificationError) {
//           console.error('Error creating notification:', notificationError);
//         }
//       }
//     }
    
//     res.status(200).json({ message: 'Shifts rejected successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// The approveShift and rejectShift functions already have notification functionality
// Let's update the bulkApprove and bulkReject functions to ensure they're properly sending notifications

export const bulkApprove = async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Get all shifts to be approved for notifications
    const shifts = await RotatingShift.find({ _id: { $in: ids } });
    
    await RotatingShift.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Approved',
        isForReview: false,
        reviewedBy: req.body.reviewedBy || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Create notifications for each user
    for (const shift of shifts) {
      if (shift.userId) {
        try {
          const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been approved`;
          
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-shift',  // Update the type to be more specific
            userId: shift.userId,
            status: 'approved',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(shift.userId).emit('new-notification', notification);
            console.log(`Socket notification emitted to user ${shift.userId} for bulk approval`);
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }
    
    res.status(200).json({ message: 'Shifts approved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkReject = async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Get all shifts to be rejected for notifications
    const shifts = await RotatingShift.find({ _id: { $in: ids } });
    
    await RotatingShift.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Rejected',
        isForReview: false,
        reviewedBy: req.body.reviewedBy || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Create notifications for each user
    for (const shift of shifts) {
      if (shift.userId) {
        try {
          const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been rejected`;
          
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-shift',  // Update the type to be more specific
            userId: shift.userId,
            status: 'rejected',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(shift.userId).emit('new-notification', notification);
            console.log(`Socket notification emitted to user ${shift.userId} for bulk rejection`);
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }
    
    res.status(200).json({ message: 'Shifts rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const approveShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    const updatedShift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        isForReview: false,
        reviewedBy: req.body.reviewedBy || 'Admin',
        reviewedAt: new Date(),
        reviewComment: req.body.reviewComment || ''
      },
      { new: true }
    );
    
    // Create notification for the user
    if (shift.userId) {
      try {
        const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been approved by ${req.body.reviewedBy || 'Admin'}`;
        
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-shift',
          userId: shift.userId,
          status: 'approved',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(shift.userId).emit('new-notification', notification);
          console.log(`Socket notification emitted to user ${shift.userId} for approval`);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    const updatedShift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        isForReview: false,
        reviewedBy: req.body.reviewedBy || 'Admin',
        reviewedAt: new Date(),
        reviewComment: req.body.reviewComment || ''
      },
      { new: true }
    );
    
    // Create notification for the user
    if (shift.userId) {
      try {
        const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been rejected by ${req.body.reviewedBy || 'Admin'}`;
        
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-shift',
          userId: shift.userId,
          status: 'rejected',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(shift.userId).emit('new-notification', notification);
          console.log(`Socket notification emitted to user ${shift.userId} for rejection`);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const createNotification = async (req, userId, message, status, relatedId) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type: 'rotating-shift',
      status,
      relatedId,
      read: false,
      time: new Date()
    });
    
    await notification.save();
    
    // Get the io instance from the request app
    const io = req.app.get('io');
    
    if (io) {
      // Emit to the specific user's room
      io.to(userId).emit('new-notification', notification);
      console.log(`Socket notification emitted to user ${userId}`);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};


// Helper function to get admin user IDs - implement based on your user system
const getAdminUserIds = async () => {
  try {
    // This is a placeholder - implement based on your user model and roles
    // For example:
    // const admins = await User.find({ role: { $in: ['admin', 'HR'] } });
    // return admins.map(admin => admin._id);
    
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error('Error getting admin user IDs:', error);
    return [];
  }
};


export const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Get all shifts to be deleted for notifications
    const shifts = await RotatingShift.find({ _id: { $in: ids } });
    
    await RotatingShift.deleteMany({ _id: { $in: ids } });
    
    // Create notifications for each user
    for (const shift of shifts) {
      if (shift.userId) {
        await createNotification(
          req,
          shift.userId,
          `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been deleted`,
          'deleted',
          null
        );
      }
    }
    
    res.status(200).json({ message: 'Shifts deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Add a function to get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const notifications = await Notification.find({ 
      userId, 
      type: 'rotating-shift' 
    })
    .sort({ time: -1 })
    .limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a function to mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await Notification.updateMany(
      { userId, type: 'rotating-shift', read: false },
      { read: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
