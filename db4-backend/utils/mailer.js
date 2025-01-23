  import nodemailer from 'nodemailer';
  import dns from 'dns';
  import dotenv from 'dotenv';
  dotenv.config();

  // Force DNS to resolve to IPv4 addresses only
  dns.setDefaultResultOrder('ipv4first');

  console.log('User:', process.env.USER); // Debugging
  console.log('Pass:', process.env.PASS); // Debugging

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.USER,
  //     pass: process.env.PASS
  //   },
  //   tls: {
  //     rejectUnauthorized: false
  //   }
  // });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Test the transporter
  transporter.verify(function(error, success) {
    if (error) {
      console.log('Mailer error:', error);
    } else {
      console.log('Server is ready to send emails');
    }
  });
  


  export const sendOnboardingEmail = async (email, { name, jobPosition, joiningDate }) => {
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'Welcome to DB4Cloud Technlogies!',
      html: `
        <h2>Welcome ${name}!</h2>
        <p>We're excited to have you join our team as ${jobPosition}.</p>
        <p>Your joining date is confirmed for ${joiningDate}.</p>
        <p>Please complete your onboarding tasks and documentation before the joining date.</p>
        <br>
        <p>Best regards,</p>
        <p>HR Team</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  };


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

  export const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Click here to reset your password:</h2>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
      `
    };

    return await transporter.sendMail(mailOptions);
  };