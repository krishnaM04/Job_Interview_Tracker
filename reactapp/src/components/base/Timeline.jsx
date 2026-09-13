import React from 'react';

const Timeline = ({ 
  items = [],
  variant = 'vertical'
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: variant === 'vertical' ? 'column' : 'row',
      gap: '20px'
    }}>
      {items.map((item, idx) => (
        <div key={idx} style={{
          display: 'flex',
          flexDirection: variant === 'vertical' ? 'row' : 'column',
          gap: '16px',
          flex: variant === 'horizontal' ? 1 : 'auto'
        }}>
          {/* Timeline dot */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: item.completed ? 'var(--success)' : item.active ? 'var(--accent)' : 'var(--border)',
              border: item.active ? '3px solid var(--accent)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '12px',
              flexShrink: 0
            }}>
              {item.completed && '✓'}
            </div>
            {idx < items.length - 1 && (
              <div style={{
                width: variant === 'vertical' ? '2px' : '100%',
                height: variant === 'vertical' ? '40px' : '2px',
                backgroundColor: 'var(--border)',
                flexGrow: 1
              }} />
            )}
          </div>

          {/* Timeline content */}
          <div style={{
            flex: 1,
            paddingTop: variant === 'vertical' ? 0 : '8px'
          }}>
            {item.label && (
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '4px'
              }}>
                {item.label}
              </div>
            )}
            {item.description && (
              <div style={{
                fontSize: '13px',
                color: 'var(--text)',
                opacity: 0.7
              }}>
                {item.description}
              </div>
            )}
            {item.date && (
              <div style={{
                fontSize: '12px',
                color: 'var(--text)',
                opacity: 0.6,
                marginTop: '4px'
              }}>
                {item.date}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
