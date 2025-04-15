import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiSave, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import templateService from "../../services/TemplateService";
import productService from "../../services/ProductService";
import PresentationProductService from "../../services/PresentationProductService";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState(null);
  const [nombre, setNombre] = useState("");
  const [productos, setProductos] = useState([]);
  
  // Datos para selección de productos
  const [allProducts, setAllProducts] = useState([]);
  const [allPresentations, setAllPresentations] = useState({});
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPresentation, setSelectedPresentation] = useState("");
  const [cantidad, setCantidad] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar la plantilla
        const templateData = await templateService.getTemplateById(id);
        setTemplate(templateData);
        setNombre(templateData.nombre);
        setProductos(templateData.productos || []);
        
        // Cargar productos - usando getAllProducts en lugar de getProducts
        const productsResponse = await productService.getAllProducts();
        if (productsResponse.success) {
          setAllProducts(productsResponse.data);
        } else {
          toast.error("No se pudieron cargar los productos");
        }
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("No se pudo cargar la plantilla");
        navigate("/user/templates");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
  // Cargar presentaciones cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      const fetchPresentations = async () => {
        try {
          const response = await PresentationProductService.getProductPresentations(selectedProduct);
          
          // Manejar diferentes formatos de respuesta
          if (Array.isArray(response)) {
            setAllPresentations(prev => ({
              ...prev,
              [selectedProduct]: response
            }));
          } else if (response && Array.isArray(response.data)) {
            setAllPresentations(prev => ({
              ...prev,
              [selectedProduct]: response.data
            }));
          } else if (response && response.success && Array.isArray(response.data)) {
            setAllPresentations(prev => ({
              ...prev,
              [selectedProduct]: response.data
            }));
          }
          
          // Seleccionar la primera presentación por defecto
          const presentations = Array.isArray(response) ? response : 
                               (Array.isArray(response?.data) ? response.data : []);
          
          if (presentations.length > 0) {
            setSelectedPresentation(presentations[0].id || presentations[0].presentacion_id);
          }
          
        } catch (error) {
          console.error("Error al cargar presentaciones:", error);
          toast.error("No se pudieron cargar las presentaciones");
        }
      };
      
      fetchPresentations();
    }
  }, [selectedProduct]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      toast.error("El nombre de la plantilla es obligatorio");
      return;
    }
    
    if (productos.length === 0) {
      toast.error("Debes agregar al menos un producto a la plantilla");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Preparar los datos en el formato que espera el backend
      const templateData = {
        nombre,
        productos: productos.map(p => ({
          producto_id: parseInt(p.producto_id),
          presentacion_id: parseInt(p.presentacion_id),
          cantidad: parseInt(p.cantidad)
        }))
      };
      
      console.log("Enviando datos de plantilla:", templateData);
      
      // Enviar solo los datos necesarios al backend
      const response = await templateService.updateTemplate(id, templateData);
      
      if (response && response.success === false) {
        toast.error(response.message || "No se pudo actualizar la plantilla");
        return;
      }
      
      toast.success("Plantilla actualizada correctamente");
      navigate("/user/templates");
    } catch (error) {
      console.error("Error al actualizar plantilla:", error);
      toast.error("No se pudo actualizar la plantilla");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddProduct = async () => {
    if (!selectedProduct || !selectedPresentation || cantidad < 1) {
      toast.error("Selecciona un producto, presentación y cantidad válida");
      return;
    }
    
    // Verificar si el producto ya existe en la lista
    const existingIndex = productos.findIndex(
      p => p.producto_id === parseInt(selectedProduct) && p.presentacion_id === parseInt(selectedPresentation)
    );
    
    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedProductos = [...productos];
      updatedProductos[existingIndex].cantidad = parseInt(cantidad);
      setProductos(updatedProductos);
    } else {
      // Agregar nuevo producto
      const selectedProductObj = allProducts.find(p => p.id === parseInt(selectedProduct));
      
      // Obtener presentaciones del producto si no están cargadas
      let presentationDetails;
      if (!allPresentations[selectedProduct]) {
        try {
          const response = await PresentationProductService.getProductPresentations(selectedProduct);
          const presentations = Array.isArray(response) ? response : 
                               (Array.isArray(response?.data) ? response.data : []);
          
          presentationDetails = presentations.find(
            p => (p.id === parseInt(selectedPresentation) || p.presentacion_id === parseInt(selectedPresentation))
          );
        } catch (error) {
          console.error("Error al cargar presentaciones:", error);
          toast.error("No se pudieron cargar las presentaciones");
          return;
        }
      } else {
        presentationDetails = allPresentations[selectedProduct].find(
          p => (p.id === parseInt(selectedPresentation) || p.presentacion_id === parseInt(selectedPresentation))
        );
      }
      
      if (!presentationDetails) {
        toast.error("No se encontró la presentación seleccionada");
        return;
      }
      
      // Usar el ID correcto según la estructura de datos, como en ProductSelector.jsx
      const finalPresentationId = presentationDetails.presentacion_id || presentationDetails.id;
      
      setProductos([
        ...productos,
        {
          producto_id: parseInt(selectedProduct),
          presentacion_id: parseInt(finalPresentationId),
          cantidad: parseInt(cantidad),
          // Información adicional para mostrar en la UI
          producto_nombre: selectedProductObj?.nombre || "Producto desconocido",
          presentacion_nombre: presentationDetails.presentacion_nombre || presentationDetails.nombre || "Presentación desconocida"
        }
      ]);
    }
    
    // Limpiar selección
    setSelectedProduct("");
    setSelectedPresentation("");
    setCantidad(1);
    setShowAddProductModal(false);
    
    toast.success("Producto agregado a la plantilla");
  };
  
  const handleRemoveProduct = (index) => {
    const updatedProductos = [...productos];
    updatedProductos.splice(index, 1);
    setProductos(updatedProductos);
    toast.success("Producto eliminado de la plantilla");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16">
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Editar Plantilla</h1>
            <p className="text-gray-500">Modifica los detalles de tu plantilla</p>
          </div>
          <div className="flex space-x-2">
            <Link to="/user/templates" className="px-4 py-2 flex items-center text-gray-600 bg-white rounded-md shadow hover:bg-gray-50">
              <FiArrowLeft className="mr-2" />
              Volver
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 flex items-center text-white bg-green-500 rounded-md shadow hover:bg-green-600 disabled:bg-green-300"
            >
              <FiSave className="mr-2" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Pedido Semanal"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Productos</h3>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-3 py-1 flex items-center text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  <FiPlus className="mr-1" />
                  Agregar Producto
                </button>
              </div>
              
              {productos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay productos en esta plantilla. Agrega al menos uno.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presentación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productos.map((producto, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{producto.producto_nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">{producto.presentacion_nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">{producto.cantidad}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemoveProduct(index)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar producto"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal para agregar producto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agregar Producto</h2>
              
              <div className="mb-4">
                <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                <select
                  id="producto"
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    setSelectedPresentation("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona un producto</option>
                  {allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="presentacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Presentación
                </label>
                <select
                  id="presentacion"
                  value={selectedPresentation}
                  onChange={(e) => setSelectedPresentation(e.target.value)}
                  disabled={!selectedProduct || !allPresentations[selectedProduct]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Selecciona una presentación</option>
                  {selectedProduct &&
                    allPresentations[selectedProduct]?.map((presentation) => {
                      // Usar el ID correcto según la estructura de datos
                      const presentationId = presentation.presentacion_id || presentation.id;
                      return (
                        <option 
                          key={presentationId} 
                          value={presentationId}
                        >
                          {presentation.presentacion_nombre || presentation.nombre}
                        </option>
                      );
                    })}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}