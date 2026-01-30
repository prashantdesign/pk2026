'use server';

import nodemailer from 'nodemailer';

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = async ({ to, subject, html }: MailPayload) => {
  const { EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_SENDER_NAME } = process.env;

  if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    const errorMessage = 'Email server credentials (EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD) are not configured in the .env file.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Using explicit SMTP configuration for Gmail
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${EMAIL_SENDER_NAME || 'PK Design'}" <${EMAIL_SERVER_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via nodemailer:', error);
    // Re-throwing the error to be caught by the server action
    throw new Error('Could not send email. Please check server logs for details.');
  }
};
