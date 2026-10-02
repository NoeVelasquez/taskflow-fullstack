import axios from 'axios';

// Detectar automáticamente la API de producción en Render si no está definida en .env
const defaultApiUrl =
  typeof window !== 'undefined' && window.location.hostname.includes('render.com')
    ? 'https://taskflow-fullstack-vtbf.onrender.com/api'
    : 'http://localhost:3000/api';

const baseURL = import.meta.env.VITE_API_URL || defaultApiUrl;

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de Request: adjuntar token JWT si existe en localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Manejo centralizado de errores y expiración de sesión
axiosClient.interceptors.response.use(
  (response) => {
    // Si la respuesta viene envuelta con successResponse de Express ({ success: true, data: ... })
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      console.warn('[API Auth] Sesión expirada o no autorizada');
      // No forzamos reload en rutas de auth para permitir mensajes de credenciales incorrectas
      const isAuthRoute =
        error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.dispatchEvent(new Event('taskflow_auth_logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
