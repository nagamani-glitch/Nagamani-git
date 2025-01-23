import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { sendOtpEmail } from '../utils/mailer.js';

// Register User and send OTP
export const registerAuth = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please try login!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    newUser.otp = otp;
    newUser.otpExpires = otpExpires;
    await newUser.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'Registration successful. Please check your email for the OTP.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Login User
export const loginAuth = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};



// Forgot Password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetEmail(email, resetToken);
    res.status(200).json({ 
      success: true,
      message: 'Password reset email sent successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};




// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS
//       }
//     });

//     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    
//     const mailOptions = {
//       from: process.env.USER,
//       to: email,
//       subject: 'Password Reset Link',
//       html: `
//         <h2>Password Reset Request</h2>
//         <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
//         <p>This link will expire in 1 hour.</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Password reset link sent to your email' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Error sending reset link' });
//   }
// };

// Reset Password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Add this export function for OTP verification
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
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully. Registration completed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


