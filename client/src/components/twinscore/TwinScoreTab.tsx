import React from 'react';
import { Resume } from '../../types';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';

interface TwinScoreTabProps { resume: Resume; }

const TwinScoreTab: React.FC<TwinScoreTabProps> = ({ resume }) => {
  const a = resume.analysis;
  if (!a) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <p style={{ color: 'var(--text-muted)' }}>Run an analysis first to see your Twin Score.</p>
    </div>
  );

  const score = a.twinScore;
  const tier = score >= 80 ? 'TOP 5%' : score >= 65 ? 'TOP 15%' : 'TOP 30%';
  const headline = score >= 80 ? 'Highly original and standout' : score >= 65 ? 'Above average uniqueness' : 'Improve originality';

  const editorialRecs = [
    { icon: '✦', title: "Quantify Your 'Passion'", desc: 'Replace "Passionate leader" with "Led a cross-functional team of 12 to deliver $2M in annual savings."' },
    { icon: '↗', title: 'Use Industry Verbs', desc: "Switch generic 'managed' to 'orchestrated', 'streamlined', or 'architected' depending on the specific task." },
    { icon: '◎', title: 'Show, Don\'t Label', desc: 'Focus on the output of your soft skills rather than labeling the skill itself.' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', padding: '2rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--navy)', marginBottom: '0.375rem' }}>
            Twin Score
          </h2>
          <p className="label" style={{ marginBottom: '2rem' }}>Uniqueness & Market Positioning Analysis</p>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ScoreRing score={score} size={180} strokeWidth={10} label="INDEX" color="var(--navy)" />
            <div style={{
              position: 'absolute', top: -8, right: -8,
              background: 'var(--indigo)', color: 'var(--white)',
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em',
              padding: '0.25rem 0.625rem', borderRadius: 999,
            }}>
              {tier}
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--green-score)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            {headline}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto' }}>
            Your professional narrative avoids common clichés found in 82% of mid-to-senior level resumes in your industry.
          </p>
        </div>

        {/* Two-column: Generic Phrases + Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p className="label" style={{ marginBottom: '1rem' }}>Detected Generic Phrases</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {a.detectedGenericPhrases.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No generic phrases detected — excellent!</p>
              ) : a.detectedGenericPhrases.map((p, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>
                      "{p.phrase}"
                    </p>
                    <span style={{ color: 'var(--amber)', fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {p.matchPercent}% Match
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {p.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="label" style={{ marginBottom: '1rem' }}>Editorial Recommendations</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {editorialRecs.map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '0.875rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <span style={{ color: 'var(--indigo)', fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside style={{ borderLeft: '1px solid var(--border)', background: 'var(--white)', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p className="label" style={{ marginBottom: '1rem' }}>Score Summary</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ProgressBar label="Impact Score" value={a.impact} color="green" />
            <ProgressBar label="Readability" value={84} color="green" />
            <ProgressBar label="Editorial Clarity" value={a.clarity} color={a.clarity >= 80 ? 'green' : 'amber'} />
          </div>
        </div>

        <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '1rem', borderLeft: '3px solid var(--indigo)' }}>
          <p style={{ fontStyle: 'italic', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            "Your Twin Score is above average for this role, meaning you won't be easily filtered by automated tools in the initial screening phase."
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <p className="label" style={{ marginBottom: '0.5rem' }}>Market Context</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem' }}>↗</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Stable</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TwinScoreTab;
