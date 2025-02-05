import multer from 'multer';
import path from 'path';
import fs from 'fs';
import EmployeeRegister from '../models/employeeRegisterModel.js';

// Create upload directories
const uploadDir = 'uploads';
const profileDir = path.join(uploadDir, 'profile');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, extname);
  }
});

export const registerEmployee = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Profile image is required'
      });
    }

    const employeeData = JSON.parse(req.body.data);
    const employee = new EmployeeRegister({
      ...employeeData,
      img: `profile/${req.file.filename}`
    });

    const savedEmployee = await employee.save();
    res.status(201).json({
      success: true,
      data: savedEmployee
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

  

export const getAllEmployees = async (req, res) => {
  try {
      const employees = await EmployeeRegister.find();
      res.json(employees);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await EmployeeRegister.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

