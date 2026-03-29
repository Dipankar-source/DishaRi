const User = require('../database/User');
const DashboardStats = require('../database/DashboardStats');

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select('-password')
      .populate('dashboard.subjectStats.subject', 'name');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await DashboardStats.findOne({ user: userId })
      .populate('subjectStats.subject', 'name');

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp || 0,
        level: Math.floor((user.xp || 0) / 1000) + 1,
        xpToNext: 1000, // Fixed step for now
        streak: user.streak || 0,
        rank: user.rank || 'Novice',
        joinedAt: user.createdAt
      },
      stats: stats ? stats.toObject() : {},
      dashboard: user.dashboard
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, location, avatar, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
