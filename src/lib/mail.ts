import nodemailer from 'nodemailer';

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

// 1. Create a transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// 2. Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer verification error:", error);
  } else {
    console.log("Nodemailer is ready to send messages");
  }
});

// 3. Create a sendMail function
export const sendMail = async ({ to, subject, html }: MailPayload) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email.');
  }
};
