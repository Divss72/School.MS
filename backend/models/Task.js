const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Submitted'], default: 'Pending' },
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    text: String,
    file: String,
    submittedAt: Date
  }]
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Task', taskSchema);
