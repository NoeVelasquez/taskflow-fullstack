import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ currentView, onViewChange, isOpen = false, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban },
    { id: 'tasks', label: 'Mis Tareas', icon: CheckSquare },
  ];

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleLinkClick = (id) => {
    onViewChange(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop overlay para pantallas móviles */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <div className="sidebar-logo-icon">
              <Sparkles size={20} />
            </div>
            <h1 className="sidebar-brand-title">TaskFlow</h1>
          </div>

          {/* Botón cerrar para vista móvil */}
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            aria-label="Cerrar menú lateral"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">{userInitials}</div>
            <div className="user-info">
              <span className="user-name" title={user?.name || 'Usuario'}>
                {user?.name || 'Usuario'}
              </span>
              <span className="user-email" title={user?.email || ''}>
                {user?.email || ''}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout(true)}
            className="btn-ghost btn-icon"
            title="Cerrar sesión"
            style={{ cursor: 'pointer', color: '#dc2626' }}
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};
