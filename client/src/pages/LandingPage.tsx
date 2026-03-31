import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Zap, Shield, ArrowRight, Star, LogIn } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)',
        background: 'var(--white)',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
          fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy)',
        }}>
          The Editorial Intelligence
        </span>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Guidelines', 'Pricing', 'Support'].map(item => (
            <a key={item} href="#" style={{
              fontSize: '0.875rem', color: 'var(--text-secondary)',
              textDecoration: 'none', fontWeight: 500,
              transition: 'color var(--transition)',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >{item}</a>
          ))}
          <Link to="/login" className="btn btn-outline btn-sm" style={{ gap: '0.3rem' }}>
            <LogIn size={14} />
            Sign In
          </Link>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Get Started</Link>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <section style={{
          maxWidth: 760, margin: '0 auto',
          padding: '5rem 2rem 3rem',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--navy)', color: 'var(--gold-light)',
            padding: '0.35rem 1rem', borderRadius: 999,
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '2rem',
          }}>
            <Zap size={11} />
            Intelligence Engine V2.0
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'var(--navy)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}>
            Unlock the power of<br />AI-driven editorial insights.
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 3rem',
          }}>
            Transform your professional narrative. Our editorial engine analyzes your resume with the precision of a top-tier recruiter.
          </p>

          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            maxWidth: 520,
            margin: '0 auto 3rem',
          }}>
            <Link to="/resume/new" style={{ textDecoration: 'none' }}>
              <div style={{
                border: '1.5px dashed var(--border-dark)',
                borderRadius: 12,
                padding: '3rem 2rem',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                marginBottom: '1.5rem',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--indigo)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,79,172,0.03)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dark)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: 'var(--cream)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Upload size={22} color="var(--indigo)" />
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>
                  Drop your resume
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Upload your .pdf or .txt resume to begin analysis
                </p>
              </div>
            </Link>

            <Link to="/resume/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: 10, padding: '0.875rem' }}>
              Select File
              <ArrowRight size={16} />
            </Link>

            <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>or link document</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="url"
                placeholder="https://drive.google.com/resume-link"
                className="form-input"
                style={{ flex: 1 }}
              />
              <Link to="/resume/new" className="btn btn-outline" style={{ flexShrink: 0 }}>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Shield size={12} /> Secure Encryption
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max File Size: 10MB</span>
            </div>
          </div>
        </section>

        <section style={{
          maxWidth: 900, margin: '0 auto',
          padding: '0 2rem 5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
        }}>
          {[
            {
              color: 'var(--indigo)',
              icon: <Star size={18} color="var(--indigo)" />,
              title: 'Editorial Precision',
              desc: 'Advanced NLP models trained on executive search criteria and top-tier publishing standards.',
            },
            {
              color: 'var(--green-score)',
              icon: <Zap size={18} color="var(--green-score)" />,
              title: 'Actionable Insights',
              desc: 'Receive clear, categorized suggestions to improve clarity, impact, and industry alignment.',
            },
            {
              color: 'var(--amber)',
              icon: <Shield size={18} color="var(--amber)" />,
              title: 'Privacy First',
              desc: 'Your data is processed securely and never shared. We value professional confidentiality.',
            },
          ].map(({ color, icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{
                width: 3, height: 24, background: color, borderRadius: 2,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon}
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy)' }}>
                  {title}
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 2 }}>
            The Editorial Intelligence
          </p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            © 2024 The Editorial Intelligence. High-end digital publishing for professional growth.
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Editorial Standards'].map(item => (
            <a key={item} href="#" style={{
              fontSize: '0.75rem', color: 'var(--text-muted)',
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{item}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
