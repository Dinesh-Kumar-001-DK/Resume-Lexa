export interface CriticalImprovement {
  type: 'VAGUE_LANGUAGE' | 'SPELLING_ERROR' | 'MISSING_KEYWORD';
  original: string | null;
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

export interface Analysis {
  editorialScore: number;
  impact: number;
  clarity: number;
  jdMatch: number;
  twinScore: number;
  marketReadiness: string;
  criticalImprovements: CriticalImprovement[];
  detectedGenericPhrases: GenericPhrase[];
  benchmarkGaps: BenchmarkGap[];
  interviewQuestions: InterviewQuestion[];
  analyzedAt: string;
}

export interface Resume {
  _id: string;
  title: string;
  content: string;
  jobDescription: string;
  fileUrl: string | null;
  fileName: string | null;
  version: string;
  status: 'draft' | 'analyzed' | 'optimized';
  analysis: Analysis | null;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardStats {
  totalResumes: number;
  analyzedResumes: number;
  avgScore: number;
  recentResumes: Resume[];
}

export type TabType = 'editor' | 'compare' | 'twinscore' | 'interviewprep';
