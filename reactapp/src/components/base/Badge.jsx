import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  style = {}
}) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--border)',
      color: 'var(--text)',
      fontWeight: '600'
    },
    primary: {
      backgroundColor: 'var(--accent-light)',
      color: 'var(--accent)',
      fontWeight: '600'
    },
    success: {
      backgroundColor: 'var(--success-light)',
      color: 'var(--success)',
      fontWeight: '600'
    },
    warning: {
      backgroundColor: 'var(--warning-light)',
      color: 'var(--warning)',
      fontWeight: '600'
    },
    danger: {
      backgroundColor: 'var(--error-light)',
      color: 'var(--error)',
      fontWeight: '600'
    },
    info: {
      backgroundColor: 'var(--info-light)',
      color: 'var(--info)',
      fontWeight: '600'
    },
    pending: {
      backgroundColor: 'var(--warning-light)',
      color: 'var(--warning)',
      fontWeight: '600'
    },
    declined: {
      backgroundColor: 'var(--error-light)',
      color: 'var(--error)',
      fontWeight: '600'
    },
    offer: {
      backgroundColor: 'var(--success-light)',
      color: 'var(--success)',
      fontWeight: '600'
    }
  };

  const sizeStyles = {
    small: { padding: '5px 10px', fontSize: '12px' },
    medium: { padding: '6px 14px', fontSize: '13px' },
    large: { padding: '8px 16px', fontSize: '14px' }
  };

  return (
    <span
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        textTransform: 'capitalize',
        letterSpacing: '0.2px',
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
