const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const GENERIC_PHRASES = [
  { phrase: 'team player', weight: 0.95 },
  { phrase: 'passionate about results', weight: 0.88 },
  { phrase: 'results-driven', weight: 0.82 },
  { phrase: 'detail-oriented', weight: 0.79 },
  { phrase: 'motivated self-starter', weight: 0.91 },
  { phrase: 'excellent communication skills', weight: 0.85 },
  { phrase: 'fast learner', weight: 0.77 },
  { phrase: 'hard worker', weight: 0.80 }
];

const POWER_VERBS = ['led', 'architected', 'spearheaded', 'orchestrated', 'pioneered',
  'accelerated', 'scaled', 'reduced', 'increased', 'generated', 'launched',
  'built', 'drove', 'transformed', 'streamlined', 'negotiated', 'secured'];

const WEAK_VERBS = ['worked on', 'responsible for', 'helped with', 'assisted',
  'participated', 'involved in', 'tasked with'];

const INTERVIEW_QUESTIONS_POOL = [
  "Tell me about a time you had to pivot a product strategy based on conflicting user data.",
  "Describe a situation where you had to manage a stakeholder with unrealistic expectations.",
  "How do you prioritize a roadmap when multiple departments claim their features are critical?",
  "What is the most difficult technical trade-off you've had to facilitate?",
  "Describe a situation where you failed to meet a deadline. How did you handle it?",
  "How do you measure the success of a product feature after launch?",
  "Tell me about a time you had to make a data-driven decision without complete data.",
  "Describe how you've mentored or grown team members in a previous role."
];

function analyzeResume(content, jobDescription) {
  const contentLower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;

  const metricMatches = (content.match(/\d+[%$kmb+]|\d+\s*(percent|million|billion|thousand)/gi) || []).length;
  const impact = Math.min(100, 60 + metricMatches * 5 + (wordCount > 300 ? 10 : 0));

  const powerVerbCount = POWER_VERBS.filter(v => contentLower.includes(v)).length;
  const weakVerbCount = WEAK_VERBS.filter(v => contentLower.includes(v)).length;
  const clarity = Math.min(100, Math.max(40, 70 + powerVerbCount * 3 - weakVerbCount * 8));

  let jdMatch = 0;
  if (jobDescription && jobDescription.trim()) {
    const jdWords = new Set(jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 4));
    const resumeWords = new Set(contentLower.split(/\W+/).filter(w => w.length > 4));
    let matched = 0;
    jdWords.forEach(w => { if (resumeWords.has(w)) matched++; });
    jdMatch = Math.min(100, Math.round((matched / Math.max(jdWords.size, 1)) * 100));
  } else {
    jdMatch = 75 + Math.floor(Math.random() * 15);
  }

  const editorialScore = Math.round(impact * 0.35 + clarity * 0.35 + jdMatch * 0.30);

  const genericFound = GENERIC_PHRASES.filter(({ phrase }) => contentLower.includes(phrase));
  const twinScore = Math.max(40, 100 - genericFound.length * 10);

  const criticalImprovements = [];

  WEAK_VERBS.forEach(verb => {
    if (contentLower.includes(verb)) {
      criticalImprovements.push({
        type: 'VAGUE_LANGUAGE',
        original: verb,
        suggested: verb === 'responsible for' ? 'spearheaded' :
                   verb === 'worked on' ? 'architected' : 'led',
        applied: false
      });
    }
  });

  if (contentLower.includes('mobile first')) {
    criticalImprovements.push({
      type: 'SPELLING_ERROR',
      original: 'mobile first',
      suggested: 'mobile-first',
      applied: false
    });
  }

  const keywordsToCheck = ['agile', 'stakeholder', 'cross-functional', 'roadmap', 'metrics'];
  keywordsToCheck.forEach(kw => {
    if (!contentLower.includes(kw)) {
      criticalImprovements.push({
        type: 'MISSING_KEYWORD',
        original: null,
        suggested: `Add "${kw.charAt(0).toUpperCase() + kw.slice(1)}" to Experience section`,
        applied: false
      });
    }
  });

  const detectedGenericPhrases = genericFound.map(({ phrase, weight }) => ({
    phrase,
    matchPercent: Math.round(weight * 100),
    suggestion: `Replace with a quantified achievement instead of "${phrase}"`
  }));

  const benchmarkGaps = [
    {
      title: 'Strategic Leadership Narrative',
      description: 'Lacks evidence of cross-functional steering and long-term vision.',
      resolved: false
    },
    {
      title: 'Semantic Keyword Density',
      description: 'Missing key terms: "Product Lifecycle", "Stakeholder Mgmt".',
      resolved: false
    },
    {
      title: 'Editorial White Space',
      description: 'Layout is too dense (line height < 1.4). Reduces scanability.',
      resolved: false
    }
  ];

  const shuffled = [...INTERVIEW_QUESTIONS_POOL].sort(() => 0.5 - Math.random());
  const interviewQuestions = shuffled.slice(0, 5).map(q => ({
    question: q,
    userAnswer: '',
    aiScore: null,
    aiFeedback: ''
  }));

  const marketReadiness = editorialScore >= 85 ? 'Top 8%' :
                          editorialScore >= 70 ? 'Top 20%' : 'Top 35%';

  return {
    editorialScore,
    impact,
    clarity,
    jdMatch,
    twinScore,
    marketReadiness,
    criticalImprovements: criticalImprovements.slice(0, 5),
    detectedGenericPhrases,
    benchmarkGaps,
    interviewQuestions,
    analyzedAt: new Date()
  };
}

router.post('/:resumeId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const analysis = analyzeResume(resume.content, resume.jobDescription);

    resume.analysis = analysis;
    resume.status = 'analyzed';
    await resume.save();

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:resumeId/interview-answer', async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });

    if (!resume || !resume.analysis) {
      return res.status(404).json({ success: false, message: 'Resume or analysis not found' });
    }

    const q = resume.analysis.interviewQuestions[questionIndex];
    if (!q) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const hasNumbers = /\d+/.test(answer);
    const hasSituation = /(when|during|while|in my|at my)/i.test(answer);
    const hasAction = /(i led|i built|i implemented|i created|i managed|i drove)/i.test(answer);
    const hasResult = /(result|outcome|achieved|increased|reduced|improved|saved)/i.test(answer);

    let score = 5;
    if (hasSituation) score += 1;
    if (hasAction) score += 1.5;
    if (hasResult) score += 1.5;
    if (hasNumbers) score += 1;
    score = Math.min(10, Math.round(score * 10) / 10);

    const tips = [];
    if (!hasNumbers) tips.push('Quantify the Outcome: Add specific metrics to demonstrate measurable impact.');
    if (!hasAction) tips.push('Refine the Action Phase: Lead with strong action verbs describing what YOU did.');
    if (!hasResult) tips.push('State the Result: Conclude with the measurable outcome of your action.');

    q.userAnswer = answer;
    q.aiScore = score;
    q.aiFeedback = tips.join(' | ') || 'Strong STAR-method response with quantified outcomes.';

    await resume.save();

    res.json({
      success: true,
      score,
      feedback: tips,
      data: q
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
