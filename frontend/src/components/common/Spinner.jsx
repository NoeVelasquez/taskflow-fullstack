import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 24, className = '', text = '' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2rem 1rem',
      }}
      className={className}
    >
      <Loader2
        size={size}
        style={{
          color: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {text}
        </span>
      )}
    </div>
  );
};
