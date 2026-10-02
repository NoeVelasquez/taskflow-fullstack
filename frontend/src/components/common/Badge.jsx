export const Badge = ({ status = 'active', label, className = '' }) => {
  const normalizedStatus = (status || '').toLowerCase();

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'active':
      case 'activo':
        return { className: 'badge-active', text: label || 'Activo' };
      case 'completed':
      case 'completado':
        return { className: 'badge-completed', text: label || 'Completado' };
      case 'pending':
      case 'pendiente':
        return { className: 'badge-pending', text: label || 'Pendiente' };
      case 'archived':
      case 'archivado':
        return { className: 'badge-archived', text: label || 'Archivado' };
      default:
        return { className: 'badge-inactive', text: label || status };
    }
  };

  const config = getStatusConfig();

  return <span className={`badge ${config.className} ${className}`}>{config.text}</span>;
};
