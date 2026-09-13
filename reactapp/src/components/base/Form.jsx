import React from 'react';

const Form = ({ 
  children, 
  onSubmit,
  layout = 'vertical',
  className = '',
  style = {}
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        gap: '16px',
        ...style
      }}
      className={className}
    >
      {children}
    </form>
  );
};

export const FormField = ({ 
  label = '',
  name = '',
  type = 'text',
  value = '',
  onChange = null,
  error = '',
  required = false,
  placeholder = '',
  disabled = false,
  multiline = false,
  rows = 4,
  options = [],
  fullWidth = true
}) => {
  const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: error ? '2px solid var(--error)' : '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    fontSize: '14px',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    disabled
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text)'
        }}>
          {label}
          {required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={inputStyle}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyle}
        />
      )}

      {error && (
        <div style={{
          marginTop: '6px',
          fontSize: '13px',
          color: 'var(--error)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Form;
