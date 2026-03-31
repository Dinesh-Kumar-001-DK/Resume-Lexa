import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import Navbar from '../components/layout/Navbar';
import ScoreRing from '../components/common/ScoreRing';
import { Plus, FileText, Trash2, Archive, ChevronRight, BarChart2 } from 'lucide-react';
import { Resume } from '../types';
import { toast } from 'react-toastify';
import api from '../utils/api';

const DashboardPage: React.FC = () => {
  const { resumes, fetchResumes, deleteResume } = useResume();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalResumes: 0, analyzedResumes: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchResumes();
      try {
        const { data } = await api.get('/users/dashboard');
        setStats(data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [fetchResumes]);

  const statusColor = (status: string) => {
    if (status === 'analyzed') return 'var(--green-score)';
    if (status === 'optimized') return 'var(--indigo)';
    return 'var(--amber)';
  };

  const statusLabel = (status: string) => {
    if (status === 'analyzed') return 'Analyzed';
    if (status === 'optimized') return 'Optimized';
    return 'Draft';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)' }}>
          <div className="spinner dark" style={{ width: 32, height: 32 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <p className="label" style={{ marginBottom: '0.375rem' }}>Editorial Desk</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--navy)' }}>
              Welcome to your editorial workspace.
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
              Your professional narrative engine is ready.
            </p>
          </div>
          <Link to="/resume/new" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Plus size={16} />
            New Resume
          </Link>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem',
        }}>
          {[
            { label: 'Total Resumes', value: stats.totalResumes, icon: <FileText size={18} color="var(--indigo)" /> },
            { label: 'Analyzed', value: stats.analyzedResumes, icon: <BarChart2 size={18} color="var(--green-score)" /> },
            { label: 'Avg. Score', value: stats.avgScore || '—', icon: <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--amber)' }} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--cream)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{icon}</div>
              <div>
                <p className="label" style={{ marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem' }}>
            Your Manuscripts
          </h2>

          {resumes.length === 0 ? (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'var(--cream)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <FileText size={28} color="var(--text-muted)" />
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                No resumes yet
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Upload your first resume to begin your editorial analysis.
              </p>
              <Link to="/resume/new" className="btn btn-primary">
                <Plus size={15} /> Create Your First Resume
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resumes.map((resume: Resume) => (
                <div
                  key={resume._id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center',
                    gap: '1.25rem', cursor: 'pointer',
                    transition: 'box-shadow var(--transition), transform var(--transition)',
                  }}
                  onClick={() => navigate(`/resume/${resume._id}`)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  {resume.analysis ? (
                    <ScoreRing score={resume.analysis.editorialScore} size={56} strokeWidth={5} label="" />
                  ) : (
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'var(--cream)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={20} color="var(--text-muted)" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resume.title}
                      </h3>
                      <span style={{
                        background: statusColor(resume.status || 'draft') + '18',
                        color: statusColor(resume.status || 'draft'),
                        fontSize: '0.6875rem', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        padding: '0.15rem 0.5rem', borderRadius: 4,
                      }}>
                        {statusLabel(resume.status || 'draft')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {resume.version} · Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {resume.analysis && ` · Score: ${resume.analysis.editorialScore}`}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { toast.info('Archive coming soon'); }}
                      className="btn btn-ghost btn-sm"
                      title="Archive"
                    >
                      <Archive size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${resume.title}"?`)) deleteResume(resume._id);
                      }}
                      className="btn btn-ghost btn-sm"
                      title="Delete"
                      style={{ color: 'var(--red-alert)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center', marginTop: '4rem',
          padding: '2rem', background: 'var(--cream-dark)',
          borderRadius: 16,
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '1.0625rem', color: 'var(--text-secondary)',
          }}>
            "Precision is the hallmark of the distinguished professional."
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
