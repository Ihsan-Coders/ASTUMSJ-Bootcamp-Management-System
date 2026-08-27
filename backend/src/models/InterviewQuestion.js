const mongoose = require('mongoose');

// A single global list of interview questions, managed by Admin. Every
// interview uses whichever questions are currently in this collection —
// there is no per-applicant selection/attachment step. A question's text
// and maxScore are snapshotted onto the Application at the moment a
// mentor submits their result (see Application.interviewAnswers), so
// editing or deleting a question here never changes already-completed
// interviews.
const interviewQuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },

    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      min: [1, 'Max score must be at least 1'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
