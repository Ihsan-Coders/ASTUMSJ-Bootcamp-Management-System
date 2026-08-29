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

/**
 * CREATE BATCH
 */
const createBatch = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, registrationStart, registrationEnd } =
    req.body;

  const batch = await Batch.create({
    name,
    startDate,
    endDate,
    registrationStart,
    registrationEnd,
  });

  res.status(201).json({
    success: true,
    data: batch,
    message: "Batch created",
  });
});

/**
 * GET ALL BATCHES
 */
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

/**
 * GET OPEN BATCHES
 */
const getOpenBatches = asyncHandler(async (req, res) => {
  const now = new Date();

  const batches = await Batch.find({
    registrationStart: { $lte: now },
    registrationEnd: { $gte: now },
    isActive: true,
  }).select("name registrationEnd");

  res.status(200).json({
    success: true,
    data: batches,
    message: "Open batches fetched",
  });
});

/**
 * UPDATE BATCH
 */
const updateBatch = asyncHandler(async (req, res) => {
  const updates = getAllowedUpdates(req.body);

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

/**
 * DELETE BATCH
 */
const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndDelete(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  // Remove batch and mentor relationship from students.
  await User.updateMany(
    {
      role: "student",
      batch: batch._id,
    },
    {
      $set: {
        batch: null,
        mentor: null,
      },
    },
  );

  res.status(200).json({
    success: true,
    data: null,
    message: "Batch deleted",
  });
});

/**
 * ASSIGN MENTOR TO BATCH
 *
 * Relationships:
 *
 * Batch  -> MANY mentors
 * Mentor -> MANY batches
 *
 * Adding a mentor does NOT remove existing mentors.
 */
const assignMentorToBatch = asyncHandler(async (req, res) => {
  const { batchId, mentorId } = req.body;

  if (!batchId || !mentorId) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "batchId and mentorId are required",
    });
  }

  const mentor = await User.findOne({
    _id: mentorId,
    role: "mentor",
    isActive: true,
  });

  if (!mentor) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Mentor not found or inactive",
    });
  }

  const batch = await Batch.findById(batchId);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  // Add mentor without removing existing mentors.
  // $addToSet prevents duplicate mentors.
  await Batch.findByIdAndUpdate(batchId, {
    $addToSet: {
      mentors: mentor._id,
    },
  });

  const updatedBatch = await Batch.findById(batchId)
    .populate("mentors", "name email role")
    .populate("students", "name email role");

  res.status(200).json({
    success: true,
    data: updatedBatch,
    message: "Mentor assigned to batch",
  });
});

/**
 * ENROLL STUDENT IN BATCH
 *
 * Student -> ONE batch
 *
 * Enrollment does NOT automatically assign a mentor.
 * The admin explicitly assigns a mentor afterward.
 */
const enrollStudentInBatch = asyncHandler(async (req, res) => {
  const { batchId, studentId } = req.body;

  if (!batchId || !studentId) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "batchId and studentId are required",
    });
  }

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    isActive: true,
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Student not found or inactive",
    });
  }

  const batch = await Batch.findById(batchId);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  // Remove student from previous batch.
  if (student.batch) {
    await Batch.findByIdAndUpdate(student.batch, {
      $pull: {
        students: student._id,
      },
    });
  }

  // Add student to new batch.
  await Batch.findByIdAndUpdate(batchId, {
    $addToSet: {
      students: student._id,
    },
  });

  // Update student's batch.
  student.batch = batch._id;

  // Mentor must be explicitly assigned.
  student.mentor = null;

  await student.save();

  const updatedBatch = await Batch.findById(batchId)
    .populate("mentors", "name email role")
    .populate("students", "name email role");

  res.status(200).json({
    success: true,
    data: updatedBatch,
    message: "Student enrolled in batch",
  });
});

/**
 * ASSIGN SPECIFIC MENTOR TO SPECIFIC STUDENT
 *
 * Student -> ONE mentor
 * Mentor  -> MANY students
 *
 * IMPORTANT:
 * The mentor must already belong to the student's batch.
 */
const assignMentorToStudent = asyncHandler(async (req, res) => {
  const { studentId, mentorId } = req.body;

  if (!studentId || !mentorId) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "studentId and mentorId are required",
    });
  }

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    isActive: true,
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Student not found or inactive",
    });
  }

  const mentor = await User.findOne({
    _id: mentorId,
    role: "mentor",
    isActive: true,
  });

  if (!mentor) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Mentor not found or inactive",
    });
  }

  // Student must first belong to a batch.
  if (!student.batch) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Student must be enrolled in a batch first",
    });
  }

  // Mentor must belong to the same batch as the student.
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

  // Assign mentor to student.
  student.mentor = mentor._id;

  await student.save();

  const updatedStudent = await User.findById(student._id)
    .select("_id name email role batch mentor")
    .populate("batch", "name")
    .populate("mentor", "name email role");

  res.status(200).json({
    success: true,
    data: updatedStudent,
    message: "Mentor assigned to student",
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
};
