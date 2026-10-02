import { FolderKanban, Edit, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ProjectCard = ({ project, onSelect, onEdit, onDelete }) => {
  const taskCount = project.tasks ? project.tasks.length : 0;
  const completedTaskCount = project.tasks ? project.tasks.filter((t) => t.completed).length : 0;
  const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FolderKanban size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {project.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('es-ES') : ''}
            </span>
          </div>
        </div>
        <Badge status={project.status || 'active'} />
      </div>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {project.description || 'Sin descripción asignada para este proyecto.'}
      </p>

      {/* Mini progreso de tareas */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
          <span>Tareas: {completedTaskCount}/{taskCount}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-track" style={{ height: '6px' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.875rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={() => onEdit(project)}
            className="btn-ghost btn-icon"
            title="Editar proyecto"
            style={{ cursor: 'pointer' }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="btn-ghost btn-icon"
            title="Eliminar proyecto"
            style={{ cursor: 'pointer', color: 'var(--danger)' }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelect(project.id)}
          icon={ArrowRight}
        >
          Ver Tareas
        </Button>
      </div>
    </div>
  );
};
