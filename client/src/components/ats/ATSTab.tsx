import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { toast } from 'react-toastify';
import ScoreRing from '../common/ScoreRing';

const ATSTab: React.FC = () => {
  const { currentResume, analyzeATS, isAnalyzing } = useResume();

  if (!currentResume) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select a resume to view ATS analysis
      </div>
    );
  }

  const handleAnalyzeATS = async () => {
    try {
      await analyzeATS(currentResume._id);
      toast.success('ATS Analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze ATS');
    }
  };

  const analysis = currentResume.analysis;
  const atsScore = analysis?.atsScore || 0;
  const atsGrade = analysis?.atsGrade || 'N/A';
  const keywordAnalysis = analysis?.keywordAnalysis;
  const formatAnalysis = analysis?.formatAnalysis;
  const contentAnalysis = analysis?.contentAnalysis;
  const roleMatch = analysis?.roleMatch;

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy)' }}>ATS Analysis</h2>
        <button
          onClick={handleAnalyzeATS}
          disabled={isAnalyzing}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run ATS Analysis'}
        </button>
      </div>

      {atsScore === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--cream)', borderRadius: 12 }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Run ATS analysis to see how your resume performs with applicant tracking systems
          </p>
          <button
            onClick={handleAnalyzeATS}
            disabled={isAnalyzing}
            className="btn btn-primary"
          >
            {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with Gemini AI'}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ScoreRing score={atsScore} size={80} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Score</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>{atsGrade}</p>
                </div>
              </div>
            </div>

            {roleMatch && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Role Match</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>{roleMatch.matchPercentage}%</p>
              </div>
            )}

            {keywordAnalysis && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Keyword Match</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>{keywordAnalysis.score}%</p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {keywordAnalysis && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Keywords</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Found ({keywordAnalysis.matched.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {keywordAnalysis.matched.map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--green)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8125rem' }}>{kw}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Missing ({keywordAnalysis.missing.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {keywordAnalysis.missing.map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8125rem' }}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {formatAnalysis && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Format Analysis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Proper Headers</span>
                    <span style={{ color: formatAnalysis.hasProperHeaders ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{formatAnalysis.hasProperHeaders ? 'Yes' : 'No'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Bullet Points</span>
                    <span style={{ color: formatAnalysis.hasBulletPoints ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{formatAnalysis.hasBulletPoints ? 'Yes' : 'No'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Quantified Achievements</span>
                    <span style={{ color: formatAnalysis.hasQuantifiedAchievements ? 'var(--green)' : 'var(--amber)', fontWeight: 600 }}>{formatAnalysis.hasQuantifiedAchievements ? 'Yes' : 'No'}</span>
                  </div>
                  {formatAnalysis.issues.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issues</p>
                      <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                        {formatAnalysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {contentAnalysis && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Content Analysis</h3>
                {contentAnalysis.strengths.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Strengths</p>
                    <ul style={{ fontSize: '0.8125rem', color: 'var(--text)', paddingLeft: '1rem' }}>
                      {contentAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {contentAnalysis.weaknesses.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Weaknesses</p>
                    <ul style={{ fontSize: '0.8125rem', color: 'var(--text)', paddingLeft: '1rem' }}>
                      {contentAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                {contentAnalysis.suggestions.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--indigo)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Suggestions</p>
                    <ul style={{ fontSize: '0.8125rem', color: 'var(--text)', paddingLeft: '1rem' }}>
                      {contentAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {roleMatch && (
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Skills Match</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Matched Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {roleMatch.matchedSkills.map((skill, i) => (
                      <span key={i} style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--green)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8125rem' }}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Missing Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {roleMatch.missingSkills.map((skill, i) => (
                      <span key={i} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8125rem' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ATSTab;
