import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../utils/api';
import { Resume, TabType } from '../types';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  isAnalyzing: boolean;
  isSaving: boolean;
  activeTab: TabType;
  fetchResumes: () => Promise<void>;
  fetchResume: (id: string) => Promise<void>;
  createResume: (data: { title: string; content: string; jobDescription?: string; version?: string; tags?: string[] }) => Promise<Resume>;
  updateResume: (id: string, data: Partial<Resume>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  analyzeResume: (id: string) => Promise<void>;
  analyzeATS: (id: string) => Promise<void>;
  applyFix: (resumeId: string, suggestionIndex: number, newText: string) => Promise<void>;
  submitInterviewAnswer: (resumeId: string, questionIndex: number, answer: string) => Promise<{ score: number; feedback: string }>;
  setActiveTab: (tab: TabType) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const API_URL = '/resumes';

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('editor');

  const fetchResumes = async () => {
    const res = await api.get(API_URL);
    setResumes(res.data.data || []);
  };

  const fetchResume = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`);
    setCurrentResume(res.data.data || res.data);
  };

  const createResume = async (data: { title: string; content: string; jobDescription?: string; version?: string; tags?: string[] }) => {
    setIsSaving(true);
    try {
      const res = await api.post(API_URL, data);
      const newResume = res.data.data || res.data;
      setResumes([...resumes, newResume]);
      return newResume;
    } finally {
      setIsSaving(false);
    }
  };

  const updateResume = async (id: string, data: Partial<Resume>) => {
    setIsSaving(true);
    try {
      const res = await api.put(`${API_URL}/${id}`, data);
      const updated = res.data.data || res.data;
      setCurrentResume(updated);
      setResumes(resumes.map(r => r._id === id ? updated : r));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteResume = async (id: string) => {
    await api.delete(`${API_URL}/${id}`);
    setResumes(resumes.filter(r => r._id !== id));
  };

  const analyzeResume = async (id: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.post(`/analysis/${id}`);
      const analyzed = res.data.data || res.data;
      setCurrentResume(analyzed);
      setResumes(resumes.map(r => r._id === id ? analyzed : r));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeATS = async (id: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.post(`/ats/${id}`);
      const analyzed = res.data.data || res.data;
      setCurrentResume(analyzed);
      setResumes(resumes.map(r => r._id === id ? analyzed : r));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyFix = async (resumeId: string, suggestionIndex: number, newText: string) => {
    const res = await api.post(`${API_URL}/${resumeId}/apply-fix`, { fixIndex: suggestionIndex, newText });
    const fixed = res.data.data || res.data;
    setCurrentResume(fixed);
    setResumes(resumes.map(r => r._id === resumeId ? fixed : r));
  };

  const submitInterviewAnswer = async (resumeId: string, questionIndex: number, answer: string) => {
    const res = await api.post(`/analysis/${resumeId}/interview-answer`, { questionIndex, answer });
    const result = res.data.data || res.data;
    setCurrentResume(result);
    const q = result.analysis.interviewQuestions[questionIndex];
    return { score: q.aiScore, feedback: q.aiFeedback };
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      currentResume,
      isAnalyzing,
      isSaving,
      activeTab,
      fetchResumes,
      fetchResume,
      createResume,
      updateResume,
      deleteResume,
      analyzeResume,
      analyzeATS,
      applyFix,
      submitInterviewAnswer,
      setActiveTab,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
