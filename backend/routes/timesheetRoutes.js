// import express from 'express';
// import {
//     checkIn,
//     checkOut,
//     getTodayTimesheet,
//     getWeeklyTimesheets,
//     getAllTimesheets,
//     getTimesheetById,
//     updateTimesheet,
//     deleteTimesheet
// } from '../controllers/timesheetController.js';
 
// const router = express.Router();
 
// // Basic timesheet operations
// router.post('/check-in', checkIn);
// router.post('/check-out', checkOut);
// router.get('/today', getTodayTimesheet);
// router.get('/weekly', getWeeklyTimesheets);
 
// // Additional CRUD operations
// router.get('/', getAllTimesheets);
// router.get('/:id', getTimesheetById);
// router.put('/:id', updateTimesheet);
// router.delete('/:id', deleteTimesheet);
 
// export default router;

import express from 'express';
import {
    checkIn,
    checkOut,
    getTodayTimesheet,
    getWeeklyTimesheets,
    getAllTimesheets,
    getTimesheetById,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetsByDateRange
} from '../controllers/timesheetController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Check-in and check-out routes
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

// Get timesheets
router.get('/today', getTodayTimesheet);
router.get('/weekly', getWeeklyTimesheets);
router.get('/date-range', getTimesheetsByDateRange);
router.get('/', getAllTimesheets);
router.get('/:id', getTimesheetById);

// Update and delete timesheets
router.put('/:id', updateTimesheet);
router.delete('/:id', deleteTimesheet);

export default router;
