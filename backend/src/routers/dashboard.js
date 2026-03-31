const express = require('express');
const {
  getDashboardStats,
  updateTestScore,
  getTestHistory,
  getPerformanceData,
  getSubjectStats
} = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.get('/stats', auth, getDashboardStats);
router.post('/test-score', auth, updateTestScore);
router.get('/test-history', auth, getTestHistory);
router.get('/performance', auth, getPerformanceData);
router.get('/subject-stats', auth, getSubjectStats);

module.exports = router;