// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host:process.env.HOST,
//     service:process.env.SERVICE,
//     port:Number(process.env.EMAIL_PORT),
//     secure:Boolean(process.env.SECURE),
//   auth: {
//     user: process.env.USER,  // Gmail user from .env
//     pass: process.env.PASS,  // Gmail password from .env
//   },
// });

// export const sendOtpEmail = async (email, otp) => {
//   const mailOptions = {
//     from: process.env.USER,
//     to: email,
//     subject: 'OTP for Email Verification',
//     text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     throw new Error('Error sending OTP email');
//   }
// };


import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.HOST,           // SMTP host, e.g., smtp.gmail.com
  service: process.env.SERVICE,     // Service name, e.g., 'gmail'
  port: Number(process.env.EMAIL_PORT),  // Port number, e.g., 587
  secure: Boolean(process.env.SECURE),   // Whether to use SSL/TLS (false for port 587)
  auth: {
    user: process.env.USER,          // Gmail user from .env
    pass: process.env.PASS,          // Gmail app-specific password from .env
  },
});

// Function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.USER,              // Sender's email address
    to: email,                           // Recipient's email address
    subject: 'OTP for Email Verification', // Subject of the email
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,  // Email body
  };

  try {
    // Sending the email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully!');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending OTP email');
  }
};

