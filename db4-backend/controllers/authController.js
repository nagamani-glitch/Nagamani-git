// import User from '../models/authModels.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // Register Route
// const registerAuth =  async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Create a new user
//     user = new User({ name, email, password });
//     await user.save();

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Login Route
// const loginAuth = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export {loginAuth, registerAuth}






////////////////////////////////////////////////////////////////////////////////////////////////////////////



// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/userModel.js';
// import nodemailer from 'nodemailer';

// // Create a transporter for sending OTP (using Gmail as an example)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.USER,  // Your email address from .env
//     pass: process.env.PASS,  // Your email password from .env
//   },
// });

// // Register User
// export const registerAuth = async (req, res) => {
//   const { name, email, password } = req.body;
  
//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Create new user and hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     // Generate JWT token (for session management)
//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });

//     // Send OTP via email
//     const otp = Math.floor(100000 + Math.random() * 900000);  // Generate 6-digit OTP
//     const otpExpires = Date.now() + 10 * 60 * 1000;  // OTP expiry time (10 minutes)

//     // Save OTP to user document for later verification
//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();

//     const mailOptions = {
//       from: process.env.USER,
//       to: email,
//       subject: 'Email OTP Verification',
//       text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
//     };
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Registration successful. Please check your email for the OTP.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Login User
// export const loginAuth = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password match
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Verify OTP
// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Check if OTP is valid and not expired
//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     // OTP verified, allow further actions (e.g., activate user)
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.json({ message: 'OTP verified successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };











import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/mailer.js';

// Register User and send OTP
export const registerAuth = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please try login!' });
    }

    // Hash password before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate OTP and set expiration time (valid for 10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 10 * 60 * 1000;  // OTP expires in 10 minutes

    // Save OTP and expiration time
    newUser.otp = otp;
    newUser.otpExpires = otpExpires;
    await newUser.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'Registration successful. Please check your email for the OTP.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Verify OTP for user registration
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified successfully, clear OTP and expiration time
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. Registration completed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Login User (JWT Token Generation)
export const loginAuth = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};








