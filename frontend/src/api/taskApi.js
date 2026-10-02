import axiosClient from './axiosClient';

export const taskApi = {
  /**
   * Obtiene la lista de tareas del usuario con paginación y filtro opcional por proyecto
   * @param {{ projectId?: string, page?: number, limit?: number }} params
   * @returns {Promise<{ total: number, page: number, limit: number, totalPages: number, data: Array }>}
   */
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/tasks', { params });
    return response.data.data;
  },

  /**
   * Obtiene una tarea individual por ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}`);
    return response.data.data;
  },

  /**
   * Crea una nueva tarea
   * @param {{ title: string, description?: string, projectId?: string }} taskData
   * @returns {Promise<Object>}
   */
  create: async (taskData) => {
    const response = await axiosClient.post('/tasks', taskData);
    return response.data.data;
  },

  /**
   * Actualiza los datos de una tarea (título, descripción)
   * @param {string} id
   * @param {{ title?: string, description?: string }} taskData
   * @returns {Promise<Object>}
   */
  update: async (id, taskData) => {
    const response = await axiosClient.put(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  /**
   * Alterna / marca como completada una tarea
   * @param {string} id
   * @returns {Promise<Object>}
   */
  complete: async (id) => {
    const response = await axiosClient.patch(`/tasks/${id}/complete`);
    return response.data.data;
  },

  /**
   * Elimina una tarea por ID
   * @param {string} id
   * @returns {Promise<any>}
   */
  delete: async (id) => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data.data;
  },
};
