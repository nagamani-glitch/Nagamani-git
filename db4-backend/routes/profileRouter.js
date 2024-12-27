import express from 'express';
import { getUserProfile, updateUserProfile, getAllProfiles } from '../controllers/profileController.js';

const router = express.Router();
router.get('/profile/:id', getUserProfile);
router.get('/all', getAllProfiles)
router.put('/profile/:id', updateUserProfile);

export default router
