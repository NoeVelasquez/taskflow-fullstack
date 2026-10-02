import { useState, useMemo } from 'react';
import { ArrowLeft, Edit3, Trash2, Plus, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { TaskList } from '../tasks/TaskList';
import { TaskKanban } from '../tasks/TaskKanban';

export const ProjectDetails = ({
  project,
  onBack,
  onEditProject,
  onDeleteProject,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskComplete,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [taskFilter, setTaskFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [searchTask, setSearchTask] = useState('');

  const tasks = project?.tasks || [];

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTask.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTask.toLowerCase()));

      const matchesStatus =
        taskFilter === 'ALL' ||
        (taskFilter === 'COMPLETED' && task.completed) ||
        (taskFilter === 'PENDING' && !task.completed);

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTask, taskFilter]);

  return (
    <div>
      {/* Barra superior de navegación del proyecto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={onBack}
          className="btn-ghost"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          <ArrowLeft size={18} />
          <span>Volver a Proyectos</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Edit3}
            onClick={() => onEditProject(project)}
          >
            Editar Proyecto
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => onDeleteProject(project)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {/* Tarjeta de encabezado del proyecto */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {project.name}
              </h2>
              <Badge status={project.status || 'active'} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '700px' }}>
              {project.description || 'Sin descripción detallada.'}
            </p>
          </div>

          {/* Mini métricas del proyecto */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {totalCount}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tareas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                {pendingCount}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pendientes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                {completedCount}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completadas</div>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Progreso del Proyecto</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Sección de Tareas del Proyecto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Tareas del Proyecto
          </h3>

          {/* Alternador de vista Lista vs Kanban */}
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
                padding: '4px 10px',
                fontSize: '0.75rem',
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
                padding: '4px 10px',
                fontSize: '0.75rem',
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
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => onNewTask(project.id)}
        >
          Nueva Tarea
        </Button>
      </div>

      {viewMode === 'list' ? (
        <TaskList
          tasks={filteredTasks}
          searchTerm={searchTask}
          onSearchChange={setSearchTask}
          filter={taskFilter}
          onFilterChange={setTaskFilter}
          onToggleComplete={onToggleTaskComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onNewTask={() => onNewTask(project.id)}
          emptyMessage="No hay tareas registradas en este proyecto todavía."
        />
      ) : (
        <TaskKanban
          tasks={tasks}
          onToggleComplete={onToggleTaskComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onNewTask={() => onNewTask(project.id)}
        />
      )}
    </div>
  );
};
