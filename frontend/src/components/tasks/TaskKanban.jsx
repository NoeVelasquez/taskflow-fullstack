import { TaskItem } from './TaskItem';
import { Clock, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const TaskKanban = ({
  tasks = [],
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onNewTask,
  projectMap = {},
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '1.25rem',
        alignItems: 'flex-start',
      }}
    >
      {/* Columna: Por Hacer / Pendientes */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={16} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Por Hacer
            </h4>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#e2e8f0',
              color: 'var(--text-main)',
            }}
          >
            {pendingTasks.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '120px' }}>
          {pendingTasks.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-color)',
              }}
            >
              No hay tareas pendientes.
            </div>
          ) : (
            pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projectName={projectMap[task.projectId]}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>

        {onNewTask && (
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={onNewTask}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Agregar Tarea
          </Button>
        )}
      </div>

      {/* Columna: Completadas */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={16} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Completadas
            </h4>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#e2e8f0',
              color: 'var(--text-main)',
            }}
          >
            {completedTasks.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '120px' }}>
          {completedTasks.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-color)',
              }}
            >
              Aún no has completado ninguna tarea.
            </div>
          ) : (
            completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projectName={projectMap[task.projectId]}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
