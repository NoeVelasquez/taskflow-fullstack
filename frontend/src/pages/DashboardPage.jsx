import { useEffect } from 'react';
import { DashboardMetrics } from '../components/dashboard/DashboardMetrics';
import { RecentProjects } from '../components/dashboard/RecentProjects';
import { UrgentTasks } from '../components/dashboard/UrgentTasks';
import { OnboardingGuide } from '../components/dashboard/OnboardingGuide';
import { Spinner } from '../components/common/Spinner';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = ({
  onSelectProject,
  onNewProject,
  onNavigateTasks,
}) => {
  const { user } = useAuth();
  const {
    projects,
    allTasks,
    isLoadingProjects,
    isLoadingTasks,
    fetchProjects,
    fetchAllTasks,
    toggleTaskComplete,
  } = useProjects();

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
  }, [fetchProjects, fetchAllTasks]);

  const isLoading = isLoadingProjects || isLoadingTasks;
  const hasProjects = projects.length > 0;
  const hasTasks = allTasks.length > 0;

  return (
    <div className="page-wrapper">
      {/* Saludo de bienvenida */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
          ¡Hola, {user?.name || 'Bienvenido'}! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Aquí tienes el resumen y las herramientas para gestionar tus proyectos y tareas con facilidad.
        </p>
      </div>

      {isLoading && projects.length === 0 && allTasks.length === 0 ? (
        <Spinner text="Cargando métricas del dashboard..." size={32} />
      ) : (
        <>
          {/* Guía de Primeros Pasos interactiva */}
          <OnboardingGuide
            onNewProject={onNewProject}
            onNewTask={() => onNavigateTasks()}
            hasProjects={hasProjects}
            hasTasks={hasTasks}
          />

          <DashboardMetrics />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: '1.5rem',
            }}
          >
            <RecentProjects
              projects={projects}
              onSelectProject={onSelectProject}
              onNewProject={onNewProject}
            />

            <UrgentTasks
              tasks={allTasks}
              onToggleComplete={toggleTaskComplete}
              onNavigateTasks={onNavigateTasks}
            />
          </div>
        </>
      )}
    </div>
  );
};
