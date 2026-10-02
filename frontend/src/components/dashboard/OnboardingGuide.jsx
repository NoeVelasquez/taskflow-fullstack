import { useState } from 'react';
import { Sparkles, FolderPlus, CheckSquare, Kanban, ArrowRight, X, Compass } from 'lucide-react';
import { Button } from '../common/Button';

export const OnboardingGuide = ({ onNewProject, onNewTask, hasProjects, hasTasks }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)',
        border: '1.5px solid #c7d2fe',
        marginBottom: '2rem',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setIsDismissed(true)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
        }}
        title="Ocultar guía de inicio"
        aria-label="Ocultar guía de inicio"
      >
        <X size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Compass size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ¡Primeros pasos en TaskFlow! 🚀
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Aprende a sacarle el máximo provecho a tu espacio de trabajo en 3 sencillos pasos.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem',
        }}
      >
        {/* Paso 1 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Crea un Proyecto
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
              Agrupa tus metas por tema (ej. <em>"Desarrollo Web"</em>, <em>"Tesis"</em> o <em>"Tareas de Casa"</em>).
            </p>
          </div>
          <Button
            variant={hasProjects ? 'secondary' : 'primary'}
            size="sm"
            icon={FolderPlus}
            onClick={onNewProject}
            style={{ width: '100%' }}
          >
            {hasProjects ? '✓ Crear Otro Proyecto' : 'Crear mi Primer Proyecto'}
          </Button>
        </div>

        {/* Paso 2 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Agrega Tareas
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
              Desglosa las actividades pendientes y vincúlalas al proyecto que desees.
            </p>
          </div>
          <Button
            variant={hasTasks ? 'secondary' : 'primary'}
            size="sm"
            icon={CheckSquare}
            onClick={onNewTask}
            style={{ width: '100%' }}
          >
            {hasTasks ? '✓ Agregar Otra Tarea' : 'Agregar mi Primera Tarea'}
          </Button>
        </div>

        {/* Paso 3 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#fffbeb',
                  color: '#d97706',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Completa y Monitorea
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
              Usa la vista <strong>Lista</strong> o <strong>Tablero Kanban</strong> y marca el checkbox para ver tu progreso crecer.
            </p>
          </div>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            💡 ¡Tu progreso subirá automáticamente!
          </div>
        </div>
      </div>
    </div>
  );
};
