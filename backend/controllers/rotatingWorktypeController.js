import RotatingWorktype from '../models/RotatingWorktype.js';

export const getAllWorktypes = async (req, res) => {
  try {
    const { isAllocated } = req.query;
    const worktypes = await RotatingWorktype.find({ 
      isAllocated: isAllocated === 'true' 
    }).sort('-createdAt');
    res.status(200).json(worktypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorktype = async (req, res) => {
  try {
    const newWorktype = new RotatingWorktype(req.body);
    const savedWorktype = await newWorktype.save();
    res.status(201).json(savedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWorktype = async (req, res) => {
  try {
    const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedWorktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWorktype = async (req, res) => {
  try {
    await RotatingWorktype.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Worktype request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const approveWorktype = async (req, res) => {
  try {
    const worktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(worktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectWorktype = async (req, res) => {
  try {
    const worktype = await RotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(worktype);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkApprove = async (req, res) => {
  try {
    const { ids } = req.body;
    await RotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { status: 'Approved' }
    );
    res.status(200).json({ message: 'Worktypes approved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkReject = async (req, res) => {
  try {
    const { ids } = req.body;
    await RotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { status: 'Rejected' }
    );
    res.status(200).json({ message: 'Worktypes rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
