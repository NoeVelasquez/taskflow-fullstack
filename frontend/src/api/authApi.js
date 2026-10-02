import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Inicia sesión con email y contraseña
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: { id: string, name: string, email: string } }>}
   */
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Registra un nuevo usuario en la plataforma
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ id: string, name: string, email: string }>}
   */
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data.data;
  },

  /**
   * Obtiene la información del usuario autenticado
   * @returns {Promise<{ id: string, name: string, email: string }>}
   */
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data.data;
  },
};
