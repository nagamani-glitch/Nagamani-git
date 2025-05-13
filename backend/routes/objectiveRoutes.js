// import express from 'express';
// import {
//   getObjectives,
//   createObjective,
//   updateObjective,
//   deleteObjective,
//   toggleArchive,
//   getObjectivesByUser
// } from '../controllers/objectiveController.js';

// const router = express.Router();

// router.get('/', getObjectives);
// router.post('/', createObjective);
// router.put('/:id', updateObjective);
// router.delete('/:id', deleteObjective);
// router.options('/:id/archive', (req, res) => {
//     res.header('Access-Control-Allow-Methods', 'PATCH');
//     res.status(204).send();
// });

// router.patch('/:id/archive', toggleArchive);

// // Add a new route to get objectives by userId
// router.get('/user/:userId', getObjectivesByUser);

// export default router;

import express from 'express';
import {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  toggleArchive,
  getObjectivesByUser
} from '../controllers/objectiveController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/', getObjectives);
router.post('/', createObjective);
router.put('/:id', updateObjective);
router.delete('/:id', deleteObjective);

// Handle CORS preflight requests for the archive toggle endpoint
router.options('/:id/archive', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'PATCH');
  res.status(204).send();
});

router.patch('/:id/archive', toggleArchive);

// Add a route to get objectives by userId
router.get('/user/:userId', getObjectivesByUser);

export default router;
