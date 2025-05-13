// import Timesheet from '../models/Timesheet.js';
 
 
// // Check-in handler
// export const checkIn = async (req, res) => {
//     try {
//         const { employeeId, employeeName } = req.body;
       
//         const existingActiveTimesheet = await Timesheet.findOne({
//             employeeId,
//             status: 'active'
//         });
 
//         if (existingActiveTimesheet) {
//             return res.status(400).json({ message: 'Already checked in' });
//         }
 
//         const timesheet = await Timesheet.create({
//             employeeId,
//             employeeName,
//             checkInTime: new Date()
//         });
 
//         res.status(201).json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


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

//         const checkOutTime = new Date();
//         timesheet.checkOutTime = checkOutTime;
        
//         // Calculate duration in seconds if not provided
//         if (!duration) {
//             const checkInTime = new Date(timesheet.checkInTime);
//             const durationInSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
//             timesheet.duration = durationInSeconds;
//         } else {
//             timesheet.duration = duration;
//         }
        
//         timesheet.status = 'completed';
//         await timesheet.save();

//         res.json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Get today's timesheet
// export const getTodayTimesheet = async (req, res) => {
//     try {
//         const { employeeId } = req.query;
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
 
//         const timesheet = await Timesheet.findOne({
//             employeeId,
//             checkInTime: { $gte: today }
//         }).sort({ checkInTime: -1 });
 
//         res.json({ timesheet });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// // Get weekly timesheets
// export const getWeeklyTimesheets = async (req, res) => {
//     try {
//         const { employeeId } = req.query;
//         const startOfWeek = new Date();
//         startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
//         startOfWeek.setHours(0, 0, 0, 0);
 
//         const timesheets = await Timesheet.find({
//             employeeId,
//             checkInTime: { $gte: startOfWeek }
//         }).sort({ checkInTime: -1 });
 
//         res.json({ timesheets });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// // Get all timesheets
// export const getAllTimesheets = async (req, res) => {
//     try {
//         const timesheets = await Timesheet.find().sort({ checkInTime: -1 });
//         res.json(timesheets);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// // Get timesheet by ID
// export const getTimesheetById = async (req, res) => {
//     try {
//         const timesheet = await Timesheet.findById(req.params.id);
//         if (!timesheet) {
//             return res.status(404).json({ message: 'Timesheet not found' });
//         }
//         res.json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// // Update timesheet
// export const updateTimesheet = async (req, res) => {
//     try {
//         const timesheet = await Timesheet.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         if (!timesheet) {
//             return res.status(404).json({ message: 'Timesheet not found' });
//         }
//         res.json(timesheet);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
// // Delete timesheet
// export const deleteTimesheet = async (req, res) => {
//     try {
//         const timesheet = await Timesheet.findByIdAndDelete(req.params.id);
//         if (!timesheet) {
//             return res.status(404).json({ message: 'Timesheet not found' });
//         }
//         res.json({ message: 'Timesheet deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

import Timesheet, { timesheetSchema } from '../models/Timesheet.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Check-in handler
export const checkIn = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Processing check-in for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId, employeeName } = req.body;
        
        if (!employeeId || !employeeName) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID and name are required'
            });
        }
       
        const existingActiveTimesheet = await CompanyTimesheet.findOne({
            employeeId,
            status: 'active'
        });
 
        if (existingActiveTimesheet) {
            return res.status(400).json({ message: 'Already checked in' });
        }
 
        const timesheet = await CompanyTimesheet.create({
            employeeId,
            employeeName,
            checkInTime: new Date()
        });
 
        res.status(201).json(timesheet);
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ 
            error: 'Error during check-in', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const checkOut = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Processing check-out for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId, duration } = req.body;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const timesheet = await CompanyTimesheet.findOne({
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
        console.error('Error during check-out:', error);
        res.status(500).json({ 
            error: 'Error during check-out', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get today's timesheet
export const getTodayTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching today's timesheet for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId } = req.query;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
 
        const timesheet = await CompanyTimesheet.findOne({
            employeeId,
            checkInTime: { $gte: today }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheet });
    } catch (error) {
        console.error('Error fetching today\'s timesheet:', error);
        res.status(500).json({ 
            error: 'Error fetching today\'s timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get weekly timesheets
export const getWeeklyTimesheets = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching weekly timesheets for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId } = req.query;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
 
        const timesheets = await CompanyTimesheet.find({
            employeeId,
            checkInTime: { $gte: startOfWeek }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheets });
    } catch (error) {
        console.error('Error fetching weekly timesheets:', error);
        res.status(500).json({ 
            error: 'Error fetching weekly timesheets', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get all timesheets
export const getAllTimesheets = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching all timesheets for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        // Support filtering by employee ID if provided
        const { employeeId } = req.query;
        const filter = employeeId ? { employeeId } : {};
        
        const timesheets = await CompanyTimesheet.find(filter).sort({ checkInTime: -1 });
        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching all timesheets:', error);
        res.status(500).json({ 
            error: 'Error fetching all timesheets', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get timesheet by ID
export const getTimesheetById = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Fetching timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findById(id);
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
        res.json(timesheet);
    } catch (error) {
        console.error(`Error fetching timesheet ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error fetching timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Update timesheet
export const updateTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Updating timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findByIdAndUpdate(
            id,
            req.body,
            { 
                new: true,
                runValidators: true // This ensures validation runs on update
            }
        );
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
        res.json(timesheet);
    } catch (error) {
        console.error(`Error updating timesheet ${req.params.id}:`, error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                message: error.message,
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error updating timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Delete timesheet
export const deleteTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Deleting timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findByIdAndDelete(id);
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
                res.json({ 
            message: 'Timesheet deleted successfully',
            deletedTimesheet: {
                id: timesheet._id,
                employeeId: timesheet.employeeId,
                employeeName: timesheet.employeeName
            }
        });
    } catch (error) {
        console.error(`Error deleting timesheet ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error deleting timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get employee timesheets by date range
export const getTimesheetsByDateRange = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching timesheets by date range for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId, startDate, endDate } = req.query;
        
        if (!employeeId || !startDate || !endDate) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID, start date, and end date are required'
            });
        }
        
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        const timesheets = await CompanyTimesheet.find({
            employeeId,
            checkInTime: { $gte: start, $lte: end }
        }).sort({ checkInTime: -1 });
        
        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching timesheets by date range:', error);
        res.status(500).json({ 
            error: 'Error fetching timesheets by date range', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
