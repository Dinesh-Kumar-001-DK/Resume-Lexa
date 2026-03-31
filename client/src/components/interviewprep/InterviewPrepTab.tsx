import React, { useState } from 'react';
import { Resume } from '../../types';
import { useResume } from '../../context/ResumeContext';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';
import { CheckCircle, Wand2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface InterviewPrepTabProps { resume: Resume; }

const InterviewPrepTab: React.FC<InterviewPrepTabProps> = ({ resume }) => {
  const { submitInterviewAnswer } = useResume();
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, { score: number; feedback: string[] }>>({});
  const [loading, setLoading] = useState<number | null>(null);

  const a = resume.analysis;
  if (!a) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <p style={{ color: 'var(--text-muted)' }}>Run an analysis first to generate interview questions.</p>
    </div>
  );

  const handleEvaluate = async (idx: number) => {
    if (!answers[idx]?.trim()) { toast.error('Write your answer first'); return; }
    setLoading(idx);
    try {
      const res = await submitInterviewAnswer(resume._id, idx, answers[idx]);
      setResults(prev => ({ ...prev, [idx]: { score: res.score, feedback: [res.feedback] } }));
      setActiveQ(null);
    } catch {
      toast.error('Evaluation failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Main */}
      <div style={{ overflowY: 'auto', padding: '2rem' }}>
        <p className="label" style={{ marginBottom: '0.375rem' }}>Behavioral Simulator</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.375rem' }}>
          Predicted Interview Questions
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Based on your resume and the target job description, we've identified the most likely behavioral prompts you will encounter.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {a.interviewQuestions.map((q, idx) => (
            <div key={idx} style={{
              border: activeQ === idx ? '2px solid var(--navy)' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              transition: 'border-color var(--transition)',
            }}>
              {/* Question header */}
              <div
                onClick={() => setActiveQ(activeQ === idx ? null : idx)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.125rem 1.25rem', cursor: 'pointer', background: activeQ === idx ? 'var(--cream)' : 'var(--white)' }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: results[idx] ? 'var(--green-score)' : activeQ === idx ? 'var(--navy)' : 'var(--cream-dark)',
                  color: results[idx] || activeQ === idx ? 'var(--white)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {results[idx] ? '✓' : String(idx + 1).padStart(2, '0')}
                </div>
                <p style={{ fontWeight: 500, color: 'var(--navy)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  "{q.question}"
                </p>
              </div>

              {/* Score result */}
              {results[idx] && (
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--cream)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p className="label">AI Evaluation Result</p>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>
                      {results[idx].score}/10
                    </span>
                  </div>
                  {results[idx].feedback.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {results[idx].feedback.map((tip, ti) => (
                        <div key={ti} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                          <CheckCircle size={14} color="var(--green-score)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--navy)', marginBottom: '0.125rem' }}>
                              Improvement Tip
                            </p>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--green-score)', fontWeight: 500 }}>
                      Strong STAR-method response with quantified outcomes.
                    </p>
                  )}
                  <button onClick={() => setActiveQ(idx)} className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                    Revise Answer
                  </button>
                </div>
              )}

              {/* Answer area */}
              {activeQ === idx && !results[idx] && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                  <textarea
                    className="form-textarea"
                    placeholder="Type your STAR-method response here..."
                    value={answers[idx] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    style={{ minHeight: 130, marginTop: '1rem' }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEvaluate(idx)}
                    disabled={loading === idx}
                    className="btn btn-primary"
                    style={{ marginTop: '0.75rem', gap: '0.5rem' }}
                  >
                    {loading === idx ? <><div className="spinner" style={{ width: 15, height: 15 }} />Evaluating...</> : <>Evaluate Answer</>}
                  </button>
                </div>
              )}

              {/* Practice answer */}
              {activeQ !== idx && !results[idx] && (
                <div style={{ padding: '0 1.25rem 0.875rem' }}>
                  <button onClick={() => setActiveQ(idx)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                  }}>
                    Practice Answer →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <aside style={{ borderLeft: '1px solid var(--border)', background: 'var(--white)', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p className="label" style={{ marginBottom: '1rem' }}>Editorial Scorecard</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <ScoreRing score={a.editorialScore} size={100} label="" />
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>
            {a.editorialScore}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>/100</span>
          </p>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: 1.5 }}>
            Your resume is a <strong>94% match</strong> for core technical requirements, but behavioral readiness is at 72%.
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="label">Editorial Tone</p>
            <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>92%</span>
          </div>
          <ProgressBar value={92} showValue={false} color="green" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="label">Impact Metrics</p>
            <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>84%</span>
          </div>
          <ProgressBar value={84} showValue={false} color="green" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="label">Visual Hierarchy</p>
            <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>88%</span>
          </div>
          <ProgressBar value={88} showValue={false} color="green" />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
            <Wand2 size={14} /> Generate Bio
          </button>
        </div>
      </aside>
    </div>
  );
};

export default InterviewPrepTab;
