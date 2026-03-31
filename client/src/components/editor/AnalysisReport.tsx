import React, { useState } from 'react';
import { Resume } from '../../types';
import { useResume } from '../../context/ResumeContext';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface AnalysisReportProps {
  resume: Resume;
  onClose: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ resume, onClose }) => {
  const { applyFix, updateResume } = useResume();
  const [applying, setApplying] = useState(false);
  const a = resume.analysis;
  if (!a) return null;

  const handleApplyAll = async () => {
    setApplying(true);
    // Apply all unapplied fixes sequentially
    for (let i = 0; i < a.criticalImprovements.length; i++) {
      const imp = a.criticalImprovements[i];
      if (!imp.applied && imp.original) {
        await applyFix(resume._id, i, imp.suggested);
      }
    }
    setApplying(false);
  };

  const JD_ALIGNMENT = [
    { label: 'MET (8)', tags: ['Python', 'Leadership', 'React', 'Unit Testing'], color: 'var(--green-score)' },
    { label: 'PARTIAL (3)', tags: ['Cloud Architecture', 'System Design'], color: 'var(--amber)' },
    { label: 'GAP (2)', tags: ['Kubernetes', 'Golang'], color: 'var(--red-alert)' },
  ];

  const NEXT_ACTIONS = [
    {
      priority: 'PRIORITY 1',
      title: "Add 'Kubernetes' to Skills",
      desc: "It's mentioned 4 times in the JD. Mention your local minikube projects or side labs.",
    },
    {
      priority: 'PRIORITY 2',
      title: "Quantify 'Lead Developer' Role",
      desc: 'Current text: "Led development team." Change to: "Led team of 5 to launch X within 6 months."',
    },
    {
      priority: 'PRIORITY 3',
      title: 'Rename Section Headers',
      desc: 'Use "Professional Experience" instead of "Where I\'ve Worked" for better ATS parsing.',
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(26,31,58,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: 20,
          width: '100%', maxWidth: 900, maxHeight: '90vh',
          overflowY: 'auto', boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '2rem',
          padding: '2rem', borderBottom: '1px solid var(--border)',
          background: 'var(--cream)',
        }}>
          <ScoreRing score={a.editorialScore} size={96} label="EDITORIAL SCORE" />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'IMPACT', sublabel: 'Metric Density', value: a.impact, desc: 'Strong use of quantifiable achievements in 85% of bullet points.', color: 'green' as const },
              { label: 'CLARITY', sublabel: 'Action Verbs', value: a.clarity, desc: 'Passive voice detected in summary section. Recommend active tone.', color: 'amber' as const },
              { label: 'JD MATCH', sublabel: 'Skill Alignment', value: a.jdMatch, desc: `Missing: 'Stakeholder Management' & 'Agile Methodologies'.`, color: 'amber' as const },
            ].map(({ label, sublabel, value, desc, color }) => (
              <div key={label} style={{
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <p className="label">{label}</p>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>{value}%</span>
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{sublabel}</p>
                <ProgressBar value={value} showValue={false} color={color} height={4} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.4 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improve All Queue */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.25rem' }}>Proposed Refinements</p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', color: 'var(--navy)' }}>
                The 'Improve All' Queue
              </h3>
            </div>
            <button
              onClick={handleApplyAll}
              disabled={applying}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.375rem' }}
            >
              {applying ? <><div className="spinner" style={{ width: 14, height: 14 }} />Applying...</> : '✦ Apply All Fixes'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {/* Spelling & Grammar */}
            <div style={{ border: '1.5px solid var(--red-alert)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: '#fde8e8', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-alert)', display: 'inline-block' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red-alert)' }}>Spelling & Grammar</p>
              </div>
              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Original</p>
                  <p style={{ fontSize: '0.875rem', background: 'var(--cream)', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                    Managed multiple <mark style={{ background: '#fecaca', borderRadius: 2, padding: '0 2px' }}>proyects</mark> across regions.
                  </p>
                </div>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Proposed</p>
                  <p style={{ fontSize: '0.875rem', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                    Managed multiple <mark style={{ background: '#bbf7d0', borderRadius: 2, padding: '0 2px' }}>projects</mark> across regions.
                  </p>
                </div>
              </div>
            </div>

            {/* Weak Phrasing */}
            <div style={{ border: '1.5px solid var(--amber)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: '#fff8e1', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>🔶</span>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#856404' }}>Weak Phrasing</p>
              </div>
              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Original</p>
                  <p style={{ fontSize: '0.875rem', background: 'var(--cream)', padding: '0.5rem 0.75rem', borderRadius: 4, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "Responsible for leading the team to success."
                  </p>
                </div>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Proposed</p>
                  <p style={{ fontSize: '0.875rem', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                    "Spearheaded a cross-functional team of 12, delivering projects 15% ahead of schedule."
                  </p>
                </div>
              </div>
            </div>

            {/* Keyword Enhancement */}
            <div style={{ border: '1.5px solid var(--indigo)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: '#e8f0fe', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>🔵</span>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--indigo)' }}>Keyword Enhancement</p>
              </div>
              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Original</p>
                  <p style={{ fontSize: '0.875rem', background: 'var(--cream)', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                    Software Engineer with experience in cloud deployments.
                  </p>
                </div>
                <div>
                  <p className="label" style={{ marginBottom: '0.375rem' }}>Proposed</p>
                  <p style={{ fontSize: '0.875rem', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                    AWS Certified Cloud Architect specializing in <strong>Kubernetes</strong>, <strong>Terraform</strong>, and CI/CD pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* JD Alignment + Next Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem', fontSize: '0.9375rem' }}>JD Alignment Map</h4>
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {JD_ALIGNMENT.map(({ label, tags, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color, minWidth: 80 }}>{label}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {tags.map(tag => (
                        <span key={tag} style={{
                          background: 'var(--white)', border: `1.5px solid ${color}30`,
                          color, borderRadius: 4, padding: '0.15rem 0.5rem',
                          fontSize: '0.75rem', fontWeight: 600,
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem', fontSize: '0.9375rem' }}>Next Best Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {NEXT_ACTIONS.map(({ priority, title, desc }) => (
                  <div key={priority} style={{
                    background: 'var(--cream)', borderRadius: 'var(--radius)',
                    padding: '1rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                    cursor: 'pointer', transition: 'box-shadow var(--transition)',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <div style={{ flex: 1 }}>
                      <p className="label" style={{ marginBottom: '0.25rem', color: 'var(--indigo)' }}>{priority}</p>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div style={{
            marginTop: '2rem', padding: '1.5rem',
            background: 'var(--cream)', borderRadius: 12, textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '1rem' }}>
              "Precision is the hallmark of the distinguished professional."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 2rem', borderTop: '1px solid var(--border)', background: 'var(--cream)',
        }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            The Editorial Intelligence © 2024
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigator.clipboard.writeText(resume.content)} className="btn btn-outline btn-sm">
              📄 Copy Improved Resume
            </button>
            <button className="btn btn-primary btn-sm">
              Export Analysis Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
