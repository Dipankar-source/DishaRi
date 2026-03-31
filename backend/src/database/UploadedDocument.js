const mongoose = require('mongoose');

const uploadedDocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: String,
  fileSize: Number,
  url: {
    type: String,
    required: true
  },
  imagekitFileId: {
    type: String
  },
  imagekitUrl: String,
  thumbnailUrl: String,
  metadata: {
    description: String,
    subject: String,
    roadmap: String,
    topic: String,
    tags: [String]
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
uploadedDocumentSchema.index({ uploadedBy: 1, createdAt: -1 });
uploadedDocumentSchema.index({ isPublic: 1 });

module.exports = mongoose.model('UploadedDocument', uploadedDocumentSchema);