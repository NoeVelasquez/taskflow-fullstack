import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const AuthLayout = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-backdrop-shapes">
        <div className="auth-shape-1" />
        <div className="auth-shape-2" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={28} />
          </div>
          <h2 className="auth-title">TaskFlow</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Crea tu cuenta para comenzar a organizar tus proyectos'
              : 'Ingresa a tu espacio de trabajo y gestiona tus tareas'}
          </p>
        </div>

        {isRegister ? (
          <RegisterForm onToggleMode={() => setIsRegister(false)} />
        ) : (
          <LoginForm onToggleMode={() => setIsRegister(true)} />
        )}

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="var(--primary)" /> JWT Seguro
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} color="#f59e0b" /> React + Express
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} color="#10b981" /> REST API
          </span>
        </div>
      </div>
    </div>
  );
};
