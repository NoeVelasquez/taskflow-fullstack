import { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
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
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {Icon && (
            <div
              style={{
                position: 'absolute',
                left: '12px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Icon size={18} />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            required={required}
            className={`form-input ${error ? 'error' : ''}`}
            style={{
              paddingLeft: Icon ? '40px' : '14px',
              paddingRight: isPasswordField ? '40px' : '14px',
            }}
            {...props}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: showPassword ? 'var(--primary)' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'color 150ms ease',
              }}
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
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

Input.displayName = 'Input';
