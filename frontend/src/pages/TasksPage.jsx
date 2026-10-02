import { useState, useEffect, useMemo } from 'react';
import { TaskList } from '../components/tasks/TaskList';
import { TaskKanban } from '../components/tasks/TaskKanban';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Plus, Filter } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export const TasksPage = () => {
  const {
    allTasks,
    projects,
    isLoadingTasks,
    fetchAllTasks,
    fetchProjects,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useProjects();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  // Modales
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    fetchAllTasks();
    fetchProjects();
  }, [fetchAllTasks, fetchProjects]);

  // Mapa de ID de proyecto a Nombre de proyecto para mostrar en las tarjetas
  const projectMap = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [projects]);

  // Filtrado de tareas
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'COMPLETED' && task.completed) ||
        (statusFilter === 'PENDING' && !task.completed);

      const matchesProject =
        selectedProjectId === 'ALL' ||
        (selectedProjectId === 'NONE' && !task.projectId) ||
        task.projectId === selectedProjectId;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [allTasks, searchTerm, statusFilter, selectedProjectId]);

  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            Mis Tareas ✅
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Gestiona todas tus tareas globales o filtra por proyecto específico.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Alternador de Vista Lista / Kanban */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Tablero
            </button>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleOpenCreateTask}>
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* Barra de Filtro Adicional por Proyecto */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} /> Filtrar por Proyecto:
        </span>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '220px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
        >
          <option value="ALL">Todos los proyectos ({allTasks.length})</option>
          <option value="NONE">Sin Proyecto / Generales</option>
          {projects.map((p) => {
            const count = allTasks.filter((t) => t.projectId === p.id).length;
            return (
              <option key={p.id} value={p.id}>
                {p.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {isLoadingTasks && allTasks.length === 0 ? (
        <Spinner text="Cargando tus tareas..." size={32} />
      ) : viewMode === 'list' ? (
        <TaskList
          tasks={filteredTasks}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={statusFilter}
          onFilterChange={setStatusFilter}
          onToggleComplete={toggleTaskComplete}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTaskPrompt}
          onNewTask={handleOpenCreateTask}
          projectMap={projectMap}
          emptyMessage="No se encontraron tareas con los filtros seleccionados."
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          onToggleComplete={toggleTaskComplete}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTaskPrompt}
          onNewTask={handleOpenCreateTask}
          projectMap={projectMap}
        />
      )}

      {/* Modal Crear / Editar Tarea */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTaskForm}
        initialData={editingTask}
        projects={projects}
        isLoading={isSubmitting}
      />

      {/* Modal Confirmación Eliminación */}
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
