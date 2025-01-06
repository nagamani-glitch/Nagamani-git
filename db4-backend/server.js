import cors from 'cors'
import express from "express"
import connectDB from './config/db.js'
import dotenv from 'dotenv'
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
import assetBatchRoutes from './routes/assetBatchRoutes.js';
import assetHistoryRoutes from './routes/assetHistory.js';
import assetDashboardRoutes from './routes/assetDashboardRoutes.js';
import faqCategoryRoutes from './routes/faqCategoryRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import companyHolidaysRoute from './routes/companyHolidays.js';
import restrictLeaveRoutes from './routes/restrictLeaveRoutes.js';
import holidayRoutes from './routes/holidays.js';

// sangeeta integration
import allowanceRoutes from './routes/allowanceRoutes.js';
import payrollContractRoutes from './routes/payrollContractRoutes.js';
import deductionRoutes from './routes/deductionRoutes.js'

dotenv.config()
connectDB()
const app = express()

app.use(cors({
    origin:"*",
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}))

app.use(express.json())

app.use('/api/employees', employeesRouter)
app.use('/api/auth', authRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/contracts', contractRouter);
app.use(candidateRoutes);  
app.use(surveyRoutes); 
app.use('/api/applicantProfiles', applicantProfileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/skill-zone', skillZoneRoutes);
app.use('/api/employees',employeeRoutes);

app.use('/api/assets', assetRoutes);
app.use('/api/asset-batches', assetBatchRoutes);
app.use('/api/assetHistory', assetHistoryRoutes); 
app.use('/api/dashboard', assetDashboardRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/companyHolidays', companyHolidaysRoute);
app.use('/api/restrictLeaves', restrictLeaveRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/faqCategories', faqCategoryRoutes);

// sangeeta integration
app.use('/api/allowances', allowanceRoutes);

//  contract routes import and usage
app.use('/api/contracts', payrollContractRoutes);
app.use('/api/deductions', deductionRoutes);




const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))