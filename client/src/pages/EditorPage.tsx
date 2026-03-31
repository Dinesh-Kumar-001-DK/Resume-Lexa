import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { TabType } from '../types';
import Navbar from '../components/layout/Navbar';
import EditorTab from '../components/editor/EditorTab';
import CompareTab from '../components/compare/CompareTab';
import TwinScoreTab from '../components/twinscore/TwinScoreTab';
import InterviewPrepTab from '../components/interviewprep/InterviewPrepTab';
import ATSTab from '../components/ats/ATSTab';
import AnalysisReport from '../components/editor/AnalysisReport';
import RecruiterView from '../components/editor/RecruiterView';

const TABS: { id: TabType; label: string }[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'compare', label: 'Compare' },
  { id: 'twinscore', label: 'Twin Score' },
  { id: 'interviewprep', label: 'Interview Prep' },
  { id: 'ats', label: 'ATS Score' },
];

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResume, fetchResume, analyzeResume, isAnalyzing, activeTab, setActiveTab } = useResume();
  const [pageLoading, setPageLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showRecruiter, setShowRecruiter] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/dashboard'); return; }
    fetchResume(id).finally(() => setPageLoading(false));
  }, [id, fetchResume, navigate]);

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)' }}>
          <div className="spinner dark" style={{ width: 32, height: 32 }} />
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Resume not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const score = currentResume.analysis?.editorialScore ?? null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        score={score}
        onAnalyze={() => analyzeResume(currentResume._id)}
        isAnalyzing={isAnalyzing}
        showActions
      />

      {/* Tab bar */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.25rem',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1rem', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--navy)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--navy)' : '2px solid transparent',
              marginBottom: -1, transition: 'all var(--transition)',
              letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            }}
          >
            {tab.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Extra actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {isAnalyzing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--indigo)' }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--green-score)',
                animation: 'pulse-dot 1.4s ease-in-out infinite',
              }} />
              Analyzing...
            </div>
          )}
          {currentResume.analysis && (
            <>
              <button
                onClick={() => setShowReport(true)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Full Report
              </button>
              <button
                onClick={() => setShowRecruiter(true)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Recruiter View
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'editor'        && <EditorTab        resume={currentResume} />}
        {activeTab === 'compare'       && <CompareTab       resume={currentResume} />}
        {activeTab === 'twinscore'     && <TwinScoreTab     resume={currentResume} />}
        {activeTab === 'interviewprep' && <InterviewPrepTab resume={currentResume} />}
        {activeTab === 'ats'          && <ATSTab />}
      </div>

      {/* Footer bar */}
      <div style={{
        background: 'var(--white)', borderTop: '1px solid var(--border)',
        padding: '0.625rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.6875rem', color: 'var(--text-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        <span>The Editorial Intelligence © 2024</span>
        <button
          onClick={() => navigator.clipboard.writeText(currentResume.content)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.6875rem', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}
        >
          📄 Copy Improved Resume
        </button>
      </div>

      {/* Modals */}
      {showReport && currentResume.analysis && (
        <AnalysisReport resume={currentResume} onClose={() => setShowReport(false)} />
      )}
      {showRecruiter && (
        <RecruiterView resume={currentResume} onClose={() => setShowRecruiter(false)} />
      )}
    </div>
  );
};

export default EditorPage;
