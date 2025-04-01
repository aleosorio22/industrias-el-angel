import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import PresentationProductService from "../../../services/PresentationProductService";

export default function ProductSelector({ products, onAddProduct }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [selectedPresentation, setSelectedPresentation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedProduct) {
      fetchPresentations(selectedProduct.id);
    } else {
      setPresentations([]);
      setSelectedPresentation("");
    }
  }, [selectedProduct]);

  const fetchPresentations = async (productId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await PresentationProductService.getProductPresentations(productId);
      
      // Verificar si la respuesta es un array directamente
      if (Array.isArray(response)) {
        setPresentations(response);
        if (response.length > 0) {
          setSelectedPresentation(response[0].id.toString());
        }
      } 
      // Verificar si la respuesta tiene una propiedad data que es un array
      else if (response && Array.isArray(response.data)) {
        setPresentations(response.data);
        if (response.data.length > 0) {
          setSelectedPresentation(response.data[0].id.toString());
        }
      } 
      // Si la respuesta tiene éxito pero no es un array
      else if (response && response.success) {
        setPresentations(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedPresentation(response.data[0].id.toString());
        }
      } 
      else {
        setError("No se pudieron cargar las presentaciones");
        setPresentations([]);
      }
    } catch (err) {
      setError(err.message || "Error al cargar presentaciones");
      setPresentations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm("");
  };

  const handleAddToOrder = () => {
    if (!selectedProduct || !selectedPresentation) {
      return;
    }
    
    // Asegurarse de que selectedPresentation sea un número
    const presentationId = parseInt(selectedPresentation, 10);
    
    // Encontrar la presentación seleccionada para obtener información adicional
    const selectedPresentationObj = presentations.find(p => {
      // Verificar tanto id como presentacion_id
      const presentationIdInObj = p.id || p.presentacion_id;
      return parseInt(presentationIdInObj, 10) === presentationId;
    });
    
    if (!selectedPresentationObj) {
      console.error("No se encontró la presentación seleccionada", { 
        presentationId, 
        presentations 
      });
      return;
    }
    
    // Usar el ID correcto según la estructura de datos
    const finalPresentationId = selectedPresentationObj.presentacion_id || selectedPresentationObj.id;
    
    // Llamar a la función onAddProduct con los parámetros correctos
    onAddProduct(
      selectedProduct.id,
      finalPresentationId,
      quantity
    );
    
    // Resetear selección
    setSelectedProduct(null);
    setSelectedPresentation("");
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold">Agregar productos</h2>
      </div>
      
      <div className="p-4">
        {/* Buscador de productos */}
        {!selectedProduct ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar producto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Nombre o código del producto"
              />
            </div>
            
            {searchTerm && (
              <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{product.nombre}</div>
                      <div className="text-sm text-gray-500">Código: {product.codigo}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="font-medium">{selectedProduct.nombre}</div>
              <div className="text-sm text-gray-500">Código: {selectedProduct.codigo}</div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-2 text-sm text-green-600 hover:text-green-700"
              >
                Cambiar producto
              </button>
            </div>
            
            {error ? (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            ) : isLoading ? (
              <div className="text-center py-2">Cargando presentaciones...</div>
            ) : presentations.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presentación
                  </label>
                  <select
                    value={selectedPresentation}
                    onChange={(e) => setSelectedPresentation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    {presentations.map(presentation => (
                      <option 
                        key={presentation.id || presentation.presentacion_id} 
                        value={presentation.id || presentation.presentacion_id}
                      >
                        {presentation.presentacion_nombre || presentation.nombre} 
                        ({presentation.cantidad} {selectedProduct.unidad_nombre})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l-md"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center p-2 border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-r-md"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToOrder}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  type="button"
                >
                  <FiPlus className="mr-2" />
                  Agregar al pedido
                </button>
              </>
            ) : (
              <div className="text-center py-2 text-gray-500">
                Este producto no tiene presentaciones disponibles
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}