// routes/applicantProfileRoutes.js
import express from 'express'
import { getAllApplicantProfiles, 
    createApplicantProfile,
    deleteApplicantProfile,
    batchDeleteApplicantProfiles} from '../controllers/applicantProfileController.js';

const router = express.Router();

router.get('/',getAllApplicantProfiles);
router.post('/',createApplicantProfile);
router.delete('/:id',deleteApplicantProfile);
router.delete('/batch',batchDeleteApplicantProfiles);

export default router
