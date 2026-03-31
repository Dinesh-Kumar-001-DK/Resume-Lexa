const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  editorialScore: { type: Number, default: 0 },
  impact: { type: Number, default: 0 },
  clarity: { type: Number, default: 0 },
  jdMatch: { type: Number, default: 0 },
  twinScore: { type: Number, default: 0 },
  marketReadiness: { type: String, default: '' },
  atsScore: { type: Number, default: 0 },
  atsGrade: { type: String, default: 'F' },
  keywordAnalysis: {
    matched: [String],
    missing: [String],
    score: { type: Number, default: 0 }
  },
  formatAnalysis: {
    hasProperHeaders: { type: Boolean, default: true },
    hasBulletPoints: { type: Boolean, default: true },
    hasQuantifiedAchievements: { type: Boolean, default: false },
    issues: [String]
  },
  contentAnalysis: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  roleMatch: {
    matchPercentage: { type: Number, default: 0 },
    matchedSkills: [String],
    missingSkills: [String]
  },
  criticalImprovements: [{
    type: { type: String },
    original: String,
    suggested: String,
    applied: { type: Boolean, default: false }
  }],
  detectedGenericPhrases: [{
    phrase: String,
    matchPercent: Number,
    suggestion: String
  }],
  benchmarkGaps: [{
    title: String,
    description: String,
    resolved: { type: Boolean, default: false }
  }],
  interviewQuestions: [{
    question: String,
    userAnswer: { type: String, default: '' },
    aiScore: { type: Number, default: null },
    aiFeedback: { type: String, default: '' }
  }],
  analyzedAt: { type: Date, default: Date.now }
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Resume content is required']
  },
  jobDescription: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  version: {
    type: String,
    default: 'v1.0'
  },
  status: {
    type: String,
    enum: ['draft', 'analyzed', 'optimized'],
    default: 'draft'
  },
  analysis: {
    type: analysisSchema,
    default: null
  },
  tags: [String],
  isArchived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

resumeSchema.index({ createdAt: -1 });
resumeSchema.index({ status: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
