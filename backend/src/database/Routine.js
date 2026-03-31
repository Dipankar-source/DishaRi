const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputs: {
    goal: String,
    level: String,
    dailyLife: String,
    studyHours: String,
    preferredTimes: String,
    otherDetails: String
  },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  suggestedRoutine: {
    type: String, // AI-generated markdown routine
    required: true
  },
  finalRoutine: {
    type: String // User-edited/confirmed routine
  },
  associatedSubject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  status: {
    type: String,
    enum: ['suggested', 'confirmed', 'roadmap_generated'],
    default: 'suggested'
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

module.exports = mongoose.model('Routine', routineSchema);
