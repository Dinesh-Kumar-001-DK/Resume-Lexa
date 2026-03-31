const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/dashboard', async (req, res) => {
  try {
    const [totalResumes, analyzedResumes, recentResumes] = await Promise.all([
      Resume.countDocuments({ userId: req.user.id, isArchived: false }),
      Resume.countDocuments({ userId: req.user.id, status: 'analyzed' }),
      Resume.find({ userId: req.user.id, isArchived: false })
        .sort({ updatedAt: -1 })
        .limit(3)
        .select('title status analysis.editorialScore updatedAt')
        .lean()
    ]);

    const avgScore = recentResumes.length > 0
      ? Math.round(recentResumes.reduce((sum, r) => sum + (r.analysis?.editorialScore || 0), 0) / recentResumes.length)
      : 0;

    res.json({
      success: true,
      data: {
        totalResumes,
        analyzedResumes,
        avgScore,
        recentResumes
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
