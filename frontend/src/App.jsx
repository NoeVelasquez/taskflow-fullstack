import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { Spinner } from './components/common/Spinner';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { ProjectFormModal } from './components/projects/ProjectFormModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { useProjects } from './context/ProjectContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { projects, createProject, createTask } = useProjects();

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'projects' | 'tasks'
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modales Rápidos Globales
  const [isQuickProjectModalOpen, setIsQuickProjectModalOpen] = useState(false);
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  // Carga inicial verificando sesión
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: 'white',
        }}
      >
        <Spinner size={40} text="Iniciando TaskFlow..." />
      </div>
    );
  }

  // Usuario no autenticado: Pantalla de Login / Registro
  if (!isAuthenticated) {
    return <AuthLayout />;
  }

  // Handlers de navegación
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'projects') {
      setSelectedProjectId(null);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentView('projects');
    setIsMobileMenuOpen(false);
  };

  const handleClearSelectedProject = () => {
    setSelectedProjectId(null);
  };

  // Handlers para modales rápidos desde Navbar
  const handleQuickCreateProject = async (formData) => {
    setIsSubmittingQuick(true);
    const result = await createProject(formData);
    setIsSubmittingQuick(false);
    return result.success;
  };

  const handleQuickCreateTask = async (formData) => {
    setIsSubmittingQuick(true);
    const result = await createTask(formData);
    setIsSubmittingQuick(false);
    return result.success;
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Panel de Control';
      case 'projects':
        return selectedProjectId ? 'Detalle de Proyecto' : 'Proyectos';
      case 'tasks':
        return 'Gestión de Tareas';
      default:
        return 'TaskFlow';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="main-content">
        <Navbar
          title={getPageTitle()}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onNewProject={() => setIsQuickProjectModalOpen(true)}
          onNewTask={() => setIsQuickTaskModalOpen(true)}
        />

        {currentView === 'dashboard' && (
          <DashboardPage
            onSelectProject={handleSelectProject}
            onNewProject={() => setIsQuickProjectModalOpen(true)}
            onNavigateTasks={() => setCurrentView('tasks')}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsPage
            selectedProjectId={selectedProjectId}
            onClearSelectedProject={handleClearSelectedProject}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'tasks' && <TasksPage />}
      </main>

      {/* Modal Rápido: Nuevo Proyecto */}
      <ProjectFormModal
        isOpen={isQuickProjectModalOpen}
        onClose={() => setIsQuickProjectModalOpen(false)}
        onSubmit={handleQuickCreateProject}
        isLoading={isSubmittingQuick}
      />

      {/* Modal Rápido: Nueva Tarea */}
      <TaskFormModal
        isOpen={isQuickTaskModalOpen}
        onClose={() => setIsQuickTaskModalOpen(false)}
        onSubmit={handleQuickCreateTask}
        projects={projects}
        isLoading={isSubmittingQuick}
      />
    </div>
  );
}

export default App;
