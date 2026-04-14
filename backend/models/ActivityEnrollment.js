const mongoose = require('mongoose');

const activityEnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  note: { type: String } // Interest form response
}, { timestamps: true });

// Prevent duplicate enrollment for same student and activity
activityEnrollmentSchema.index({ studentId: 1, activityId: 1 }, { unique: true });

module.exports = mongoose.model('ActivityEnrollment', activityEnrollmentSchema);
