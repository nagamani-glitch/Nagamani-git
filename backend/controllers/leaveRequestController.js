import LeaveRequest from '../models/LeaveRequest.js';

export const getLeaveRequests = async (req, res) => {
  try {
    const { type, status, startDate, endDate, searchTerm } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }
    if (searchTerm) {
      filter.$or = [
        { type: { $regex: searchTerm, $options: 'i' } },
        { status: { $regex: searchTerm, $options: 'i' } },
        { comment: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const leaveRequests = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate, comment, days } = req.body;
    const newLeaveRequest = new LeaveRequest({
      type,
      startDate,
      endDate,
      comment,
      days,
      status: 'Pending',
      confirmation: 'Pending'
    });
    
    const savedRequest = await newLeaveRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate, comment, days } = req.body;
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { type, startDate, endDate, comment, days },
      { new: true, runValidators: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    const deletedRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, confirmation: req.body.confirmation },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeaveComment = async (req, res) => {
  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { comment: req.body.comment },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
