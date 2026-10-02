import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm = ({ onToggleMode }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Nombre Completo"
        type="text"
        name="name"
        placeholder="Juan Pérez"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={User}
        required
      />

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
        placeholder="Mínimo 6 caracteres"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={Lock}
        required
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        name="confirmPassword"
        placeholder="Repita la contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={Lock}
        required
      />

      <div style={{ marginTop: '1.5rem' }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={UserPlus}
          style={{ width: '100%' }}
        >
          Crear Cuenta
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        ¿Ya tienes una cuenta?{' '}
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
          Inicia sesión aquí
        </button>
      </div>
    </form>
  );
};
