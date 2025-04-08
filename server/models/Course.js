const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  professor: { type: String, required: true },
  schedule: { type: String, required: true },
  credits: { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);