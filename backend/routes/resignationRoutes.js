// import express from 'express';
// import {
//   createResignation,
//   getAllResignations,
//   updateResignation,
//   deleteResignation,
//   sendEmail,
// } from '../controllers/resignationController.js';

// const router = express.Router();

// router.post('/', createResignation);
// router.get('/', getAllResignations);
// router.put('/:id', updateResignation);
// router.delete('/:id', deleteResignation);
// router.post('/email', sendEmail);

// export default router;

import express from 'express';
import {
  createResignation,
  getAllResignations,
  getResignationsByUser,
  updateResignation,
  deleteResignation,
  sendEmail,
} from '../controllers/resignationController.js';

const router = express.Router();

router.post('/', createResignation);
router.get('/', getAllResignations);
router.get('/user/:userId', getResignationsByUser);
router.put('/:id', updateResignation);
router.delete('/:id', deleteResignation);
router.post('/email', sendEmail);

export default router;
