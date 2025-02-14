import ShiftRequest from '../models/ShiftRequest.js';

export const getAllShiftRequests = async (req, res) => {
  try {
    const { isAllocated } = req.query;
    const shifts = await ShiftRequest.find({ 
      isAllocated: isAllocated === 'true' 
    }).sort('-createdAt');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShiftRequest = async (req, res) => {
  try {
    const newShiftRequest = new ShiftRequest({
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
