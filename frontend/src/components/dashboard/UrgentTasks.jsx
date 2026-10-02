import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const UrgentTasks = ({ tasks = [], onToggleComplete, onNavigateTasks }) => {
  const pending = tasks.filter((t) => !t.completed).slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Tareas Pendientes</h3>
          <p className="card-subtitle">Prioritarias por completar</p>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowRight} onClick={onNavigateTasks}>
          Ver Todas
        </Button>
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
          ¡Estás al día! No tienes tareas pendientes.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {pending.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                <button
                  type="button"
                  onClick={() => onToggleComplete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                  title="Marcar como completada"
                >
                  <Circle size={20} />
                </button>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
