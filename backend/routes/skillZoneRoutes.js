// import express from 'express'
// const router = express.Router();
// import {
//   getSkillZones,
//   createSkillZone,
//   updateSkillZoneCandidate,
//   deleteSkillZoneCandidate,
//   deleteSkillZone // include deleteSkillZone
// } from '../controllers/skillZoneController.js';

// // Routes
// router.get('/', getSkillZones); // Fetch all skill zones
// router.post('/', createSkillZone); // Create new skill zone
// router.put('/:skillZoneId/candidates/:candidateId', updateSkillZoneCandidate); // Edit candidate in a skill zone
// router.delete('/:skillZoneId/candidates/:candidateId', deleteSkillZoneCandidate); // Delete candidate from a skill zone

// // New route to delete an entire skill zone
// router.delete('/:skillZoneId', deleteSkillZone); // Delete skill zone by ID

// export default router

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
// The route should be exactly like this
router.post('/api/skill-zone/:skillId/candidates', addCandidate);


// Update a candidate in a skill
router.put('/api/skill-zone/:skillId/candidates/:candidateId', updateCandidate);

// Delete a candidate from a skill
router.delete('/api/skill-zone/:skillId/candidates/:candidateId', deleteCandidate);

// Delete a skill
router.delete('/api/skill-zone/:skillId', deleteSkill);

export default router;
