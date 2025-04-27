// import TimeOffRequest from '../models/TimeOffRequest.js';

// export const getAllRequests = async (req, res) => {
//     try {
//       const { searchTerm, status } = req.query;
//       const filter = {};
  
//       if (searchTerm) {
//         filter.$or = [
//           { name: { $regex: searchTerm, $options: 'i' } },
//           { empId: { $regex: searchTerm, $options: 'i' } }
//         ];
//       }
  
//       if (status && status !== 'all') {
//         filter.status = status.charAt(0).toUpperCase() + status.slice(1);
//       }
  
//       const requests = await TimeOffRequest.find(filter).sort({ createdAt: -1 });
//       res.status(200).json(requests);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  


// // export const createRequest = async (req, res) => {
// //     try {
// //       const requestData = {
// //         ...req.body,
// //         date: new Date(req.body.date),
// //         minHour: Number(req.body.minHour),
// //         atWork: Number(req.body.atWork),
// //         overtime: Number(req.body.overtime) || 0
// //       };
  
// //       const newRequest = new TimeOffRequest(requestData);
// //       const savedRequest = await newRequest.save();
// //       res.status(201).json(savedRequest);
// //     } catch (error) {
// //       res.status(400).json({ 
// //         message: error.message || 'Invalid request data',
// //         details: Object.values(error.errors || {}).map(err => err.message)
// //       });
// //     }
// //   };
  
// // Update the createRequest function to include userId
// export const createRequest = async (req, res) => {
//   try {
//     const requestData = {
//       ...req.body,
//       date: new Date(req.body.date),
//       minHour: Number(req.body.minHour),
//       atWork: Number(req.body.atWork),
//       overtime: Number(req.body.overtime) || 0
//     };

//     const newRequest = new TimeOffRequest(requestData);
//     const savedRequest = await newRequest.save();
//     res.status(201).json(savedRequest);
//   } catch (error) {
//     res.status(400).json({ 
//       message: error.message || 'Invalid request data',
//       details: Object.values(error.errors || {}).map(err => err.message)
//     });
//   }
// };

// // export const updateRequest = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updatedRequest = await TimeOffRequest.findByIdAndUpdate(
// //       id,
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
// //     if (!updatedRequest) {
// //       return res.status(404).json({ message: 'Request not found' });
// //     }
// //     res.status(200).json(updatedRequest);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // };

// // Update the updateRequest function to handle notifications
// export const updateRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, reviewedBy, reviewComment } = req.body;
    
//     const timeOffRequest = await TimeOffRequest.findById(id);
//     if (!timeOffRequest) {
//       return res.status(404).json({ message: 'Request not found' });
//     }
    
//     // Store the previous status to check if it changed
//     const previousStatus = timeOffRequest.status;
    
//     const updatedRequest = await TimeOffRequest.findByIdAndUpdate(
//       id,
//       { 
//         ...req.body,
//         // If status is being updated, add reviewer info and timestamp
//         ...(status && status !== previousStatus ? {
//           reviewedBy,
//           reviewedAt: new Date()
//         } : {})
//       },
//       { new: true, runValidators: true }
//     );
    
//     // If status changed to Approved or Rejected, we could trigger a notification here
//     // This would connect to your notification system
    
//     res.status(200).json(updatedRequest);
//   } catch (error) {
//     console.error('Error updating request:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedRequest = await TimeOffRequest.findByIdAndDelete(id);
//     if (!deletedRequest) {
//       return res.status(404).json({ message: 'Request not found' });
//     }
//     res.status(200).json({ message: 'Request deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getRequestById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const request = await TimeOffRequest.findById(id);
//     if (!request) {
//       return res.status(404).json({ message: 'Request not found' });
//     }
//     res.status(200).json(request);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getRequestsByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const requests = await TimeOffRequest.find({ userId }).sort({ createdAt: -1 });
//     res.status(200).json(requests);
//   } catch (error) {
//     console.error('Error fetching user requests:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

import TimeOffRequest from '../models/TimeOffRequest.js';

// Get all time off requests
export const getAllRequests = async (req, res) => {
  try {
    const { searchTerm, status } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { empId: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const requests = await TimeOffRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get time off requests by user ID
export const getRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { searchTerm, status } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Build filter object
    const filter = { userId };
    
    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { empId: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const requests = await TimeOffRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new time off request
export const createRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      date: new Date(req.body.date),
      minHour: Number(req.body.minHour),
      atWork: Number(req.body.atWork),
      overtime: Number(req.body.overtime) || 0
    };

    const newRequest = new TimeOffRequest(requestData);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ 
      message: error.message || 'Invalid request data',
      details: Object.values(error.errors || {}).map(err => err.message)
    });
  }
};

// Get a specific time off request by ID
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TimeOffRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: 'Time off request not found' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a time off request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, reviewComment } = req.body;
    
    const timeOffRequest = await TimeOffRequest.findById(id);
    if (!timeOffRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Store the previous status to check if it changed
    const previousStatus = timeOffRequest.status;
    
    const updatedRequest = await TimeOffRequest.findByIdAndUpdate(
      id,
      { 
        ...req.body,
        // If status is being updated, add reviewer info and timestamp
        ...(status && status !== previousStatus ? {
          reviewedBy,
          reviewedAt: new Date()
        } : {})
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a time off request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TimeOffRequest.findByIdAndDelete(id);
    
    if (!request) {
      return res.status(404).json({ message: 'Time off request not found' });
    }
    
    res.status(200).json({ message: 'Time off request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

