const User = require('../database/User');
const DashboardStats = require('../database/DashboardStats');
const Test = require('../database/Test');
const Subject = require('../database/Subject');
const Roadmap = require('../database/Roadmap');
const UploadedDocument = require('../database/UploadedDocument');

// Get user dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId)
      .populate('dashboard.subjectStats.subject', 'name');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await DashboardStats.findOne({ user: userId })
      .populate('subjectStats.subject', 'name');

    if (!stats) {
      // Create initial stats if doesn't exist
      const newStats = new DashboardStats({
        user: userId
      });
      await newStats.save();
      return res.json(newStats);
    }

    // Fetch roadmap count
    const totalRoadmaps = await Roadmap.countDocuments({ createdBy: userId });
    
    // Fetch document count
    const totalDocuments = await UploadedDocument.countDocuments({ user: userId });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        xp: user.xp || 0
      },
      stats: {
        ...stats.toObject(),
        totalRoadmaps,
        totalDocuments
      },
      userDashboard: user.dashboard
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Update test score and stats
const updateTestScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { score, totalQuestions, correctAnswers, testType } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user dashboard
    user.dashboard.totalTests += 1;
    user.dashboard.totalScore += score;
    user.dashboard.averageScore = user.dashboard.totalScore / user.dashboard.totalTests;
    
    if (score > (user.dashboard.bestScore || 0)) {
      user.dashboard.bestScore = score;
    }

    user.dashboard.testsSeries.push({
      date: new Date(),
      score,
      totalQuestions,
      correctAnswers,
      testType
    });

    // Keep only last 50 tests
    if (user.dashboard.testsSeries.length > 50) {
      user.dashboard.testsSeries = user.dashboard.testsSeries.slice(-50);
    }

    await user.save();

    // Update DashboardStats
    let stats = await DashboardStats.findOne({ user: userId });
    if (!stats) {
      stats = new DashboardStats({ user: userId });
    }

    stats.testStats.totalTests += 1;
    if (testType === 'practice') stats.testStats.practiceTests += 1;
    else if (testType === 'grand') stats.testStats.grandTests += 1;

    stats.testStats.totalScore += score;
    stats.testStats.averageScore = stats.testStats.totalScore / stats.testStats.totalTests;
    
    if (score > (stats.testStats.bestScore || 0)) {
      stats.testStats.bestScore = score;
    }
    if (score < (stats.testStats.worstScore || Infinity)) {
      stats.testStats.worstScore = score;
    }

    stats.testStats.accuracyRate = (correctAnswers / totalQuestions) * 100;

    // Add to performance trend
    stats.performanceTrend.push({
      date: new Date(),
      averageScore: stats.testStats.averageScore,
      testsCompleted: stats.testStats.totalTests
    });

    // Keep only last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    stats.performanceTrend = stats.performanceTrend.filter(trend => 
      new Date(trend.date) > thirtyDaysAgo
    );

    stats.lastUpdated = new Date();
    await stats.save();

    res.json({
      message: 'Test score updated successfully',
      stats: stats
    });
  } catch (error) {
    console.error('Update test score error:', error);
    res.status(500).json({ error: 'Failed to update test score' });
  }
};

// Get test history
const getTestHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, offset = 0 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const testHistory = user.dashboard.testsSeries
      .sort((a, b) => b.date - a.date)
      .slice(offset, offset + parseInt(limit));

    res.json({
      total: user.dashboard.testsSeries.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      tests: testHistory
    });
  } catch (error) {
    console.error('Get test history error:', error);
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
};

// Get performance data for graphs
const getPerformanceData = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const stats = await DashboardStats.findOne({ user: userId })
      .populate('subjectStats.subject', 'name');

    if (!stats) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const performanceData = stats.performanceTrend.filter(trend =>
      new Date(trend.date) >= startDate
    );

    res.json({
      performanceTrend: performanceData,
      subjectStats: stats.subjectStats,
      testStats: stats.testStats
    });
  } catch (error) {
    console.error('Get performance data error:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
};

// Get subject-wise stats
const getSubjectStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await DashboardStats.findOne({ user: userId })
      .populate('subjectStats.subject', 'name description');

    if (!stats) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    res.json(stats.subjectStats);
  } catch (error) {
    console.error('Get subject stats error:', error);
    res.status(500).json({ error: 'Failed to fetch subject stats' });
  }
};

module.exports = {
  getDashboardStats,
  updateTestScore,
  getTestHistory,
  getPerformanceData,
  getSubjectStats
};