const Batch = require('../models/Batch');
const asyncHandler = require('../utils/asyncHandler');

const allowedBatchFields = ['name','startDate','endDate',
      'registrationStart','registrationEnd','isActive',];

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
    const { name, startDate, endDate, registrationStart, registrationEnd } = req.body;
    const batch = await Batch.create({ name, startDate, endDate, registrationStart, registrationEnd });
    res.status(201).json({ success: true, data: batch, message: 'Batch created' });
})

const getBatches = asyncHandler(async (req, res) => {
    const batches = await Batch.find().populate('mentors students', 'name email role');
    res.status(200).json({ success: true, data: batches, message: 'Batches fetched' });
})

const getOpenBatches = asyncHandler(async (req, res) => {
    const now = new Date();
    const batches = await Batch.find({
      registrationStart: { $lte: now },
      registrationEnd: { $gte: now },
      isActive: true,
    }).select('name registrationEnd');
    res.status(200).json({ success: true, data: batches, message: 'Open batches fetched' });
})

const updateBatch = asyncHandler(async (req, res) => {
    const updates = getAllowedUpdates(req.body);

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      updates,{new: true,runValidators: true,}
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
      message: 'Batch updated',
    });
})

const deleteBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, data: null, message: 'Batch not found' });
    res.status(200).json({ success: true, data: null, message: 'Batch deleted' });
})

const assignMentorToBatch = asyncHandler(async (req, res) => {
    const { batchId, mentorId } = req.body;
    const batch = await Batch.findByIdAndUpdate(batchId, { $addToSet: { mentors: mentorId } }, { new: true });
    res.status(200).json({ success: true, data: batch, message: 'Mentor assigned' });
})

const enrollStudentInBatch = asyncHandler(async (req, res) => {
    const { batchId, studentId } = req.body;
    const batch = await Batch.findByIdAndUpdate(batchId, { $addToSet: { students: studentId } }, { new: true });
    res.status(200).json({ success: true, data: batch, message: 'Student enrolled' });
})

module.exports = {
  createBatch, getBatches, getOpenBatches, updateBatch, deleteBatch,
  assignMentorToBatch, enrollStudentInBatch,
};
