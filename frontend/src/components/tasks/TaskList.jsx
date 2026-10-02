import { TaskItem } from './TaskItem';
import { EmptyState } from '../common/EmptyState';
import { Search, CheckSquare } from 'lucide-react';

export const TaskList = ({
  tasks = [],
  searchTerm = '',
  onSearchChange,
  filter = 'ALL',
  onFilterChange,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onNewTask,
  projectMap = {},
  emptyMessage = 'No hay tareas para mostrar con los filtros seleccionados.',
}) => {
  return (
    <div>
      {/* Controles de búsqueda y filtros */}
      {(onSearchChange || onFilterChange) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          {onSearchChange && (
            <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '450px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Buscar tareas por título o descripción..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
              />
            </div>
          )}

          {onFilterChange && (
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'PENDING', label: 'Pendientes' },
                { id: 'COMPLETED', label: 'Completadas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange(tab.id)}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: filter === tab.id ? 'var(--bg-surface)' : 'transparent',
                    color: filter === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: filter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de tareas */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={searchTerm || filter !== 'ALL' ? 'No se encontraron tareas' : 'No hay tareas creadas'}
          description={emptyMessage}
          actionText={onNewTask && !searchTerm && filter === 'ALL' ? 'Agregar Tarea' : undefined}
          onAction={onNewTask && !searchTerm && filter === 'ALL' ? onNewTask : undefined}
        />
      ) : (
        <div className="tasks-container">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectName={projectMap[task.projectId]}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
