import DisciplinaryAction from '../models/DisciplinaryAction.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/disciplinary';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

// Get all disciplinary actions with optional filtering
export const getAllActions = async (req, res) => {
  try {
    const { searchQuery, status } = req.query;
    
    let query = {};
    
    if (searchQuery) {
      query = {
        $or: [
          { employee: { $regex: searchQuery, $options: 'i' } },
          { action: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { employeeId: { $regex: searchQuery, $options: 'i' } },
          { department: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const actions = await DisciplinaryAction.find(query).sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new disciplinary action
export const createAction = async (req, res) => {
  try {
    const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
    const newAction = new DisciplinaryAction({
      employee,
      action,
      description,
      startDate,
      status,
      employeeId,
      email,
      department,
      designation
    });
    
    if (req.file) {
      newAction.attachments = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    
    await newAction.save();
    res.status(201).json(newAction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single disciplinary action
export const getAction = async (req, res) => {
  try {
    const action = await DisciplinaryAction.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a disciplinary action
export const updateAction = async (req, res) => {
  try {
    const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
    const updatedAction = {
      employee,
      action,
      description,
      startDate,
      status,
      employeeId,
      email,
      department,
      designation
    };
    
    if (req.file) {
      // Delete old file if exists
      const oldAction = await DisciplinaryAction.findById(req.params.id);
      if (oldAction.attachments && oldAction.attachments.path) {
        fs.unlink(oldAction.attachments.path, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      
      updatedAction.attachments = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    
    const result = await DisciplinaryAction.findByIdAndUpdate(
      req.params.id,
      updatedAction,
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a disciplinary action
export const deleteAction = async (req, res) => {
  try {
    const action = await DisciplinaryAction.findById(req.params.id);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Delete attachment if exists
    if (action.attachments && action.attachments.path) {
      fs.unlink(action.attachments.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    await DisciplinaryAction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Action deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download attachment
export const downloadAttachment = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads/disciplinary', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
