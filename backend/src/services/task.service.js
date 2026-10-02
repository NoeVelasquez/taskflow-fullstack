import * as repository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import { AppError } from '../utils/AppError.js';

export const createTask = async (data) => {
  if (data.projectId) {
    const project = await projectRepository.findById(data.projectId, data.userId);
    if (!project) {
      throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
    }
  }
  return await repository.create(data);
};

export const findAllTasks = async (userId) => {
  return await repository.findAllByUser(userId);
};

export const getTask = async (id, userId) => {
  const task = await repository.findById(id, userId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  return task;
};

export const updateTask = async (id, userId, data) => {
  const task = await repository.findById(id, userId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  return await repository.update(task, data);
};

export const deleteTask = async (id, userId) => {
  const task = await repository.findById(id, userId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  await repository.remove(task);
};

export const completeTask = async (id, userId, completedStatus) => {
  const task = await repository.findById(id, userId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  const newCompletedState = completedStatus !== undefined ? completedStatus : !task.completed;

  return await repository.update(task, {
    completed: newCompletedState,
  });
};

/**
 * Retorna las tareas paginadas y metadatos de paginación para el cliente.
 */
export const getPagedTasks = async (userId, { projectId, page, limit }) => {
  if (projectId) {
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
    }
  }

  // 1. Calcular offset
  const offset = (page - 1) * limit;

  // 2. Consultar repositorio
  const { count: totalItems, rows: tasks } = await repository.findTasksPaged(
    userId,
    {
      projectId,
      limit,
      offset,
    }
  );

  // 3. Calcular total de páginas
  const totalPages = Math.ceil(totalItems / limit);

  // 4. Retornar datos listos y estructurados
  return {
    items: tasks,
    pagination: {
      totalItems,
      totalPages,
      page,
      limit,
    },
  };
};
