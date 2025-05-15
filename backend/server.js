// import express from "express"
// import dotenv from 'dotenv';
// import cors from 'cors';
// import fs from 'fs';
// import path from 'path';

// //import connectDB from './config/db.js';
// import { connectMainDB } from './config/db.js';
// import employeesRouter from './routes/employeesRouter.js'
// import authRouter from './routes/authRouter.js'
// import profileRouter from './routes/profileRouter.js'
// // import contractRouter from './routes/contractRouter.js'
// import applicantProfileRoutes from './routes/applicantProfileRoutes.js'
// import candidateRoutes from './routes/candidateRoutes.js'
// import employeeRoutes from './routes/employeeRoutes.js'
// import interviewRoutes from './routes/interviewRoutes.js'

// import skillZoneRoutes from './routes/skillZoneRoutes.js'
// import surveyRoutes from './routes/surveyRoutes.js'
// // import assetRoutes from './routes/assets.js';
// import assetDashboardRoutes from './routes/assetDashboardRoutes.js';
// import assetBatchRoutes from './routes/assetBatchRoutes.js';
// // import assetHistoryRoutes from './routes/assetHistory.js';
// import assetRoutes from './routes/assetHistory.js';
// import faqCategoryRoutes from './routes/faqCategoryRoutes.js';
// import faqRoutes from './routes/faqRoutes.js';
// import companyHolidaysRoute from './routes/companyHolidays.js';
// import restrictLeaveRoutes from './routes/restrictLeaveRoutes.js';
// import holidayRoutes from './routes/holidays.js';
// import shiftRequestRoutes from './routes/shiftRequestRoutes.js';
// import workTypeRequestRoutes from './routes/workTypeRequestRoutes.js';
// import onboardingRoutes from './routes/onboardingRoutes.js';
// import hiredEmployeeRoutes from './routes/hiredEmployeeRoutes.js';
// import timesheetRoutes from './routes/timesheetRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';

// import companyRoutes from './routes/companyRoutes.js';
// import roleRoutes from './routes/roleRoutes.js';
// import { authenticate, companyFilter } from './middleware/companyAuth.js';
// //import authTestRoutes from './routes/authTestRoutes.js';

// import { fileURLToPath } from 'url';
// import { dirname} from "path";

// import { Server } from 'socket.io';
// import http from 'http';

// // // Sangeeta 
// import objectiveRoutes from './routes/objectiveRoutes.js';
// import offboardingRoutes from './routes/offboardingRoutes.js';
// import resignationRoutes from './routes/resignationRoutes.js';
// import Feedback from './routes/feedbackRoutes.js';
// import payrollContractRoutes from './routes/payrollContractRoutes.js';
// import payrollRoutes from './routes/PayrollRoutes.js';

// // Harish
// import attendanceRoutes from './routes/attendanceRoutes.js';
// import documentRoutes from './routes/documentRoutes.js';
// import policyRoutes from './routes/policyRoutes.js';
// import organizationRoutes from './routes/organizationRoutes.js';
// import disciplinaryActionRoutes from './routes/disciplinaryActions.js'; 
// import timeOffRequestRoutes from './routes/timeOffRequests.js'; 
// import rotatingShiftRoutes from './routes/rotatingShiftRoutes.js';
// import rotatingWorktypeRoutes from './routes/rotatingWorktypeRoutes.js';
// import myLeaveRequestRoutes from './routes/myLeaveRequestRoutes.js';
// import leaveRequestRoutes from './routes/leaveRequestRoutes.js';
// // import documentRoute from './routes/documentRoutes-1.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config()

// // Connect to the main database with error handling
// try {
//   await connectMainDB();
//   console.log('Main database connection established');
// } catch (error) {
//   console.error('Failed to connect to the main database:', error.message);
//   // Continue running the server even if initial connection fails
//   // The connection will be retried when needed
// }

// //connectDB()
// // Connect to the main database
// connectMainDB()
// const app = express()

// // Add a graceful shutdown handler
// process.on('SIGINT', async () => {
//   console.log('Shutting down gracefully...');
//   const { closeAllConnections } = await import('./config/db.js');
//   await closeAllConnections();
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('Shutting down gracefully...');
//   const { closeAllConnections } = await import('./config/db.js');
//   await closeAllConnections();
//   process.exit(0);
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Set up Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   // Handle user joining a room
//   socket.on('join', ({ userId }) => {
//     if (userId) {
//       socket.join(userId);
//       console.log(`User ${userId} joined their room`);
//     }
//   });
  
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// // console.log('Notification routes registered');

