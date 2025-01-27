import express from "express"
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import employeesRouter from './routes/employeesRouter.js'
import authRouter from './routes/authRouter.js'
import profileRouter from './routes/profileRouter.js'
import contractRouter from './routes/contractRouter.js'
import applicantProfileRoutes from './routes/applicantProfileRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import skillZoneRoutes from './routes/skillZoneRoutes.js'
import surveyRoutes from './routes/surveyRoutes.js'
import assetRoutes from './routes/assets.js';
import assetDashboardRoutes from './routes/assetDashboardRoutes.js';
import assetBatchRoutes from './routes/assetBatchRoutes.js';
import assetHistoryRoutes from './routes/assetHistory.js';
import faqCategoryRoutes from './routes/faqCategoryRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import companyHolidaysRoute from './routes/companyHolidays.js';
import restrictLeaveRoutes from './routes/restrictLeaveRoutes.js';
import holidayRoutes from './routes/holidays.js';
import shiftRequestRoutes from './routes/shiftRequestRoutes.js';
import workTypeRequestRoutes from './routes/workTypeRequestRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import hiredEmployeeRoutes from './routes/hiredEmployeeRoutes.js';





// Sangeeta 
import allowanceRoutes from './routes/allowanceRoutes.js';
import deductionRoutes from './routes/deductionRoutes.js';
import payslipRoutes from './routes/payslipRoutes.js';
import federalTaxRoutes from './routes/federalTaxRoutes.js';
import objectiveRoutes from './routes/objectiveRoutes.js';
import offboardingRoutes from './routes/offboardingRoutes.js';
import resignationRoutes from './routes/resignationRoutes.js';
import Feedback from './routes/feedbackRoutes.js';
import payrollContractRoutes from './routes/payrollContractRoutes.js';

// Harish
import attendanceRoutes from './routes/attendanceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import disciplinaryActionRoutes from './routes/disciplinaryActions.js'; 
 
dotenv.config()
connectDB()
const app = express()

// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//     allowedHeaders: [
//         'Content-Type', 
//         'Authorization',
//         'Access-Control-Allow-Methods'
//     ]
// }));


// Middleware to parse JSON request bodies

app.use(cors({
    origin: "http://localhost:3000", // Allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Include credentials like cookies
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Access-Control-Allow-Methods', 
        'Access-Control-Allow-Origin'
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

app.use("/api/employees", employeesRouter);
app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/contracts", contractRouter);
app.use(candidateRoutes);
app.use(surveyRoutes);
app.use('/api/applicantProfiles', applicantProfileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/skill-zone', skillZoneRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/dashboard', assetDashboardRoutes);
app.use('/api/asset-batches', assetBatchRoutes);
app.use('/api/assethistory', assetHistoryRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/companyHolidays', companyHolidaysRoute);
app.use('/api/restrictLeaves', restrictLeaveRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/faqCategories', faqCategoryRoutes);
app.use('/api/hired-employees', hiredEmployeeRoutes);
app.use('/api/shift-requests', shiftRequestRoutes);
app.use('/api/work-type-requests', workTypeRequestRoutes);



 

// Sangeeta integration

app.use('/api/deductions', deductionRoutes);
app.use('/api/allowances', allowanceRoutes);
app.use('/api/payroll-contracts', payrollContractRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/federal-tax', federalTaxRoutes);
app.use('/api/objectives', objectiveRoutes);
app.use('/api/feedback', Feedback);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/resignations', resignationRoutes);


// Harish
app.use('/api/attendance', attendanceRoutes);
app.use('/api', documentRoutes);
app.use('/api', policyRoutes);
app.use('/api', organizationRoutes);
app.use('/api/disciplinary-actions', disciplinaryActionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`✨ Server running on port ${PORT}`.yellow.bold));
