import express from 'express'
import { getEmployees, createEmployee, registerEmployee } from '../controllers/employeesController.js'
import multer from 'multer'
const router = express.Router();

// Multer configurationn
const upload = multer({ dest: 'uploads/' }); // Stores the image in 'uploads/' folder
// Modify the POST route to include multer upload middleware

router.route('/').get(getEmployees)
.post(upload.single('img'), createEmployee)

router.route('/register')
.post(registerEmployee)

export default router