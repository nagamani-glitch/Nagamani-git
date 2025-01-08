import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

export const sendResignationEmail = async (resignationData) => {
  const mailOptions = {
    from: resignationData.email,  // Sender's email from the form
    to: process.env.USER,         // Your configured email
    subject: 'New Resignation Letter',
    html: `
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
    `
  };

  return await transporter.sendMail(mailOptions);
};
