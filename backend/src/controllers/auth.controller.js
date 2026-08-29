const User = require('../models/User');
const {
  hashPassword,
  comparePassword,
} = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { generateResetToken, hashResetToken } = require('../utils/resetToken');
const { sendEmail } = require('../utils/email');
const {
  normalizeEmail,
  buildStudentRegistrationPayload,
  createActivationToken,
  hashActivationToken,
} = require('../utils/studentRegistration');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'Email already registered',
    });
  }

  const hashedPassword = await hashPassword(password);
  const safePayload = buildStudentRegistrationPayload({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const user = await User.create({
    ...safePayload,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        applicationStatus: user.applicationStatus,
        isActive: user.isActive,
      },
    },
    message: 'Registration submitted successfully. Your application is pending review.',
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid email or password',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Account is not active.',
    });
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid email or password',
    });
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
    message: 'Logged in successfully',
  });
});

const activateAccount = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = hashActivationToken(token);

  const user = await User.findOne({
    activationTokenHash: hashedToken,
    activationTokenUsed: false,
    activationTokenExpires: { $gt: new Date() },
  }).select('+activationTokenHash +activationTokenExpires +activationTokenUsed +password');

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid or expired activation token',
    });
  }

  const hashedPassword = await hashPassword(password);

  user.password = hashedPassword;
  user.isActive = true;
  user.applicationStatus = 'activated';
  user.activationTokenHash = undefined;
  user.activationTokenExpires = undefined;
  user.activationTokenUsed = true;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    data: null,
    message: 'Account activated successfully',
  });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail });

  const genericResponse = {
    success: true,
    data: null,
    message: 'If an account exists for that email, a reset link has been sent.',
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const { rawToken, hashedToken, expiresAt } = generateResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your ASTU MSJ Bootcamp password',
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. This link expires in 30 minutes:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw err;
  }

  return res.status(200).json(genericResponse);
});

// POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = hashResetToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid or expired reset token',
    });
  }

  user.password = await hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const newToken = generateToken(user._id);

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: newToken,
    },
    message: 'Password reset successfully',
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully',
  });
});

module.exports = {
  register,
  login,
  activateAccount,
  logout,
  forgotPassword,
  resetPassword,
};