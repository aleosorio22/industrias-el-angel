import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import templateService from "../../services/TemplateService";

export default function UserTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await templateService.getTemplates();
      // Asegurarse de que data sea un array
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar plantillas:", error);
      toast.error("No se pudieron cargar las plantillas");
      setTemplates([]); // Establecer un array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      await templateService.deleteTemplate(templateToDelete.id);
      toast.success("Plantilla eliminada correctamente");
      fetchTemplates();
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);
      toast.error("No se pudo eliminar la plantilla");
    } finally {
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Mis Plantillas</h1>
            <p className="text-gray-500">Gestiona tus plantillas de pedidos</p>
          </div>
          <div className="flex space-x-2">
            <Link to="/user/profile" className="px-4 py-2 flex items-center text-gray-600 bg-white rounded-md shadow hover:bg-gray-50">
              <FiArrowLeft className="mr-2" />
              Volver
            </Link>
            <Link to="/user/templates/new" className="px-4 py-2 flex items-center text-white bg-green-500 rounded-md shadow hover:bg-green-600">
              <FiPlus className="mr-2" />
              Nueva Plantilla
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No tienes plantillas guardadas</h2>
            <p className="text-gray-500 mb-6">Crea tu primera plantilla para agilizar tus pedidos frecuentes</p>
            <Link to="/user/templates/new" className="px-4 py-2 text-white bg-green-500 rounded-md shadow hover:bg-green-600">
              Crear plantilla
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creación</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{template.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">
                          {template.productos && Array.isArray(template.productos) 
                            ? `${template.productos.length} productos` 
                            : "0 productos"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">
                          {template.fecha_creacion 
                            ? new Date(template.fecha_creacion).toLocaleDateString() 
                            : "Fecha no disponible"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/user/orders/new?template=${template.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Usar plantilla"
                          >
                            <FiCopy size={18} />
                          </Link>
                          <Link 
                            to={`/user/templates/${template.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Editar plantilla"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(template)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar plantilla"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
              <p className="text-gray-500 mb-4">
                ¿Estás seguro de que deseas eliminar la plantilla "{templateToDelete?.nombre}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}