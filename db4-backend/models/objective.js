// import mongoose from 'mongoose';

// const objectiveSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true 
//   },
//   managers: { 
//     type: Number, 
//     default: 0 
//   },
//   keyResults: { 
//     type: Number, 
//     default: 0 
//   },
//   assignees: { 
//     type: Number, 
//     default: 0 
//   },
//   duration: { 
//     type: String, 
//     required: true 
//   },
//   description: { 
//     type: String, 
//     required: true 
//   },
//   archived: { 
//     type: Boolean, 
//     default: false 
//   },
//   objectiveType: { 
//     type: String, 
//     enum: ['self', 'all'], 
//     required: true 
//   }
// }, { timestamps: true });

// export default mongoose.model('Objective', objectiveSchema);

import mongoose from 'mongoose';

const objectiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  managers: { type: Number, default: 0 },
  keyResults: { type: Number, default: 0 },
  assignees: { type: Number, default: 0 },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  archived: { type: Boolean, default: false },
  objectiveType: { type: String, enum: ['self', 'all'], required: true }
}, { timestamps: true });

export default mongoose.model('Objective', objectiveSchema);
