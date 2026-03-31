const Roadmap = require('../database/Roadmap');
const Subject = require('../database/Subject');
const User = require('../database/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate a mock roadmap structure (fallback if Gemini fails)
const generateMockRoadmap = (goal, level, subjects) => {
  // Normalize level to lowercase
  const normalizedLevel = level && level.toLowerCase ? level.toLowerCase() : 'beginner';
  
  const roadmapTemplates = {
    'Campus Placement': [
      {
        id: 'section-1',
        title: 'Foundation & Problem Solving',
        description: 'Build strong fundamentals in data structures and algorithms',
        estimatedWeeks: 4,
        topics: [
          {
            id: 'topic-1',
            title: 'DSA Basics',
            description: 'Arrays, Strings, and basic problem solving',
            difficulty: 'beginner',
            estimatedHours: 20,
            subtopics: ['Arrays', 'Strings', 'Basic Math'],
            resources: [],
            practicalProjects: ['Solve 50 LeetCode easy problems'],
            prerequisites: []
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Intermediate Concepts',
        description: 'Master essential data structures',
        estimatedWeeks: 6,
        topics: [
          {
            id: 'topic-2',
            title: 'Advanced DSA',
            description: 'Trees, Graphs, Dynamic Programming',
            difficulty: 'intermediate',
            estimatedHours: 30,
            subtopics: ['Trees', 'Graphs', 'DP Basics'],
            resources: [],
            practicalProjects: ['Solve 100 LeetCode medium problems'],
            prerequisites: ['DSA Basics']
          }
        ]
      },
      {
        id: 'section-3',
        title: 'Interview Preparation',
        description: 'Optimize and prepare for technical interviews',
        estimatedWeeks: 4,
        topics: [
          {
            id: 'topic-3',
            title: 'System Design & Optimization',
            description: 'Optimize solutions and understand SD basics',
            difficulty: 'intermediate',
            estimatedHours: 20,
            subtopics: ['Time Complexity', 'Space Optimization', 'System Design'],
            resources: [],
            practicalProjects: ['Mock interviews', 'Case studies'],
            prerequisites: ['Advanced DSA']
          }
        ]
      }
    ],
    'GATE Exam': [
      {
        id: 'section-1',
        title: 'Mathematics Fundamentals',
        description: 'Coverage of discrete math and algorithms',
        estimatedWeeks: 6,
        topics: [
          {
            id: 'topic-1',
            title: 'Discrete Mathematics',
            description: 'Logic, Sets, Relations, and Functions',
            difficulty: 'beginner',
            estimatedHours: 25,
            subtopics: ['Logic', 'Sets', 'Relations'],
            resources: [],
            practicalProjects: ['Problem sets and exercises'],
            prerequisites: []
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Core CS Subjects',
        description: 'In-depth study of core computer science',
        estimatedWeeks: 8,
        topics: [
          {
            id: 'topic-2',
            title: 'Data Structures & Algorithms',
            description: 'Comprehensive DSA for GATE',
            difficulty: 'intermediate',
            estimatedHours: 40,
            subtopics: ['Complexity Analysis', 'Searching', 'Sorting', 'Graphs'],
            resources: [],
            practicalProjects: ['Previous year GATE papers'],
            prerequisites: ['Discrete Mathematics']
          }
        ]
      }
    ]
  };

  const normalizedGoal = goal || 'Personal Growth';
  
  // Create topics from subjects if provided
  const subjectsTopics = (subjects && subjects.length > 0) ? subjects.map((s, i) => ({
    id: `topic-mock-${i}`,
    title: s,
    description: `Comprehensive study of ${s} components and real-world application`,
    difficulty: level?.toLowerCase() || 'beginner',
    estimatedHours: 15,
    subtopics: [s, 'Advanced Concepts', 'Interview Prep'],
    resources: [],
    practicalProjects: [`Build a project using ${s}`],
    prerequisites: i > 0 ? [subjects[i-1]] : [],
    importantQuestions: [`Explain the core architecture of ${s}`, `How to optimize ${s}?`],
    interviewTips: ['Focus on practical implementation', 'Mention performance trade-offs']
  })) : [];

  const templateSections = roadmapTemplates[normalizedGoal] || [
    {
      id: 'section-1',
      title: `${subjectsTopics.length > 0 ? subjectsTopics[0].title : 'Goal'} Foundations`,
      description: `Solidifying foundations for ${normalizedGoal}`,
      estimatedWeeks: 4,
      topics: subjectsTopics.length > 0 ? subjectsTopics.slice(0, 3) : [
        {
          id: 'topic-1',
          title: 'Core Fundamentals',
          description: 'Master the non-negotiable basics',
          difficulty: 'beginner',
          estimatedHours: 15,
          subtopics: ['Basics', 'Core Concepts'],
          resources: [],
          practicalProjects: ['Practice exercises'],
          prerequisites: [],
          importantQuestions: ['What are the fundamental principles?', 'How does X work under the hood?'],
          interviewTips: ['Showcase your understanding of the "Why"', 'Be ready for edge cases']
        }
      ]
    }
  ];
  
  return {
    title: `Personalized Learning Roadmap: ${normalizedGoal}`,
    description: `A structured ${normalizedLevel} level roadmap to achieve your goal. (Fallback generation)`,
    sections: templateSections,
    level: normalizedLevel,
    totalDuration: '12-16 weeks',
    estimatedTotalHours: 100
  };
};

// Generate roadmap from form data with optional document analysis
const generateRoadmapFromForm = async (req, res) => {
  try {
    // Verify Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in environment variables.' 
      });
    }

    const userId = req.userId;
    const { goal, level, dailyHours, deadline, scheduleNotes, subjects, documentUrls } = req.body;
    
    // Validate required fields
    if (!goal || !level || !dailyHours) {
      return res.status(400).json({ 
        error: 'Missing required fields: goal, level, and dailyHours are required' 
      });
    }
    
    // Parse subjects if it's a string
    let selectedSubjects = [];
    try {
      selectedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : (subjects || []);
    } catch (e) {
      selectedSubjects = [];
    }

    let documentContent = '';
    let uploadedDocumentsInfo = [];
    
    // Process ImageKit document URLs if any
    if (documentUrls) {
      try {
        uploadedDocumentsInfo = typeof documentUrls === 'string' ? JSON.parse(documentUrls) : (documentUrls || []);
        if (uploadedDocumentsInfo.length > 0) {
          documentContent = uploadedDocumentsInfo
            .map((doc) => `[Document: ${doc.name} - Uploaded to ImageKit: ${doc.url}]`)
            .join('\n');
        }
      } catch (e) {
        console.log('Could not parse document URLs');
        uploadedDocumentsInfo = [];
      }
    }

    // Build prompt for Gemini - with unique identifier in prompt to generate unique roadmaps
    const uniqueTimestamp = Date.now();
    const subjectsText = selectedSubjects.length > 0 
      ? selectedSubjects.join(', ')
      : `Core topics for ${goal}`;

    const prompt = `### SYSTEM INSTRUCTION:
You are a highly-specialized curriculum architect. You MUST follow user constraints with 100% precision.
STRICT CONSTRAINT: Do NOT include Data Structures, Algorithms, or competitive programming topics UNLESS "Data Structures & Algorithms" is explicitly mentioned in the MANDATORY SUBJECTS below. If the user wants "${subjectsText}", do NOT give them DSA for "placement preparation". Focus ONLY on the domain of the selected subjects.

LEARNER PROFILE:
- Goal: ${goal}
- Current Level: ${level}
- Daily Study Time: ${dailyHours} hours
- Target Deadline: ${deadline || 'Not specified'}
- MANDATORY SUBJECTS: ${subjectsText}

ROADMAP REQUIREMENTS:
1. SUBJECT INTEGRITY: 100% of the topics must be within the scope of ${subjectsText}.
2. DEPTH: Provide a comprehensive 6-8 section roadmap. 
3. COMPLEXITY: Each topic must have subtopics, 3-5 interview questions, and 2-3 expert tips.
4. JSON ONLY: Return ONLY the JSON object.

Required JSON structure:
{
  "title": "Mastery Path: ${subjectsText}",
  "description": "A professional ${level} level roadmap for ${goal}",
  "totalDuration": "estimated completion time",
  "sections": [
    {
      "id": "section-1",
      "order": 1,
      "title": "Phase Title",
      "description": "Phase objective",
      "estimatedWeeks": 4,
      "topics": [
        {
          "id": "topic-1",
          "order": 1,
          "title": "Topic Title",
          "description": "What to learn",
          "difficulty": "beginner/intermediate/advanced",
          "estimatedHours": 10,
          "subtopics": ["sub-topic 1", "sub-topic 2"],
          "resources": [{"type": "video", "title": "Resource", "url": "https://example.com"}],
          "practicalProjects": ["Project name"],
          "prerequisites": [],
          "importantQuestions": ["Interview Question?"],
          "interviewTips": ["Expert Tip"]
        }
      ]
    }
  ],
  "estimatedTotalHours": 100
}`;

    let roadmapData;
    
    // Try to use Gemini API, fallback to mock if it fails
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let roadmapText = response.text().trim();

      console.log('Gemini response received. Extracting JSON...');

      // Parse the response - be more thorough
      try {
        // Remove markdown formatting if present
        if (roadmapText.startsWith('```')) {
          roadmapText = roadmapText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        }
        roadmapData = JSON.parse(roadmapText);
      } catch (e1) {
        // Try to extract JSON object using a more flexible regex
        const jsonMatch = roadmapText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            roadmapData = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            console.warn('Failed to parse extracted JSON');
            throw e1;
          }
        } else {
          throw e1;
        }
      }

      // Ensure sections and topics have order field
      if (roadmapData.sections && Array.isArray(roadmapData.sections)) {
        roadmapData.sections = roadmapData.sections.map((section, idx) => ({
          ...section,
          order: section.order || (idx + 1),
          id: section.id || `section-${idx + 1}`,
          topics: Array.isArray(section.topics) ? section.topics.map((topic, topicIdx) => ({
            ...topic,
            order: topic.order || (topicIdx + 1),
            id: topic.id || `topic-${idx + 1}-${topicIdx + 1}`,
            difficulty: topic.difficulty || 'beginner'
          })) : []
        }));
      }
    } catch (geminiError) {
      console.warn('Gemini API failed:', geminiError.message);
      roadmapData = generateMockRoadmap(goal, level, selectedSubjects);
    }

    // Validate parsed roadmap data
    if (!roadmapData || !roadmapData.title || !roadmapData.sections || !Array.isArray(roadmapData.sections)) {
      console.error('Invalid roadmap structure:', roadmapData);
      return res.status(400).json({ 
        error: 'Invalid roadmap structure from AI',
        hint: 'Ensure Gemini API is returning valid JSON with sections array'
      });
    }

    // Save roadmap to database
    const normalizedLevel = level && typeof level === 'string' ? level.toLowerCase() : 'beginner';
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const finalLevel = validLevels.includes(normalizedLevel) ? normalizedLevel : 'beginner';
    
    const savedRoadmap = new Roadmap({
      title: roadmapData.title,
      description: roadmapData.description,
      category: goal,
      level: finalLevel,
      sections: roadmapData.sections || [],
      createdBy: userId,
      isPublished: false,
      metadata: {
        goal,
        dailyHours,
        deadline,
        subjects: selectedSubjects,
        uploadedDocuments: uploadedDocumentsInfo,
        hasDocuments: uploadedDocumentsInfo && uploadedDocumentsInfo.length > 0,
        generatedAt: new Date(),
        totalDuration: roadmapData.totalDuration,
        estimatedTotalHours: roadmapData.estimatedTotalHours
      }
    });

    await savedRoadmap.save();

    // Update user's roadmap progress
    const user = await User.findById(userId);
    if (!user.roadmaps) {
      user.roadmaps = [];
    }
    user.roadmaps.push({
      roadmapId: savedRoadmap._id,
      status: 'in_progress',
      createdAt: new Date()
    });
    await user.save();

    res.json({
      message: 'Roadmap generated successfully',
      roadmap: {
        _id: savedRoadmap._id,
        ...roadmapData,
        dbId: savedRoadmap._id
      }
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap', details: error.message });
  }
};

// Original Gemini roadmap generation (kept for backward compatibility)
const generateRoadmapWithAI = async (req, res) => {
  try {
    const { subjectName, level = 'intermediate', details } = req.body;

    const prompt = `Create a detailed learning roadmap for "${subjectName}" at ${level} level. 
    The roadmap should include:
    1. Main learning phases with clear progression
    2. For each phase: title, description, estimated time, skills to learn, prerequisites
    3. Key topics to learn in order
    4. Recommended resources (videos, articles, documentation)
    5. Practical projects/assignments
    6. Difficulty progression
    
    Format the response as a JSON object with a "roadmap" array containing phases.
    Each phase should have: title, description, level, order, estimatedTime, skills[], topics[], resources[], prerequisites[].`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmapText = response.text();

    // Parse the response
    let roadmapData;
    try {
      const jsonMatch = roadmapText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roadmapData = JSON.parse(jsonMatch[0]);
      } else {
        roadmapData = JSON.parse(roadmapText);
      }
    } catch (e) {
      return res.status(400).json({ 
        error: 'Failed to parse AI response', 
        rawResponse: roadmapText 
      });
    }

    res.json({
      message: 'Roadmap generated successfully',
      roadmap: roadmapData
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};

// Create roadmap
const createRoadmap = async (req, res) => {
  try {
    const { title, description, category, level, nodes, subject } = req.body;
    const userId = req.userId;

    const roadmap = new Roadmap({
      title,
      description,
      category,
      level,
      nodes,
      subject,
      createdBy: userId,
      isPublished: true
    });

    await roadmap.save();

    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap
    });
  } catch (error) {
    console.error('Create roadmap error:', error);
    res.status(500).json({ error: 'Failed to create roadmap' });
  }
};

// Get all roadmaps
const getAllRoadmaps = async (req, res) => {
  try {
    const { category, level, search } = req.query;

    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const roadmaps = await Roadmap.find(query)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(roadmaps);
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
};

// Get single roadmap
const getRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await Roadmap.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('subject', 'name')
      .populate('createdBy', 'name');

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
};

// Update user's roadmap progress
const updateRoadmapProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { roadmapId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const roadmapProgress = user.roadmaps.find(r => r.roadmapId.toString() === roadmapId);

    if (roadmapProgress) {
      roadmapProgress.status = status;
      roadmapProgress.lastAccessed = new Date();
    } else {
      user.roadmaps.push({
        roadmapId,
        status,
        lastAccessed: new Date()
      });
    }

    await user.save();

    res.json({
      message: 'Roadmap progress updated',
      progress: user.roadmaps
    });
  } catch (error) {
    console.error('Update roadmap progress error:', error);
    res.status(500).json({ error: 'Failed to update roadmap progress' });
  }
};

