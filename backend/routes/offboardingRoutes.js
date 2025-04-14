import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import {
  getAllOffboardings,
  getOffboardingById,
  createOffboarding,
  updateOffboarding,
  deleteOffboarding,
  getOffboardingsByStage,
  getOffboardingsByDepartment,
  getOffboardingsByManager,
  updateAssetStatus,
  updateClearanceStatus,
  moveToNextStage,
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
  getOffboardingStats
} from '../controllers/offboardingController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only certain file types
  const allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Basic CRUD routes
router.get('/', getAllOffboardings);
router.get('/:id', getOffboardingById);
router.post('/', createOffboarding);
router.put('/:id', updateOffboarding);
router.delete('/:id', deleteOffboarding);

// Filter routes
router.get('/stage/:stage', getOffboardingsByStage);
router.get('/department/:department', getOffboardingsByDepartment);
router.get('/manager/:manager', getOffboardingsByManager);

// Asset management routes
router.post('/asset/update-status', updateAssetStatus);

// Clearance management routes
router.post('/clearance/update-status', updateClearanceStatus);

// Stage management routes
router.post('/move-to-next-stage', moveToNextStage);

// Document management routes
router.post('/documents/upload', upload.single('file'), uploadDocument);
router.get('/:id/documents', getDocuments);
router.get('/:id/documents/:documentId/download', downloadDocument);
router.delete('/:id/documents/:documentId', deleteDocument);

// Statistics route
router.get('/stats/overview', getOffboardingStats);

export default router;
