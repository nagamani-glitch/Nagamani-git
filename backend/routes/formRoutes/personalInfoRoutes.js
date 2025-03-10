import express from 'express';
import { savePersonalInfo, getPersonalInfo, upload } from '../../controllers/formControllers/personalInfoController.js';

const router = express.Router();

router.post('/save', upload.single('profileImage'), savePersonalInfo);
router.get('/:employeeId', getPersonalInfo);
router.use('/uploads', express.static('uploads'));

export default router;
