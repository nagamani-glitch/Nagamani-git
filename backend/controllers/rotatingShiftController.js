import RotatingShift from '../models/RotatingShift.js';

// export const getAllShifts = async (req, res) => {
//   try {
//     const shifts = await RotatingShift.find();
//     res.status(200).json(shifts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createShift = async (req, res) => {
//   try {
//     const newShift = new RotatingShift(req.body);
//     const savedShift = await newShift.save();
//     res.status(201).json(savedShift);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
export const getAllShifts = async (req, res) => {
    try {
      const { isAllocated } = req.query;
      const shifts = await RotatingShift.find({ isAllocated: isAllocated === 'true' });
      res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const createShift = async (req, res) => {
    try {
      const newShift = new RotatingShift({
        ...req.body,
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
    await RotatingShift.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const approveShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectShift = async (req, res) => {
  try {
    const shift = await RotatingShift.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkApprove = async (req, res) => {
  try {
    const { ids } = req.body;
    await RotatingShift.updateMany(
      { _id: { $in: ids } },
      { status: 'Approved' }
    );
    res.status(200).json({ message: 'Shifts approved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkReject = async (req, res) => {
  try {
    const { ids } = req.body;
    await RotatingShift.updateMany(
      { _id: { $in: ids } },
      { status: 'Rejected' }
    );
    res.status(200).json({ message: 'Shifts rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