// Download roadmap as PDF
const downloadRoadmapPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await Roadmap.findById(id).populate('subject', 'name');

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Create PDF
    const pdfDoc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${roadmap.title.replace(/\s+/g, '_')}.pdf"`);

    pdfDoc.pipe(res);

    // Helper function to add a box around text
    const addBox = (doc, x, y, width, height, title, content) => {
      doc.rect(x, y, width, height).stroke();
      doc.fontSize(11).font('Helvetica-Bold').text(title, x + 8, y + 8, { width: width - 16 });
      doc.fontSize(9).font('Helvetica').text(content, x + 8, y + 25, { width: width - 16, height: height - 33 });
    };

    // Page 1: Title & Overview
    pdfDoc.fontSize(28).font('Helvetica-Bold').text(roadmap.title || 'Learning Roadmap', { align: 'center' });
    pdfDoc.moveDown(0.5);

    // Metadata box
    const metadata = [
      `Goal: ${roadmap.metadata?.goal || roadmap.category || 'Personal Growth'}`,
      `Level: ${roadmap.level?.charAt(0).toUpperCase() + roadmap.level?.slice(1) || 'Beginner'}`,
      `Daily Hours: ${roadmap.metadata?.dailyHours || '2-3 hours'}`,
      `Total Duration: ${roadmap.metadata?.totalDuration || roadmap.estimatedTotalHours + ' hours'}`
    ].join('\n');

    pdfDoc.fontSize(10).font('Helvetica').fillColor('#666').text(metadata, { align: 'center' });
    pdfDoc.moveDown();

    if (roadmap.description) {
      pdfDoc.fillColor('#000').fontSize(12).font('Helvetica-Bold').text('Overview');
      pdfDoc.fontSize(10).font('Helvetica').text(roadmap.description);
      pdfDoc.moveDown();
    }

    pdfDoc.addPage();

    // Sections & Topics
    if (roadmap.sections && Array.isArray(roadmap.sections)) {
      pdfDoc.fontSize(16).font('Helvetica-Bold').text('Learning Path', { underline: true });
      pdfDoc.moveDown(0.3);

      roadmap.sections.forEach((section, sectionIdx) => {
        // Check if we need a new page
        if (pdfDoc.y > 700) {
          pdfDoc.addPage();
        }

        // Section header
        const sectionNum = section.order || (sectionIdx + 1);
        pdfDoc.fontSize(13).font('Helvetica-Bold').fillColor('#1f2937');
        pdfDoc.text(`${sectionNum}. ${section.title}`);
        pdfDoc.fontSize(9).font('Helvetica').fillColor('#666').text(section.description || '');
        pdfDoc.moveDown(0.2);

        // Topics under section
        if (section.topics && Array.isArray(section.topics)) {
          section.topics.forEach((topic, topicIdx) => {
            if (pdfDoc.y > 750) {
              pdfDoc.addPage();
            }

            const topicNum = topic.order || (topicIdx + 1);
            pdfDoc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
            pdfDoc.text(`   ${sectionNum}.${topicNum} ${topic.title}`);

            // Topic details
            pdfDoc.fontSize(8).font('Helvetica').fillColor('#666');
            const topicDetails = [];
            if (topic.difficulty) topicDetails.push(`Difficulty: ${topic.difficulty}`);
            if (topic.estimatedHours) topicDetails.push(`Hours: ${topic.estimatedHours}h`);
            if (topicDetails.length > 0) {
              pdfDoc.text(`       ${topicDetails.join(' | ')}`);
            }

            // Description
            if (topic.description) {
              pdfDoc.fontSize(8).fillColor('#666').text(`       ${topic.description}`, { width: 400 });
            }

            // Subtopics
            if (topic.subtopics && Array.isArray(topic.subtopics) && topic.subtopics.length > 0) {
              pdfDoc.fontSize(8).fillColor('#999').text(`       Topics: ${topic.subtopics.join(', ')}`, { width: 400 });
            }

            // Resources
            if (topic.resources && Array.isArray(topic.resources) && topic.resources.length > 0) {
              pdfDoc.fontSize(8).fillColor('#0066cc').text(`       Resources: ${topic.resources.length} link(s)`, { link: true });
            }

            // Projects
            if (topic.practicalProjects && Array.isArray(topic.practicalProjects) && topic.practicalProjects.length > 0) {
              pdfDoc.fontSize(8).fillColor('#666').text(`       Projects: ${topic.practicalProjects.join(', ')}`, { width: 400 });
            }

            pdfDoc.moveDown(0.15);
          });
        }

        pdfDoc.moveDown(0.3);
      });
    }

    // Summary page
    pdfDoc.addPage();
    pdfDoc.fontSize(14).font('Helvetica-Bold').text('Summary & Study Tips', { underline: true });
    pdfDoc.moveDown(0.3);

    const tips = [
      '1. Follow the sections in order for optimal learning progression',
      '2. Complete each topic before moving to the next section',
      '3. Practice hands-on projects alongside video tutorials',
      '4. Review prerequisites if any topics feel difficult',
      '5. Adjust the pace based on your daily available time'
    ];

    tips.forEach(tip => {
      pdfDoc.fontSize(10).font('Helvetica').text(tip);
      pdfDoc.moveDown(0.2);
    });

    pdfDoc.moveDown(0.5);
    pdfDoc.fontSize(9).fillColor('#999').text(`Generated on ${new Date().toLocaleDateString()}`);

    pdfDoc.end();
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};

