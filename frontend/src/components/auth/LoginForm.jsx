import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await login(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Correo Electrónico"
        type="email"
        name="email"
        placeholder="ejemplo@correo.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={Mail}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={Lock}
        required
      />

      <div style={{ marginTop: '1.5rem' }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={LogIn}
          style={{ width: '100%' }}
        >
          Iniciar Sesión
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onToggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Regístrate aquí
        </button>
      </div>
    </form>
  );
};
