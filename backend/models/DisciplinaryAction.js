import mongoose from 'mongoose';

const disciplinaryActionSchema = new mongoose.Schema({
  employee: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
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
    required: true
  },
  attachments: {
    filename: String,
    originalName: String,
    path: String
  },
  // Add employee reference fields
  employeeId: {
    type: String
  },
  email: {
    type: String
  },
  department: {
    type: String
  },
  designation: {
    type: String
  }
}, { timestamps: true });

const DisciplinaryAction = mongoose.model('DisciplinaryAction', disciplinaryActionSchema);

export default DisciplinaryAction;
