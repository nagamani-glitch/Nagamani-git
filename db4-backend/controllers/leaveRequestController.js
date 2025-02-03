import LeaveRequest from '../models/LeaveRequest.js';

export const getLeaveRequests = async (req, res) => {
  try {
    const { type, status, startDate, endDate, searchTerm } = req.query;
    const filter = {};

    if (searchTerm) {
      filter.$or = [
        { type: { $regex: searchTerm, $options: 'i' } },
        { status: { $regex: searchTerm, $options: 'i' } },
        { comment: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }

    const leaveRequests = await LeaveRequest.find(filter)
      .sort({ createdAt: -1 });
      
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    console.log('Received leave request data:', req.body);
    
    const newLeaveRequest = new LeaveRequest({
      type: req.body.type,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      days: req.body.days,
      comment: req.body.reason,
      status: 'Pending',
      confirmation: 'Pending'
    });

    console.log('Created new leave request object:', newLeaveRequest);
    
    const savedRequest = await newLeaveRequest.save();
    console.log('Saved leave request:', savedRequest);
    
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error saving leave request:', error);
    res.status(400).json({ 
      message: 'Failed to save leave request',
      error: error.message,
      details: error.errors 
    });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
