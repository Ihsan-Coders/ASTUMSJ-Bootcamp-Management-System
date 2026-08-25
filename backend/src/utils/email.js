const nodemailer = require('nodemailer');

// Generic SMTP transport — works with Gmail (with an app password),
// Mailtrap (for local/dev testing without sending real email), or any
// other SMTP provider. Configure via .env, see .env.example.
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email is not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
  }

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
