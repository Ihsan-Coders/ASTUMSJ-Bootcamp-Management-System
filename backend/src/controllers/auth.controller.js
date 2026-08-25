const User = require('../models/User');
const {
  hashPassword,
  comparePassword,
} = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { generateResetToken, hashResetToken } = require('../utils/resetToken');
const { sendEmail } = require('../utils/email');


// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;


    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered',
      });
    }

    const hashedPassword = await hashPassword(password);

    // SECURITY:
    // Public registration ALWAYS creates student accounts.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
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
      message: 'Registered successfully',
    });
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    
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
        message: 'Account is disabled',
      });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      user.password
    );

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
})

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

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
  // Skip full schema validation — we're only touching the reset fields,
  // not re-validating name/email/password on an already-valid document.
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
})


module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};