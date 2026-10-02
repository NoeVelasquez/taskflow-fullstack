import { FolderKanban, ArrowRight, Plus } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const RecentProjects = ({ projects = [], onSelectProject, onNewProject }) => {
  const recent = projects.slice(0, 4);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Proyectos Recientes</h3>
          <p className="card-subtitle">Últimos proyectos gestionados</p>
        </div>
        <Button variant="ghost" size="sm" icon={Plus} onClick={onNewProject}>
          Nuevo
        </Button>
      </div>

      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No hay proyectos creados aún.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recent.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              className="card-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FolderKanban size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.description || 'Sin descripción'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <Badge status={proj.status || 'active'} />
                <ArrowRight size={16} color="#94a3b8" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
