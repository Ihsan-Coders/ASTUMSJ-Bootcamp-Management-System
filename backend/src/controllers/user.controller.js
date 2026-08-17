const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');
const allowedUserFields = ['name','email','batch',];

const getAllowedUserUpdates = (body) => {
  const updates = {};

  allowedUserFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const users = await User.find(filter).select('-password');
    res.status(200).json({ success: true, data: users, message: 'Users fetched' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, data: null, message: 'Email already in use' });
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword, role: 'student'});
    res.status(201).json({ success: true, data: { ...user._doc, password: undefined }, message: 'User created' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = getAllowedUserUpdates(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: null, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isActive: false, role: 'student' })
      .select('-password')
      .populate('batch', 'name');
    res.status(200).json({ success: true, data: pendingUsers, message: 'Pending users fetched' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User approved' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });
    res.status(200).json({ success: true, data: null, message: 'Application rejected' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = {
  getUsers, createUser, updateUser, deleteUser,
  getPendingUsers, approveUser, rejectUser,
};
