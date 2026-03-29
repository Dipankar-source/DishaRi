const { GoogleGenerativeAI } = require('@google/generative-ai');
const Subject = require('../database/Subject');

// Lazy initialize Gemini AI to ensure environment variables are loaded
let genAIInstance = null;
const getGenAI = () => {
  if (!genAIInstance && process.env.GEMINI_API_KEY) {
    genAIInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAIInstance;
};

const generateQuestions = async (req, res) => {
  try {
    const { subjects, topics, complexity } = req.body;
    const genAI = getGenAI();

    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Using gemini-2.5-flash which is verified to work with this project's key
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Get subject and topic names
    const subjectDocs = await Subject.find({ _id: { $in: subjects } });
    const subjectNames = subjectDocs.map(s => s.name).join(', ');

    // Get topic details
    let topicDetails = [];
    for (const subjectId of subjects) {
      const subject = await Subject.findById(subjectId);
      if (subject) {
        const subjectTopics = subject.topics.filter(t => topics.includes(t._id.toString()));
        topicDetails.push(...subjectTopics.map(t => `${subject.name}: ${t.title}`));
      }
    }

    const topicsText = topicDetails.join(', ');

    // Adjust question count based on complexity
    const questionCount = complexity === 'extreme' ? 45 : 30;

    // Complexity descriptions
    const complexityDescriptions = {
      easy: 'basic concepts, definitions, and simple problems',
      moderate: 'intermediate concepts, standard algorithms, and moderate complexity problems',
      hard: 'advanced concepts, complex algorithms, and challenging problems',
      extreme: 'expert-level concepts, very complex problems, and edge cases',
      mixed: 'a balanced combination of easy, moderate, and hard questions to test comprehensive knowledge'
    };

    const prompt = `Generate ${questionCount} multiple choice questions for a ${complexity} level CSE (Computer Science Engineering) test.

Subjects: ${subjectNames}
Topics: ${topicsText}
Complexity Level: ${complexity} - ${complexity === 'mixed' ? 'Provide a varied mix of easy, moderate, and hard questions.' : `Focus on ${complexityDescriptions[complexity]}`}

Requirements:
- Each question must have 4 options (A, B, C, D)
- Only one correct answer
- Questions should be technical and appropriate for ${complexity} difficulty level
- Include a brief explanation for each correct answer
- Format as JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Ensure questions are original and not copied from existing question banks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    let questions;
    try {
      // Try to parse the response directly
      const cleanedText = text.trim();
      if (cleanedText.startsWith('[') && cleanedText.endsWith(']')) {
        questions = JSON.parse(cleanedText);
      } else {
        // Find JSON array in the text (handling markdown code blocks if present)
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in AI response');
        }
      }
    } catch (parseError) {
      console.error('JSON Parse error for text:', text);
      throw new Error(`Failed to parse questions from AI response: ${parseError.message}`);
    }

    // Validate questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format');
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !Array.isArray(question.options) || question.options.length !== 4 ||
          typeof question.correctAnswer !== 'number' || !question.explanation) {
        throw new Error('Invalid question format');
      }
    }

    res.json({
      questions,
      count: questions.length,
      complexity,
      subjects: subjectNames,
      topics: topicsText
    });

  } catch (error) {
    console.error('Generate questions error details:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    let errorMessage = 'Failed to generate questions';
    let statusCode = 500;

    if (error.message.includes('Resource has been exhausted') || error.message.includes('429')) {
      errorMessage = 'AI Quota Exceeded (429). Please wait a few minutes and try again.';
      statusCode = 429;
    } else if (error.message.includes('Safety') || error.message.includes('blocked')) {
      errorMessage = 'Response blocked by AI safety filters. Try different topics.';
      statusCode = 400;
    } else if (error.message.includes('404')) {
      errorMessage = 'AI Model not found or unavailable for this region.';
      statusCode = 404;
    }

    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.message,
      suggestion: statusCode === 429 ? 'Wait ~60 seconds' : undefined
    });
  }
};

// Analyze document content for context in Gemini prompts
// Supports PDF, DOCX, TXT, CSV text extraction
const analyzeDocument = async (fileBuffer, fileName) => {
  try {
    if (!fileBuffer) {
      return '';
    }

    let extractedText = '';

    // Handle different file formats
    if (fileName.endsWith('.txt')) {
      // For text files, directly decode the buffer
      extractedText = fileBuffer.toString('utf-8');
    } else if (fileName.endsWith('.csv')) {
      // For CSV, just decode as text
      extractedText = fileBuffer.toString('utf-8').split('\n').slice(0, 50).join('\n');
    } else if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
      // For PDF and DOCX, we'd need libraries like pdfparse or docx
      // For now, just note that we attempted to process
      extractedText = `[Document: ${fileName} uploaded but detailed parsing requires additional libraries]`;
    } else {
      // Default: try to extract as text
      extractedText = fileBuffer.toString('utf-8').substring(0, 2000);
    }

    // Limit text length to avoid exceeding token limits
    const maxLength = 2000;
    return extractedText.substring(0, maxLength);
  } catch (error) {
    console.warn(`Error analyzing document ${fileName}:`, error.message);
    return `[Document: ${fileName} - could not extract content]`;
  }
};

// Generate roadmap with document context
const generateRoadmapWithDocumentContext = async (req, res) => {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const { goal, level, dailyHours, deadline, scheduleNotes, subjects, documentContent } = req.body;
    const userId = req.user._id || req.userId;

    // Build Gemini prompt with document context
    const subjectsText = Array.isArray(subjects) ? subjects.join(', ') : subjects || 'Core topics';
    
    const prompt = `Create a comprehensive, unique personalized learning roadmap JSON based on:

LEARNER PROFILE:
- Goal: ${goal}
- Level: ${level}
- Daily Hours: ${dailyHours}
- Deadline: ${deadline || 'Flexible'}
- Notes: ${scheduleNotes || 'None'}
- Subjects: ${subjectsText}

${documentContent ? `\nDOCUMENT/SYLLABUS CONTEXT:\n${documentContent}` : ''}

Generate a realistic, progressive roadmap in JSON format with sections, topics, and time estimates.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmapText = response.text();

    // Parse JSON response
    let roadmapData;
    try {
      roadmapData = JSON.parse(roadmapText);
    } catch (e) {
      const jsonMatch = roadmapText.match(/\{[\s\S]*\}(?=\s*$)/);
      if (jsonMatch) {
        roadmapData = JSON.parse(jsonMatch[0]);
      } else {
        throw e;
      }
    }

    res.json({
      success: true,
      roadmap: roadmapData,
      preview: true
    });
  } catch (error) {
    console.error('Generate roadmap with document context error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};

module.exports = {
  generateQuestions,
  analyzeDocument,
  generateRoadmapWithDocumentContext
};