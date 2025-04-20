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
    // user: process.env.USER, // Your email
    // pass: process.env.PASS // Your email password or app password
    user: 'rickyharish30@gmail.com',
    pass : 'irnb atlq oani ytlq' 
  }
}
);
 
// Function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  try {
    const verifyLink = `${process.env.CLIENT_URL}/verify?email=${email}&otp=${otp}`;
   
    const mailOptions = {
      from: process.env.USER || `rickyharish30@gmail.com`, // Fix: Remove extra quotes
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #3f51b5; margin-bottom: 5px;">Password Reset Request</h1>
                <div style="height: 3px; width: 80px; background-color: #3f51b5; margin: 0 auto;"></div>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your DB4Cloud Technologies account. To proceed with resetting your password, please click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" target="_self" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5;">This link will expire in <strong>1 hour</strong> for security reasons. If you did not request a password reset, please disregard this email and ensure your account is secure.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
                <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                <p style="word-break: break-all; color: #3f51b5;">${resetLink}</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #777; font-size: 14px;">
                <p>© ${new Date().getFullYear()} DB4Cloud Technologies. All rights reserved.</p>
            </div>
        </div>
    `

    };
 
    await transporter.sendMail(mailOptions);
};