// // Middleware to parse JSON request bodies
// app.use(cors({
//     origin: "http://localhost:3000", // Allow your frontend
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
//     credentials: true, // Include credentials like cookies
//     allowedHeaders: [
//         'Content-Type', 
//         'Authorization', 
//         'Access-Control-Allow-Methods', 
//         'Access-Control-Allow-Origin'
//     ] // Include all necessary headers
// }));

// // Handle preflight requests for all routes
// app.options('*', cors()); 

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error' });
// });

// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// // IMPORTANT: Do NOT apply authentication middleware globally here
// // Instead, apply it within each route file for protected routes only

// // Public routes - no authentication required
// app.use("/api/auth", authRouter);
// app.use("/api/companies", companyRoutes); // Company routes handle their own authentication

// // Protected routes - these routes should handle their own authentication
// app.use("/api/employees", employeesRouter);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/api/profiles", profileRouter);
// // app.use("/api/contracts", contractRouter);
// app.use(candidateRoutes);
// app.use(surveyRoutes);
// app.use('/api/applicantProfiles', applicantProfileRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use(skillZoneRoutes);
// app.use('/api/employees',employeeRoutes);
// app.use('/api/onboarding', onboardingRoutes);
// // app.use('/api/assets', assetRoutes);
// app.use('/api/dashboard', assetDashboardRoutes);
// app.use('/api/asset-batches', assetBatchRoutes);
// // app.use('/api/assethistory', assetHistoryRoutes);
// app.use('/api/assets', assetRoutes);
// app.use('/api/holidays', holidayRoutes);
// app.use('/api/companyHolidays', companyHolidaysRoute);
// app.use('/api/restrictLeaves', restrictLeaveRoutes);
// app.use('/api/faqs', faqRoutes);
// app.use('/api/faqCategories', faqCategoryRoutes);
// app.use('/api/hired-employees', hiredEmployeeRoutes);
// app.use('/api/shift-request', shiftRequestRoutes);
// app.use('/api/work-type-requests', workTypeRequestRoutes);
// app.use('/api/timesheet', timesheetRoutes);
// app.use('/api/notifications', notificationRoutes);

// // Sangeeta integration
// app.use('/api/payroll-contracts', payrollContractRoutes);
// app.use('/api/objectives', objectiveRoutes);
// app.use('/api/feedback', Feedback);
// app.use('/api/offboarding', offboardingRoutes);
// app.use('/api/resignations', resignationRoutes);
// app.use('/api/payroll', payrollRoutes);

// // Harish
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api', documentRoutes);
// app.use('/api', policyRoutes);
// app.use('/api', organizationRoutes);
// app.use('/api/disciplinary-actions', disciplinaryActionRoutes);
// app.use('/api/time-off-requests', timeOffRequestRoutes);
// app.use('/api/rotating-shift', rotatingShiftRoutes);
// app.use('/api/rotating-worktype', rotatingWorktypeRoutes);
// app.use('/api/leave-requests', myLeaveRequestRoutes);
// app.use('/api/leave-requests', leaveRequestRoutes);
// // app.use('/api/documents', documentRoute);

// // After creating the io instance
// app.set('io', io);

// app.use('/api/roles', roleRoutes);
// // app.use('/api/test', authTestRoutes);

// const PORT = process.env.PORT || 5002;

// server.listen(PORT, console.log(`✨ Server running on port ${PORT}`.yellow.bold));


import express from "express"
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

//import connectDB from './config/db.js';
import { connectMainDB } from './config/db.js';
import employeesRouter from './routes/employeesRouter.js'
import authRouter from './routes/authRouter.js'
import profileRouter from './routes/profileRouter.js'
// import contractRouter from './routes/contractRouter.js'
import applicantProfileRoutes from './routes/applicantProfileRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'

import skillZoneRoutes from './routes/skillZoneRoutes.js'
import surveyRoutes from './routes/surveyRoutes.js'
// import assetRoutes from './routes/assets.js';
import assetDashboardRoutes from './routes/assetDashboardRoutes.js';
import assetBatchRoutes from './routes/assetBatchRoutes.js';
// import assetHistoryRoutes from './routes/assetHistory.js';
import assetRoutes from './routes/assetHistory.js';
import faqCategoryRoutes from './routes/faqCategoryRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import companyHolidaysRoute from './routes/companyHolidays.js';
import restrictLeaveRoutes from './routes/restrictLeaveRoutes.js';
import holidayRoutes from './routes/holidays.js';
import shiftRequestRoutes from './routes/shiftRequestRoutes.js';
import workTypeRequestRoutes from './routes/workTypeRequestRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import hiredEmployeeRoutes from './routes/hiredEmployeeRoutes.js';
import timesheetRoutes from './routes/timesheetRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import companyRoutes from './routes/companyRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import { authenticate, companyFilter } from './middleware/companyAuth.js';
//import authTestRoutes from './routes/authTestRoutes.js';

