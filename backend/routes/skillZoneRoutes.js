// import express from 'express';
// import {
//   getAllSkills,
//   addSkill,
//   addCandidate,
//   updateCandidate,
//   deleteCandidate,
//   deleteSkill
// } from '../controllers/skillZoneController.js';

// const router = express.Router();

// // Get all skills
// router.get('/api/skill-zone', getAllSkills);

// // Add a new skill
// router.post('/api/skill-zone', addSkill);

// // Add a candidate to a skill
// // The route should be exactly like this
// router.post('/api/skill-zone/:skillId/candidates', addCandidate);


// // Update a candidate in a skill
// router.put('/api/skill-zone/:skillId/candidates/:candidateId', updateCandidate);

// // Delete a candidate from a skill
// router.delete('/api/skill-zone/:skillId/candidates/:candidateId', deleteCandidate);

// // Delete a skill
// router.delete('/api/skill-zone/:skillId', deleteSkill);

// export default router;

import express from 'express';
import {
  getAllSkills,
  addSkill,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  deleteSkill
} from '../controllers/skillZoneController.js';

const router = express.Router();

// Get all skills
router.get('/api/skill-zone', getAllSkills);

// Add a new skill
router.post('/api/skill-zone', addSkill);

// Add a candidate to a skill
router.post('/api/skill-zone/:skillId/candidates', addCandidate);

// Update a candidate in a skill
router.put('/api/skill-zone/:skillId/candidates/:candidateId', updateCandidate);

// Delete a candidate from a skill
router.delete('/api/skill-zone/:skillId/candidates/:candidateId', deleteCandidate);

// Delete a skill
router.delete('/api/skill-zone/:skillId', deleteSkill);

export default router;
