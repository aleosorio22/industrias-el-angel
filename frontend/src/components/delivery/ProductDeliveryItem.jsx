import { useState, useEffect } from "react";
import { FiCheck, FiX, FiEdit2, FiSave } from "react-icons/fi";

const ProductDeliveryItem = ({ 
  product, 
  deliveryData, 
  onUpdateDelivery, 
  disabled 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(deliveryData?.cantidad_entregada || 0);
  const [comment, setComment] = useState(deliveryData?.comentario || "");
  const [error, setError] = useState(null);
  
  // Actualizar estados cuando cambia deliveryData
  useEffect(() => {
    if (deliveryData) {
      setQuantity(deliveryData.cantidad_entregada || 0);
      setComment(deliveryData.comentario || "");
    }
  }, [deliveryData]);

  const originalQuantity = product.cantidad;
  const isComplete = quantity >= originalQuantity;
  const isPartial = quantity > 0 && quantity < originalQuantity;
  const isPending = quantity === 0;

  const handleSave = () => {
    if (quantity < 0) {
      setError("La cantidad no puede ser negativa");
      return;
    }

    onUpdateDelivery({
      producto_id: product.producto_id,
      presentacion_id: product.presentacion_id, // Ya está correcto
      cantidad_entregada: quantity,
      comentario: comment
    });
    
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setQuantity(deliveryData?.cantidad_entregada || 0);
    setComment(deliveryData?.comentario || "");
    setIsEditing(false);
    setError(null);
  };

  const getStatusBadge = () => {
    if (isComplete) {
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Completo</span>;
    } else if (isPartial) {
      return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Parcial</span>;
    } else {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">Pendiente</span>;
    }
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{product.producto_nombre}</h3>
          <p className="text-sm text-gray-500">Código: {product.producto_codigo}</p>
        </div>
        <div className="flex items-center">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Cantidad solicitada:</span>
          <span className="text-sm font-medium">{originalQuantity} {product.presentacion_nombre}</span>
        </div>
        
        {isEditing ? (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad entregada:
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentario (opcional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Razón de entrega parcial, etc."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              >
                <FiX className="mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FiSave className="mr-1" />
                Guardar
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center mt-2">
            <div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Cantidad entregada:</span>
                <span className="text-sm font-medium">
                  {quantity} {product.presentacion_nombre}
                </span>
              </div>
              
              {isPartial && (
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600 mr-2">Diferencia:</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {originalQuantity - quantity} {product.presentacion_nombre}
                  </span>
                </div>
              )}
              
              {comment && (
                <div className="mt-2 text-sm text-gray-600 italic">
                  "{comment}"
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              disabled={disabled}
              className={`p-2 rounded-full ${
                disabled 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiEdit2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDeliveryItem;