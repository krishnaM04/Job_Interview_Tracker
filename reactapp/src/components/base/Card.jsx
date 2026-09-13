import React, { useState } from 'react';

const Card = ({ 
  children, 
  title = null,
  subtitle = null,
  footer = null,
  hoverable = false,
  className = '',
  style = {},
  onClick = null
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: isHovered && (hoverable || onClick) ? 'var(--shadow-md)' : 'var(--shadow)',
        cursor: hoverable || onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isHovered && (hoverable || onClick) ? 'translateY(-2px)' : 'translateY(0)',
        ...style
      }}
    >
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            margin: '0 0 4px 0',
            color: 'var(--text)',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.3px'
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              margin: 0,
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div style={{ color: 'var(--text)' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          color: 'var(--text)'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
