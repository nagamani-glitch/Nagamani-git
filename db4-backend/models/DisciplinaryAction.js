import mongoose from 'mongoose';

const disciplinaryActionSchema = new mongoose.Schema({
  employee: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Warning', 'Suspension', 'Termination', 'Written Notice']
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Warning', 'Suspension', 'Termination', 'Written Notice']
  },
  attachments: {
    filename: String,
    path: String,
    originalName: String,
    mimetype: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

disciplinaryActionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('DisciplinaryAction', disciplinaryActionSchema);
