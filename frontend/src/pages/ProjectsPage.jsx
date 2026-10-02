import { useState, useEffect } from 'react';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectDetails } from '../components/projects/ProjectDetails';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Spinner } from '../components/common/Spinner';
import { useProjects } from '../context/ProjectContext';

export const ProjectsPage = ({ selectedProjectId, onClearSelectedProject, onSelectProject }) => {
  const {
    projects,
    activeProject,
    isLoadingProjects,
    isLoadingActiveProject,
    fetchProjects,
    fetchProjectDetails,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useProjects();

  // Estados de Modales
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetProjectIdForTask, setTargetProjectIdForTask] = useState(null);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDetails(selectedProjectId);
    }
  }, [selectedProjectId, fetchProjectDetails]);

  // Handlers de Proyecto
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSubmitProjectForm = async (formData) => {
    setIsSubmitting(true);
    let result;
    if (editingProject) {
      result = await updateProject(editingProject.id, formData);
    } else {
      result = await createProject(formData);
    }
    setIsSubmitting(false);
    return result.success;
  };

  const handleDeleteProjectPrompt = (project) => {
    setConfirmModalState({
      isOpen: true,
      title: '¿Eliminar Proyecto?',
      message: `¿Estás seguro de que deseas eliminar el proyecto "${project.name}"? Esta acción eliminará también todas sus tareas asociadas.`,
      onConfirm: async () => {
        setIsSubmitting(true);
        await deleteProject(project.id);
        setIsSubmitting(false);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        if (selectedProjectId === project.id) {
          onClearSelectedProject();
        }
      },
    });
  };

  // Handlers de Tareas
  const handleOpenCreateTask = (projectId) => {
    setEditingTask(null);
    setTargetProjectIdForTask(projectId || selectedProjectId || '');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTargetProjectIdForTask(task.projectId || selectedProjectId || '');
    setIsTaskModalOpen(true);
  };

  const handleSubmitTaskForm = async (formData) => {
    setIsSubmitting(true);
    let result;
    if (editingTask) {
      result = await updateTask(editingTask.id, formData);
    } else {
      result = await createTask(formData);
    }
    setIsSubmitting(false);
    return result.success;
  };

  const handleDeleteTaskPrompt = (task) => {
    setConfirmModalState({
      isOpen: true,
      title: '¿Eliminar Tarea?',
      message: `¿Estás seguro de eliminar la tarea "${task.title}"?`,
      onConfirm: async () => {
        setIsSubmitting(true);
        await deleteTask(task.id);
        setIsSubmitting(false);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="page-wrapper">
      {/* Vista de Detalle de Proyecto */}
      {selectedProjectId && activeProject ? (
        isLoadingActiveProject ? (
          <Spinner text="Cargando información del proyecto..." size={32} />
        ) : (
          <ProjectDetails
            project={activeProject}
            onBack={onClearSelectedProject}
            onEditProject={handleOpenEditProject}
            onDeleteProject={handleDeleteProjectPrompt}
            onNewTask={handleOpenCreateTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteTaskPrompt}
            onToggleTaskComplete={toggleTaskComplete}
          />
        )
      ) : (
        /* Vista de Listado General de Proyectos */
        <>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
              Gestión de Proyectos 📁
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Organiza tus proyectos, supervisa el progreso de tareas y define prioridades.
            </p>
          </div>

          {isLoadingProjects && projects.length === 0 ? (
            <Spinner text="Cargando lista de proyectos..." size={32} />
          ) : (
            <ProjectList
              projects={projects}
              onSelectProject={onSelectProject}
              onNewProject={handleOpenCreateProject}
              onEditProject={handleOpenEditProject}
              onDeleteProject={handleDeleteProjectPrompt}
            />
          )}
        </>
      )}

      {/* Modal de Crear / Editar Proyecto */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleSubmitProjectForm}
        initialData={editingProject}
        isLoading={isSubmitting}
      />

      {/* Modal de Crear / Editar Tarea */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTaskForm}
        initialData={editingTask}
        projects={projects}
        defaultProjectId={targetProjectIdForTask}
        isLoading={isSubmitting}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        message={confirmModalState.message}
        isLoading={isSubmitting}
      />
    </div>
  );
};
