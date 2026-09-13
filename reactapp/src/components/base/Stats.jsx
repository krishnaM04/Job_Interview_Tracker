import React from 'react';

const Stats = ({ 
  label = '',
  value = '0',
  sublabel = '',
  icon = null,
  trend = null,
  color = 'primary'
}) => {
  const colorMap = {
    primary: 'var(--accent)',
    success: 'var(--success)',
    warning: '#ffa500',
    danger: 'var(--error)'
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minHeight: '100px'
    }}>
      {icon && (
        <div style={{
          fontSize: '32px',
          color: colorMap[color],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          backgroundColor: `${colorMap[color]}20`,
          borderRadius: '8px',
          flexShrink: 0
        }}>
          {icon}
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--text)',
          opacity: 0.7,
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          {label}
        </div>

        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'var(--text)',
          marginBottom: '4px'
        }}>
          {value}
        </div>

        {sublabel && (
          <div style={{
            fontSize: '13px',
            color: 'var(--text)',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {sublabel}
            {trend && (
              <span style={{
                color: trend > 0 ? 'var(--success)' : 'var(--error)',
                fontWeight: '600'
              }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
