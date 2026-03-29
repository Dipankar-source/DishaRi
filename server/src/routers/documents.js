const express = require('express');
const {
  upload,
  uploadDocument,
  getUserDocuments,
  getPublicDocuments,
  downloadDocument,
  deleteDocument,
  shareDocument
} = require('../controllers/documentController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/public', getPublicDocuments);

// Protected routes
router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/user', auth, getUserDocuments);
router.post('/:id/download', downloadDocument);
router.delete('/:id', auth, deleteDocument);
router.post('/:id/share', auth, shareDocument);

module.exports = router;