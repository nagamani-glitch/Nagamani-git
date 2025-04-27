// import mongoose from 'mongoose';

// const notificationSchema = new mongoose.Schema({
//   message: {
//     type: String,
//     required: true
//   },
//   time: {
//     type: Date,
//     default: Date.now
//   },
//   type: {
//     type: String,
//     default: 'info'
//   },
//   read: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     default: null
//   },
//   userId: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Notification', notificationSchema);

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
