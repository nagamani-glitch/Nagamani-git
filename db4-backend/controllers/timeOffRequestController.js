import TimeOffRequest from '../models/TimeOffRequest.js';

// export const getAllRequests = async (req, res) => {
//   try {
//     const { searchTerm, status } = req.query;
//     const filter = {};

//     if (searchTerm) {
//       filter.$or = [
//         { name: { $regex: searchTerm, $options: 'i' } },
//         { empId: { $regex: searchTerm, $options: 'i' } }
//       ];
//     }

//     if (status && status !== 'all') {
//       filter.status = status;
//     }

//     const requests = await TimeOffRequest.find(filter)
//       .sort({ createdAt: -1 });
//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getAllRequests = async (req, res) => {
    try {
      const { searchTerm, status } = req.query;
      const filter = {};
  
      if (searchTerm) {
        filter.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { empId: { $regex: searchTerm, $options: 'i' } }
        ];
      }
  
      if (status && status !== 'all') {
        filter.status = status.charAt(0).toUpperCase() + status.slice(1);
      }
  
      const requests = await TimeOffRequest.find(filter).sort({ createdAt: -1 });
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// export const createRequest = async (req, res) => {
//   try {
//     const newRequest = new TimeOffRequest(req.body);
//     const savedRequest = await newRequest.save();
//     res.status(201).json(savedRequest);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

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
  
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await TimeOffRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await TimeOffRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TimeOffRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
