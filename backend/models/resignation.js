// import mongoose from 'mongoose';

// const resignationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   position: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ['Approved', 'Requested', 'Rejected'],
//     default: 'Requested'
//   },
//   description: { type: String, required: true }
// }, { timestamps: true });

// export default mongoose.model('Resignation', resignationSchema);

import mongoose from 'mongoose';

const resignationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Approved', 'Requested', 'Rejected', 'Pending'],
    default: 'Requested'
  },
  description: { type: String, required: true },
  userId: { type: String },
  reviewNotes: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Resignation', resignationSchema);
