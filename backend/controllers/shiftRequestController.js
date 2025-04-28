import ShiftRequest from '../models/ShiftRequest.js';

export const getAllShiftRequests = async (req, res) => {
  try {
    const { isAllocated, userId } = req.query;
    
    // Build the query object
    const queryObj = {};
    
    // Add isAllocated filter if provided
    if (isAllocated === 'true' || isAllocated === 'false') {
      queryObj.isAllocated = isAllocated === 'true';
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
      isAllocated: req.body.isAllocated
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
    if (req.body.userId && shiftRequest.userId !== req.body.userId) {
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
    if (req.query.userId && shiftRequest.userId !== req.query.userId) {
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
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectShiftRequest = async (req, res) => {
  try {
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkApproveRequests = async (req, res) => {
  try {
    const { ids } = req.body;
    await ShiftRequest.updateMany(
      { _id: { $in: ids } },
      { status: 'Approved' }
    );
    res.status(200).json({ message: 'Shifts approved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkRejectRequests = async (req, res) => {
  try {
    const { ids } = req.body;
    await ShiftRequest.updateMany(
      { _id: { $in: ids } },
      { status: 'Rejected' }
    );
    res.status(200).json({ message: 'Shifts rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
