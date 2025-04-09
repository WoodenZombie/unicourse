const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Course name is required'],
    maxlength: [100, 'Name of the course cannot exceed 100 characters']
  },
  professor: { 
    type: String, 
    required: [true, 'Professor name is required'],
    maxlength: [100, 'Professor\'s name cannot exceed 100 characters']
  },
  schedule: {
    type: String,
    required: [true, 'Schedule is required'],
    maxlength: [100, 'Schedule cannot exceed 100 characters']
  },
  credits: {
    type: Number,
    min: [1, 'Credits must be at least 1']
  },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);