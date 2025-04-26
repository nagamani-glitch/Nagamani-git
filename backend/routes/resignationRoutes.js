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
// Add or update this route
router.post('/email', async (req, res) => {
  try {
    const result = await sendResignationEmail(req.body);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

export default router;
