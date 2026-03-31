import React from 'react';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: 'indigo' | 'green' | 'amber';
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = true,
  color = 'indigo',
  height = 5,
}) => {
  const colorMap = {
    indigo: 'var(--indigo)',
    green: 'var(--green-score)',
    amber: 'var(--amber)',
  };

  return (
    <div style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 6,
        }}>
          {label && (
            <span style={{
              fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500,
            }}>{label}</span>
          )}
          {showValue && (
            <span style={{
              fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)',
            }}>{value}%</span>
          )}
        </div>
      )}
      <div style={{
        height, background: 'var(--cream-dark)',
        borderRadius: 999, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, value)}%`,
          background: colorMap[color],
          borderRadius: 999,
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
