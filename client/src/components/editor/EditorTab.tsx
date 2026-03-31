import React, { useState } from 'react';
import { Resume } from '../../types';
import { useResume } from '../../context/ResumeContext';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';
import { Bold, Italic, Underline, List, Wand2 } from 'lucide-react';

interface EditorTabProps { resume: Resume; }

const TYPE_META: Record<string, { label: string; cls: string }> = {
  VAGUE_LANGUAGE:  { label: 'Vague Language',  cls: 'badge badge-vague' },
  SPELLING_ERROR:  { label: 'Spelling Error',  cls: 'badge badge-spelling' },
  MISSING_KEYWORD: { label: 'Missing Keyword', cls: 'badge badge-keyword' },
};

const EditorTab: React.FC<EditorTabProps> = ({ resume }) => {
  const { updateResume, analyzeResume, applyFix, isAnalyzing } = useResume();
  const [content, setContent] = useState(resume.content);
  const [jobDesc, setJobDesc] = useState(resume.jobDescription || '');
  const [hasChanges, setHasChanges] = useState(false);
  const analysis = resume.analysis;

  const handleSave = async () => {
    await updateResume(resume._id, { content, jobDescription: jobDesc });
    setHasChanges(false);
  };

  const handleApplyFix = async (idx: number, suggested: string) => {
    const imp = analysis?.criticalImprovements[idx];
    if (!imp) return;
    await applyFix(resume._id, idx, suggested);
    if (imp.original) setContent(prev => prev.replace(imp.original!, suggested));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Left sidebar */}
      <aside style={{ borderRight: '1px solid var(--border)', background: 'var(--white)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
        <div>
          <p className="label" style={{ marginBottom: '0.5rem' }}>Input Source</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Editorial Analysis</p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: '0.75rem' }}>Resume Upload</p>
          <div style={{ border: '1.5px dashed var(--border-dark)', borderRadius: 10, padding: '1.25rem', textAlign: 'center', background: 'var(--cream)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>📄</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drop .pdf or .txt</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p className="label" style={{ marginBottom: '0.75rem' }}>Job Description</p>
          <textarea className="form-textarea" placeholder="Paste the target job description here to calibrate the AI intelligence..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} style={{ minHeight: 160, fontSize: '0.8125rem' }} />
        </div>
        <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave} disabled={!hasChanges}>
          {hasChanges ? '💾 Save Changes' : '✓ Saved'}
        </button>
      </aside>

      {/* Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
          {[{ icon: <Bold size={15} />, t: 'Bold' }, { icon: <Italic size={15} />, t: 'Italic' }, { icon: <Underline size={15} />, t: 'Underline' }].map(({ icon, t }) => (
            <button key={t} title={t} style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>{icon}</button>
          ))}
          <span style={{ color: 'var(--border)', margin: '0 0.25rem' }}>|</span>
          {['H1', 'H2'].map(h => (
            <button key={h} style={{ padding: '0.375rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>{h}</button>
          ))}
          <button style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}><List size={15} /></button>
          <div style={{ flex: 1 }} />
          <button onClick={() => analyzeResume(resume._id)} disabled={isAnalyzing} className="btn btn-indigo btn-sm" style={{ gap: '0.375rem' }}>
            <Wand2 size={14} />{isAnalyzing ? 'Analyzing...' : 'AI Fix ✦'}
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#fafaf8' }}>
          <div className="card" style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem', minHeight: 600 }}>
            <textarea value={content} onChange={e => { setContent(e.target.value); setHasChanges(e.target.value !== resume.content); }}
              style={{ width: '100%', minHeight: 500, border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-primary)', background: 'transparent', resize: 'none' }}
              placeholder="Your resume content appears here. You can edit it directly..." />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside style={{ borderLeft: '1px solid var(--border)', background: 'var(--white)', padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p className="label">AI Analysis</p>
            <button onClick={() => analyzeResume(resume._id)} disabled={isAnalyzing} style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '0.25rem 0.625rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              {isAnalyzing ? '...' : 'Improve All'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            {analysis
              ? <ScoreRing score={analysis.editorialScore} size={110} label="EDITORIAL SCORE" />
              : <div style={{ width: 110, height: 110, borderRadius: '50%', border: '8px solid var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Analyze<br />to score</p></div>
            }
          </div>
          {analysis && (
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              {[{ label: 'Impact', value: analysis.impact }, { label: 'Clarity', value: analysis.clarity }, { label: 'JD Match', value: analysis.jdMatch }].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>{value}</p>
                  <p className="label" style={{ fontSize: '0.6rem' }}>{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {analysis && (
          <>
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <p className="label">Twin Score Match</p>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)' }}>{analysis.twinScore}%</span>
              </div>
              <ProgressBar value={analysis.twinScore} showValue={false} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.625rem' }}>
                Your resume reflects strong alignment with the Job Description's core requirements.
              </p>
            </div>

            {analysis.criticalImprovements.some(i => !i.applied) && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <p className="label" style={{ marginBottom: '0.875rem' }}>Critical Improvements</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analysis.criticalImprovements.map((imp, idx) => !imp.applied && (
                    <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
                      <span className={TYPE_META[imp.type]?.cls || 'badge'} style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                        {TYPE_META[imp.type]?.label || imp.type}
                      </span>
                      {imp.original && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontStyle: 'italic', marginBottom: '0.25rem' }}>"{imp.original}"</p>}
                      <p style={{ fontSize: '0.8125rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>"{imp.suggested}"</p>
                      <button onClick={() => handleApplyFix(idx, imp.suggested)} style={{ width: '100%', padding: '0.45rem', background: 'var(--navy)', color: 'var(--white)', border: 'none', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Apply Fix
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <button onClick={() => navigator.clipboard.writeText(content)} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            📄 Copy Improved Resume
          </button>
        </div>
      </aside>
    </div>
  );
};

export default EditorTab;
