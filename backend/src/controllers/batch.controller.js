const Batch = require("../models/Batch");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const allowedBatchFields = [
  "name",
  "startDate",
  "endDate",
  "registrationStart",
  "registrationEnd",
  "isActive",
];

const getAllowedUpdates = (body) => {
  const updates = {};

  allowedBatchFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

const createBatch = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, registrationStart, registrationEnd } =
    req.body;

  const batch = await Batch.create({
    name,
    startDate,
    endDate,
    registrationStart,
    registrationEnd,
    isActive: false,
    isAcceptingApplicants: false,
  });

  res.status(201).json({
    success: true,
    data: batch,
    message: "Batch created",
  });
});

const getBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find()
    .populate("mentors", "name email role")
    .populate("students", "name email role");

  res.status(200).json({
    success: true,
    data: batches,
    message: "Batches fetched",
  });
});

const getOpenBatches = asyncHandler(async (req, res) => {
  const now = new Date();

  const batches = await Batch.find({
    registrationStart: { $lte: now },
    registrationEnd: { $gte: now },
    isActive: true,
    isAcceptingApplicants: true,
  }).select("name registrationEnd");

  res.status(200).json({
    success: true,
    data: batches,
    message: "Open batches fetched",
  });
});

const updateBatch = asyncHandler(async (req, res) => {
  const updates = getAllowedUpdates(req.body);

  if (updates.isActive === true) {
    await Batch.updateMany(
      { _id: { $ne: req.params.id }, isActive: true },
      {
        $set: {
          isActive: false,
          isAcceptingApplicants: false,
        },
      },
    );
  }

  if (updates.isActive === false) {
    updates.isAcceptingApplicants = false;
  }

  const batch = await Batch.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  res.status(200).json({
    success: true,
    data: batch,
    message: "Batch updated",
  });
});

const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  if (batch.isActive || batch.isAcceptingApplicants) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Active or accepting batches cannot be deleted. Deactivate the batch first.",
    });
  }

  await batch.deleteOne();

  res.status(200).json({
    success: true,
    data: null,
    message: "Batch deleted",
  });
});

const assignMentorToBatch = asyncHandler(async (req, res) => {
  const { batchId, mentorId } = req.body;

  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $addToSet: { mentors: mentorId } },
    { new: true },
  );

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  res.status(200).json({
    success: true,
    data: batch,
    message: "Mentor assigned",
  });
});

const enrollStudentInBatch = asyncHandler(async (req, res) => {
  const { batchId, studentId } = req.body;

  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $addToSet: { students: studentId } },
    { new: true },
  );

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  await User.findByIdAndUpdate(studentId, {
    batch: batchId,
  });

  res.status(200).json({
    success: true,
    data: batch,
    message: "Student enrolled",
  });
});

const assignMentorToStudent = asyncHandler(async (req, res) => {
  const { studentId, mentorId } = req.body;

  if (!studentId || !mentorId) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "studentId and mentorId are required",
    });
  }

  const student = await User.findById(studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Student not found",
    });
  }

  if (student.role !== "student") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Selected user is not a student",
    });
  }

  if (!student.batch) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Student is not enrolled in a batch",
    });
  }

  const mentor = await User.findById(mentorId);

  if (!mentor) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Mentor not found",
    });
  }

  if (mentor.role !== "mentor") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Selected user is not a mentor",
    });
  }

  const batch = await Batch.findOne({
    _id: student.batch,
    mentors: mentor._id,
  });

  if (!batch) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "This mentor is not assigned to the student's batch",
    });
  }

  student.mentor = mentor._id;
  await student.save();

  const updatedStudent = await User.findById(student._id)
    .select("-password")
    .populate("mentor", "name email role")
    .populate("batch", "name");

  res.status(200).json({
    success: true,
    data: updatedStudent,
    message: "Mentor assigned to student",
  });
});

const setAcceptingBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  if (!batch.isActive) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Only an active batch can accept applicants",
    });
  }

  await Batch.updateMany({}, {
    $set: { isAcceptingApplicants: false },
  });

  batch.isAcceptingApplicants = true;

  await batch.save();

  res.status(200).json({
    success: true,
    data: batch,
    message: "Batch set as currently accepting applicants",
  });
});

module.exports = {
  createBatch,
  getBatches,
  getOpenBatches,
  updateBatch,
  deleteBatch,
  assignMentorToBatch,
  enrollStudentInBatch,
  assignMentorToStudent,
  setAcceptingBatch,
};
