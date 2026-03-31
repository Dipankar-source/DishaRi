const express = require('express');
const { markTopicComplete, updateRoadmapTopicProgress, getUserCoins } = require('../controllers/topicsController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Mark a topic as complete and award ePoints
router.post('/:subjectId/topics/:topicId/complete', auth, markTopicComplete);

// Update roadmap topic progress (video watch percentage)
router.post('/roadmap/:roadmapId/progress', auth, updateRoadmapTopicProgress);

// Get user's ePoints and coins
router.get('/coins/me', auth, getUserCoins);

module.exports = router;
