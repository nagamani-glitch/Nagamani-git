// import mongoose from 'mongoose';

// const onboardingSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   jobPosition: {
//     type: String,
//     required: true
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   joiningDate: {
//     type: Date,
//     required: true
//   },
//   portalStatus: {
//     type: String,
//     enum: ['Active', 'Inactive'],
//     default: 'Active'
//   },
//   taskStatus: {
//     type: String,
//     enum: ['Pending', 'Completed'],
//     default: 'Pending'
//   },
//   stage: {
//     type: String,
//     enum: ['Test', 'Interview', 'Offer'],
//     required: true
//   }
// }, {
//   timestamps: true
// });

// const Onboarding = mongoose.model('Onboarding', onboardingSchema);
// export default Onboarding;

import mongoose from 'mongoose';

const onboardingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  jobPosition: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  portalStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  taskStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  stage: {
    type: String,
    enum: ['Test', 'Interview', 'Offer'],
    default: 'Test'
  }
}, {
  timestamps: true
});

const Onboarding = mongoose.model('Onboarding', onboardingSchema);
export default Onboarding;
