const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // Dashboard Stats
  dashboard: {
    totalTests: {
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
    testsSeries: [{
      date: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        required: true
      },
      totalQuestions: {
        type: Number,
        required: true
      },
      correctAnswers: {
        type: Number,
        required: true
      },
      testType: {
        type: String,
        enum: ['practice', 'grand']
      }
    }],
    subjectStats: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      },
      testsAttempted: {
        type: Number,
        default: 0
      },
      averageScoreInSubject: {
        type: Number,
        default: 0
      }
    }]
  },
  // Learning Progress
  progress: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    completedTopics: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }],
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  // Roadmap status
  roadmaps: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    lastAccessed: {
      type: Date
    }
  }],
  // Active Roadmap
  activeRoadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    default: null
  },
  // ePoints/Coins/XP System
  ePoints: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  // Uploaded Documents
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadedDocument'
  }],
  // Profile Info
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  avatar: {
    type: String // URL or Base64
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 500
  },
  streak: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Novice'
  },
  xpToNext: {
    type: Number,
    default: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total completed subjects
userSchema.virtual('completedSubjectsCount').get(function() {
  return this.progress.filter(p => p.isCompleted).length;
});

// Virtual for total completed topics
userSchema.virtual('completedTopicsCount').get(function() {
  return this.progress.reduce((total, subject) => total + subject.completedTopics.length, 0);
});

// Update timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);