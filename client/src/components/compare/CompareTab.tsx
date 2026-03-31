import React from 'react';
import { Resume } from '../../types';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';
import { CheckCircle, XCircle, Star, TrendingUp, Eye, Cpu } from 'lucide-react';

interface CompareTabProps { resume: Resume; }

const WINNING_TRAITS = [
  { icon: '⭐', title: 'The "North Star" Hook', desc: 'Every top-tier resume starts with a 2-line high-impact statement that defines their unique value proposition immediately.' },
  { icon: '📊', title: 'Aggregated Impact Metrics', desc: 'Instead of listing tasks, they aggregate impact across years. E.g., "Led projects resulting in $2.4M cost savings over 3 fiscal years."' },
  { icon: '👁', title: 'Visual Hierarchy Logic', desc: "Utilizes 'F-pattern' scanning zones for critical skills, ensuring human reviewers find the 'why' in under 6 seconds." },
  { icon: 'A', title: 'Systemic Problem Solving', desc: 'Describes professional achievements through the lens of solving organizational complexity, not just technical tasks.' },
];

const CompareTab: React.FC<CompareTabProps> = ({ resume }) => {
  const a = resume.analysis;
  if (!a) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-muted)' }}>Run an analysis first to see benchmark comparison.</p>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', padding: '2rem' }}>
        <p className="label" style={{ marginBottom: '0.375rem' }}>Benchmark Analysis</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
          Editorial Benchmarking
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          Comparing your current profile against the top 1% of applicants in the modern tech ecosystem.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Your Resume */}
          <div>
            <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem', fontSize: '0.9375rem' }}>Your Resume</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <CheckCircle size={15} color="var(--green-score)" />
                <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--navy)' }}>Core Strengths</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Impact-Driven Syntax', desc: 'Your bullet points correctly prioritize metrics (e.g., "Increased efficiency by 40%").' },
                  { title: 'Technical Stack Alignment', desc: 'Direct mapping found for Cloud Infrastructure and Distributed Systems.' },
                ].map(({ title, desc }) => (
                  <div key={title} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <XCircle size={15} color="var(--red-alert)" />
                <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--navy)' }}>Identified Gaps</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {a.benchmarkGaps.map((gap, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <input type="checkbox" defaultChecked={gap.resolved} style={{ marginTop: '0.125rem', accentColor: 'var(--navy)' }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--navy)', marginBottom: '0.125rem' }}>{gap.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{gap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 1% Resume */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '0.9375rem' }}>Top 1% Resume</p>
              <span className="badge badge-gold">Gold Standard</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--navy)', marginBottom: '0.875rem' }}>Winning Editorial Traits</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {WINNING_TRAITS.map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)' }}>
                    {icon}
                  </div>
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScoreRing score={a.editorialScore} size={110} label="SCORE" />
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--green-score)' }}>Strong Candidate Match</p>

        <div>
          <p className="label" style={{ marginBottom: '1rem' }}>Match Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <ProgressBar label="Experience Alignment" value={a.impact} color="green" />
            <ProgressBar label="Skills Density" value={84} color="green" />
            <ProgressBar label="Editorial Quality" value={71} color="amber" />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <p className="label" style={{ marginBottom: '0.75rem' }}>Market Readiness</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
            {a.marketReadiness}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Relative to 1,240 applicants
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CompareTab;
