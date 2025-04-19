import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();
 
// Force DNS to resolve to IPv4 addresses only
dns.setDefaultResultOrder('ipv4first');

console.log("User:", process.env.USER);
console.log("Pass:", process.env.PASS);
 
 
 
export const sendOnboardingEmail = async (
  email,
  { name, jobPosition, joiningDate }
) => {
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Welcome to DB4Cloud Technologies!",
    html: `
      <h2>Welcome ${name}!</h2>
      <p>We're excited to have you join our team as ${jobPosition}.</p>
      <p>Your joining date is confirmed for ${joiningDate}.</p>
      <p>Please complete your onboarding tasks and documentation before the joining date.</p>
      <br>
      <p>Best regards,</p>
      <p>HR Team</p>
    `,
  };
 
  return await transporter.sendMail(mailOptions);
};

console.log("HRMS-1702: Email configuration:");
console.log("Email User:", process.env.USER);
console.log("Email Pass exists:", !!process.env.PASS);
console.log("Email Pass length:", process.env.PASS ? process.env.PASS.length : 0);
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.USER, // Your email
    pass: process.env.PASS // Your email password or app password
  }
}
);
 
// Function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  try {
    const verifyLink = `${process.env.CLIENT_URL}/verify?email=${email}&otp=${otp}`;
   
    const mailOptions = {
      from: process.env.USER, // Fix: Remove extra quotes
      to: email,
      subject: 'OTP Verification',
      html: `
        <p>Thank you for registering with us. Please use the OTP below to verify your email:</p>
        <h3>${otp}</h3>
        <p>This OTP will expire in 10 minutes.</p>
      `
    };
   
    // Verify SMTP connection before sending
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP connection error:', error);
          reject(error);
        } else {
          console.log('SMTP server is ready to send messages');
          resolve(success);
        }
      });
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Function to send password reset email
export const sendResetEmail = async (email, resetToken) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
   
    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h2>Password Reset Request</h2>
            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };
 
    await transporter.sendMail(mailOptions);
};