import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// export const sendResignationEmail = async (resignationData) => {
//   const mailOptions = {
//     from: resignationData.email,  // Sender's email from the form
//     to: process.env.USER,         // Your configured email
//     subject: 'New Resignation Letter',
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>Resignation Letter</h2>
//         <p><strong>From:</strong> ${resignationData.name}</p>
//         <p><strong>Email:</strong> ${resignationData.email}</p>
//         <p><strong>Position:</strong> ${resignationData.position}</p>
//         <p><strong>Status:</strong> ${resignationData.status}</p>
//         <div style="margin: 20px 0;">
//           <p><strong>Resignation Letter:</strong></p>
//           ${resignationData.description}
//         </div>
//       </div>
//     `
//   };

//   return await transporter.sendMail(mailOptions);
// };

export const sendResignationEmail = async (resignationData) => {
  // Determine if this is a status update notification
  const isStatusUpdate = resignationData.status === 'Approved' || resignationData.status === 'Rejected';
  
  const subject = isStatusUpdate 
    ? `Resignation Status Update: ${resignationData.status}`
    : 'New Resignation Letter';
  
  let emailContent = '';
  
  if (isStatusUpdate) {
    // Email template for status updates
    emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Resignation Status Update</h2>
        <p>Dear ${resignationData.name},</p>
        <p>Your resignation letter has been <strong>${resignationData.status.toLowerCase()}</strong>.</p>
        
        ${resignationData.reviewNotes ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #1976d2;">
          <p><strong>Review Notes:</strong></p>
          <p>${resignationData.reviewNotes}</p>
        </div>
        ` : ''}
        
        <div style="margin: 20px 0;">
          <p><strong>Original Resignation Letter:</strong></p>
          ${resignationData.description}
        </div>
        
        ${resignationData.reviewedBy ? `
        <p><strong>Reviewed by:</strong> ${resignationData.reviewedBy}</p>
        <p><strong>Review date:</strong> ${new Date(resignationData.reviewedAt).toLocaleDateString()}</p>
        ` : ''}
        
        <p>If you have any questions, please contact the HR department.</p>
      </div>
    `;
  } else {
    // Original email template for new resignation letters
    emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Resignation Letter</h2>
        <p><strong>From:</strong> ${resignationData.name}</p>
        <p><strong>Email:</strong> ${resignationData.email}</p>
        <p><strong>Position:</strong> ${resignationData.position}</p>
        <p><strong>Status:</strong> ${resignationData.status}</p>
        <div style="margin: 20px 0;">
          <p><strong>Resignation Letter:</strong></p>
          ${resignationData.description}
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.USER,  // Send from the configured email
    to: isStatusUpdate ? resignationData.email : process.env.USER, // Send to user or HR based on type
    subject: subject,
    html: emailContent
  };

  return await transporter.sendMail(mailOptions);
};
