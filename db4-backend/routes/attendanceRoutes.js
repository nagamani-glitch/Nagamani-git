import express from 'express';
import { AttendanceController } from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', AttendanceController.getAllAttendance);
router.post('/', AttendanceController.createAttendance);
router.get('/search', AttendanceController.searchAttendance);
router.put('/bulk-select', AttendanceController.bulkUpdateSelection);
router.delete('/:id', AttendanceController.deleteAttendance);

export default router;
