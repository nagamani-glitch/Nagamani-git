// import express from 'express';
// import {
//   getAllRequests,
//   createRequest,
//   updateRequest,
//   deleteRequest,
//   getRequestById
// } from '../controllers/timeOffRequestController.js';

// const router = express.Router();

// router.get('/', getAllRequests);
// router.post('/', createRequest);
// router.get('/:id', getRequestById);
// router.put('/:id', updateRequest);
// router.delete('/:id', deleteRequest);

// export default router;

// import express from 'express';
// import {
//   getAllRequests,
//   createRequest,
//   updateRequest,
//   deleteRequest,
//   getRequestById,
//   getRequestsByUserId
// } from '../controllers/timeOffRequestController.js';

// const router = express.Router();

// // Get all time off requests
// router.get('/', getAllRequests);

// // Create a new time off request
// router.post('/', createRequest);

// // Get a specific time off request by ID
// router.get('/:id', getRequestById);

// // Update a time off request
// router.put('/:id', updateRequest);

// // Delete a time off request
// router.delete('/:id', deleteRequest);

// // Get time off requests by user ID
// router.get('/by-user/:userId', getRequestsByUserId);

// export default router;


import express from 'express';
import {
  getAllRequests,
  getRequestsByUserId,
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestStats
} from '../controllers/timeOffRequestController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/', getAllRequests);
router.get('/stats', getRequestStats);
router.get('/user/:userId', getRequestsByUserId);
router.get('/:id', getRequestById);
router.post('/', createRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
