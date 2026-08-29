const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendApplicationRejectedEmail,
  sendInterviewScheduledEmail,
  sendInterviewFailedEmail,
  sendFinalApprovalEmail,
} = require("../utils/email");
const { createActivationToken, hashActivationToken, normalizeEmail } = require("../utils/studentRegistration");

const allowedUserFields = ["name", "email", "batch", "codeforcesHandle"];

const getAllowedUserUpdates = (body) => {
  const updates = {};

  allowedUserFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

const sanitizeUser = (user) => {
  if (!user) return user;
  const userObject = user.toObject ? user.toObject() : user;
  delete userObject.password;
  return userObject;
};

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("batch", "name");

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
    message: "Profile fetched",
  });
});

const selfEditableFields = ['name', 'email'];

const updateMe = asyncHandler(async (req, res) => {
  const updates = {};

  selfEditableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
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
        message: "Email already in use",
      });
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .populate("batch", "name");

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
    message: "Profile updated",
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Current password is incorrect",
    });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    data: null,
    message: "Password changed successfully",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const users = await User.find(filter).select("-password");
  res.status(200).json({ success: true, data: users, message: "Users fetched" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  return res.status(200).json({ success: true, data: user, message: "User fetched" });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(400).json({ success: false, data: null, message: "Email already in use" });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "student",
    isActive: false,
    applicationStatus: "pending",
  });

  res.status(201).json({
    success: true,
    data: sanitizeUser(user),
    message: "Student created",
  });
});

const createMentor = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(400).json({ success: false, data: null, message: "Email already in use" });
  }

  const mentor = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: await hashPassword(password),
    role: "mentor",
    isActive: true,
  });

  res.status(201).json({ success: true, data: sanitizeUser(mentor), message: "Mentor created" });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(400).json({ success: false, data: null, message: "Email already in use" });
  }

  const admin = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: await hashPassword(password),
    role: "admin",
    isActive: true,
  });

  res.status(201).json({ success: true, data: sanitizeUser(admin), message: "Admin created" });
});

const updateUser = asyncHandler(async (req, res) => {
  const updates = getAllowedUserUpdates(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user, message: "User updated" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  res.status(200).json({ success: true, data: null, message: "User deleted" });
});

const getPendingUsers = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({
    role: "student",
    applicationStatus: { $in: ["pending", "approved", "interview_scheduled", "interview_passed"] },
  }).select("-password");

  res.status(200).json({ success: true, data: pendingUsers, message: "Pending users fetched" });
});

const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  if (user.role !== "student") {
    return res.status(400).json({ success: false, data: null, message: "Only student applications can be approved" });
  }

  user.applicationStatus = "pending";
  user.applicationApprovedBy = req.user.id;
  user.isActive = false;
  await user.save();

  return res.status(200).json({ success: true, data: sanitizeUser(user), message: "Application approved for review" });
});

const rejectUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  user.applicationStatus = "rejected";
  user.isActive = false;
  user.applicationRejectedBy = req.user.id;
  user.activationTokenHash = undefined;
  user.activationTokenExpires = undefined;
  user.activationTokenUsed = false;
  await user.save({ validateBeforeSave: false });

  try {
    await sendApplicationRejectedEmail({ to: user.email, name: user.name });
  } catch (error) {
    console.error("Failed to send rejection email:", error.message);
  }

  return res.status(200).json({ success: true, data: sanitizeUser(user), message: "Application rejected" });
});

const scheduleInterview = asyncHandler(async (req, res) => {
  const { interviewDate, interviewTime, interviewLocation, interviewLink, notes } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  if (!interviewDate && !interviewTime && !interviewLocation && !interviewLink) {
    return res.status(400).json({ success: false, data: null, message: "Interview details are required" });
  }

  user.interviewDate = interviewDate ? new Date(interviewDate) : user.interviewDate;
  user.interviewTime = interviewTime || user.interviewTime;
  user.interviewLocation = interviewLocation || user.interviewLocation;
  user.interviewLink = interviewLink || user.interviewLink;
  user.interviewNotes = notes || user.interviewNotes;
  user.applicationStatus = "interview_scheduled";
  user.interviewScheduledBy = req.user.id;
  user.isActive = false;
  await user.save();

  try {
    await sendInterviewScheduledEmail({
      to: user.email,
      name: user.name,
      interviewDate: user.interviewDate,
      interviewTime: user.interviewTime,
      interviewLocation: user.interviewLocation,
      interviewLink: user.interviewLink,
    });
  } catch (error) {
    console.error("Failed to send interview schedule email:", error.message);
  }

  return res.status(200).json({ success: true, data: sanitizeUser(user), message: "Interview scheduled" });
});

const recordInterviewResult = asyncHandler(async (req, res) => {
  const { result } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  if (!['passed', 'failed'].includes(result)) {
    return res.status(400).json({ success: false, data: null, message: "Interview result must be passed or failed" });
  }

  user.interviewResult = result;
  user.interviewResultRecordedBy = req.user.id;
  user.applicationStatus = result === 'passed' ? 'interview_passed' : 'interview_failed';
  user.isActive = false;
  await user.save();

  if (result === 'failed') {
    try {
      await sendInterviewFailedEmail({ to: user.email, name: user.name });
    } catch (error) {
      console.error("Failed to send interview failed email:", error.message);
    }
  }

  return res.status(200).json({ success: true, data: sanitizeUser(user), message: `Interview marked as ${result}` });
});

const finalApproveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  if (user.applicationStatus !== 'interview_passed' && user.applicationStatus !== 'approved') {
    return res.status(400).json({ success: false, data: null, message: "Only interview-pass applicants can receive final approval" });
  }

  const tokenData = createActivationToken();
  user.activationTokenHash = tokenData.hash;
  user.activationTokenExpires = tokenData.expiresAt;
  user.activationTokenUsed = false;
  user.applicationStatus = 'approved';
  user.finalApprovedBy = req.user.id;
  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  const activateUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/activate-account?token=${tokenData.rawToken}`;

  try {
    await sendFinalApprovalEmail({
      to: user.email,
      name: user.name,
      activateUrl,
    });
  } catch (error) {
    console.error("Failed to send final approval email:", error.message);
    user.activationTokenHash = undefined;
    user.activationTokenExpires = undefined;
    user.activationTokenUsed = false;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, data: null, message: "Email delivery failed; activation link could not be sent." });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      activationRequired: true,
    },
    message: "Final approval issued and activation link sent",
  });
});

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  getUserById,
  createUser,
  createMentor,
  createAdmin,
  updateUser,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser,
  scheduleInterview,
  recordInterviewResult,
  finalApproveUser,
};
