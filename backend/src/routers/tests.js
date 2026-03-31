const express = require('express');
const { saveTest, getTestStats, getTestHistory, getGrandTestEligibility } = require('../controllers/testsController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Save test results
router.post('/save', auth, saveTest);

// Get test statistics
router.get('/stats', auth, getTestStats);

// Get test history
router.get('/history', auth, getTestHistory);

// Check grand test eligibility
router.get('/grand/eligibility', auth, getGrandTestEligibility);

module.exports = router;