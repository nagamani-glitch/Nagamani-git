import express from 'express';
import { getAllEmployees, registerEmployee, getEmployeeById, upload } from '../controllers/employeesController.js';

const router = express.Router();


router.post('/register', upload.single('img'), registerEmployee);
router.use('/uploads', express.static('uploads'));
router.get('/all', getAllEmployees);
router.get('/:id', getEmployeeById);

export default router;



// import express from 'express';
// import { getEmployees, registerEmployee, upload } from '../controllers/employeesController.js';

// const router = express.Router();

// router.get('/', getEmployees);
// router.post('/register', upload.single('img'), registerEmployee);

// export default router;
