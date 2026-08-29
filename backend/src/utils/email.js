const nodemailer = require('nodemailer');

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

const sendApplicationRejectedEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    subject: 'ASTU MSJ Bootcamp Application Update',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your interest in the ASTU MSJ Bootcamp.</p>
      <p>After careful review, your application was not successful at this time.</p>
      <p>We encourage you to apply again in a future intake, and we wish you the best in your journey.</p>
    `,
  });
};

const sendInterviewScheduledEmail = async ({ to, name, interviewDate, interviewTime, interviewLocation, interviewLink }) => {
  const locationText = interviewLocation || interviewLink || 'the scheduled meeting venue';
  const dateText = interviewDate ? new Date(interviewDate).toLocaleString('en-GB', { dateStyle: 'full' }) : 'To be confirmed';
  const timeText = interviewTime || 'To be confirmed';

  await sendEmail({
    to,
    subject: 'Your Interview has been scheduled',
    html: `
      <p>Hi ${name},</p>
      <p>Congratulations! Your application has been approved for the interview stage.</p>
      <p><strong>Date:</strong> ${dateText}</p>
      <p><strong>Time:</strong> ${timeText}</p>
      <p><strong>Location / Link:</strong> ${locationText}</p>
      <p>Please review the instructions and be prepared to discuss your motivation and technical interests.</p>
    `,
  });
};

const sendInterviewFailedEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    subject: 'ASTU MSJ Bootcamp Interview Outcome',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for attending the interview.</p>
      <p>After review, your interview result was not successful this time.</p>
      <p>You may still apply to future intakes if eligible.</p>
    `,
  });
};

const sendFinalApprovalEmail = async ({ to, name, activateUrl }) => {
  await sendEmail({
    to,
    subject: 'Complete Your Bootcamp Account Setup',
    html: `
      <p>Hi ${name},</p>
      <p>Congratulations — you have passed the final approval stage.</p>
      <p>Please complete your account setup using the secure link below:</p>
      <p><a href="${activateUrl}">${activateUrl}</a></p>
      <p>This link is valid for a short period and can only be used once.</p>
    `,
  });
};

module.exports = {
  sendEmail,
  sendApplicationRejectedEmail,
  sendInterviewScheduledEmail,
  sendInterviewFailedEmail,
  sendFinalApprovalEmail,
};
