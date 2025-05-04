import { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters'],
    minlength: [3, 'Course name must be at least 3 characters'],
    match: [/^[a-zA-Z0-9\s\-&]+$/, 'Course name contains invalid characters']
  },
  professor: { 
    type: String, 
    required: [true, 'Professor name is required'],
    trim: true,
    maxlength: [100, 'Professor name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s\-.,']+$/, 'Professor name contains invalid characters']
  },
  schedule: {
    type: String,
    required: [true, 'Schedule is required'],
    trim: true,
    maxlength: [100, 'Schedule cannot exceed 100 characters'],
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Credits must be an integer value'
    }
  },
  description: {
    type: String,
    maxlength: [100, 'Description cannot exceed 500 characters'],
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// virtual for hometasks count
CourseSchema.virtual('hometasks', {
  ref: 'Hometask',
  localField: '_id',
  foreignField: 'courseId',
  options: { sort: { deadline: 1 } }
});

// virtual for pending hometasks count
CourseSchema.virtual('pendingHometasks', {
  ref: 'Hometask',
  localField: '_id',
  foreignField: 'courseId',
  match: { status: 'pending' }
});

// indexes for better query performance
CourseSchema.index({ name: 1 });
CourseSchema.index({ professor: 1 });
CourseSchema.index({ code: 1 }, { unique: true });
CourseSchema.index({ credits: 1 });

export default model('Course', CourseSchema);