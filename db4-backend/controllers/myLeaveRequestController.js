import MyLeaveRequest from '../models/MyLeaveRequest.js';

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await MyLeaveRequest.find().sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const newLeaveRequest = new MyLeaveRequest(req.body);
    const savedLeaveRequest = await newLeaveRequest.save();
    res.status(201).json(savedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLeaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    await leaveRequest.remove();
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const leaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason 
      },
      { new: true }
    );
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

