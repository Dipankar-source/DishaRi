const express = require('express');
const { generateQuestions } = require('../controllers/geminiController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Generate questions using Gemini AI
router.post('/generate-questions', auth, generateQuestions);

module.exports = router;