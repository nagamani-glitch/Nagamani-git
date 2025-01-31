// import ShiftRequest from '../models/ShiftRequest.js';

// const getAllShiftRequests = async (req, res) => {
//   try {
//     const shiftRequests = await ShiftRequest.find();
//     res.status(200).json(shiftRequests);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching shift requests', error });
//   }
// };

// const createShiftRequest = async (req, res) => {
//   try {
//     const { employee, requestedShift, requestedDate, requestedTill, description, isPermanentRequest } = req.body;
    
//     const newShiftRequest = new ShiftRequest({
//       employee: {
//         name: employee,
//         code: `EMP${Math.floor(1000 + Math.random() * 9000)}` // Generate employee code
//       },
//       requestedShift,
//       requestedDate,
//       requestedTill,
//       description,
//       isPermanentRequest
//     });

//     const savedRequest = await newShiftRequest.save();
//     res.status(201).json(savedRequest);
//   } catch (error) {
//     console.error('Create error:', error);
//     res.status(500).json({ message: 'Error creating shift request', error: error.message });
//   }
// };


// const updateShiftRequest = async (req, res) => {
//   try {
//     const updatedRequest = await ShiftRequest.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedRequest);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating shift request', error });
//   }
// };

// const deleteShiftRequest = async (req, res) => {
//   try {
//     await ShiftRequest.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Shift request deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting shift request', error });
//   }
// };

// const approveShiftRequest = async (req, res) => {
//   try {
//     const request = await ShiftRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Approved' },
//       { new: true }
//     );
//     res.status(200).json(request);
//   } catch (error) {
//     res.status(500).json({ message: 'Error approving shift request', error });
//   }
// };

// const rejectShiftRequest = async (req, res) => {
//   try {
//     const request = await ShiftRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Rejected' },
//       { new: true }
//     );
//     res.status(200).json(request);
//   } catch (error) {
//     res.status(500).json({ message: 'Error rejecting shift request', error });
//   }
// };

// export {
//   getAllShiftRequests,
//   createShiftRequest,
//   updateShiftRequest,
//   deleteShiftRequest,
//   approveShiftRequest,
//   rejectShiftRequest,
// };
import ShiftRequest from '../models/ShiftRequest.js';

const getAllShiftRequests = async (req, res) => {
  try {
    const shiftRequests = await ShiftRequest.find().sort('-createdAt');
    res.status(200).json(shiftRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift requests', error });
  }
};

const createShiftRequest = async (req, res) => {
  try {
    const newShiftRequest = new ShiftRequest({
      employee: {
        name: req.body.employee,
        code: `EMP${Math.floor(1000 + Math.random() * 9000)}`
      },
      requestedShift: req.body.requestedShift,
      currentShift: 'Regular Shift',
      requestedDate: req.body.requestedDate,
      requestedTill: req.body.requestedTill,
      description: req.body.description,
      isPermanentRequest: req.body.isPermanentRequest
    });
    const savedRequest = await newShiftRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shift request', error: error.message });
  }
};

const updateShiftRequest = async (req, res) => {
  try {
    const updatedRequest = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      {
        'employee.name': req.body.employee,
        requestedShift: req.body.requestedShift,
        requestedDate: req.body.requestedDate,
        requestedTill: req.body.requestedTill,
        description: req.body.description,
        isPermanentRequest: req.body.isPermanentRequest
      },
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift request', error });
  }
};

const deleteShiftRequest = async (req, res) => {
  try {
    await ShiftRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shift request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift request', error });
  }
};

const approveShiftRequest = async (req, res) => {
  try {
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error approving shift request', error });
  }
};

const rejectShiftRequest = async (req, res) => {
  try {
    const request = await ShiftRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting shift request', error });
  }
};

export {
  getAllShiftRequests,
  createShiftRequest,
  updateShiftRequest,
  deleteShiftRequest,
  approveShiftRequest,
  rejectShiftRequest
};
