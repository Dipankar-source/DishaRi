const Routine = require('../database/Routine');
const Subject = require('../database/Subject');
const User = require('../database/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to generate routine using Gemini
const generateRoutineFromAI = async (inputs) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert life coach and study planner. Create a highly personalized and realistic study routine for a student.
  
  USER PROFILE:
  - Goal: ${inputs.goal}
  - Level: ${inputs.level}
  - Daily Life Description: ${inputs.dailyLife}
  - Available Study Hours: ${inputs.studyHours}
  - Preferred Study Times: ${inputs.preferredTimes}
  ${inputs.otherDetails ? `- Other Details: ${inputs.otherDetails}` : ''}
  
  INSTRUCTIONS:
  1. Create a weekly schedule (Monday to Sunday).
  2. Include specific time slots for studying, breaks, meals, and sleep.
  3. Tailor the intensity of study sessions to the availability provided.
  4. Balance the schedule to avoid burnout.
  5. Provide a summary of the routine strategy.
  
  Format the output in clear, beautiful Markdown with emojis.
  Include a section for "Quick Tips" for this specific user.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ AI Routine Generation Error:', error);
    // Fallback routine if AI fails
    return `
# Personalized Study Routine (Fallback)

Due to a temporary AI connection issue, here is a basic structured routine based on your goals.

## Suggested Weekly Schedule
- **07:00 - 08:30**: Focused Study Session 1
- **09:30 - 12:30**: Work/Classes
- **12:30 - 13:30**: Lunch Break
- **13:30 - 17:30**: Work/Classes
- **19:00 - 21:00**: Focused Study Session 2
- **21:00 - 22:00**: Dinner & Review

## Quick Tips
- Focus on consistency over intensity.
- Adjust these slots to fit your specific needs.
    `;
  }
};

// Helper function to generate roadmap from approved routine
const generateRoadmapFromRoutine = async (inputs, routineText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert curriculum designer. Based on the following user profile and their APPROVED STUDY ROUTINE, create a COMPLETE and COMPREHENSIVE learning roadmap.
  
  USER PROFILE:
  - Subject/Goal: ${inputs.goal}
  - Level: ${inputs.level}
  
  APPROVED ROUTINE:
  ${routineText}
  
  INSTRUCTIONS:
  - Generate a list of 10-15 SPECIFIC topics for a detailed roadmap.
  - Each topic must include a title, description, difficulty, estimated hours, and subtopics.
  - The estimated hours must align with the daily/weekly hours in the routine.
  - Provide complete guidelines on "What to study first" and "How to study" based on the user's routine complexity.
  
  REQUIRED JSON FORMAT (Wait, the client expects the same structure as Subject):
  {
    "roadmapTitle": "A catchy title for this roadmap",
    "description": "A brief overview",
    "guidelines": "Comprehensive guidelines and roadmap strategy",
    "topics": [
      {
        "title": "Topic Title",
        "description": "Short description",
        "difficulty": "beginner|intermediate|advanced",
        "estimatedHours": 8,
        "content": "Detailed study material/points",
        "subtopics": ["subtopic 1", "subtopic 2"],
        "videoUrl": "A relevant YouTube search URL or direct link",
        "documentationUrl": "A relevant GeeksforGeeks or official doc URL"
      }
    ]
  }
  
  Keep the response strictly in JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean JSON response
    let roadmapData;
    try {
      roadmapData = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      roadmapData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }
    
    return roadmapData;
  } catch (error) {
    console.error('❌ AI Roadmap Generation Error:', error);
    return null;
  }
};

