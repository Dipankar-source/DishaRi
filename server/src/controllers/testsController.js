const Test = require('../database/Test');
const User = require('../database/User');
const DashboardStats = require('../database/DashboardStats');
const fs = require('fs');
const path = require('path');

const saveTest = async (req, res) => {
  try {
    const { type, subjects, topics, complexity, questions, userAnswers, timeTaken, tabSwitchAttempts = 0, tabSwitchWarnings = 0 } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!type || !complexity || !questions || !userAnswers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const subjectsArray = Array.isArray(subjects) ? subjects.filter(s => s) : [];
    const topicsArray = Array.isArray(topics) ? topics.filter(t => t) : [];
    const maxAllowedWarnings = type === 'grand' ? 1 : 3;
    const isAutoSubmitted = tabSwitchWarnings >= maxAllowedWarnings;

    const test = new Test({
      user: userId,
      type,
      subjects: subjectsArray,
      topics: topicsArray,
      complexity,
      questions,
      userAnswers,
      timeTaken,
      tabSwitchAttempts,
      tabSwitchWarnings,
      autoSubmitted: isAutoSubmitted
    });

    // Generate analysis
    try {
      const analysis = generateTestAnalysis(questions, userAnswers, topicsArray.length > 0 ? topicsArray : questions.map((_, i) => i));
      test.analysis = analysis;
    } catch (err) {
      test.analysis = { strongTopics: [], weakTopics: [], moderateTopics: [] };
    }

    await test.save();

    // Update User Dashboard Summary & XP
    const user = await User.findById(userId);
    let xpGain = 0;
    if (user) {
      user.dashboard.totalTests += 1;
      user.dashboard.totalScore += test.score;
      user.dashboard.averageScore = user.dashboard.totalScore / user.dashboard.totalTests;
      if (test.score > (user.dashboard.bestScore || 0)) {
        user.dashboard.bestScore = test.score;
      }
      user.dashboard.testsSeries.push({
        date: new Date(),
        score: test.score,
        totalQuestions: questions.length,
        correctAnswers: Math.round((test.score / 100) * questions.length),
        testType: type
      });
      if (user.dashboard.testsSeries.length > 50) {
        user.dashboard.testsSeries = user.dashboard.testsSeries.slice(-50);
      }
      
      // Award XP for grand tests with NO violations
      if (test.type === 'grand' && tabSwitchAttempts === 0 && tabSwitchWarnings === 0) {
        xpGain = Math.max(20, Math.round(test.score * 10 + test.accuracy * 0.5));
        user.xp = (user.xp || 0) + xpGain;
      }
      
      await user.save();
    }

    // Update DashboardStats Collection
    let stats = await DashboardStats.findOne({ user: userId });
    if (!stats) {
      stats = new DashboardStats({ user: userId });
    }

    stats.testStats.totalTests += 1;
    if (type === 'practice') stats.testStats.practiceTests += 1;
    else if (type === 'grand') stats.testStats.grandTests += 1;

    stats.testStats.totalScore += test.score;
    stats.testStats.averageScore = stats.testStats.totalScore / stats.testStats.totalTests;
    
    if (test.score > (stats.testStats.bestScore || 0)) stats.testStats.bestScore = test.score;
    if (test.score < (stats.testStats.worstScore || Infinity)) stats.testStats.worstScore = test.score;

    stats.testStats.accuracyRate = ((stats.testStats.accuracyRate * (stats.testStats.totalTests - 1)) + test.accuracy) / stats.testStats.totalTests;
    
    if (complexity && stats.testStats.complexityStats[complexity] !== undefined) {
      stats.testStats.complexityStats[complexity] += 1;
    }

    stats.performanceTrend.push({
      date: new Date(),
      averageScore: stats.testStats.averageScore,
      testsCompleted: stats.testStats.totalTests
    });
    if (stats.performanceTrend.length > 30) stats.performanceTrend = stats.performanceTrend.slice(-30);

    stats.lastUpdated = new Date();
    await stats.save();

    res.status(201).json({
      message: 'Test saved successfully',
      xpGain,
      xpTotal: user?.xp || 0,
      test: {
        _id: test._id,
        score: test.score,
        accuracy: test.accuracy,
        analysis: test.analysis,
        completedAt: test.completedAt,
        tabSwitchAttempts: test.tabSwitchAttempts,
        tabSwitchWarnings: test.tabSwitchWarnings,
        autoSubmitted: test.autoSubmitted
      }
    });
  } catch (error) {
    const errorLogPath = path.join(process.cwd(), 'submission_error.log');
    fs.appendFileSync(errorLogPath, `\n--- ERROR ${new Date().toISOString()} ---\n${error.stack}\n`);
    res.status(500).json({ error: 'Failed to save test', message: error.message });
  }
};

/*
const getTestStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const tests = await Test.find({ user: userId });

    const totalTests = tests.length;
    const averageAccuracy = totalTests > 0
      ? Math.round(tests.reduce((sum, test) => sum + test.accuracy, 0) / totalTests)
      : 0;

    const practiceTests = tests.filter(test => test.type === 'practice').length;
    const grandTests = tests.filter(test => test.type === 'grand').length;

    // Complexity-wise stats
    const complexityStats = {
      easy: tests.filter(t => t.complexity === 'easy').length,
      moderate: tests.filter(t => t.complexity === 'moderate').length,
      hard: tests.filter(t => t.complexity === 'hard').length,
      extreme: tests.filter(t => t.complexity === 'extreme').length
    };

    const recentTests = tests
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    const user = await User.findById(userId);

    res.json({
      totalTests,
      averageAccuracy,
      practiceTests,
      grandTests,
      xp: user?.xp || 0,
      complexityStats,
      recentTests: recentTests.map(test => ({
        type: test.type,
        accuracy: test.accuracy,
        complexity: test.complexity,
        completedAt: test.completedAt
      }))
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
*/

const getTestStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch all tests for this user
    const tests = await Test.find({ user: userId });

    const totalTests = tests.length;

    // 2. Calculate average accuracy safely
    const averageAccuracy = totalTests > 0
      ? Math.round(tests.reduce((sum, test) => sum + (test.accuracy || 0), 0) / totalTests)
      : 0;

    // 3. Count test types (Ensuring keys match Dashboard.jsx expectations)
    const totalPracticeTests = tests.filter(test => test.type === 'practice').length;
    const totalGrandTests = tests.filter(test => test.type === 'grand').length;

    // 4. Complexity-wise stats
    const complexityStats = {
      easy: tests.filter(t => t.complexity === 'easy').length,
      moderate: tests.filter(t => t.complexity === 'moderate').length,
      hard: tests.filter(t => t.complexity === 'hard').length,
      extreme: tests.filter(t => t.complexity === 'extreme').length
    };

    // 5. Get recent tests
    const recentTests = tests
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    const user = await User.findById(userId);

    // 6. Return keys that match Dashboard.jsx: stats?.totalPracticeTests etc.
    res.json({
      totalTests,
      averageAccuracy,
      totalPracticeTests, // Renamed from practiceTests
      totalGrandTests,    // Renamed from grandTests
      xp: user?.xp || 0,
      complexityStats,
      autoSubmittedTests: tests.filter(t => t.autoSubmitted).length,
      totalTabSwitches: tests.reduce((sum, test) => sum + (test.tabSwitchAttempts || 0), 0),
      recentTests: recentTests.map(test => ({
        type: test.type,
        accuracy: test.accuracy,
        complexity: test.complexity,
        completedAt: test.completedAt,
        tabSwitchAttempts: test.tabSwitchAttempts,
        autoSubmitted: test.autoSubmitted
      }))
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTestHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const tests = await Test.find({ user: userId })
      .sort({ completedAt: -1 })
      .populate('subjects', 'name')
      .select('type accuracy completedAt score questions complexity analysis timeTaken tabSwitchAttempts tabSwitchWarnings autoSubmitted');

    res.json(tests);
  } catch (error) {
    console.error('Get test history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getGrandTestEligibility = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('progress.subject');
    const completedSubjects = user.progress.filter(p => p.isCompleted);

    res.json({
      eligible: completedSubjects.length > 0,
      completedSubjects: completedSubjects.map(p => ({
        _id: p.subject._id,
        name: p.subject.name,
        completedAt: p.completedAt
      }))
    });
  } catch (error) {
    console.error('Get grand test eligibility error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to generate test analysis - more robust version
const generateTestAnalysis = (questions, userAnswers, topics) => {
  try {
    // Handle empty cases
    if (!questions || questions.length === 0 || !userAnswers || userAnswers.length === 0) {
      return {
        strongTopics: [],
        weakTopics: [],
        moderateTopics: []
      };
    }

    // If topics don't exist or empty, skip analysis
    if (!topics || topics.length === 0) {
      return {
        strongTopics: [],
        weakTopics: [],
        moderateTopics: []
      };
    }

    const topicPerformance = {};

    // Initialize topic performance
    const validTopics = Array.isArray(topics) ? topics.filter(t => t) : [];

    if (validTopics.length === 0) {
      return {
        strongTopics: [],
        weakTopics: [],
        moderateTopics: []
      };
    }

    validTopics.forEach(topicId => {
      topicPerformance[topicId] = { correct: 0, total: 0 };
    });

    // Calculate performance per topic (simplified - assuming questions are evenly distributed)
    const questionsPerTopic = Math.ceil(questions.length / validTopics.length);
    validTopics.forEach((topicId, index) => {
      const startIndex = index * questionsPerTopic;
      const endIndex = Math.min(index === validTopics.length - 1 ? questions.length : (index + 1) * questionsPerTopic, questions.length);

      for (let i = startIndex; i < endIndex; i++) {
        if (i < questions.length && i < userAnswers.length) {
          topicPerformance[topicId].total++;
          if (userAnswers[i] === questions[i].correctAnswer) {
            topicPerformance[topicId].correct++;
          }
        }
      }
    });

    // Categorize topics
    const strongTopics = [];
    const weakTopics = [];
    const moderateTopics = [];

    Object.entries(topicPerformance).forEach(([topicId, performance]) => {
      if (performance.total > 0) {
        const accuracy = (performance.correct / performance.total) * 100;
        const topicData = { topic: topicId, accuracy: Math.round(accuracy) };

        if (accuracy >= 80) {
          strongTopics.push(topicData);
        } else if (accuracy < 50) {
          weakTopics.push(topicData);
        } else {
          moderateTopics.push(topicData);
        }
      }
    });

    return {
      strongTopics,
      weakTopics,
      moderateTopics
    };
  } catch (error) {
    console.warn('Error in generateTestAnalysis:', error.message);
    return {
      strongTopics: [],
      weakTopics: [],
      moderateTopics: []
    };
  }
};

module.exports = {
  saveTest,
  getTestStats,
  getTestHistory,
  getGrandTestEligibility
};