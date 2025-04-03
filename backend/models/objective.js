// import mongoose from 'mongoose';

// const objectiveSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   managers: { type: Number, default: 0 },
//   keyResults: { type: Number, default: 0 },
//   assignees: { type: Number, default: 0 },
//   duration: { type: String, required: true },
//   description: { type: String, required: true },
//   archived: { type: Boolean, default: false },
//   objectiveType: { type: String, enum: ['self', 'all'], required: true }
// }, { timestamps: true });

// export default mongoose.model('Objective', objectiveSchema);

import mongoose from 'mongoose';

const objectiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  managers: [{ type: String }], // Array of manager names as strings
  keyResults: { type: Number, default: 0 },
  assignees: [{ type: String }], // Array of assignee names as strings
  duration: { type: String, required: true },
  description: { type: String, required: true },
  archived: { type: Boolean, default: false },
  objectiveType: { type: String, enum: ['self', 'all'], required: true }
}, { timestamps: true });

// Virtual property to get manager count
objectiveSchema.virtual('managerCount').get(function() {
  return this.managers.length;
});

// Virtual property to get assignee count
objectiveSchema.virtual('assigneeCount').get(function() {
  return this.assignees.length;
});

// Make sure virtuals are included when converting to JSON
objectiveSchema.set('toJSON', { virtuals: true });
objectiveSchema.set('toObject', { virtuals: true });

export default mongoose.model('Objective', objectiveSchema);
