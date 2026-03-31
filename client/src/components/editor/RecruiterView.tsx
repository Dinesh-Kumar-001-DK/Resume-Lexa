import React from 'react';
import { Resume } from '../../types';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';
import { MapPin, DollarSign, Zap, Star, ChevronRight } from 'lucide-react';

interface RecruiterViewProps {
  resume: Resume;
  onClose: () => void;
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ resume, onClose }) => {
  const a = resume.analysis;

  const ATS_KEYS = ['Design Systems', 'Data Viz', 'B2B SaaS', 'Stakeholder Mgmt'];
  const MANDATORY = [
    '7+ years in digital product design with a portfolio showcasing end-to-end product cycles.',
    'Expert mastery of Figma and advanced prototyping tools (Protopie, Framer).',
    'Demonstrated experience building and maintaining cross-functional design systems.',
  ];
  const PREFERRED = [
    'Previous experience in Fintech or high-complexity data environments.',
    'Ability to write clean CSS/HTML for high-fidelity prototyping.',
  ];
  const HOW_TO_WIN = [
    {
      num: '01',
      title: 'Lead with "Scale"',
      desc: "Frame your experience through the lens of efficiency and systems. Use terms like 'Atomic Design' and 'Design Tokens' in your summary.",
    },
    {
      num: '02',
      title: 'The "Editorial" Pivot',
      desc: "Emphasize documentation and presentation skills. They aren't just looking for a drawer of shapes; they want a storyteller.",
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(26,31,58,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--cream)', borderRadius: 20,
          width: '100%', maxWidth: 1020, maxHeight: '92vh',
          overflowY: 'auto', boxShadow: 'var(--shadow-lg)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 280px',
        }}
      >
        {/* Left nav (decorative sidebar) */}
        <div style={{ gridColumn: '1 / -1', background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>
            The Editorial Intelligence — Premium Recruiter Mode
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem' }}>×</button>
        </div>

        {/* Main content */}
        <div style={{ gridColumn: '1 / 3', padding: '2rem', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <p className="label">Analysis Report &nbsp;·&nbsp; REF: JD-9921-X</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.875rem', color: 'var(--navy)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            Senior Product Designer,{' '}
            <span style={{ color: 'var(--indigo)' }}>Strategic Systems</span>
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <MapPin size={13} /> San Francisco, CA (Hybrid)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <DollarSign size={13} /> $180k – $240k
            </span>
          </div>

          {/* Mission + ATS Keys */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.75rem' }}>Mission Summary</p>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                "This role is designed for a design practitioner who excels at the intersection of complex data visualization and human-centric interaction. You will be the editorial voice of our interface, ensuring every pixel serves a purpose in our mission to democratize enterprise intelligence."
              </p>
            </div>
            <div style={{ minWidth: 140 }}>
              <p className="label" style={{ marginBottom: '0.75rem' }}>ATS Key Phrases</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {ATS_KEYS.map(k => (
                  <span key={k} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)' }}>{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory + Preferred */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <span style={{ color: 'var(--green-score)' }}>✅</span>
                <p className="label">Mandatory Proficiencies</p>
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MANDATORY.map(m => <li key={m} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m}</li>)}
              </ul>
            </div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <Star size={14} color="var(--amber)" />
                <p className="label">Preferred Assets</p>
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PREFERRED.map(p => <li key={p} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p}</li>)}
              </ul>
            </div>
          </div>

          {/* Org DNA + Strategy */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <p className="label" style={{ marginBottom: '1rem' }}>Organizational DNA</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.875rem' }}>
                {[{ label: 'Autonomy & Speed', value: 'High', pct: 85 }, { label: 'Collaborative Depth', value: 'Medium', pct: 55 }].map(({ label, value, pct }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)' }}>{value}</span>
                    </div>
                    <ProgressBar value={pct} showValue={false} color={pct > 70 ? 'indigo' : 'amber'} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                "The JD emphasizes 'bias for action' and 'editorial precision' repeatedly, suggesting a culture of fast iteration with high craft expectations."
              </p>
            </div>

            <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius)', padding: '1.25rem', color: 'var(--white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p className="label" style={{ color: 'rgba(255,255,255,0.6)' }}>Strategic Strategy: How to Win</p>
                <Zap size={14} color="var(--gold-light)" />
              </div>
              {HOW_TO_WIN.map(({ num, title, desc }) => (
                <div key={num} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>{num}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--white)', marginBottom: '0.25rem' }}>{title}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right scorecard panel */}
        <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--white)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <p className="label" style={{ marginBottom: '1rem' }}>Editorial Scorecard</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <ScoreRing score={a ? Math.round(a.editorialScore / 10) : 84} size={96} label="COMPLEXITY" color="var(--navy)" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>JD Tone & Narrative</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Formal</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Academic</span>
            </div>
            <ProgressBar value={72} showValue={false} color="indigo" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              The language used is authoritative and structured, requiring a resume that mirrors this high-level professionalism.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p className="label" style={{ marginBottom: '0.625rem' }}>Urgency Index</p>
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '0.875rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Zap size={16} color="var(--amber)" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)' }}>Active Backfill</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Likely immediate start window</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p className="label" style={{ marginBottom: '0.625rem' }}>Suggested Resume Type</p>
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '0.875rem', borderLeft: '3px solid var(--indigo)' }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--indigo)', marginBottom: '0.25rem' }}>The Functional Modernist</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Focus on quantifiable impact within systems rather than a generic chronological list.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}>
              Generate Tailored Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterView;