import { fileURLToPath } from 'url';
import { dirname} from "path";

import { Server } from 'socket.io';
import http from 'http';

// // Sangeeta 
import objectiveRoutes from './routes/objectiveRoutes.js';
import offboardingRoutes from './routes/offboardingRoutes.js';
import resignationRoutes from './routes/resignationRoutes.js';
import Feedback from './routes/feedbackRoutes.js';
import payrollContractRoutes from './routes/payrollContractRoutes.js';
import payrollRoutes from './routes/PayrollRoutes.js';

// Harish
import attendanceRoutes from './routes/attendanceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import disciplinaryActionRoutes from './routes/disciplinaryActions.js'; 
import timeOffRequestRoutes from './routes/timeOffRequests.js'; 
import rotatingShiftRoutes from './routes/rotatingShiftRoutes.js';
import rotatingWorktypeRoutes from './routes/rotatingWorktypeRoutes.js';
import myLeaveRequestRoutes from './routes/myLeaveRequestRoutes.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';
// import documentRoute from './routes/documentRoutes-1.js';

import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to the main database with error handling and retry
(async function setupDatabase() {
  try {
    console.log('Initializing database connection...');
    await connectMainDB();
    console.log('Main database connection established successfully');
  } catch (error) {
    console.error('Failed to connect to the main database:', error.message);
    console.log('Server will continue to run and retry connections as needed');
    // The server will continue running and connections will be retried when needed
  }
})();

const app = express();

// Add a graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  const { closeAllConnections } = await import('./config/db.js');
  await closeAllConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  const { closeAllConnections } = await import('./config/db.js');
  await closeAllConnections();
  process.exit(0);
});

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle user joining a room
  socket.on('join', ({ userId }) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// console.log('Notification routes registered');

// Middleware to parse JSON request bodies
app.use(cors({
    origin: "http://localhost:3000", // Allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Include credentials like cookies
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Access-Control-Allow-Methods', 
        'Access-Control-Allow-Origin',
        'X-Company-Code' 
    ] // Include all necessary headers
}));

// Handle preflight requests for all routes
app.options('*', cors()); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// IMPORTANT: Do NOT apply authentication middleware globally here
// Instead, apply it within each route file for protected routes only

// Public routes - no authentication required
app.use("/api/auth", authRouter);
app.use("/api/companies", companyRoutes); // Company routes handle their own authentication

// Protected routes - these routes should handle their own authentication
app.use("/api/employees", employeesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/profiles", profileRouter);
// app.use("/api/contracts", contractRouter);
app.use(candidateRoutes);
app.use(surveyRoutes);
app.use('/api/applicantProfiles', applicantProfileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use(skillZoneRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api/onboarding', onboardingRoutes);
// app.use('/api/assets', assetRoutes);
app.use('/api/dashboard', assetDashboardRoutes);
app.use('/api/asset-batches', assetBatchRoutes);
// app.use('/api/assethistory', assetHistoryRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/companyHolidays', companyHolidaysRoute);
app.use('/api/restrictLeaves', restrictLeaveRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/faqCategories', faqCategoryRoutes);
app.use('/api/hired-employees', hiredEmployeeRoutes);
app.use('/api/shift-request', shiftRequestRoutes);
app.use('/api/work-type-requests', workTypeRequestRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/api/notifications', notificationRoutes);

// Sangeeta integration
app.use('/api/payroll-contracts', payrollContractRoutes);
app.use('/api/objectives', objectiveRoutes);
app.use('/api/feedback', Feedback);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/resignations', resignationRoutes);
app.use('/api/payroll', payrollRoutes);

// Harish
app.use('/api/attendance', attendanceRoutes);
app.use('/api', documentRoutes);
app.use('/api', policyRoutes);
app.use('/api', organizationRoutes);
app.use('/api/disciplinary-actions', disciplinaryActionRoutes);
app.use('/api/time-off-requests', timeOffRequestRoutes);
app.use('/api/rotating-shift', rotatingShiftRoutes);
app.use('/api/rotating-worktype', rotatingWorktypeRoutes);
app.use('/api/leave-requests', myLeaveRequestRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
// app.use('/api/documents', documentRoute);

app.use('/api/users', userRoutes);

// After creating the io instance
app.set('io', io);

app.use('/api/roles', roleRoutes);
// app.use('/api/test', authTestRoutes);

const PORT = process.env.PORT || 5002;

server.listen(PORT, console.log(`✨ Server running on port ${PORT}`.yellow.bold));
