import RotatingWorktype from '../models/RotatingWorktype.js';
import Notification from '../models/Notification.js';

// Get all worktypes with filtering options
export const getAllWorktypes = async (req, res) => {
  try {
    const { isForReview, userId } = req.query;
    
    let query = {};
    
    // If userId is provided, filter by user
    if (userId) {
      query.userId = userId;
    }
    
    // If isForReview is provided, filter by review status
    if (isForReview !== undefined) {
      query.isForReview = isForReview === 'true';
    }
    
    const worktypes = await RotatingWorktype.find(query).sort('-createdAt');
    res.status(200).json(worktypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get worktypes for a specific user
export const getUserWorktypes = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const worktypes = await RotatingWorktype.find({ 
      userId: userId 
    }).sort('-createdAt');
    
    res.status(200).json(worktypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new worktype request
export const createWorktype = async (req, res) => {
  try {
    // Ensure userId is provided
    if (!req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const newWorktype = new RotatingWorktype(req.body);
    const savedWorktype = await newWorktype.save();
    res.status(201).json(savedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a worktype request
export const updateWorktype = async (req, res) => {
  try {
    // Check if the user owns this request (if userId is provided)
    if (req.body.userId) {
      const worktype = await RotatingWorktype.findById(req.params.id);
      
      if (!worktype) {
        return res.status(404).json({ message: 'Worktype request not found' });
      }
      
      // Only allow updates if the user owns the request or is an admin
      // Note: You might want to add admin check here based on your auth system
      if (worktype.userId !== req.body.userId) {
        return res.status(403).json({ 
          message: 'You do not have permission to update this request' 
        });
      }
    }
    
    const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedWorktype) {
      return res.status(404).json({ message: 'Worktype request not found' });
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a worktype request
export const deleteWorktype = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // If userId is provided, check ownership
    if (userId) {
      const worktype = await RotatingWorktype.findById(req.params.id);
      
      if (!worktype) {
        return res.status(404).json({ message: 'Worktype request not found' });
      }
      
      // Only allow deletion if the user owns the request or is an admin
      if (worktype.userId !== userId) {
        return res.status(403).json({ 
          message: 'You do not have permission to delete this request' 
        });
      }
    }
    
    const deletedWorktype = await RotatingWorktype.findByIdAndDelete(req.params.id);
    
    if (!deletedWorktype) {
      return res.status(404).json({ message: 'Worktype request not found' });
    }
    
    res.status(200).json({ message: 'Worktype request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Approve a worktype request
export const approveWorktype = async (req, res) => {
  try {
    const worktype = await RotatingWorktype.findById(req.params.id);
    
    if (!worktype) {
      return res.status(404).json({ message: 'Worktype request not found' });
    }
    
    // Update the worktype with approved status and reviewer info
    const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    // Create notification for the user
    if (worktype.userId) {
      try {
        // Create notification message
        const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
        
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-worktype',
          userId: worktype.userId,
          status: 'approved',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(worktype.userId).emit('new-notification', notification);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reject a worktype request
export const rejectWorktype = async (req, res) => {
  try {
    const worktype = await RotatingWorktype.findById(req.params.id);
    
    if (!worktype) {
      return res.status(404).json({ message: 'Worktype request not found' });
    }
    
    // Update the worktype with rejected status and reviewer info
    const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    // Create notification for the user
    if (worktype.userId) {
      try {
        // Create notification message
        const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
        
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-worktype',
          userId: worktype.userId,
          status: 'rejected',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(worktype.userId).emit('new-notification', notification);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk approve worktype requests
export const bulkApprove = async (req, res) => {
  try {
    const { ids, reviewerName } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No request IDs provided' });
    }
    
    // Get all worktypes to be approved for notification purposes
    const worktypes = await RotatingWorktype.find({ _id: { $in: ids } });
    
    // Update all worktypes
    const result = await RotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Approved',
        isForReview: false,
        reviewerName: reviewerName || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Create notifications for each user
    const notifications = [];
    for (const worktype of worktypes) {
      if (worktype.userId) {
        try {
          // Create notification message
          const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
          
          // Create notification in database
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-worktype',
            userId: worktype.userId,
            status: 'approved',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          notifications.push(notification);
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(worktype.userId).emit('new-notification', notification);
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }
    
    res.status(200).json({ 
      message: 'Worktypes approved successfully',
      count: result.modifiedCount,
      notifications: notifications.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk reject worktype requests
export const bulkReject = async (req, res) => {
  try {
    const { ids, reviewerName } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No request IDs provided' });
    }
    
    // Get all worktypes to be rejected for notification purposes
    const worktypes = await RotatingWorktype.find({ _id: { $in: ids } });
    
    // Update all worktypes
    const result = await RotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Rejected',
        isForReview: false,
        reviewerName: reviewerName || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Create notifications for each user
    const notifications = [];
    for (const worktype of worktypes) {
      if (worktype.userId) {
        try {
          // Create notification message
          const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
          
          // Create notification in database
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-worktype',
            userId: worktype.userId,
            status: 'rejected',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          notifications.push(notification);
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(worktype.userId).emit('new-notification', notification);
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }
    
    res.status(200).json({ 
      message: 'Worktypes rejected successfully',
      count: result.modifiedCount,
      notifications: notifications.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