// Get user's roadmap progress
const getUserRoadmapProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate('roadmaps.roadmapId', 'title category level');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.roadmaps);
  } catch (error) {
    console.error('Get user roadmap progress error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap progress' });
  }
};

// Get user's roadmaps with full details
const getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all roadmaps for this user with full details
    const roadmaps = await Roadmap.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    // Include user progress data
    const roadmapsWithProgress = roadmaps.map(roadmap => {
      const progress = user.roadmaps?.find(r => r.roadmapId?.toString() === roadmap._id.toString());
      return {
        ...roadmap.toObject(),
        progress: progress || {}
      };
    });

    res.json(roadmapsWithProgress);
  } catch (error) {
    console.error('Get user roadmaps error:', error);
    res.status(500).json({ error: 'Failed to fetch user roadmaps' });
  }
};

// Get single user roadmap with full details
// Update individual topic progress in a roadmap
const updateTopicProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { roadmapId, sectionId, topicId, isCompleted } = req.body;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Verify ownership
    if (roadmap.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update or add topic progress
    // We'll use a string key format in metadata or a dedicated progress array
    // Since the schema has topicProgress but with refs to Subject.topics (which might not match AI generated IDs), 
    // we'll use a more flexible approach by updating the 'sections' themselves or a progress map in metadata.
    
    // For this implementation, we'll update the 'isCompleted' status of the topic within the sections array
    const sectionIndex = roadmap.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1) {
      const topicIndex = roadmap.sections[sectionIndex].topics.findIndex(t => t.id === topicId);
      if (topicIndex !== -1) {
        // We need a way to store this. Let's use the metadata.progress map
        if (!roadmap.metadata) roadmap.metadata = {};
        if (!roadmap.metadata.progress) roadmap.metadata.progress = {};
        
        roadmap.metadata.progress[`${sectionId}-${topicId}`] = isCompleted;
        roadmap.markModified('metadata.progress');
        
        // Also update overall status if all topics are done
        const allTopics = roadmap.sections.flatMap(s => s.topics);
        const completedTopics = allTopics.filter(t => roadmap.metadata.progress[`${s.id}-${t.id}`]);
        
        if (completedTopics.length === allTopics.length) {
          roadmap.status = 'completed';
        } else if (completedTopics.length > 0) {
          roadmap.status = 'active';
        }
      }
    }

    await roadmap.save();

    res.json({
      message: 'Topic progress updated',
      progress: roadmap.metadata.progress
    });
  } catch (error) {
    console.error('Update topic progress error:', error);
    res.status(500).json({ error: 'Failed to update topic progress' });
  }
};

const getUserRoadmapById = async (req, res) => {
  try {
    const userId = req.userId;
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId);
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Verify ownership
    if (roadmap.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    const progress = user.roadmaps?.find(r => r.roadmapId?.toString() === roadmapId);

    res.json({
      ...roadmap.toObject(),
      progress: progress || {}
    });
  } catch (error) {
    console.error('Get user roadmap by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
};

module.exports = {
  generateRoadmapFromForm,
  generateRoadmapWithAI,
  createRoadmap,
  getAllRoadmaps,
  getRoadmap,
  updateRoadmapProgress,
  updateTopicProgress,
  downloadRoadmapPDF,
  getUserRoadmapProgress,
  getUserRoadmaps,
  getUserRoadmapById
};