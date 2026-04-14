const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Announcement', 'Holiday', 'Exam'], required: true },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Notice', noticeSchema);
