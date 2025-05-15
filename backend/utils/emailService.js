import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

export const sendResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

const testEmailConfig = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to send emails");
    }
  });
};

// Send invitation email
export const sendInvitationEmail = async ({ email, name, companyName, temporaryPassword, companyCode }) => {
  console.log(`Preparing invitation email for ${email}`);
  
  const mailOptions = {
    from: `"${companyName} HR" <${process.env.USER}>`,
    to: email,
    subject: `Invitation to join ${companyName} HR System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Welcome to ${companyName} HR System</h2>
        <p>Hello ${name},</p>
        <p>You have been invited to join the ${companyName} HR Management System. Please use the following credentials to log in:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Company Code:</strong> ${companyCode}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
        </div>
        <p>Please log in at <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</a> and change your password immediately.</p>
        <p>If you have any questions, please contact your HR administrator.</p>
        <p>Best regards,<br>${companyName} HR Team</p>
      </div>
    `
  };
  
  console.log('Sending invitation email...');
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

// Send resignation email
export const sendResignationEmail = async (data) => {
  const { name, email, reason, noticePeriod, lastWorkingDate } = data;
  
  const mailOptions = {
    from: process.env.USER,
    to: process.env.HR_EMAIL || process.env.USER, // Send to HR email or default to sender
    subject: `Resignation Notice: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Resignation Notice</h2>
        <p>Employee <strong>${name}</strong> has submitted their resignation.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Employee Email:</strong> ${email}</p>
          <p><strong>Reason for Resignation:</strong> ${reason}</p>
          <p><strong>Notice Period:</strong> ${noticePeriod} days</p>
          <p><strong>Last Working Date:</strong> ${lastWorkingDate}</p>
        </div>
        <p>Please take appropriate action.</p>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Resignation email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending resignation email:', error);
    throw error;
  }
};

// You can add other email-related functions here
export const sendPasswordResetEmail = async ({ email, resetLink }) => {
  // Implementation for password reset emails
};

export const sendVerificationEmail = async ({ email, verificationCode }) => {
  // Implementation for verification emails
};


// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASS
//   }
// });

// export const sendResetEmail = async (email, resetUrl) => {
//   const mailOptions = {
//     from: process.env.USER,
//     to: email,
//     subject: 'Password Reset Request',
//     html: `
//       <h1>Password Reset</h1>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetUrl}">Reset Password</a>
//       <p>This link will expire in 1 hour.</p>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// }

// const testEmailConfig = async () => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.USER,
//       pass: process.env.PASS
//     }
//   });

//   transporter.verify(function(error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to send emails");
//     }
//   });
// };

// // Send invitation email
// export const sendInvitationEmail = async ({ email, name, companyName, temporaryPassword, companyCode }) => {
//   console.log(`Preparing invitation email for ${email}`);
  
//   const mailOptions = {
//     from: `"${companyName} HR" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Invitation to join ${companyName} HR System`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
//         <h2 style="color: #333;">Welcome to ${companyName} HR System</h2>
//         <p>Hello ${name},</p>
//         <p>You have been invited to join the ${companyName} HR Management System. Please use the following credentials to log in:</p>
//         <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
//           <p><strong>Company Code:</strong> ${companyCode}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
//         </div>
//         <p>Please log in at <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</a> and change your password immediately.</p>
//         <p>If you have any questions, please contact your HR administrator.</p>
//         <p>Best regards,<br>${companyName} HR Team</p>
//       </div>
//     `
//   };
  
//   console.log('Sending invitation email...');
  
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Invitation email sent: ${info.messageId}`);
//     return info;
//   } catch (error) {
//     console.error('Error sending invitation email:', error);
//     throw error;
//   }
// };

// // You can add other email-related functions here
// export const sendPasswordResetEmail = async ({ email, resetLink }) => {
//   // Implementation for password reset emails
// };

// export const sendVerificationEmail = async ({ email, verificationCode }) => {
//   // Implementation for verification emails
// };