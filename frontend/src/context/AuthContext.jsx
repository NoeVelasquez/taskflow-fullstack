import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';
import { extractErrorMessage, extractFieldErrors } from '../utils/errorHandler';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const { toastSuccess, toastError, toastInfo } = useToast();

  const logout = useCallback((showNotification = true) => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    setToken(null);
    if (showNotification) {
      toastInfo('Sesión finalizada');
    }
  }, [toastInfo]);

  // Verificar la validez del token en el montaje inicial
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
        localStorage.setItem('taskflow_user', JSON.stringify(userData));
      } catch (err) {
        console.warn('Sesión previa inválida o expirada:', err);
        logout(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();

    // Escuchar evento global de deslogueo disparado por Axios en 401
    const handleGlobalLogout = () => {
      logout(true);
    };

    window.addEventListener('taskflow_auth_logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('taskflow_auth_logout', handleGlobalLogout);
    };
  }, [logout]);

  const login = async (credentials) => {
    try {
      const data = await authApi.login({
        email: credentials.email?.trim(),
        password: credentials.password,
      });
      // data: { token, user: { id, name, email } }
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toastSuccess(`¡Bienvenido de nuevo, ${data.user.name || 'Usuario'}!`);
      return { success: true, user: data.user };
    } catch (error) {
      const message = extractErrorMessage(error, 'Error al iniciar sesión. Verifique sus credenciales.');
      const fieldErrors = extractFieldErrors(error);
      toastError(message);
      return { success: false, error: message, fieldErrors };
    }
  };

  const register = async (userData) => {
    try {
      const createdUser = await authApi.register({
        name: userData.name?.trim(),
        email: userData.email?.trim(),
        password: userData.password,
      });
      toastSuccess('¡Registro exitoso! Iniciando sesión automáticamente...');
      // Iniciar sesión automáticamente tras el registro
      const loginResult = await login({
        email: userData.email?.trim(),
        password: userData.password,
      });
      return { success: true, user: createdUser, loginResult };
    } catch (error) {
      const message = extractErrorMessage(error, 'Error al registrar el usuario.');
      const fieldErrors = extractFieldErrors(error);
      toastError(message);
      return { success: false, error: message, fieldErrors };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
