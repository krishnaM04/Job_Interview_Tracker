import React from 'react';

const ProgressBar = ({ 
  value = 0,
  max = 100,
  variant = 'primary',
  showLabel = true,
  animated = true,
  size = 'medium'
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  const variantColors = {
    primary: 'var(--accent)',
    success: 'var(--success)',
    warning: '#ffa500',
    danger: 'var(--error)'
  };

  const sizeHeights = {
    small: '6px',
    medium: '12px',
    large: '20px'
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: sizeHeights[size],
        backgroundColor: 'var(--border)',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: variantColors[variant],
            transition: animated ? 'width 0.3s ease' : 'none',
            borderRadius: '10px'
          }}
        />
      </div>
      {showLabel && (
        <div style={{
          marginTop: '8px',
          fontSize: '14px',
          color: 'var(--text)',
          textAlign: 'right'
        }}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
