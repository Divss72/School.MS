const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  schedule: [{
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true },   // HH:MM
    teacher: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('TimeTable', timeTableSchema);
