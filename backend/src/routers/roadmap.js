const express = require('express');
const multer = require('multer');
const {
  generateRoadmapFromForm,
  generateRoadmapWithAI,
  createRoadmap,
  getAllRoadmaps,
  getRoadmap,
  updateRoadmapProgress,
  updateTopicProgress,
  downloadRoadmapPDF,
  getUserRoadmapProgress,
  getUserRoadmaps,
  getUserRoadmapById
} = require('../controllers/roadmapController');
const auth = require('../middlewares/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, CSV, and Word documents are allowed'));
    }
  }
});

const router = express.Router();

// Protected routes (specific routes first)
router.post('/generate', auth, upload.array('documents', 5), generateRoadmapFromForm);
router.post('/generate-ai', auth, generateRoadmapWithAI);
router.post('/create', auth, createRoadmap);
router.post('/progress', auth, updateRoadmapProgress);
router.post('/topic-progress', auth, updateTopicProgress);
router.get('/user/progress', auth, getUserRoadmapProgress);
router.get('/user/roadmaps', auth, getUserRoadmaps);
router.get('/user/:roadmapId', auth, getUserRoadmapById);

// Public routes (general routes last)
router.get('/', getAllRoadmaps);
router.get('/download/:id', downloadRoadmapPDF);
router.get('/:id', getRoadmap);

module.exports = router;