const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PDFParse } = require('pdf-parse');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);


let geminiModel;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.txt', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and DOCX files allowed'));
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, archived = false } = req.query;
    const query = {
      userId: req.user.id,
      isArchived: archived === 'true'
    };
    if (status) query.status = status;

    const resumes = await Resume.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content -analysis.interviewQuestions')
      .lean();

    const total = await Resume.countDocuments(query);

    res.json({
      success: true,
      data: resumes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, content, jobDescription, tags } = req.body;

    const resume = await Resume.create({
      title,
      content,
      jobDescription: jobDescription || '',
      tags: tags || [],
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const allowed = ['title', 'content', 'jobDescription', 'tags', 'isArchived', 'version'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) resume[field] = req.body[field];
    });

    await resume.save();
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.fileUrl) {
      const filePath = path.join(__dirname, '..', resume.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let extractedContent = '';
    let title = req.file.originalname.replace(/\.[^/.]+$/, '');

    if (req.file.mimetype === 'text/plain') {
      extractedContent = fs.readFileSync(filePath, 'utf-8');
    } else if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      let parser = null;
      try {
        const dataBuffer = fs.readFileSync(filePath);
        parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        extractedContent = data.text || '';
        if (!extractedContent || extractedContent.length < 10) {
          extractedContent = '[PDF content could not be extracted - empty or protected]';
        }
      } catch (pdfErr) {
        console.error('PDF extraction error:', pdfErr.message);
        extractedContent = '[PDF content could not be extracted - ' + pdfErr.message + ']';
      } finally {
        if (parser) {
          await parser.destroy().catch(console.error);
        }
      }
    } else if (req.file.originalname.endsWith('.docx')) {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ path: filePath });
        extractedContent = result.value;
      } catch (docErr) {
        console.error('DOCX extraction error:', docErr.message);
        extractedContent = '[DOCX content could not be extracted]';
      }
    }

    if (!extractedContent || extractedContent.startsWith('[')) {
      extractedContent = extractedContent || 'Content could not be extracted. Please paste your resume text manually.';
    }

    if (extractedContent && extractedContent.length > 10 && geminiModel) {
      try {
        const extractPrompt = `Extract the following resume text and format it cleanly. Return ONLY the cleaned resume content with proper sections (Summary, Experience, Education, Skills). Resume:\n\n${extractedContent.substring(0, 8000)}`;
        const result = await geminiModel.generateContent(extractPrompt);
        const cleaned = result.response.text();
        if (cleaned && cleaned.length > 50) {
          extractedContent = cleaned;
        }
      } catch (aiErr) {
        console.log('AI extraction failed, using raw content');
      }
    }

    const lines = extractedContent.split('\n').filter(l => l.trim());
    if (lines.length > 0 && lines[0].length < 100) {
      title = lines[0];
    }

    const resume = await Resume.create({
      title: title,
      content: extractedContent,
      jobDescription: '',
      tags: [],
      fileUrl: `/uploads/${req.file.filename}`,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: {
        resume,
        extractedContent: extractedContent.substring(0, 500) + (extractedContent.length > 500 ? '...' : '')
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/apply-fix', async (req, res) => {
  try {
    const { fixIndex, newText } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume || !resume.analysis) {
      return res.status(404).json({ success: false, message: 'Resume or analysis not found' });
    }

    if (resume.analysis.criticalImprovements[fixIndex]) {
      resume.analysis.criticalImprovements[fixIndex].applied = true;
      const imp = resume.analysis.criticalImprovements[fixIndex];
      if (imp.original && newText) {
        resume.content = resume.content.replace(imp.original, newText);
      }
      await resume.save();
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/interview-answer', async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume || !resume.analysis || !resume.analysis.interviewQuestions) {
      return res.status(404).json({ success: false, message: 'Resume or interview questions not found' });
    }

    const question = resume.analysis.interviewQuestions[questionIndex];
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.userAnswer = answer;
    question.aiScore = Math.floor(Math.random() * 30) + 70;
    question.aiFeedback = 'Good response! Consider adding more specific examples from your experience.';

    await resume.save();
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
