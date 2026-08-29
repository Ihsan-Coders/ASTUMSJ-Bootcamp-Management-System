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
    isActive: false,
    isAcceptingApplicants: false,
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
  const batches = await Batch.find().populate(
    "mentors students",
    "name email role",
  );

  res.status(200).json({
    success: true,
    data: batches,
    message: "Batches fetched",
  });
});

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
    isAcceptingApplicants: true,
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
  // IMPORTANT: get the allowed updates from the request body
  const updates = getAllowedUpdates(req.body);

  // If an admin activates this batch,
  // deactivate every other batch.
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

  // If an admin deactivates this batch,
  // it must stop accepting applicants too.
  if (updates.isActive === false) {
    updates.isAcceptingApplicants = false;
  }

  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    },
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
    message: "Batch updated",
  });
});

/**
 * DELETE BATCH
 */
const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  // Do not allow deleting a batch that is still operational
  // or accepting applicants.
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

  await Batch.updateMany(
    {},
    { $set: { isAcceptingApplicants: false } },
  );

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
  setAcceptingBatch,
};
