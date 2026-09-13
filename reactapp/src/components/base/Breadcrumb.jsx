import React from 'react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flexWrap: 'wrap'
      }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {idx > 0 && (
              <span style={{ color: 'var(--text)', opacity: 0.5, margin: '0 4px' }}>
                /
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '6px 4px'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                {item.label}
              </a>
            ) : (
              <span style={{
                color: 'var(--text)',
                fontSize: '14px',
                padding: '6px 4px',
                fontWeight: idx === items.length - 1 ? '600' : '400'
              }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
