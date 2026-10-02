import * as projectService from '../services/project.service.js';
import { successResponse } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Obtiene el detalle de un proyecto con todas sus tareas asociadas.
 */
export const getProjectWithTasks = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user.id; // Obtenido del middleware de autenticación (JWT)

  const project = await projectService.getProjectDetails(projectId, userId);

  return successResponse(
    res,
    project,
    'Proyecto y tareas asociadas obtenidos correctamente'
  );
});

/**
 * Crea un nuevo proyecto.
 */
export const createProject = catchAsync(async (req, res, next) => {
  const project = await projectService.createProject({
    ...req.body,
    userId: req.user.id,
  });
  return successResponse(res, project, 'Proyecto creado correctamente', 201);
});

/**
 * Obtiene el listado global de proyectos del usuario.
 */
export const getAllProjects = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projects = await projectService.getAllProjects(userId);
  return successResponse(res, projects, 'Listado de proyectos obtenido correctamente');
});

/**
 * Actualiza un proyecto.
 */
export const updateProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user.id;
  const { name, description, status } = req.body;

  const project = await projectService.updateProject(projectId, userId, {
    name,
    description,
    status,
  });

  return successResponse(res, project, 'Proyecto actualizado');
});

/**
 * Elimina un proyecto (soft delete).
 */
export const deleteProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  await projectService.deleteProject(projectId, userId);

  return successResponse(res, null, 'Proyecto eliminado');
});
