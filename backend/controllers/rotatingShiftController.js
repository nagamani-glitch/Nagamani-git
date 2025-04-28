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

export const createShift = async (req, res) => {
  try {
    // Ensure userId is included in the request
    if (!req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const newShift = new RotatingShift({
      ...req.body,
      isForReview: true,
      isAllocated: req.body.isAllocated || false
    });
    
    const savedShift = await newShift.save();
    res.status(201).json(savedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    // Find the shift first to check ownership
    const rotatingShift = await RotatingShift.findById(req.params.id);
    
    if (!rotatingShift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Check if the user owns this request (if userId is provided in the request)
    if (req.body.userId && rotatingShift.userId !== req.body.userId) {
      return res.status(403).json({ message: 'You can only update your own requests' });
    }
    
    const updatedShift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    // Find the shift first to check ownership
    const rotatingShift = await RotatingShift.findById(req.params.id);
    
    if (!rotatingShift) {
      return res.status(404).json({ message: 'Shift request not found' });
    }
    
    // Check if the user owns this request (if userId is provided in the query)
    if (req.query.userId && rotatingShift.userId !== req.query.userId) {
      return res.status(403).json({ message: 'You can only delete your own requests' });
    }
    
    await RotatingShift.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shift deleted successfully' });
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
        const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been approved`;
        
        const notification = new Notification({
          message: notificationMessage,
          type: 'shift',
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
          console.log(`Socket notification emitted to user ${shift.userId}`);
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
        const notificationMessage = `Your rotating shift request for ${new Date(shift.requestedDate).toLocaleDateString()} has been rejected`;
        
        const notification = new Notification({
          message: notificationMessage,
          type: 'shift',
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
          console.log(`Socket notification emitted to user ${shift.userId}`);
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
            type: 'shift',
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
            type: 'shift',
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
