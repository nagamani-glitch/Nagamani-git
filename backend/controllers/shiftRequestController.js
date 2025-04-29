import ShiftRequest from '../models/ShiftRequest.js';
import Notification from '../models/Notification.js';

export const getAllShiftRequests = async (req, res) => {
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
    
    const shifts = await ShiftRequest.find(queryObj).sort('-createdAt');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserShiftRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const shifts = await ShiftRequest.find({ userId }).sort('-createdAt');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShiftRequest = async (req, res) => {
  try {
    // Ensure userId is included in the request
    if (!req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const newShiftRequest = new ShiftRequest({
      userId: req.body.userId,
      name: req.body.name,
      employeeCode: req.body.employeeCode,
      requestedShift: req.body.requestedShift,
      currentShift: req.body.currentShift,
      requestedDate: req.body.requestedDate,
      requestedTill: req.body.requestedTill,
      description: req.body.description,
      isPermanentRequest: req.body.isPermanentRequest,
      isForReview: true, // Always set to true for new requests
      isAllocated: req.body.isAllocated || false
    });
    
    const savedRequest = await newShiftRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShiftRequest = async (req, res) => {
  try {
    // Find the request first to check ownership
    const shiftRequest = await ShiftRequest.findById(req.params.id);
    
    if (!shiftRequest) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Check if the user owns this request (if userId is provided in the request)
    if (req.body.userId && shiftRequest.userId !== req.body.userId && !isAdmin(req)) {
      return res.status(403).json({ message: 'You can only update your own requests' });
    }
    
    const updatedRequest = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShiftRequest = async (req, res) => {
  try {
    // Find the request first to check ownership
    const shiftRequest = await ShiftRequest.findById(req.params.id);
    
    if (!shiftRequest) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Check if the user owns this request (if userId is provided in the query)
    if (req.query.userId && shiftRequest.userId !== req.query.userId && !isAdmin(req)) {
      return res.status(403).json({ message: 'You can only delete your own requests' });
    }
    
    await ShiftRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shift request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const approveShiftRequest = async (req, res) => {
  try {
    // Find the request first to get user information
    const shiftRequest = await ShiftRequest.findById(req.params.id);
    
    if (!shiftRequest) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Store the previous status to check if it changed
    const previousStatus = shiftRequest.status;
    
    // Update the request to approved status and remove from review if specified
    const updateData = { 
      status: 'Approved',
      // If isForReview is specified in the request body, use that value
      ...(req.body.hasOwnProperty('isForReview') && { isForReview: req.body.isForReview }),
      reviewedBy: req.body.reviewedBy || 'Admin',
      reviewedAt: new Date()
    };
    
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    // If status changed to Approved, create a notification
    if (previousStatus !== 'Approved' && shiftRequest.userId) {
      // Create notification message
      const notificationMessage = `Your shift request for ${new Date(shiftRequest.requestedDate).toLocaleDateString()} has been approved`;
      
      try {
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'shift',
          userId: shiftRequest.userId,
          status: 'approved',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        console.log(`Notification saved to database for user ${shiftRequest.userId}`);
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(shiftRequest.userId).emit('new-notification', notification);
          console.log(`Socket notification emitted to user ${shiftRequest.userId}`);
        } else {
          console.error('Socket.io instance not available');
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectShiftRequest = async (req, res) => {
  try {
    // Find the request first to get user information
    const shiftRequest = await ShiftRequest.findById(req.params.id);
    
    if (!shiftRequest) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Store the previous status to check if it changed
    const previousStatus = shiftRequest.status;
    
    // Update the request to rejected status and remove from review if specified
    const updateData = { 
      status: 'Rejected',
      // If isForReview is specified in the request body, use that value
      ...(req.body.hasOwnProperty('isForReview') && { isForReview: req.body.isForReview }),
      reviewedBy: req.body.reviewedBy || 'Admin',
      reviewedAt: new Date()
    };
    
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    // If status changed to Rejected, create a notification
    if (previousStatus !== 'Rejected' && shiftRequest.userId) {
      // Create notification message
      const notificationMessage = `Your shift request for ${new Date(shiftRequest.requestedDate).toLocaleDateString()} has been rejected`;
      
      try {
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'shift',
          userId: shiftRequest.userId,
          status: 'rejected',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        console.log(`Notification saved to database for user ${shiftRequest.userId}`);
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(shiftRequest.userId).emit('new-notification', notification);
          console.log(`Socket notification emitted to user ${shiftRequest.userId}`);
        } else {
          console.error('Socket.io instance not available');
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkApproveRequests = async (req, res) => {
  try {
    const { ids, isForReview, reviewedBy = 'Admin' } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No request IDs provided' });
    }
    
    // Get all the requests before updating them to create notifications
    const requests = await ShiftRequest.find({ _id: { $in: ids } });
    
    // Update the requests to approved status and remove from review if specified
    const updateData = { 
      status: 'Approved',
      // If isForReview is specified in the request body, use that value
      ...(isForReview !== undefined && { isForReview }),
      reviewedBy,
      reviewedAt: new Date()
    };
    
    const result = await ShiftRequest.updateMany(
      { _id: { $in: ids } },
      updateData
    );
    
    // Create notifications for each approved request
    const notificationPromises = requests.map(async (request) => {
      if (request.userId) {
        const notificationMessage = `Your shift request for ${new Date(request.requestedDate).toLocaleDateString()} has been approved`;
        
        try {
          // Create notification in database
          const notification = new Notification({
            message: notificationMessage,
            type: 'shift',
            userId: request.userId,
            status: 'approved',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(request.userId).emit('new-notification', notification);
          }
          
          return notification;
        } catch (error) {
          console.error(`Error creating notification for user ${request.userId}:`, error);
          return null;
        }
      }
      return null;
    });
    
    await Promise.all(notificationPromises);
    
    res.status(200).json({ 
      message: 'Shifts approved successfully',
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkRejectRequests = async (req, res) => {
  try {
    const { ids, isForReview, reviewedBy = 'Admin' } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No request IDs provided' });
    }
    
    // Get all the requests before updating them to create notifications
    const requests = await ShiftRequest.find({ _id: { $in: ids } });
    
    // Update the requests to rejected status and remove from review if specified
    const updateData = { 
      status: 'Rejected',
      // If isForReview is specified in the request body, use that value
      ...(isForReview !== undefined && { isForReview }),
      reviewedBy,
      reviewedAt: new Date()
    };
    
    const result = await ShiftRequest.updateMany(
      { _id: { $in: ids } },
      updateData
    );
    
    // Create notifications for each rejected request
    const notificationPromises = requests.map(async (request) => {
      if (request.userId) {
        const notificationMessage = `Your shift request for ${new Date(request.requestedDate).toLocaleDateString()} has been rejected`;
        
        try {
          // Create notification in database
          const notification = new Notification({
            message: notificationMessage,
            type: 'shift',
            userId: request.userId,
            status: 'rejected',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          // Get the io instance from the request app
          const io = req.app.get('io');
          
          if (io) {
            // Emit to the specific user's room
            io.to(request.userId).emit('new-notification', notification);
          }
          
          return notification;
        } catch (error) {
          console.error(`Error creating notification for user ${request.userId}:`, error);
          return null;
        }
      }
      return null;
    });
    
    await Promise.all(notificationPromises);
    
    res.status(200).json({ 
      message: 'Shifts rejected successfully',
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to check if a user is an admin
// This is a placeholder - implement your actual admin check logic
const isAdmin = (req) => {
  // You might check a role field in the user's JWT token
  // or check against a list of admin user IDs
  return false; // Default to false for now
};


