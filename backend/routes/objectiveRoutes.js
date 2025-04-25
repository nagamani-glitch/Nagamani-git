// import express from 'express';
// import {
//   getObjectives,
//   createObjective,
//   updateObjective,
//   deleteObjective,
//   toggleArchive
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

const router = express.Router();

router.get('/', getObjectives);
router.post('/', createObjective);
router.put('/:id', updateObjective);
router.delete('/:id', deleteObjective);
router.options('/:id/archive', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'PATCH');
    res.status(204).send();
});

router.patch('/:id/archive', toggleArchive);

// Add a new route to get objectives by userId
router.get('/user/:userId', getObjectivesByUser);

export default router;
