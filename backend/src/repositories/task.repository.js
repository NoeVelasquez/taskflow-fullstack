import Task from '../entities/task.entity.js';

export const create = async (data) => {
  return await Task.create(data);
};

export const findAllByUser = async (userId) => {
  return await Task.findAll({
    where: {
      userId,
    },
    attributes: ['id', 'title', 'description', 'completed'],
    order: [['createdAt', 'DESC']],
  });
};

export const findById = async (id, userId) => {
  return await Task.findOne({
    where: {
      id,
      userId,
    },
    attributes: ['id', 'title', 'description', 'completed'],
  });
};

export const update = async (task, data) => {
  return await task.update(data);
};

export const remove = async (task) => {
  return await task.destroy();
};

/**
 * Busca tareas paginadas y filtradas de manera segura por el ID del usuario y proyecto.
 *
 * @param {string} userId - ID del usuario propietario de las tareas.
 * @param {object} options - Opciones de filtrado y paginación.
 * @param {string} [options.projectId] - ID del proyecto (opcional).
 * @param {number} options.limit - Cantidad de registros por página.
 * @param {number} options.offset - Cantidad de registros a saltar.
 * @returns {Promise<{count: number, rows: Task[]}>} Objeto con total de ítems y las tareas encontradas.
 */
export const findTasksPaged = async (userId, { projectId, limit, offset }) => {
  const whereClause = { userId };

  if (projectId) {
    whereClause.projectId = projectId;
  }

  return await Task.findAndCountAll({
    where: whereClause,
    attributes: [
      'id',
      'title',
      'description',
      'completed',
      'projectId',
      'createdAt',
    ],
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']],
  });
};
