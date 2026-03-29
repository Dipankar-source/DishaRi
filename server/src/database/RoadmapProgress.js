const mongoose = require('mongoose');

const roadmapProgressSchema = new mongoose.Schema({
  // Which user's progress is this tracking
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Which roadmap is this progress for
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  // Track progress per topic in the roadmap
  topicProgress: [
    {
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject.topics'
      },
      isCompleted: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      },
      watchPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }
  ],
  // Track section progress
  sectionProgress: [
    {
      sectionId: String,
      isCompleted: {
        type: Boolean,
        default: false
      },
      completedTopicsCount: {
        type: Number,
        default: 0
      },
      totalTopicsCount: {
        type: Number,
        default: 0
      },
      completedAt: Date
    }
  ],
  // Current position in roadmap visualization
  currentPositionNodeId: {
    type: String,
    default: null
  },
  // Overall roadmap progress status
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  // Overall completion percentage
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // First accessed date
  firstAccessedAt: {
    type: Date,
    default: Date.now
  },
  // Last accessed date
  lastAccessedAt: {
    type: Date
  },
  // Completion date
  completedAt: {
    type: Date
  },
  // Total time spent (in minutes)
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
roadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

// Update timestamp before saving
roadmapProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RoadmapProgress', roadmapProgressSchema);
