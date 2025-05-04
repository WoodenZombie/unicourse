import { Schema, model } from 'mongoose';

const HometaskSchema = new Schema({
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course', 
    required: [true, 'Course ID is required'],
    validate: {
      validator: async function(value) {
        if (!value) return false;
        try {
          const course = await model('Course').findById(value).select('_id');
          return !!course;
        } catch (err) {
          return false;
        }
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
        return value > new Date(); 
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
    default: Date.now,
    immutable: true 
  }
}, {
  timestamps: true, 
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v; 
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});


// indexes for better query performance
HometaskSchema.index({ courseId: 1 });
HometaskSchema.index({ status: 1 });
HometaskSchema.index({ deadline: 1 });
HometaskSchema.index({ courseId: 1, status: 1 });

export default model('Hometask', HometaskSchema);