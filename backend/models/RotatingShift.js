// // import mongoose from 'mongoose';

// // const rotatingShiftSchema = new mongoose.Schema({
// //   userId: {
// //     type: String,
// //     required: true // Add userId as a required field
// //   },
// //   name: {
// //     type: String,
// //     required: true
// //   },
// //   employeeCode: {
// //     type: String,
// //     required: true
// //   },
// //   requestedShift: {
// //     type: String,
// //     required: true
// //   },
// //   currentShift: {
// //     type: String,
// //     required: true
// //   },
// //   requestedDate: {
// //     type: Date,
// //     required: true
// //   },
// //   requestedTill: {
// //     type: Date,
// //     required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['Pending', 'Approved', 'Rejected'],
// //     default: 'Pending'
// //   },
// //   description: String,
// //   isPermanentRequest: {
// //     type: Boolean,
// //     default: false
// //   },
// //   isForReview: {
// //     type: Boolean,
// //     default: true
// //   },
// //   // Keep isAllocated for backward compatibility
// //   isAllocated: {
// //     type: Boolean,
// //     default: false
// //   },
// //   reviewedBy: String,
// //   reviewedAt: Date,
// //   reviewComment: String
// // }, {
// //   timestamps: true
// // });

// // export default mongoose.model('RotatingShift', rotatingShiftSchema);


// import mongoose from 'mongoose';

// const rotatingShiftSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   employeeCode: {
//     type: String,
//     required: true
//   },
//   requestedShift: {
//     type: String,
//     required: true
//   },
//   currentShift: {
//     type: String,
//     required: true
//   },
//   requestedDate: {
//     type: Date,
//     required: true
//   },
//   requestedTill: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending'
//   },
//   description: String,
//   isPermanentRequest: {
//     type: Boolean,
//     default: false
//   },
//   isForReview: {
//     type: Boolean,
//     default: true
//   },
//   isAllocated: {
//     type: Boolean,
//     default: false
//   },
//   reviewedBy: String,
//   reviewedAt: Date,
//   reviewComment: String,
//   notificationSent: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('RotatingShift', rotatingShiftSchema);



import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['rotating-shift', 'shift-request', 'leave-request', 'work-type-request', 'system']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'updated', 'deleted'],
    default: 'pending'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RotatingShift',
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
