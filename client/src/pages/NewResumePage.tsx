import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import Navbar from '../components/layout/Navbar';
import { CheckCircle, AlertTriangle, ChevronRight, Upload, FileText, X } from 'lucide-react';
import api from '../utils/api';

const FORMATS = [
  {
    id: 'chronological',
    label: 'Chronological',
    description: 'Best for vertical career growth and consistent employment history. Prioritizes recent achievements in reverse order.',
    tag: '98% MATCH FOR SENIOR PROFILE',
    recommended: true,
  },
  {
    id: 'functional',
    label: 'Functional',
    description: 'Focuses on skill mastery and expertise categories rather than chronological progression. Ideal for career pivots.',
    recommended: false,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    description: 'A contemporary blend of skill highlights and chronological history. Best for mid-career professionals.',
    recommended: false,
  },
];

const NewResumePage: React.FC = () => {
  const { createResume, isSaving } = useResume();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'format'>('details');
  const [selectedFormat, setSelectedFormat] = useState('chronological');
  const [form, setForm] = useState({
    title: '',
    content: '',
    jobDescription: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const { data } = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success && data.data?.resume) {
        setForm(f => ({
          ...f,
          title: data.data.resume.title || f.title,
          content: data.data.resume.content || f.content
        }));
        setUploadedFile({ name: file.name, size: file.size });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreate = async () => {
    try {
      const resume = await createResume({
        title: form.title || 'Untitled Resume',
        content: form.content,
        jobDescription: form.jobDescription,
        version: 'v1.0',
        tags: [selectedFormat],
      });
      navigate(`/resume/${resume._id}`);
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
        {/* Main panel */}
        <div>
          <p className="label" style={{ marginBottom: '0.375rem' }}>Editorial Desk · Draft v2.4</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
            {step === 'details' ? 'Manuscript Setup' : 'Manuscript Orchestration'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            {step === 'details'
              ? 'Provide your resume content to begin the editorial analysis.'
              : 'Define the structural narrative of your professional history.'}
          </p>

          {step === 'details' ? (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Resume Title</label>
                <input
                  className="form-input" type="text"
                  placeholder="e.g. Senior Product Manager — TechCorp 2024"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume Content</label>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--cream)',
                    border: '1px dashed var(--border-dark)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--navy)',
                  }}>
                    <Upload size={16} />
                    {uploading ? 'Extracting...' : 'Upload Resume File (PDF, DOCX, TXT)'}
                  </label>
                  {uploadedFile && (
                    <span style={{
                      marginLeft: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.8125rem',
                      color: 'var(--green-score)',
                    }}>
                      <FileText size={14} />
                      {uploadedFile.name}
                      <X size={14} style={{ cursor: 'pointer' }} onClick={clearFile} />
                    </span>
                  )}
                </div>

                <textarea
                  className="form-textarea"
                  placeholder="Or paste your full resume text here..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  style={{ minHeight: 240 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Job Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional — improves JD Match score)</span></label>
                <textarea
                  className="form-textarea"
                  placeholder="Paste the job description here to calibrate the AI intelligence..."
                  value={form.jobDescription}
                  onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))}
                  style={{ minHeight: 120 }}
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ justifyContent: 'center' }}
                disabled={!form.content.trim()}
                onClick={() => setStep('format')}
              >
                Continue to Format Selection <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Format strategy banner */}
              <div style={{
                background: '#e8f5e9', border: '1px solid #a5d6a7',
                borderRadius: 'var(--radius)', padding: '0.875rem 1.125rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <CheckCircle size={16} color="var(--green-score)" />
                <span style={{ fontSize: '0.875rem', color: '#1b5e20', fontWeight: 500 }}>
                  Steady history found → Recommended: <strong>Chronological</strong>
                </span>
              </div>

              {/* Format cards */}
              {FORMATS.map((fmt, i) => (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    border: selectedFormat === fmt.id
                      ? '2px solid var(--navy)'
                      : '1px solid var(--border)',
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <p className="label" style={{ marginBottom: '0.25rem' }}>Option {String.fromCharCode(65 + i)}</p>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--navy)' }}>{fmt.label}</h3>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: `2px solid ${selectedFormat === fmt.id ? 'var(--navy)' : 'var(--border-dark)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selectedFormat === fmt.id && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy)' }} />
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{fmt.description}</p>
                  {fmt.tag && (
                    <p style={{ fontSize: '0.6875rem', color: 'var(--green-score)', fontWeight: 700, letterSpacing: '0.08em', marginTop: '0.625rem' }}>
                      {fmt.tag}
                    </p>
                  )}
                </div>
              ))}

              {/* CTA */}
              <button
                className="btn btn-primary"
                style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
                onClick={handleCreate}
                disabled={isSaving}
              >
                {isSaving
                  ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating...</>
                  : 'Start Architecting'
                }
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                AI will now begin drafting the primary structure
              </p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 72 }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>The Red Pen</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>6 Improvements Found</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <p className="label" style={{ color: 'var(--indigo)' }}>Analysis</p>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Experience level detected: <strong style={{ color: 'var(--navy)' }}>Senior Executive</strong>. Architecture should prioritize high-impact leadership metrics.
                </p>
              </div>

              <hr className="divider" />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <AlertTriangle size={13} color="var(--amber)" />
                  <p className="label">Career Gap</p>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "6-month gap identified in 2021. AI Suggestion: Utilize the Hybrid strategy to bridge narrative."
                </p>
              </div>

              <hr className="divider" />

              <div>
                <p className="label" style={{ marginBottom: '0.5rem' }}>Skill Strengths Extracted</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {['Strategic Planning', 'Stakeholder Management', 'Market Analysis', 'P&L Management'].map(skill => (
                    <span key={skill} style={{
                      background: 'var(--cream)', border: '1px solid var(--border)',
                      borderRadius: 4, padding: '0.2rem 0.6rem',
                      fontSize: '0.75rem', fontWeight: 500, color: 'var(--navy)',
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewResumePage;
