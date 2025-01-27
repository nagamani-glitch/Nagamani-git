import Attendance from '../models/attendance.js';

export const AttendanceController = {
  getAllAttendance: async (req, res) => {
    try {
      const attendance = await Attendance.find().sort({ date: -1 });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createAttendance: async (req, res) => {
    try {
      const attendance = new Attendance({
        ...req.body,
        day: new Date(req.body.date).toLocaleDateString('en-US', { weekday: 'long' })
      });
      const newAttendance = await attendance.save();
      res.status(201).json(newAttendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          day: new Date(req.body.date).toLocaleDateString('en-US', { weekday: 'long' })
        },
        { new: true }
      );
      
      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Record not found' });
      }
      
      res.json(updatedAttendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchAttendance: async (req, res) => {
    const { searchTerm } = req.query;
    try {
      const attendance = await Attendance.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { empId: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  bulkUpdateSelection: async (req, res) => {
    const { ids, isSelected } = req.body;
    try {
      await Attendance.updateMany(
        { _id: { $in: ids } },
        { $set: { isSelected } }
      );
      res.json({ message: 'Selection updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      await Attendance.findByIdAndDelete(req.params.id);
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};