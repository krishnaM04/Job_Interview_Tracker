import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(91, 110, 255, 0.3)'
    },
    secondary: {
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      boxShadow: 'none'
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
    },
    success: {
      backgroundColor: 'var(--success)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent-light)',
      boxShadow: 'none'
    }
  };

  const sizeStyles = {
    small: { padding: '7px 16px', fontSize: '13px', minHeight: '36px' },
    medium: { padding: '10px 24px', fontSize: '14px', minHeight: '44px' },
    large: { padding: '14px 32px', fontSize: '16px', minHeight: '48px' }
  };

  const hoverStyles = {
    primary: { backgroundColor: 'var(--accent-hover)', boxShadow: '0 4px 12px rgba(91, 110, 255, 0.4)', transform: 'translateY(-1px)' },
    secondary: { backgroundColor: 'var(--border-light)', borderColor: 'var(--text-light)' },
    danger: { backgroundColor: '#dc2626', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)', transform: 'translateY(-1px)' },
    success: { backgroundColor: '#059669', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)', transform: 'translateY(-1px)' },
    ghost: { backgroundColor: 'var(--accent-light)' }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => !disabled && !loading && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...variantStyles[variant],
        ...(isHovered && !disabled && !loading ? hoverStyles[variant] : {}),
        width: fullWidth ? '100%' : 'auto',
        borderRadius: '7px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'all 0.2s ease',
        fontWeight: '600',
        letterSpacing: '0.3px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeStyles[size]
      }}
      className={className}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid #fff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      )}
      {children}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
