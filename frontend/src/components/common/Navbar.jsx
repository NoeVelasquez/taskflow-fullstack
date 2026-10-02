import { ApiStatusBadge } from './ApiStatusBadge';
import { Button } from './Button';
import { Plus, FolderPlus, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ title, onToggleMobileMenu, onNewProject, onNewTask }) => {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="navbar-hamburger-btn"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-title">
          <span>{title}</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="navbar-status-wrapper">
          <ApiStatusBadge />
        </div>

        {onNewProject && (
          <Button
            variant="secondary"
            size="sm"
            icon={FolderPlus}
            onClick={onNewProject}
            className="navbar-action-btn"
          >
            <span className="btn-text-full">Nuevo Proyecto</span>
            <span className="btn-text-short">Proyecto</span>
          </Button>
        )}

        {onNewTask && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onNewTask}
            className="navbar-action-btn"
          >
            <span className="btn-text-full">Nueva Tarea</span>
            <span className="btn-text-short">Tarea</span>
          </Button>
        )}
      </div>
    </header>
  );
};
