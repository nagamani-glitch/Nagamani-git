import express from 'express';
import { getAllEmployees, registerEmployee, upload } from '../controllers/employeesController.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.post('/register', upload.single('img'), registerEmployee);

export default router;



// import express from 'express';
// import { getEmployees, registerEmployee, upload } from '../controllers/employeesController.js';

// const router = express.Router();

// router.get('/', getEmployees);
// router.post('/register', upload.single('img'), registerEmployee);

// export default router;
