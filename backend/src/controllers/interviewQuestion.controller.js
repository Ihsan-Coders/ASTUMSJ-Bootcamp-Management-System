const InterviewQuestion = require('../models/InterviewQuestion');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/interview-questions — admin + mentor (mentor needs these to
// conduct an interview).
const getInterviewQuestions = asyncHandler(async (req, res) => {
  const questions = await InterviewQuestion.find().sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: questions,
    message: 'Interview questions fetched',
  });
});

// POST /api/interview-questions — admin only.
const createInterviewQuestion = asyncHandler(async (req, res) => {
  const question = await InterviewQuestion.create(req.body);

  res.status(201).json({
    success: true,
    data: question,
    message: 'Interview question created',
  });
});

// PUT /api/interview-questions/:id — admin only.
const updateInterviewQuestion = asyncHandler(async (req, res) => {
  const question = await InterviewQuestion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return res.status(404).json({ success: false, data: null, message: 'Question not found' });
  }

  res.status(200).json({ success: true, data: question, message: 'Interview question updated' });
});

// DELETE /api/interview-questions/:id — admin only.
// Deleting a question does not affect applications that already used it —
// their answers keep a snapshot of the question text/maxScore.
const deleteInterviewQuestion = asyncHandler(async (req, res) => {
  const question = await InterviewQuestion.findByIdAndDelete(req.params.id);

  if (!question) {
    return res.status(404).json({ success: false, data: null, message: 'Question not found' });
  }

  res.status(200).json({ success: true, data: null, message: 'Interview question deleted' });
});

module.exports = {
  getInterviewQuestions,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
};
