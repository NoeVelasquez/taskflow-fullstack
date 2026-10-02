import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CheckSquare, Edit3 } from 'lucide-react';

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  projects = [],
  defaultProjectId = '',
  isLoading = false,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: defaultProjectId || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        projectId: initialData.projectId || defaultProjectId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: defaultProjectId || '',
      });
    }
    setErrors({});
  }, [initialData, defaultProjectId, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título de la tarea es obligatorio';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (formData.projectId) {
      payload.projectId = formData.projectId;
    }

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  const projectOptions = [
    { value: '', label: '-- Sin Proyecto (General) --' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
      icon={isEditing ? Edit3 : CheckSquare}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Título de la Tarea"
          name="title"
          placeholder="Ej: Implementar autenticación JWT"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <Textarea
          label="Descripción (Opcional)"
          name="description"
          placeholder="Añade detalles, notas o instrucciones adicionales..."
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
        />

        {projects.length > 0 && !defaultProjectId && (
          <Select
            label="Proyecto Asociado"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projectOptions}
          />
        )}
      </form>
    </Modal>
  );
};
