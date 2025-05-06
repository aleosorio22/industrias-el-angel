import { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, Spin, Alert } from 'antd'; // Usaremos Ant Design para el Select múltiple
import PlantService from '../services/PlantService'; // Asegúrate que la ruta sea correcta y que el servicio exista
import { toast } from 'react-hot-toast';

const PlantFormModal = ({
  isOpen,
  onClose,
  onSubmit, // Esta función manejará la llamada al servicio (create/update)
  isEditing,
  selectedPlant, // Planta seleccionada para editar (debe incluir .areas si se cargaron)
}) => {
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', areas: [] });
  const [availableAreas, setAvailableAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [errorAreas, setErrorAreas] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar áreas disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setLoadingAreas(true);
      setErrorAreas(null);
      
      PlantService.getAvailableAreas()
        .then(response => {
          if (response.success && Array.isArray(response.data)) {
            // Mapeamos las áreas al formato esperado por Ant Design Select
            setAvailableAreas(response.data.map(area => ({
              value: area.id,
              label: area.nombre,
              // Deshabilitar si el área está asignada y no es a la planta actual que estamos editando
              disabled: !!area.asignada_a_planta_id && 
                       (isEditing && selectedPlant && 
                        area.asignada_a_planta_id !== selectedPlant.id)
            })));
          } else {
            throw new Error(response.message || 'Error al cargar áreas disponibles');
          }
        })
        .catch(err => {
          console.error("Error fetching available areas:", err);
          const errorMsg = typeof err === 'object' && err.message 
            ? err.message 
            : 'No se pudieron cargar las áreas.';
          setErrorAreas(errorMsg);
          toast.error(`Error al cargar áreas: ${errorMsg}`);
          setAvailableAreas([]);
        })
        .finally(() => setLoadingAreas(false));
    }
  }, [isOpen, isEditing, selectedPlant]);

  // Rellenar formulario al editar
  useEffect(() => {
    if (isEditing && selectedPlant) {
      setFormData({
        nombre: selectedPlant.nombre || '',
        ubicacion: selectedPlant.ubicacion || '',
        // Asumimos que selectedPlant.areas contiene los IDs de las áreas asignadas
        areas: selectedPlant.areas?.map(area => area.id) || []
      });
    } else {
      // Resetear al crear o cerrar
      setFormData({ nombre: '', ubicacion: '', areas: [] });
    }
  }, [isEditing, selectedPlant, isOpen]); // Resetear también al abrir/cerrar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (selectedAreaIds) => {
    setFormData(prev => ({ ...prev, areas: selectedAreaIds }));
  };

  const handleSubmitInternal = async () => {
    if (!formData.nombre) {
      toast.error('El nombre de la planta es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Llamamos a la función onSubmit pasada como prop, que se encargará de la lógica del servicio
      await onSubmit(formData);
      handleClose(); // Cerrar solo si onSubmit fue exitoso (no lanzó error)
    } catch (error) {
      // El error ya debería ser manejado y mostrado por la función onSubmit en el componente padre
      console.error("Error submitting form via prop:", error);
      // No cerramos el modal si hay error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Resetear estado local antes de llamar a onClose
    setFormData({ nombre: '', ubicacion: '', areas: [] });
    setAvailableAreas([]);
    setErrorAreas(null);
    setIsSubmitting(false); // Asegurarse de resetear el estado de envío
    onClose(); // Llama a la función onClose pasada por props
  };

  return (
    <Modal
      title={isEditing ? 'Editar Planta de Producción' : 'Crear Nueva Planta de Producción'}
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={isSubmitting} 
          onClick={handleSubmitInternal}
          className="bg-blue-500 hover:bg-blue-600 text-white" // Añadimos clases de Tailwind para asegurar el color
        >
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Planta Industrias El Angel"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Zona 0, Guatemala"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="areas" className="block text-sm font-medium text-gray-700 mb-1">
            Áreas Asignadas
          </label>
          {loadingAreas ? (
            <div className="text-center p-4"><Spin /> Cargando áreas...</div>
          ) : errorAreas ? (
            <Alert message={errorAreas} type="error" showIcon />
          ) : (
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Selecciona las áreas de producción para esta planta"
              onChange={handleAreaChange}
              value={formData.areas} // Debe ser un array de IDs
              options={availableAreas} // Array de { value: id, label: nombre, disabled: boolean }
              optionFilterProp="label" // Permite buscar por nombre de área
              disabled={isSubmitting}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              loading={loadingAreas}
            />
          )}
           <p className="text-xs text-gray-500 mt-1">
            Solo se muestran áreas disponibles o asignadas a esta planta.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PlantFormModal;