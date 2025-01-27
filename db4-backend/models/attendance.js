  import mongoose from 'mongoose';

  const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: String, required: true },
    date: { type: Date, required: true },
    day: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String },
    inDate: { type: Date },
    outDate: { type: Date },
    shift: { type: String },
    workType: { type: String },
    minHour: { type: Number },
    atWork: { type: String },
    overtime: { type: String },
    comment: { type: String },
    isSelected: { type: Boolean, default: false }
  }, {
    timestamps: true
  });

  export default mongoose.model('Attendance', attendanceSchema);
