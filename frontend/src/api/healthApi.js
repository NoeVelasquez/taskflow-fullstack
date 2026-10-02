import axiosClient from './axiosClient';

export const healthApi = {
  /**
   * Verifica la conectividad con el backend
   * @returns {Promise<{ isOnline: boolean, message?: string }>}
   */
  check: async () => {
    try {
      const response = await axiosClient.get('/health', { timeout: 3000 });
      return { isOnline: true, data: response.data };
    } catch {
      return { isOnline: false };
    }
  },
};
