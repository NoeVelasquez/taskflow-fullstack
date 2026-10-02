import * as projectRepository from '../repositories/project.repository.js';
import { AppError } from '../utils/AppError.js';

export const getProjectDetails = async (projectId, userId) => {
  const project = await projectRepository.findProjectWithTasks(
    projectId,
    userId
  );

  if (!project) {
    throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
  }

  return project;
};

export const createProject = async (data) => {
  return await projectRepository.create(data);
};

export const getAllProjects = async (userId) => {
  return await projectRepository.findAllByUser(userId);
};

export const updateProject = async (projectId, userId, data) => {
  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
  }
  return await projectRepository.update(project, data);
};

export const deleteProject = async (projectId, userId) => {
  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    throw new AppError('Proyecto no encontrado o acceso no autorizado', 404);
  }
  await projectRepository.remove(project);
};
