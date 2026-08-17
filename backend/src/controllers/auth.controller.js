const User = require('../models/User');
const {
  hashPassword,
  comparePassword,
} = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');


// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Password must be at least 8 characters',
      });
    }

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

  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error',
    });
  }
};


// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email and password are required',
      });
    }

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

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error',
    });
  }
};


// POST /api/auth/logout
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully',
  });
};


module.exports = {
  register,
  login,
  logout,
};