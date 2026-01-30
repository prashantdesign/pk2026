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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
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
    // We can optionally verify the connection, but sendMail will do it implicitly
    // await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via nodemailer:', error);
    throw new Error('Could not send email due to a server configuration issue.');
  }
};
