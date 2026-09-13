import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions = null,
  size = 'medium',
  closeButton = true 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'width: 400px',
    medium: 'width: 600px',
    large: 'width: 900px',
    fullscreen: 'width: 95vw; height: 95vh'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)',
        ...{[`width`]: sizeClasses[size]?.split(';')[0]?.split(':')[1]?.trim()},
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--header-bg)'
        }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text)',
                padding: 0
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', color: 'var(--text)' }}>
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            padding: '20px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg)'
          }}>
            {actions}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
