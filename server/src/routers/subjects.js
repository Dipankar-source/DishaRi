const express = require('express');
const { getSubjects, getSubjectTopics, completeTopic, getUserProgress, createSubjectWithAI, deleteSubject, deleteTopic } = require('../controllers/subjectsController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Create subject with AI-generated topics (specific route before general ones)
router.post('/create-with-ai', auth, createSubjectWithAI);

// Delete subject
router.delete('/:id', auth, deleteSubject);

// Delete topic from subject
router.delete('/:subjectId/topics/:topicId', auth, deleteTopic);

// Get all subjects
router.get('/', auth, getSubjects);

// Get topics for a subject
router.get('/:id/topics', auth, getSubjectTopics);

// Mark topic as completed
router.post('/topic/:id/complete', auth, completeTopic);

// Get user progress
router.get('/progress/me', auth, getUserProgress);

module.exports = router;