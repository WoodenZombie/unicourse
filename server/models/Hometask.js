const mongoose = require('mongoose');

const HometaskSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: [true, 'Course ID is required'],
    validate: {
      validator: async function(value) {
        const course = await mongoose.model('Course').findById(value);
        return course !== null;
      },
      message: 'Course with this ID does not exist'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [100, 'Description cannot exceed 100 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Deadline must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Виртуальное поле для вычисления "просрочено ли задание"
HometaskSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' && this.deadline < Date.now();
});

// Индекс для ускорения поиска по курсу и статусу
HometaskSchema.index({ courseId: 1, status: 1 });

module.exports = mongoose.model('Hometask', HometaskSchema);