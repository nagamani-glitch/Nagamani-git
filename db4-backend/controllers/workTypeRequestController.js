import WorkTypeRequest from '../models/WorkTypeRequest.js';

export const getAllWorkTypeRequests = async (req, res) => {
  try {
    const workTypeRequests = await WorkTypeRequest.find().sort({ createdAt: -1 });
    res.status(200).json(workTypeRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching work type requests', error });
  }
};

export const createWorkTypeRequest = async (req, res) => {
  try {
    const newWorkTypeRequest = new WorkTypeRequest(req.body);
    const savedRequest = await newWorkTypeRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating work type request', error });
  }
};

export const updateWorkTypeRequest = async (req, res) => {
  try {
    const updatedRequest = await WorkTypeRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating work type request', error });
  }
};

export const deleteWorkTypeRequest = async (req, res) => {
  try {
    await WorkTypeRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Work type request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting work type request', error });
  }
};

export const approveWorkTypeRequest = async (req, res) => {
  try {
    const request = await WorkTypeRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error approving work type request', error });
  }
};

export const rejectWorkTypeRequest = async (req, res) => {
  try {
    const request = await WorkTypeRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting work type request', error });
  }
};
