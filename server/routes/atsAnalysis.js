const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

let genAI, model;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

function analyzeWithoutAI(content, jobDescription) {
  const contentLower = content.toLowerCase();
  const words = content.split(/\s+/).length;
  
  const jdWords = jobDescription ? new Set(jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3)) : new Set();
  const resumeWords = new Set(contentLower.split(/\W+/).filter(w => w.length > 3));
  
  const matched = [];
  const missing = [];
  
  jdWords.forEach(w => {
    if (resumeWords.has(w)) matched.push(w);
    else missing.push(w);
  });
  
  const keywordScore = jdWords.size > 0 ? Math.round((matched.length / jdWords.size) * 100) : 75;
  const atsScore = Math.min(95, Math.round(50 + (words / 10) + (keywordScore * 0.4)));
  const atsGrade = atsScore >= 90 ? 'A' : atsScore >= 80 ? 'B' : atsScore >= 70 ? 'C' : atsScore >= 60 ? 'D' : 'F';
  
  const hasHeaders = /^(experience|education|skills|summary|projects)/im.test(content);
  const hasBullets = content.includes('•') || content.includes('- ') || content.includes('* ');
  const hasQuantified = /\d+[%$]|\d+\s*(year|month|percent)/i.test(content);
  
  return {
    atsScore,
    atsGrade,
    keywordMatch: {
      found: matched.slice(0, 10),
      missing: missing.slice(0, 10),
      score: keywordScore
    },
    formatAnalysis: {
      hasProperHeaders: hasHeaders,
      hasBulletPoints: hasBullets,
      hasQuantifiedAchievements: hasQuantified,
      issues: [
        !hasHeaders && 'Missing section headers',
        !hasBullets && 'Use bullet points for readability',
        !hasQuantified && 'Add quantified achievements'
      ].filter(Boolean)
    },
    contentAnalysis: {
      strengths: ['Clear format', 'Good length'],
      weaknesses: ['Could use more keywords'],
      suggestions: ['Add more action verbs', 'Include metrics']
    },
    roleMatch: {
      matchPercentage: keywordScore,
      matchedSkills: matched.slice(0, 5),
      missingSkills: missing.slice(0, 5)
    }
  };
}

async function analyzeWithGemini(content, jobDescription) {
  if (!model) {
    return analyzeWithoutAI(content, jobDescription);
  }

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume against the job description and provide a detailed ATS analysis.

Resume:
${content}

Job Description:
${jobDescription || 'No job description provided'}

Provide your analysis in the following JSON format:
{
  "atsScore": <number 0-100>,
  "atsGrade": "<letter grade A-F>",
  "keywordMatch": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"],
    "score": <number 0-100>
  },
  "formatAnalysis": {
    "hasProperHeaders": <boolean>,
    "hasBulletPoints": <boolean>,
    "hasQuantifiedAchievements": <boolean>,
    "issues": ["issue1", "issue2"]
  },
  "contentAnalysis": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "roleMatch": {
    "matchPercentage": <number 0-100>,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3", "skill4"]
  }
}

Provide ONLY the JSON, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return analyzeWithoutAI(content, jobDescription);
  }
}

router.post('/:resumeId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const atsAnalysis = await analyzeWithGemini(resume.content, resume.jobDescription);

    resume.analysis = resume.analysis || {};
    resume.analysis.atsScore = atsAnalysis.atsScore;
    resume.analysis.atsGrade = atsAnalysis.atsGrade;
    resume.analysis.keywordAnalysis = {
      matched: atsAnalysis.keywordMatch?.found || [],
      missing: atsAnalysis.keywordMatch?.missing || [],
      score: atsAnalysis.keywordMatch?.score || 0
    };
    resume.analysis.formatAnalysis = atsAnalysis.formatAnalysis;
    resume.analysis.contentAnalysis = atsAnalysis.contentAnalysis;
    resume.analysis.roleMatch = atsAnalysis.roleMatch;
    
    await resume.save();

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
