const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  email: { type: String, required: true }, // Denormalized for easy table fetching
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Student', studentSchema);
