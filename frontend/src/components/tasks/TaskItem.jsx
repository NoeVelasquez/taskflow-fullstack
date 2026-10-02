import { useState } from 'react';
import { Check, Edit, Trash2, Calendar, FolderKanban, Loader2 } from 'lucide-react';

export const TaskItem = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  projectName = null,
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    await onToggleComplete(task.id);
    setIsToggling(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox personalizado con protección antirreparto */}
      <div className="task-checkbox-container">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          className={`task-custom-checkbox ${task.completed ? 'checked' : ''}`}
          aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          style={{ opacity: isToggling ? 0.6 : 1 }}
        >
          {isToggling ? (
            <Loader2 size={12} className="spinner" style={{ animation: 'spin 0.6s linear infinite' }} />
          ) : task.completed ? (
            <Check size={14} strokeWidth={3} />
          ) : null}
        </button>
      </div>

      {/* Contenido de la tarea */}
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          {projectName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
              <FolderKanban size={13} />
              {projectName}
            </span>
          )}

          {task.createdAt && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              {new Date(task.createdAt).toLocaleDateString('es-ES')}
            </span>
          )}

          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: task.completed ? '#ecfdf5' : '#fffbeb',
              color: task.completed ? '#065f46' : '#92400e',
            }}
          >
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>
      </div>

      {/* Acciones de la tarea */}
      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          className="btn-ghost btn-icon"
          title="Editar tarea"
          style={{ cursor: 'pointer' }}
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="btn-ghost btn-icon"
          title="Eliminar tarea"
          style={{ cursor: 'pointer', color: 'var(--danger)' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
