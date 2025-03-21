import express from 'express';
import {
    checkIn,
    checkOut,
    getTodayTimesheet,
    getWeeklyTimesheets,
    getAllTimesheets,
    getTimesheetById,
    updateTimesheet,
    deleteTimesheet
} from '../controllers/timesheetController.js';
 
const router = express.Router();
 
// Basic timesheet operations
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayTimesheet);
router.get('/weekly', getWeeklyTimesheets);
 
// Additional CRUD operations
router.get('/', getAllTimesheets);
router.get('/:id', getTimesheetById);
router.put('/:id', updateTimesheet);
router.delete('/:id', deleteTimesheet);
 
export default router;