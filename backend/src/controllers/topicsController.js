const Subject = require('../database/Subject');
const User = require('../database/User');
const RoadmapProgress = require('../database/RoadmapProgress');

// Mark a topic as complete and award ePoints
const markTopicComplete = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId, topicId } = req.params;

    // Validate inputs
    if (!subjectId || !topicId) {
      return res.status(400).json({ error: 'Subject ID and Topic ID are required' });
    }

    // Find the subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find the topic
    const topic = subject.topics.find(t => t._id.toString() === topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get or create user progress for this subject
    let subjectProgress = user.progress.find(p => p.subject.toString() === subjectId);
    if (!subjectProgress) {
      subjectProgress = {
        subject: subjectId,
        completedTopics: [],
        isCompleted: false
      };
      user.progress.push(subjectProgress);
    }

    // Check if topic already completed
    const isAlreadyCompleted = subjectProgress.completedTopics.some(id => id.toString() === topicId);
    
    // Add topic to completed topics if not already there
    if (!isAlreadyCompleted) {
      subjectProgress.completedTopics.push(topicId);

      // Award ePoints for completing topic
      const ePointsReward = topic.ePointsReward || 10;
      user.ePoints = (user.ePoints || 0) + ePointsReward;
      user.coins = user.ePoints; // Keep coins in sync with ePoints

      console.log(`User ${userId} earned ${ePointsReward} ePoints for completing topic ${topicId}`);
    }

    // Check if subject is completed (all topics completed)
    if (subjectProgress.completedTopics.length === subject.topics.length) {
      subjectProgress.isCompleted = true;
      subjectProgress.completedAt = new Date();
    }

    // Save user
    await user.save();

    // Calculate progress percentage for subject
    const completionPercentage = Math.round(
      (subjectProgress.completedTopics.length / subject.topics.length) * 100
    );

    // Return success response
    res.json({
      message: 'Topic marked as completed',
      success: true,
      rewards: {
        ePoints: topic.ePointsReward || 10,
        totalUserEPoints: user.ePoints,
        totalUserCoins: user.coins
      },
      progress: {
        completedTopics: subjectProgress.completedTopics.length,
        totalTopics: subject.topics.length,
        completionPercentage: completionPercentage,
        isSubjectCompleted: subjectProgress.isCompleted,
        completedAt: subjectProgress.completedAt
      },
      alreadyCompleted: isAlreadyCompleted
    });
  } catch (error) {
    console.error('Mark topic complete error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Update roadmap topic progress (video watch percentage)
const updateRoadmapTopicProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;
    const { topicId, watchPercentage } = req.body;

    if (!roadmapId || !topicId) {
      return res.status(400).json({ error: 'Roadmap ID and Topic ID are required' });
    }

    // Find roadmap
    const roadmap = await (require('../database/Roadmap')).findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // Find or create roadmap progress
    let roadmapProgress = await RoadmapProgress.findOne({ userId, roadmapId });
    if (!roadmapProgress) {
      roadmapProgress = new RoadmapProgress({
        userId,
        roadmapId,
        topicProgress: [],
        sectionProgress: []
      });
    }

    // Update or create topic progress
    let topicProgress = roadmapProgress.topicProgress.find(tp => tp.topicId.toString() === topicId);
    if (!topicProgress) {
      topicProgress = {
        topicId,
        isCompleted: false,
        watchPercentage: 0
      };
      roadmapProgress.topicProgress.push(topicProgress);
    }

    // Update watch percentage
    topicProgress.watchPercentage = Math.min(100, Math.max(0, watchPercentage || 0));

    // Mark as completed if reached 100%
    if (topicProgress.watchPercentage >= 100 && !topicProgress.isCompleted) {
      topicProgress.isCompleted = true;
      topicProgress.completedAt = new Date();

      // Update user ePoints for roadmap topic completion
      const user = await User.findById(userId);
      const ePointsReward = 15; // Roadmap topics might give more points
      user.ePoints = (user.ePoints || 0) + ePointsReward;
      user.coins = user.ePoints;
      await user.save();
    }

    // Recalculate overall roadmap progress
    const totalTopics = roadmapProgress.topicProgress.length;
    const completedTopics = roadmapProgress.topicProgress.filter(tp => tp.isCompleted).length;
    roadmapProgress.completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Update status based on completion
    if (roadmapProgress.completionPercentage === 0) {
      roadmapProgress.status = 'not_started';
    } else if (roadmapProgress.completionPercentage === 100) {
      roadmapProgress.status = 'completed';
      roadmapProgress.completedAt = new Date();
    } else {
      roadmapProgress.status = 'in_progress';
    }

    roadmapProgress.lastAccessedAt = new Date();
    await roadmapProgress.save();

    res.json({
      message: 'Topic progress updated',
      success: true,
      topicProgress: {
        topicId,
        isCompleted: topicProgress.isCompleted,
        watchPercentage: topicProgress.watchPercentage,
        completedAt: topicProgress.completedAt
      },
      roadmapProgress: {
        completionPercentage: roadmapProgress.completionPercentage,
        completedTopics,
        totalTopics,
        status: roadmapProgress.status
      },
      userEPoints: (await User.findById(userId)).ePoints
    });
  } catch (error) {
    console.error('Update roadmap topic progress error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Get user's ePoints and coins
const getUserCoins = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('ePoints coins');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ePoints: user.ePoints || 0,
      coins: user.coins || 0
    });
  } catch (error) {
    console.error('Get user coins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  markTopicComplete,
  updateRoadmapTopicProgress,
  getUserCoins
};