const suggestRoutine = async (req, res) => {
  try {
    console.log('--- ROUTINE SUGGEST START ---');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI_local = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    if (!req.user) {
      console.error('❌ Fatal: User missing');
      return res.status(401).json({ error: 'Auth required' });
    }

    const userId = req.user._id;
    const { goal, level, dailyLife, studyHours, preferredTimes, otherDetails, documents } = req.body;

    if (!goal || !dailyLife) {
      return res.status(400).json({ error: 'Goal and Daily Life are required' });
    }

    console.log('🤖 AI Generating routine...');
    let suggestedRoutine = "";
    try {
      const model = genAI_local.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Create a study routine for: Goal: ${goal}, Level: ${level}, Daily Life: ${dailyLife}, Hours: ${studyHours}, Time: ${preferredTimes}. Format in Markdown.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      suggestedRoutine = String(response.text());
    } catch (aiError) {
      console.error('❌ AI Failed, using fallback:', aiError.message);
      suggestedRoutine = `# Fallback Routine\n\nStudy Goal: ${goal}\n- Morning: Session 1\n- Afternoon: Practice\n- Evening: Review`;
    }

    console.log('💾 Preparing routine data for DB...');
    const routineData = {
      user: userId,
      inputs: {
        goal: String(goal || ''),
        level: String(level || ''),
        dailyLife: String(dailyLife || ''),
        studyHours: String(studyHours || ''),
        preferredTimes: String(preferredTimes || ''),
        otherDetails: String(otherDetails || '')
      },
      documents: Array.isArray(documents) ? documents.map(d => ({
        name: String(d.name || ''),
        url: String(d.url || ''),
        type: String(d.type || 'document')
      })) : [],
      suggestedRoutine: suggestedRoutine || 'Routine generation failed'
    };

    const newRoutine = new Routine(routineData);
    await newRoutine.save();
    console.log('✅ Routine saved with ID:', newRoutine._id);

    res.json({
      success: true,
      routineId: newRoutine._id,
      suggestedRoutine
    });
  } catch (error) {
    const logData = `
--- SUGGEST ERROR ---
Time: ${new Date().toISOString()}
Error: ${error.message}
Stack: ${error.stack}
User: ${req.user?._id}
Body: ${JSON.stringify(req.body, null, 2)}
---------------------
`;
    fs.appendFileSync('error.log', logData);
    console.error('❌ TOP LEVEL ERROR in suggestRoutine:', error);
    res.status(500).json({ 
      error: 'Suggest failed', 
      message: error.message 
    });
  }
};

const confirmRoutineAndRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { routineId, finalRoutine } = req.body;

    const routineDoc = await Routine.findById(routineId);
    if (!routineDoc) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    routineDoc.finalRoutine = finalRoutine;
    routineDoc.status = 'confirmed';
    
    // Now generate the roadmap
    const roadmapData = await generateRoadmapFromRoutine(routineDoc.inputs, finalRoutine);
    
    if (!roadmapData) {
      throw new Error('Failed to parse AI roadmap data');
    }

    // Create a new Subject from the roadmap
    const newSubject = new Subject({
      name: roadmapData.roadmapTitle || routineDoc.inputs.goal,
      description: roadmapData.description || `Personalized roadmap based on verified routine`,
      guidelines: roadmapData.guidelines || '',
      level: routineDoc.inputs.level || 'intermediate',
      topics: roadmapData.topics.map(t => ({
        ...t,
        ePointsReward: t.difficulty === 'advanced' ? 20 : (t.difficulty === 'intermediate' ? 15 : 10)
      })),
      createdBy: userId,
      totalTopics: roadmapData.topics.length
    });

    await newSubject.save();

    // Link subject to routine
    routineDoc.associatedSubject = newSubject._id;
    routineDoc.status = 'roadmap_generated';
    await routineDoc.save();

    // Add subject to user progress
    await User.findByIdAndUpdate(userId, {
      $push: {
        progress: {
          subject: newSubject._id,
          completedTopics: [],
          isCompleted: false
        }
      }
    });

    res.json({
      success: true,
      subjectId: newSubject._id,
      guidelines: roadmapData.guidelines,
      roadmap: newSubject
    });
  } catch (error) {
    const logData = `
--- CONFIRM ERROR ---
Time: ${new Date().toISOString()}
Error: ${error.message}
Stack: ${error.stack}
User: ${req.user?._id}
---------------------
`;
    fs.appendFileSync('error.log', logData);
    console.error('Confirm routine error:', error);
    res.status(500).json({ error: 'Failed to finalize routine and roadmap', message: error.message });
  }
};

module.exports = {
  suggestRoutine,
  confirmRoutineAndRoadmap
};
