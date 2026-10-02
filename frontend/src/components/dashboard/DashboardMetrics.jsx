import { FolderKanban, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

export const DashboardMetrics = () => {
  const { stats } = useProjects();

  const metrics = [
    {
      label: 'Total Proyectos',
      value: stats.totalProjects,
      icon: FolderKanban,
      colorClass: 'indigo',
    },
    {
      label: 'Proyectos Activos',
      value: stats.activeProjectsCount,
      icon: BarChart3,
      colorClass: 'sky',
    },
    {
      label: 'Tareas Pendientes',
      value: stats.pendingTasks,
      icon: Clock,
      colorClass: 'amber',
    },
    {
      label: 'Tareas Completadas',
      value: stats.completedTasks,
      icon: CheckCircle2,
      colorClass: 'emerald',
    },
  ];

  return (
    <div>
      <div className="metrics-grid">
        {metrics.map((m, index) => {
          const Icon = m.icon;
          return (
            <div key={index} className="metric-card">
              <div className={`metric-icon-box ${m.colorClass}`}>
                <Icon size={26} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de progreso global */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Progreso Global de Cumplimiento
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {stats.completedTasks} de {stats.totalTasks} tareas completadas en total
            </p>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stats.completionPercentage}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
