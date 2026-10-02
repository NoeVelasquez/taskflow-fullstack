import { FolderPlus, CheckCircle, Plus } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FolderPlus,
  title = 'No hay elementos registrados',
  description = 'Comienza agregando un nuevo elemento para organizarte mejor.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={Plus} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
