import Timesheet from '../models/Timesheet.js';
 
// // Check-in handler
// export const checkIn = async (req, res) => {
//     try {
//         const { employeeId } = req.body;
       
//         const existingActiveTimesheet = await Timesheet.findOne({
//             employeeId,
//             status: 'active'
//         });
 
//         if (existingActiveTimesheet) {
//             return res.status(400).json({ message: 'Already checked in' });
//         }
 
//         const timesheet = await Timesheet.create({
//             employeeId,
//             checkInTime: new Date()
//         });
 
//         res.status(201).json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// Check-in handler
export const checkIn = async (req, res) => {
    try {
        const { employeeId, employeeName } = req.body;
       
        const existingActiveTimesheet = await Timesheet.findOne({
            employeeId,
            status: 'active'
        });
 
        if (existingActiveTimesheet) {
            return res.status(400).json({ message: 'Already checked in' });
        }
 
        const timesheet = await Timesheet.create({
            employeeId,
            employeeName,
            checkInTime: new Date()
        });
 
        res.status(201).json(timesheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // Check-out handler
// export const checkOut = async (req, res) => {
//     try {
//         const { employeeId, duration } = req.body;
       
//         const timesheet = await Timesheet.findOne({
//             employeeId,
//             status: 'active'
//         });
 
//         if (!timesheet) {
//             return res.status(400).json({ message: 'No active check-in found' });
//         }
 
//         timesheet.checkOutTime = new Date();
//         timesheet.duration = duration;
//         timesheet.status = 'completed';
//         await timesheet.save();
 
//         res.json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
export const checkOut = async (req, res) => {
    try {
        const { employeeId, duration } = req.body;
        
        const timesheet = await Timesheet.findOne({
            employeeId,
            status: 'active'
        });

        if (!timesheet) {
            return res.status(400).json({ message: 'No active check-in found' });
        }

        const checkOutTime = new Date();
        timesheet.checkOutTime = checkOutTime;
        
        // Calculate duration in seconds if not provided
        if (!duration) {
            const checkInTime = new Date(timesheet.checkInTime);
            const durationInSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
            timesheet.duration = durationInSeconds;
        } else {
            timesheet.duration = duration;
        }
        
        timesheet.status = 'completed';
        await timesheet.save();

        res.json(timesheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get today's timesheet
export const getTodayTimesheet = async (req, res) => {
    try {
        const { employeeId } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
 
        const timesheet = await Timesheet.findOne({
            employeeId,
            checkInTime: { $gte: today }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Get weekly timesheets
export const getWeeklyTimesheets = async (req, res) => {
    try {
        const { employeeId } = req.query;
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
 
        const timesheets = await Timesheet.find({
            employeeId,
            checkInTime: { $gte: startOfWeek }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Get all timesheets
export const getAllTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find().sort({ checkInTime: -1 });
        res.json(timesheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Get timesheet by ID
export const getTimesheetById = async (req, res) => {
    try {
        const timesheet = await Timesheet.findById(req.params.id);
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        res.json(timesheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Update timesheet
export const updateTimesheet = async (req, res) => {
    try {
        const timesheet = await Timesheet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        res.json(timesheet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Delete timesheet
export const deleteTimesheet = async (req, res) => {
    try {
        const timesheet = await Timesheet.findByIdAndDelete(req.params.id);
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        res.json({ message: 'Timesheet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};