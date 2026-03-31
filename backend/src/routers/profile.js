const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.get('/me', auth, getProfile);
router.patch('/update', auth, updateProfile);

module.exports = router;
