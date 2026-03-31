const mongoose = require('mongoose');

const roadmapNodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  order: {
    type: Number,
    default: 0
  },
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  skills: [{
    type: String
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      default: 'article'
    },
    thumbnail: String
  }],
  videos: [{
    title: String,
    url: String,
    platform: {
      type: String,
      enum: ['youtube', 'custom', 'imagekit'],
      default: 'youtube'
    },
    thumbnail: String,
    duration: String,
    description: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapNode'
  }],
  estimatedTime: {
    type: String, // e.g., "2 weeks", "5 days"
    default: '1 week'
  }
});

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  category: {
    type: String,
    required: true
    // Flexible category field - can be 'programming', 'Campus Placement', etc.
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  nodes: [roadmapNodeSchema],
  sections: [
    {
      id: String,
      title: String,
      description: String,
      estimatedWeeks: Number,
      topics: [
        {
          id: String,
          title: String,
          description: String,
          difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced']
          },
          estimatedHours: Number,
          subtopics: [String],
          resources: [
            {
              type: String,
              title: String,
              url: String
            }
          ],
          practicalProjects: [String],
          prerequisites: [String],
          importantQuestions: [String],
          interviewTips: [String]
        }
      ]
    }
  ],
  // Topic Progress Tracking (per user per roadmap)
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
      completedAt: Date,
      watchPercentage: {
        type: Number,
        default: 0
      }
    }
  ],
  // Roadmap Status
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  // Current Position in Roadmap Visualization
  currentPositionNodeId: {
    type: String,
    default: null
  },
  // Computed Visualization Data (for efficient rendering)
  visualizationData: mongoose.Schema.Types.Mixed,
  metadata: {},
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  downloadUrl: String,
  pdfUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
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

module.exports = mongoose.model('Roadmap', roadmapSchema);