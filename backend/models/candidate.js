import mongoose from 'mongoose';

// Candidate schema definition
const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    column: { type: String, required: true },
    stars: { type: Number, required: true },
    recruitment: { type: String, required: true }, // Recruitment drive, e.g., 'Recruitment Drive'
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
