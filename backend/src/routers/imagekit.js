const express = require('express');
const { getImageKitAuth } = require('../controllers/imagekitController');

const router = express.Router();

// Public route - no auth required for ImageKit token generation
router.get('/auth', getImageKitAuth);

module.exports = router;
