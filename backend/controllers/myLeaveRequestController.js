// import MyLeaveRequest from '../models/MyLeaveRequest.js';

// export const getAllLeaveRequests = async (req, res) => {
//   try {
//     const leaveRequests = await MyLeaveRequest.find().sort({ createdAt: -1 });
//     res.status(200).json(leaveRequests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createLeaveRequest = async (req, res) => {
//   try {
//     const newLeaveRequest = new MyLeaveRequest(req.body);
//     const savedLeaveRequest = await newLeaveRequest.save();
//     res.status(201).json(savedLeaveRequest);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateLeaveRequest = async (req, res) => {
//   try {
//     const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedLeaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
//     res.status(200).json(updatedLeaveRequest);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteLeaveRequest = async (req, res) => {
//   try {
//     const leaveRequest = await MyLeaveRequest.findByIdAndDelete(req.params.id);
//     if (!leaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
//     res.status(200).json({ message: 'Leave request deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const approveLeaveRequest = async (req, res) => {
//   try {
//     const leaveRequest = await MyLeaveRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'approved' },
//       { new: true }
//     );
//     if (!leaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
//     res.status(200).json(leaveRequest);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const rejectLeaveRequest = async (req, res) => {
//   try {
//     const { rejectionReason } = req.body;
//     const leaveRequest = await MyLeaveRequest.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'rejected',
//         rejectionReason 
//       },
//       { new: true }
//     );
//     if (!leaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
//     res.status(200).json(leaveRequest);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


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
    // Ensure new requests are always created with pending status
    const leaveData = {
      ...req.body,
      status: 'pending'
    };
    
    const newLeaveRequest = new MyLeaveRequest(leaveData);
    const savedLeaveRequest = await newLeaveRequest.save();
    res.status(201).json(savedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    // Find the leave request first
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only allow updates if the request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot update a leave request that has already been processed' 
      });
    }
    
    // Ensure status remains pending during employee updates
    const updatedData = {
      ...req.body,
      status: 'pending'
    };
    
    const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    // Find the leave request first
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only allow deletion if the request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete a leave request that has already been processed' 
      });
    }
    
    await MyLeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// These functions will be used by the admin/HR in the LeaveRequests component
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

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const leaveRequests = await MyLeaveRequest.find({ employeeCode }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
