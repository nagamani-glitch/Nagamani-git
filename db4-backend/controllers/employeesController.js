import multer from 'multer';
import path from 'path';
import fs from 'fs';
import EmployeeRegister from '../models/employeeRegisterModel.js';

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeRegister.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerEmployee = async (req, res) => {
  try {
    const formData = JSON.parse(req.body.data);
    const imgPath = req.file ? `/uploads/${req.file.filename}` : '';

    const newEmployee = new EmployeeRegister({
      ...formData,
      img: imgPath,
      createdAt: new Date()
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json({
      success: true,
      data: savedEmployee
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};


// import multer from 'multer';
// import path from 'path';
// import EmployeeRegister from '../models/employeeRegisterModel.js';

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// export const upload = multer({ storage });

// // Controller functions
// export const getEmployees = async (req, res) => {
//   try {
//     const employees = await EmployeeRegister.find();
//     res.status(200).json(employees);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const registerEmployee = async (req, res) => {
//   try {
//     const formData = JSON.parse(req.body.data);
//     const imgPath = req.file ? `/uploads/${req.file.filename}` : '';

//     const newEmployee = new EmployeeRegister({
//       ...formData,
//       img: imgPath
//     });

//     const savedEmployee = await newEmployee.save();
//     res.status(201).json(savedEmployee);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// import Employee from "../models/employeeModel.js";
// import employeeRegisterModel from "../models/employeeRegisterModel.js";

// const getEmployees = async (req, res) => {
//     const employees = await Employee.find({}).lean();
//     res.json(employees);
// };

// const createEmployee = async (req, res) => {
//     const { name, email, dob, phone, location, role, department, Emp_ID } = req.body;

//     // Check if all fields are provided except the image (handled separately)
//     if (!name || !email || !dob || !phone || !location || !role || !department || !Emp_ID) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Get the image path (uploaded by multer)
//     const img = `/uploads/${req.file.filename}`; // File path for the uploaded image

//     try {
//         const employee = new Employee({
//             name,
//             email,
//             dob,
//             img, // Store the image URL/path
//             phone,
//             location,
//             role,
//             department,
//             Emp_ID,
//         });

//         const createdEmployee = await employee.save();
//         res.status(201).json(createdEmployee);
//     } catch (error) {
//         console.error('Error creating employee:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };

// // const registerEmployee = async(req, res) => {
// //     try {
// //         const newEmployee = new employeeRegisterModel({
// //             user: req.user._id, // Add user reference
// //             ...req.body
// //         });
// //         await newEmployee.save();
// //         res.status(201).json({
// //             message: "Employee Registered successfully",
// //             employee: newEmployee
// //         });
// //     } catch(error) {
// //         res.status(500).json({
// //             message: "Error registering employee",
// //             error: error.message
// //         });
// //     }
// // };

// const registerEmployee = async (req, res) => {
//     console.log('Registration data:', req.body);
//     try {
//       const employee = await Employee.create(req.body);
//       console.log('Created employee:', employee);
//       res.status(201).json(employee);
//     } catch (error) {
//       console.log('Registration error:', error);
//       res.status(500).json({ message: 'Error registering employee', error: error.message });
//     }
//   };
  


// export { getEmployees, createEmployee, registerEmployee};
