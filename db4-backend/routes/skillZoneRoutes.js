import express from 'express'
const router = express.Router();
import {
  getSkillZones,
  createSkillZone,
  updateSkillZoneCandidate,
  deleteSkillZoneCandidate,
  deleteSkillZone // include deleteSkillZone
} from '../controllers/skillZoneController.js';

// Routes
router.get('/', getSkillZones); // Fetch all skill zones
router.post('/', createSkillZone); // Create new skill zone
router.put('/:skillZoneId/candidates/:candidateId', updateSkillZoneCandidate); // Edit candidate in a skill zone
router.delete('/:skillZoneId/candidates/:candidateId', deleteSkillZoneCandidate); // Delete candidate from a skill zone

// New route to delete an entire skill zone
router.delete('/:skillZoneId', deleteSkillZone); // Delete skill zone by ID

export default router
