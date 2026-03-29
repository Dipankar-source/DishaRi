const ImageKit = require('imagekit');
const UploadedDocument = require('../database/UploadedDocument');
const User = require('../database/User');
const multer = require('multer');
const path = require('path');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/webm'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only documents, images, and videos are allowed'));
    }
  }
});

// Upload document to ImageKit
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = req.userId;
    const { description, subject, roadmap, topic, tags } = req.body;

    console.log('Starting document upload for user:', userId, 'File:', req.file.originalname);

    // Validate ImageKit configuration
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.error('ImageKit configuration missing');
      return res.status(500).json({ error: 'ImageKit not configured on server' });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Uploading to ImageKit...');

    // Upload to ImageKit with timeout
    let uploadResponse;
    try {
      uploadResponse = await Promise.race([
        imagekit.upload({
          file: req.file.buffer,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: '/learning-materials/',
          useUniqueFileName: true
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('ImageKit upload timeout')), 60000) // 60 second timeout
        )
      ]);
    } catch (uploadError) {
      console.error('ImageKit upload error:', uploadError.message);
      return res.status(500).json({ 
        error: 'Failed to upload file to storage',
        details: uploadError.message
      });
    }

    console.log('ImageKit upload successful:', uploadResponse.fileId);

    // Create document record in database
    const document = new UploadedDocument({
      filename: uploadResponse.name,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      url: uploadResponse.url,
      imagekitFileId: uploadResponse.fileId,
      imagekitUrl: uploadResponse.url,
      metadata: {
        description: description || '',
        subject: subject || '',
        roadmap: roadmap || '',
        topic: topic || '',
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : []
      },
      uploadedBy: userId,
      isPublic: true
    });

    console.log('Saving document to database...');

    // Save document with timeout
    await Promise.race([
      document.save(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout')), 30000) // 30 second timeout
      )
    ]);

    console.log('Document saved successfully:', document._id);

    // Add document to user's documents array
    user.documents.push(document._id);
    await user.save();

    console.log('User documents updated');

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        _id: document._id,
        filename: document.originalName,
        url: document.imagekitUrl,
        fileId: document.imagekitFileId,
        uploadedAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload document',
      details: error.message 
    });
  }
};

// Get user's documents
const getUserDocuments = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, offset = 0 } = req.query;

    const documents = await UploadedDocument.find({ uploadedBy: userId })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    const total = await UploadedDocument.countDocuments({ uploadedBy: userId });

    res.json({
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get public documents
const getPublicDocuments = async (req, res) => {
  try {
    const { search, subject, limit = 20, offset = 0 } = req.query;

    let query = { isPublic: true };

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { 'metadata.description': { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $in: [search] } }
      ];
    }

    if (subject) {
      query['metadata.subject'] = subject;
    }

    const documents = await UploadedDocument.find(query)
      .populate('uploadedBy', 'name email')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    const total = await UploadedDocument.countDocuments(query);

    res.json({
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      documents
    });
  } catch (error) {
    console.error('Get public documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Download document
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await UploadedDocument.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.redirect(document.imagekitUrl);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const document = await UploadedDocument.findById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from ImageKit
    try {
      await imagekit.deleteFile(document.imagekitFileId);
    } catch (e) {
      console.error('ImageKit deletion error:', e);
    }

    // Delete from database
    await UploadedDocument.findByIdAndDelete(id);

    // Remove from user's documents
    await User.findByIdAndUpdate(userId, {
      $pull: { documents: id }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

// Share document with other users
const shareDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;
    const userId = req.userId;

    const document = await UploadedDocument.findById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    document.sharedWith = [...new Set([...document.sharedWith, ...userIds])];
    await document.save();

    res.json({
      message: 'Document shared successfully',
      sharedWith: document.sharedWith
    });
  } catch (error) {
    console.error('Share document error:', error);
    res.status(500).json({ error: 'Failed to share document' });
  }
};

module.exports = {
  upload,
  uploadDocument,
  getUserDocuments,
  getPublicDocuments,
  downloadDocument,
  deleteDocument,
  shareDocument
};