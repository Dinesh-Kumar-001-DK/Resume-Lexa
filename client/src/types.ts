export interface Resume {
  _id: string;
  title: string;
  content: string;
  jobDescription?: string;
  analysis?: ResumeAnalysis;
  status?: 'draft' | 'analyzed' | 'optimized';
  version?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeAnalysis {
  editorialScore: number;
  overallScore: number;
  contentScore: number;
  impactScore: number;
  atsScore: number;
  atsGrade?: string;
  impact: number;
  clarity: number;
  jdMatch: number;
  twinScore: number;
  marketReadiness: string;
  suggestions: Suggestion[];
  keywordAnalysis: KeywordAnalysis;
  interviewReadiness?: InterviewReadiness;
  formatAnalysis?: FormatAnalysis;
  contentAnalysis?: ContentAnalysis;
  roleMatch?: RoleMatch;
  criticalImprovements: CriticalImprovement[];
  detectedGenericPhrases: GenericPhrase[];
  benchmarkGaps: BenchmarkGap[];
  interviewQuestions: InterviewQuestion[];
}

export interface FormatAnalysis {
  hasProperHeaders: boolean;
  hasBulletPoints: boolean;
  hasQuantifiedAchievements: boolean;
  issues: string[];
}

export interface ContentAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface RoleMatch {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface Suggestion {
  type: 'VAGUE_LANGUAGE' | 'SPELLING_ERROR' | 'MISSING_KEYWORD' | 'IMPROVEMENT';
  message: string;
  original: string;
  replacement?: string;
  position: { start: number; end: number };
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  score: number;
}

export interface InterviewReadiness {
  score: number;
  strengths: string[];
  improvements: string[];
  mockQuestions: string[];
}

export interface CriticalImprovement {
  type: string;
  original: string;
  suggested: string;
  applied: boolean;
}

export interface GenericPhrase {
  phrase: string;
  matchPercent: number;
  suggestion: string;
}

export interface BenchmarkGap {
  title: string;
  description: string;
  resolved: boolean;
}

export interface InterviewQuestion {
  question: string;
  userAnswer: string;
  aiScore: number | null;
  aiFeedback: string;
}

export type TabType = 'editor' | 'compare' | 'twinscore' | 'interviewprep' | 'ats';
