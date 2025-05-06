import { useState, useEffect } from 'react';
import { Modal, Input, Button, Checkbox, Spin, Alert } from 'antd';
import productionAreaService from "../services/ProductionAreaService";
import { toast } from 'react-hot-toast';

const ProductionAreaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  selectedArea,
  categories
}) => {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', categorias: [] });
  const [assignedCategories, setAssignedCategories] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar categorías asignadas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      setErrorCategories(null);
      
      productionAreaService.getAssignedCategories()
        .then(response => {
          if (response.success) {
            const assigned = {};
            response.data.forEach(assignment => {
              assigned[assignment.categoria_id] = assignment.area_nombre;
            });
            setAssignedCategories(assigned);
          } else {
            throw new Error(response.message || 'Error al cargar categorías asignadas');
          }
        })
        .catch(err => {
          console.error("Error fetching assigned categories:", err);
          const errorMsg = typeof err === 'object' && err.message 
            ? err.message 
            : 'No se pudieron cargar las categorías asignadas.';
          setErrorCategories(errorMsg);
          toast.error(`Error al cargar categorías: ${errorMsg}`);
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [isOpen]);

  // Rellenar formulario al editar
  useEffect(() => {
    if (isEditing && selectedArea) {
      setFormData({
        nombre: selectedArea.nombre || '',
        descripcion: selectedArea.descripcion || '',
        categorias: selectedArea.categorias?.map(cat => cat.id) || []
      });
    } else {
      // Resetear al crear o cerrar
      setFormData({ nombre: '', descripcion: '', categorias: [] });
    }
  }, [isEditing, selectedArea, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    setFormData(prev => {
      const newCategories = checked 
        ? [...prev.categorias, categoryId]
        : prev.categorias.filter(id => id !== categoryId);
      return { ...prev, categorias: newCategories };
    });
  };

  const handleSubmitInternal = async () => {
    if (!formData.nombre) {
      toast.error('El nombre del área es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: '', descripcion: '', categorias: [] });
    setErrorCategories(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Área de Producción' : 'Nueva Área de Producción'}
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
          className="bg-blue-500 hover:bg-blue-600 text-white"
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
            placeholder="Ej: Panadería"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <Input.TextArea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del área de producción"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categorías
          </label>
          {loadingCategories ? (
            <div className="text-center p-4"><Spin /> Cargando categorías...</div>
          ) : errorCategories ? (
            <Alert message={errorCategories} type="error" showIcon />
          ) : (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
              {categories.map(category => {
                const isAssigned = assignedCategories[category.id] && 
                               (!isEditing || assignedCategories[category.id] !== selectedArea?.nombre);
                
                return (
                  <div 
                    key={category.id} 
                    className={`p-2 rounded ${isAssigned ? 'opacity-50 bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Checkbox
                      checked={formData.categorias.includes(category.id)}
                      onChange={(e) => !isAssigned && handleCategoryChange(category.id, e.target.checked)}
                      disabled={isAssigned}
                    >
                      <span className="ml-2 text-sm">
                        {category.nombre}
                        {isAssigned && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Asignada a: {assignedCategories[category.id]})
                          </span>
                        )}
                      </span>
                    </Checkbox>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No hay categorías disponibles
                </p>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Selecciona las categorías aplicables
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProductionAreaFormModal;