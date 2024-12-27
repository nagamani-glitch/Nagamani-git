import express from 'express'
import multer from 'multer'
import { loginAuth, registerAuth } from '../controllers/authController.js';
const router = express.Router();

// Multer configuration
const upload = multer({ dest: 'uploads/' }); // Stores the image in 'uploads/' folder
// Modify the POST route to include multer upload middleware

router.route('/login').post(loginAuth)
router.route('/register')
.post(registerAuth)

export default router