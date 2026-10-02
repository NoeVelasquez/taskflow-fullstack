import axiosClient from './axiosClient';

export const projectApi = {
  /**
   * Obtiene todos los proyectos del usuario
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await axiosClient.get('/projects');
    return response.data.data;
  },

  /**
   * Obtiene el detalle de un proyecto junto con sus tareas asociadas
   * @param {string} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data.data;
  },

  /**
   * Crea un nuevo proyecto
   * @param {{ name: string, description?: string, status?: string }} projectData
   * @returns {Promise<Object>}
   */
  create: async (projectData) => {
    const response = await axiosClient.post('/projects', projectData);
    return response.data.data;
  },

  /**
   * Actualiza un proyecto existente
   * @param {string} id
   * @param {{ name?: string, description?: string, status?: string }} projectData
   * @returns {Promise<Object>}
   */
  update: async (id, projectData) => {
    const response = await axiosClient.put(`/projects/${id}`, projectData);
    return response.data.data;
  },

  /**
   * Elimina un proyecto
   * @param {string} id
   * @returns {Promise<any>}
   */
  delete: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data.data;
  },
};
