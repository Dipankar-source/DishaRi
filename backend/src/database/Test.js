const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String
  }
});

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['practice', 'grand'],
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  topics: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  complexity: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'extreme', 'mixed'],
    required: true
  },
  questions: [questionSchema],
  userAnswers: [{
    type: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // in minutes
    default: 0
  },
  tabSwitchAttempts: {
    type: Number,
    default: 0
  },
  tabSwitchWarnings: {
    type: Number,
    default: 0
  },
  autoSubmitted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  analysis: {
    strongTopics: [{
      topic: {
        type: mongoose.Schema.Types.Mixed
      },
      accuracy: Number
    }],
    weakTopics: [{
      topic: {
        type: mongoose.Schema.Types.Mixed
      },
      accuracy: Number
    }],
    moderateTopics: [{
      topic: {
        type: mongoose.Schema.Types.Mixed
      },
      accuracy: Number
    }]
  }
});

// Calculate score and accuracy before saving
testSchema.pre('save', function (next) {
  try {
    console.log('Pre-save hook - Test calculation');
    console.log('Questions count:', this.questions?.length);
    console.log('User answers count:', this.userAnswers?.length);

    if (this.questions && this.questions.length > 0 && this.userAnswers && this.userAnswers.length > 0) {
      let correct = 0;

      // Ensure we don't go out of bounds
      const maxIndex = Math.min(this.questions.length, this.userAnswers.length);

      for (let i = 0; i < maxIndex; i++) {
        const question = this.questions[i];
        const userAnswer = this.userAnswers[i];

        if (question && typeof question.correctAnswer === 'number' && userAnswer === question.correctAnswer) {
          correct++;
        }
      }

      this.score = correct;
      this.accuracy = Math.round((correct / this.questions.length) * 100);

      console.log('Score calculation - Correct:', correct, 'Total:', this.questions.length, 'Accuracy:', this.accuracy);
    } else {
      this.score = 0;
      this.accuracy = 0;
      console.log('No questions or answers to calculate score');
    }
    next();
  } catch (error) {
    console.error('Pre-save hook error:', error.message);
    next(error);
  }
});

module.exports = mongoose.model('Test', testSchema);