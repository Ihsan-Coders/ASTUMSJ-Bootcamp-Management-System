const mongoose = require('mongoose');

// An Application represents someone who has applied to the bootcamp through
// the public registration form. It is intentionally separate from User:
// an applicant only becomes a User (Student) once they PASS the full flow
// (admin review -> interview -> admin final decision).
const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },

    // No existing SRS/project convention defines an allowed value set for
    // gender (checked: no enum, no model, no frontend field exists
    // anywhere in the codebase). Left as a plain required string rather
    // than inventing an enum of unsupported values.
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    dailyCommitmentHours: {
      type: Number,
      required: [true, 'Daily time commitment is required'],
      min: [5, 'Daily time commitment must be at least 5 hours'],
    },

    motivation: {
      type: String,
      required: [true, 'Motivation is required'],
      trim: true,
    },

    // Optional
    codeforcesHandle: { type: String, trim: true, default: null },
    leetcodeHandle: { type: String, trim: true, default: null },
    githubUrl: { type: String, trim: true, default: null },

    // Lifecycle status. A single status field instead of several
    // overlapping flags:
    //   Pending Review     -> just submitted, awaiting admin review
    //   Interview          -> admin approved, mentor may now be assigned
    //   Interview Completed-> mentor has submitted scored answers + a note
    //                         (wired in Day 2, not this recovery step)
    //   Rejected           -> rejected by admin at initial review — terminal
    //   Passed             -> admin final decision: passed — terminal
    //                         (wired in Day 2, not this recovery step)
    //   Failed             -> admin final decision: failed — terminal
    //                         (wired in Day 2, not this recovery step)
    status: {
      type: String,
      enum: ['Pending Review', 'Interview', 'Interview Completed', 'Rejected', 'Passed', 'Failed'],
      default: 'Pending Review',
    },

    // Set by admin once the application is in the "Interview" stage.
    // Must reference a User with role "mentor".
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Populated by the mentor during the interview stage (Day 2 Phase 3).
    // Populated by the mentor during the interview stage. Each entry
    // snapshots the question's text and maxScore at submission time, so
    // later edits/deletions to InterviewQuestion never alter a completed
    // interview's record.
    interviewAnswers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InterviewQuestion',
        },
        questionText: { type: String, required: true },
        maxScore: { type: Number, required: true },
        score: { type: Number, required: true, min: 0 },
      },
    ],

    // The mentor's overall note explaining the scores given above.
    interviewNote: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Application', applicationSchema);
