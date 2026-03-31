const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
  videoUrl: {
    type: String
  },
  documentationUrl: {
    type: String
  },
  documentationSource: {
    type: String,
    enum: ['geeksforgeeks', 'tutorialspoint', 'wikipedia', 'official docs', 'javatpoint', 'programiz', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedHours: {
    type: Number,
    default: 10
  },
  subtopics: [String],
  additionalResources: [{
    title: String,
    url: String,
    type: {
      type: String,
      default: 'article'
    }
  }],
  practiceProblems: [{
    title: String,
    url: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    }
  }],
  gateWeightage: {
    type: String,
    default: 'medium'
  },
  practicalProjects: [String],
  isCompleted: {
    type: Boolean,
    default: false
  },
  // ePoints Reward for completing this topic
  ePointsReward: {
    type: Number,
    default: 10
  },
  order: {
    type: Number,
    default: 0
  }
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  guidelines: {
    type: String
  },
  icon: {
    type: String,
    default: 'book'
  },
  weightage: {
    type: Number,
    default: 0
  },
  syllabus: {
    type: String,
    enum: ['gate', 'makaut', 'both'],
    default: 'gate'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  topics: [topicSchema],
  totalTopics: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isUserCreated: {
    type: Boolean,
    default: false
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

// Virtual for completion status
subjectSchema.virtual('completionPercentage').get(function() {
  if (this.topics.length === 0) return 0;
  const completedTopics = this.topics.filter(topic => topic.isCompleted).length;
  return Math.round((completedTopics / this.topics.length) * 100);
});

// Update totalTopics when topics change
subjectSchema.pre('save', function(next) {
  this.totalTopics = this.topics.length;
  this.isUserCreated = this.createdBy ? true : false;
  if (this.topics.length > 0) {
    this.isCompleted = this.topics.every(topic => topic.isCompleted);
  }
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);