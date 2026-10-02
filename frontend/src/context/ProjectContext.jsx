import { createContext, useContext, useState, useCallback } from 'react';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingActiveProject, setIsLoadingActiveProject] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const { toastSuccess, toastError } = useToast();
  const { isAuthenticated } = useAuth();

  // ----------------------------------------------------
  // GESTIÓN DE PROYECTOS
  // ----------------------------------------------------

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return [];
    setIsLoadingProjects(true);
    try {
      const data = await projectApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setProjects(list);
      return list;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      const msg = extractErrorMessage(error, 'No se pudieron cargar los proyectos');
      toastError(msg);
      return [];
    } finally {
      setIsLoadingProjects(false);
    }
  }, [isAuthenticated, toastError]);

  const fetchProjectDetails = useCallback(
    async (id) => {
      if (!id || !isAuthenticated) return null;
      setIsLoadingActiveProject(true);
      try {
        const data = await projectApi.getById(id);
        setActiveProject(data);
        return data;
      } catch (error) {
        console.error('Error al obtener detalle del proyecto:', error);
        const msg = extractErrorMessage(error, 'Proyecto no encontrado');
        toastError(msg);
        return null;
      } finally {
        setIsLoadingActiveProject(false);
      }
    },
    [isAuthenticated, toastError]
  );

  const createProject = async (projectData) => {
    try {
      const newProject = await projectApi.create({
        name: projectData.name?.trim(),
        description: projectData.description?.trim(),
        status: projectData.status || 'active',
      });
      setProjects((prev) => [newProject, ...prev]);
      toastSuccess('¡Proyecto creado con éxito!');
      return { success: true, project: newProject };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al crear el proyecto');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const updated = await projectApi.update(id, {
        name: projectData.name?.trim(),
        description: projectData.description?.trim(),
        status: projectData.status,
      });
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      if (activeProject && activeProject.id === id) {
        setActiveProject((prev) => ({ ...prev, ...updated }));
      }
      toastSuccess('Proyecto actualizado exitosamente');
      return { success: true, project: updated };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al actualizar el proyecto');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProject && activeProject.id === id) {
        setActiveProject(null);
      }
      // Limpiar tareas asociadas del listado global en memoria
      setAllTasks((prev) => prev.filter((t) => t.projectId !== id));
      toastSuccess('Proyecto eliminado correctamente');
      return { success: true };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al eliminar el proyecto');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  // ----------------------------------------------------
  // GESTIÓN DE TAREAS
  // ----------------------------------------------------

  const fetchAllTasks = useCallback(
    async (params = { limit: 100 }) => {
      if (!isAuthenticated) return [];
      setIsLoadingTasks(true);
      try {
        const result = await taskApi.getAll(params);
        const taskList = Array.isArray(result) ? result : result?.data || [];
        setAllTasks(taskList);
        return taskList;
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        const msg = extractErrorMessage(error, 'No se pudieron cargar las tareas');
        toastError(msg);
        return [];
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [isAuthenticated, toastError]
  );

  const createTask = async (taskData) => {
    try {
      const payload = {
        title: taskData.title?.trim(),
        description: taskData.description?.trim(),
      };
      if (taskData.projectId) {
        payload.projectId = taskData.projectId;
      }

      const created = await taskApi.create(payload);
      setAllTasks((prev) => [created, ...prev]);

      // Si el proyecto activo es el asignado a la tarea, sincronizar
      if (activeProject && (!payload.projectId || activeProject.id === payload.projectId)) {
        setActiveProject((prev) => ({
          ...prev,
          tasks: prev.tasks ? [created, ...prev.tasks] : [created],
        }));
      }

      // Sincronizar en la lista general de proyectos para actualizar conteo de tareas
      if (payload.projectId) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === payload.projectId
              ? { ...p, tasks: p.tasks ? [created, ...p.tasks] : [created] }
              : p
          )
        );
      }

      toastSuccess('Tarea agregada exitosamente');
      return { success: true, task: created };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al crear la tarea');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const payload = {};
      if (taskData.title !== undefined) payload.title = taskData.title.trim();
      if (taskData.description !== undefined) payload.description = taskData.description.trim();

      const updated = await taskApi.update(id, payload);
      setAllTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));

      if (activeProject && activeProject.tasks) {
        setActiveProject((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
      }

      toastSuccess('Tarea actualizada correctamente');
      return { success: true, task: updated };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al actualizar la tarea');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
      const updated = await taskApi.complete(id);
      const isCompleted = updated.completed !== undefined ? updated.completed : true;

      setAllTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: isCompleted } : t))
      );

      if (activeProject && activeProject.tasks) {
        setActiveProject((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: isCompleted } : t)),
        }));
      }

      toastSuccess(isCompleted ? '¡Tarea completada!' : 'Tarea marcada como pendiente');
      return { success: true, task: updated };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al cambiar estado de la tarea');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.delete(id);
      setAllTasks((prev) => prev.filter((t) => t.id !== id));

      if (activeProject && activeProject.tasks) {
        setActiveProject((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== id),
        }));
      }

      toastSuccess('Tarea eliminada');
      return { success: true };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Error al eliminar la tarea');
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  // ----------------------------------------------------
  // CÁLCULO DE MÉTRICAS / ESTADÍSTICAS GLOBALES
  // ----------------------------------------------------
  const totalProjects = projects.length;
  const activeProjectsCount = projects.filter((p) => (p.status || 'active').toLowerCase() === 'active').length;
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const value = {
    projects,
    activeProject,
    allTasks,
    isLoadingProjects,
    isLoadingActiveProject,
    isLoadingTasks,
    stats: {
      totalProjects,
      activeProjectsCount,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
    },
    fetchProjects,
    fetchProjectDetails,
    createProject,
    updateProject,
    deleteProject,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setActiveProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects debe ser utilizado dentro de un ProjectProvider');
  }
  return context;
};
