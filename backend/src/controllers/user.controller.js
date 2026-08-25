const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const allowedUserFields = ['name', 'email', 'batch'];
const asyncHandler = require('../utils/asyncHandler');

const getAllowedUserUpdates = (body) => {
  const updates = {};

  allowedUserFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

// GET /api/users/me — the authenticated user's own profile.
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('batch', 'name');

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user, message: 'Profile fetched' });
});


const selfEditableFields = ['name', 'email'];

const updateMe = asyncHandler(async (req, res) => {
  const updates = {};
  selfEditableFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.email) {
    const existing = await User.findOne({
      email: updates.email,
      _id: { $ne: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email already in use',
      });
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  })
    .select('-password')
    .populate('batch', 'name');

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user, message: 'Profile updated' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'User not found',
    });
  }

const isCurrentPasswordValid = await comparePassword(
  currentPassword,
  user.password
);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Current password is incorrect',
    });
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    success: true,
    data: null,
    message: 'Password changed successfully',
  });
});

const getUsers = asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const users = await User.find(filter).select('-password');
    res.status(200).json({ success: true, data: users, message: 'Users fetched' });
  
})

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, data: null, message: 'Email already in use' });
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword, role: 'student'});
    res.status(201).json({ success: true, data: { ...user._doc, password: undefined }, message: 'User created' });
})

const createMentor = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Email already in use',
    });
  }

  const hashedPassword = await hashPassword(password);

  const mentor = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'mentor',
    isActive: true,
  });

  const mentorData = mentor.toObject();
  delete mentorData.password;

  res.status(201).json({
    success: true,
    data: mentorData,
    message: 'Mentor created',
  });
});

const updateUser = asyncHandler(async (req, res) => {
    const updates = getAllowedUserUpdates(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User updated' });
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: null, message: 'User deleted' });
})

const getPendingUsers = asyncHandler(async (req, res) => {
    const pendingUsers = await User.find({ isActive: false, role: 'student' })
      .select('-password')
      .populate('batch', 'name');
    res.status(200).json({ success: true, data: pendingUsers, message: 'Pending users fetched' });
})

const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User approved' });
  
})

const rejectUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: null, message: 'Application rejected' });
})

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  createUser,
  createMentor,
  updateUser,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser,
};
