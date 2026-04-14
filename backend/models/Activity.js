const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Sports, Music, Art
  description: { type: String, required: true },
  schedule: { type: String, required: true } // e.g. Every Friday 4PM
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
