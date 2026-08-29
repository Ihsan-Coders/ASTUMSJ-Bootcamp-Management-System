const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: false },
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },

    // At most one batch should have this true at a time — enforced in
    // the controller (setAcceptingBatch), not at the schema level. When
    // Admin accepts an applicant, this is the batch the new Student is
    // placed into automatically.
    isAcceptingApplicants: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
