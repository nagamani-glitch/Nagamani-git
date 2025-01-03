// // import cors from 'cors'
// // import express from "express"
// // import connectDB from './config/db.js'
// // import dotenv from 'dotenv'
// // import employeesRouter from './routes/employeesRouter.js'
// // import authRouter from './routes/authRouter.js'
// // import profileRouter from './routes/profileRouter.js'
// // import contractRouter from './routes/contractRouter.js'

// // dotenv.config()
// // connectDB()
// // const app = express()

// // app.use(cors({
// //     origin:"*",
// //     methods:["GET", "POST", "PUT", "DELETE"],
// //     credentials:true,
// // }))

// // app.use(express.json())

// // app.use('/api/employees', employeesRouter)
// // app.use('/api/auth', authRouter)
// // app.use('/api/profiles', profileRouter)
// // app.use('/api/contracts', contractRouter);


// // const PORT = process.env.PORT || 5000

// // app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))



// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// // import crypto from 'crypto'; // For secure OTP generation
// import connectDB from './config/db.js';
// import User from './models/User.js'; // Ensure User schema is defined correctly

// dotenv.config();

// // Database connection
// connectDB();

// // Initialize the Express app
// const app = express();

// // CORS configuration
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Nodemailer transporter setup for OTP emails
// const transporter = nodemailer.createTransport({
//   host: process.env.HOST,
//   service: process.env.SERVICE,
//   port: Number(process.env.EMAIL_PORT),
//   secure: Boolean(process.env.SECURE),
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASS,
//   },
// });

// // Function to send OTP email
// const sendOtpEmail = async (email, otp) => {
//   const mailOptions = {
//     from: process.env.USER,
//     to: email,
//     subject: 'OTP for Email Verification',
//     text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('OTP email sent successfully!');
//   } catch (error) {
//     console.error('Error sending OTP email:', error);
//     throw new Error('Error sending OTP email');
//   }
// };

// // API route for registration
// app.post('/api/auth/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(409).json({ message: 'User already exists. Please try login!' });
//     }

//     // Generate a random OTP (6 digits)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user in the database (with OTP saved temporarily)
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
//     });

//     await newUser.save();

//     // Send OTP to the user's email
//     await sendOtpEmail(email, otp);

//     // Respond back to the client
//     res.status(200).json({ message: 'OTP sent to email!' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'An error occurred. Please try again.' });
//   }
// });

// // API route for OTP verification
// app.post('/api/auth/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found!' });
//     }

//     // Check if OTP is valid and not expired
//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: 'Invalid or expired OTP!' });
//     }

//     // OTP is valid, update user as verified
//     user.otp = null; // Clear the OTP after successful verification
//     user.otpExpires = null; // Clear OTP expiration time
//     user.isVerified = true; // Set user as verified (ensure this field exists in the User schema)
//     await user.save();

//     res.status(200).json({ message: 'OTP verified successfully!' });
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     res.status(500).json({ message: 'An error occurred. Please try again.' });
//   }
// });

// // API route for login
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'No account found with this email address. Please register!' });
//     }

//     // Check if the user is verified
//     if (!user.isVerified) {
//       return res.status(403).json({ message: 'Your account is not verified. Please verify your email to continue.' });
//     }

//     // Validate password
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Respond with token and user information
//     res.status(200).json({
//       message: 'Login successful!',
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
import assetDashboardRoutes from './routes/assetDashboardRoutes.js';
import faqCategoryRoutes from './routes/faqCategoryRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import companyHolidaysRoute from './routes/companyHolidays.js';
import restrictLeaveRoutes from './routes/restrictLeaveRoutes.js';
import holidayRoutes from './routes/holidays.js';
 
 
 
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
app.use('/api/dashboard', assetDashboardRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/companyHolidays', companyHolidaysRoute);
app.use('/api/restrictLeaves', restrictLeaveRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/faqCategories', faqCategoryRoutes);
 
 
const PORT = process.env.PORT || 5000
 
app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))