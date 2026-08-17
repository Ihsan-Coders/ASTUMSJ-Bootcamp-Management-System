const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
