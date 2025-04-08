import mongoose from 'mongoose';

const applicantProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
  status: {
    type: String,
    enum: ['Hired', 'Not-Hired'],
    default: 'Not-Hired',
  },
  color: {
    type: String,
    default: '#ff9800',
  },
  employeeId: {
    type: String,
    default: '',
  },
});

const ApplicantProfile = mongoose.model('ApplicantProfile', applicantProfileSchema);

export default ApplicantProfile
