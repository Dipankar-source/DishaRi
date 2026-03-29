const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const auth = require('../middlewares/auth');

// All routine routes require authentication
router.use(auth);

// Test route
router.get('/test', (req, res) => res.json({ success: true, message: 'Routine router is working' }));

// Suggest a routine based on inputs
router.post('/suggest', routineController.suggestRoutine);

// Confirm routine and generate final roadmap
router.post('/confirm', routineController.confirmRoutineAndRoadmap);

module.exports = router;
