import Project from '../entities/project.entity.js';
import Task from '../entities/task.entity.js';

/**
 * Busca un proyecto por su ID y su dueño de forma segura, incluyendo sus tareas asociadas.
 * Proyecta únicamente los atributos necesarios.
 *
 * @param {string} projectId - ID del proyecto a buscar.
 * @param {string} userId - ID del usuario autenticado (dueño del proyecto).
 * @returns {Promise<Project|null>} Instancia del modelo Project con tareas incluidas, o null.
 */
export const findProjectWithTasks = async (projectId, userId) => {
  return await Project.findOne({
    where: {
      id: projectId,
      userId: userId, // Filtro de seguridad multi-tenant
    },
    attributes: ['id', 'name', 'description', 'createdAt'],
    include: [
      {
        model: Task,
        as: 'tasks', // Usando el alias registrado en asociaciones
        attributes: ['id', 'title', 'description', 'completed', 'createdAt'],
        required: false,
      },
    ],
    order: [[{ model: Task, as: 'tasks' }, 'createdAt', 'ASC']],
  });
};

/**
 * Crea un proyecto asociado a un usuario.
 */
export const create = async (projectData) => {
  return await Project.create(projectData);
};

/**
 * Busca un proyecto por su ID y su dueño de forma segura.
 *
 * @param {string} id - ID del proyecto.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Project|null>}
 */
export const findById = async (id, userId) => {
  return await Project.findOne({
    where: {
      id,
      userId,
    },
  });
};

/**
 * Obtiene todos los proyectos de un usuario de forma segura.
 *
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Project[]>}
 */
export const findAllByUser = async (userId) => {
  return await Project.findAll({
    where: {
      userId,
    },
    attributes: ['id', 'name', 'description', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Actualiza un proyecto.
 */
export const update = async (project, data) => {
  return await project.update(data);
};

/**
 * Elimina un proyecto (hace soft delete si paranoid está activo).
 */
export const remove = async (project) => {
  return await project.destroy();
};
