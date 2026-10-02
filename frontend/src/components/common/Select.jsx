import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Select = forwardRef(
  ({ label, error, helperText, options = [], className = '', id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            <span>
              {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
            </span>
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          required={required}
          className={`form-select ${error ? 'error' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
