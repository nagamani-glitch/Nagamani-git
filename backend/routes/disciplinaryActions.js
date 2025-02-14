import express from 'express';
import {
  getAllActions,
  createAction,
  updateAction,
  deleteAction,
  downloadFile
} from '../controllers/disciplinaryActionController.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.get('/', getAllActions);
router.post('/', upload.single('attachments'), createAction);
router.put('/:id', upload.single('attachments'), updateAction);
router.delete('/:id', deleteAction);
router.get('/download/:filename', downloadFile);

export default router;
