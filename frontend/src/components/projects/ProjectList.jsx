import { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { Search, Filter, Plus, FolderKanban } from 'lucide-react';

export const ProjectList = ({
  projects = [],
  onSelectProject,
  onNewProject,
  onEditProject,
  onDeleteProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesSearch =
        proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proj.description && proj.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (proj.status || 'active').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <div>
      {/* Controles de búsqueda y filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="Buscar proyecto por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ width: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="active">Activos</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completados</option>
              <option value="archived">Archivados</option>
            </select>
          </div>
        </div>

        <Button variant="primary" icon={Plus} onClick={onNewProject}>
          Nuevo Proyecto
        </Button>
      </div>

      {/* Lista / Grid de proyectos */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchTerm || statusFilter !== 'ALL' ? 'No se encontraron proyectos con los filtros aplicados' : 'Aún no tienes proyectos creados'}
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'Intenta cambiar el término de búsqueda o el filtro de estado.'
              : 'Organiza tus metas y tareas creando tu primer proyecto ahora.'
          }
          actionText={searchTerm || statusFilter !== 'ALL' ? undefined : 'Crear Primer Proyecto'}
          onAction={searchTerm || statusFilter !== 'ALL' ? undefined : onNewProject}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
