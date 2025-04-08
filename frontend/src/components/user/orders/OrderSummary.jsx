import { FiArrowLeft, FiCheck, FiMapPin, FiFileText, FiCalendar } from "react-icons/fi";
import { formatDate } from '../../../utils/dateUtils';

export default function OrderSummary({ 
  orderItems, 
  selectedBranch, 
  observations,
  orderDate, // Agregar prop para la fecha
  onGoBack, 
  onSubmit,
  isSubmitting
}) {
  // Calcular totales
  const totalProducts = orderItems.length;
  const totalItems = orderItems.reduce((sum, item) => sum + item.cantidad, 0);
  const totalUnits = orderItems.reduce(
    (sum, item) => sum + (item.cantidad * item.cantidad_por_presentacion), 
    0
  );

  // Formatear la fecha para mostrarla de manera más amigable
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    
    // Fix for timezone issue - add time and adjust for local timezone
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold">Resumen del pedido</h2>
      </div>
      
      {/* Información del pedido */}
      <div className="p-4 border-b border-gray-100">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha</h3>
          <div className="flex items-center">
            <FiCalendar className="text-gray-400 mr-1" />
            <p className="text-gray-800">{formatDate(orderDate)}</p>
          </div>
        </div>
        
        {selectedBranch && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Sucursal</h3>
            <div className="flex items-center">
              <FiMapPin className="text-gray-400 mr-1" />
              <p className="text-gray-800">{selectedBranch.nombre}</p>
            </div>
          </div>
        )}
        
        {observations && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Observaciones</h3>
            <div className="flex items-start">
              <FiFileText className="text-gray-400 mr-1 mt-1" />
              <p className="text-gray-800">{observations}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de productos */}
      <div className="divide-y divide-gray-100">
        {orderItems.map((item, index) => (
          <div key={index} className="p-4">
            <div className="mb-1">
              <h3 className="font-medium">{item.producto_nombre}</h3>
              <p className="text-sm text-gray-500">Código: {item.producto_codigo}</p>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-sm">
                  {item.presentacion_nombre} 
                  <span className="text-gray-500 ml-1">
                    ({item.cantidad_por_presentacion} {item.unidad_base})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.cantidad}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-md mt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total unidades:</span>
                <span className="font-medium">
                  {item.cantidad * item.cantidad_por_presentacion} {item.unidad_base}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Resumen total */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total productos:</span>
          <span className="font-medium">{totalProducts}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total presentaciones:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total unidades:</span>
          <span className="font-medium">{totalUnits}</span>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="p-4 flex justify-between">
        <button
          onClick={onGoBack}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Volver
        </button>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md flex items-center ${
            isSubmitting 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-green-500 text-white hover:bg-green-600"
          } transition-colors`}
        >
          <FiCheck className="mr-2" />
          {isSubmitting ? "Enviando..." : "Confirmar pedido"}
        </button>
      </div>
    </div>
  );
}