const mongoose = require('mongoose');

const dashboardStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Test Statistics
  testStats: {
    totalTests: {
      type: Number,
      default: 0
    },
    practiceTests: {
      type: Number,
      default: 0
    },
    grandTests: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    worstScore: {
      type: Number,
      default: 0
    },
    accuracyRate: {
      type: Number,
      default: 0
    },
    complexityStats: {
      easy: { type: Number, default: 0 },
      moderate: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      extreme: { type: Number, default: 0 }
    }
  },
  // Subject-wise stats
  subjectStats: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    testsAttempted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    accuracyRate: {
      type: Number,
      default: 0
    },
    topicsCompleted: {
      type: Number,
      default: 0
    },
    totalTopics: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  }],
  // Time spent on learning
  learningStats: {
    totalHoursSpent: {
      type: Number,
      default: 0
    },
    averageSessionTime: {
      type: Number,
      default: 0
    },
    longestSession: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    bestStreak: {
      type: Number,
      default: 0
    }
  },
  // Achievements
  achievements: [{
    name: String,
    description: String,
    achievedAt: Date,
    badge: String
  }],
  // Performance trend (last 30 days)
  performanceTrend: [{
    date: Date,
    averageScore: Number,
    testsCompleted: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DashboardStats', dashboardStatsSchema);