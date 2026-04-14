const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examName: { type: String, required: true },
  subjects: [{
    subjectName: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true }
  }],
  totalPercentage: { type: Number, required: true },
  grade: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
