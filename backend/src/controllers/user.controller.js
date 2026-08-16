const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');

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
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, data: null, message: 'Email already in use' });

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ success: true, data: { ...user._doc, password: undefined }, message: 'User created' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body; // never allow raw password overwrite here
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
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

module.exports = { getUsers, createUser, updateUser, deleteUser };
