import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FolderPlus, Edit3 } from 'lucide-react';

export const ProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es obligatorio';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe contener al menos 3 caracteres';
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

    const success = await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });

    if (success) {
      onClose();
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'archived', label: 'Archivado' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
      icon={isEditing ? Edit3 : FolderPlus}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre del Proyecto"
          name="name"
          placeholder="Ej: Rediseño Portal Web"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Textarea
          label="Descripción"
          name="description"
          placeholder="Describe el objetivo y alcance del proyecto..."
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
        />

        <Select
          label="Estado del Proyecto"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </form>
    </Modal>
  );
};
