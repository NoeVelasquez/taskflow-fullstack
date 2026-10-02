import * as taskService from '../services/task.service.js';
import * as projectRepository from '../repositories/project.repository.js';
import { successResponse } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllTasks = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  const projectId = req.params?.projectId || req.query?.projectId;

  const rawPage = parseInt(req.query?.page, 10);
  const rawLimit = parseInt(req.query?.limit, 10);

  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;

  const result = await taskService.getPagedTasks(userId, {
    projectId,
    page,
    limit,
  });

  return successResponse(
    res,
    result,
    'Listado de tareas paginado obtenido correctamente'
  );
});

export const createTask = catchAsync(async (req, res, next) => {
  const projectId = req.params?.projectId || req.body?.projectId;
  const task = await taskService.createTask({
    ...req.body,
    projectId,
    userId: req.user?.id,
  });

  return successResponse(res, task, 'Tarea creada', 201);
});

export const getTask = catchAsync(async (req, res, next) => {
  const idOrProjectId = req.params?.id;
  const userId = req.user?.id;

  // Verificar si es un ID de proyecto
  const project = await projectRepository.findById(idOrProjectId, userId);
  if (project) {
    const rawPage = parseInt(req.query?.page, 10);
    const rawLimit = parseInt(req.query?.limit, 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;

    const result = await taskService.getPagedTasks(userId, {
      projectId: idOrProjectId,
      page,
      limit,
    });

    return successResponse(
      res,
      result,
      'Listado de tareas paginado obtenido correctamente'
    );
  }

  // Si no es un proyecto, es una consulta de tarea individual
  const task = await taskService.getTask(idOrProjectId, userId);
  return successResponse(res, task, 'Tarea obtenida');
});

export const updateTask = catchAsync(async (req, res, next) => {
  const taskId = req.params?.id || req.body?.id;
  const userId = req.user?.id;
  const { title, description, completed } = req.body || {};
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;

  const task = await taskService.updateTask(
    taskId,
    userId,
    updateData
  );

  return successResponse(res, task, 'Tarea actualizada');
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const taskId = req.params?.id || req.body?.id;
  const userId = req.user?.id;
  await taskService.deleteTask(taskId, userId);

  return successResponse(res, null, 'Tarea eliminada');
});

export const completeTask = catchAsync(async (req, res, next) => {
  const taskId = req.params?.id || req.body?.id;
  const userId = req.user?.id;
  const completedStatus = req.body?.completed;
  const task = await taskService.completeTask(taskId, userId, completedStatus);

  return successResponse(res, task, task.completed ? 'Tarea completada' : 'Tarea marcada como pendiente');
});
