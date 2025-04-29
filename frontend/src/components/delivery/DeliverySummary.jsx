import { FiPackage, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const DeliverySummary = ({ orderDetails, deliveryData }) => {
  // Calcular estadísticas de entrega
  const totalProducts = orderDetails.detalles?.length || 0;
  
  // Contar productos por estado
  let completedCount = 0;
  let partialCount = 0;
  let pendingCount = 0;
  
  orderDetails.detalles?.forEach(product => {
    // Buscar entrega por producto_id Y presentacion_id
    const delivery = deliveryData.find(
      d => d.producto_id === product.producto_id && 
           d.presentacion_id === product.presentacion_id
    );
    const deliveredQuantity = delivery?.cantidad_entregada || 0;
    
    if (deliveredQuantity >= product.cantidad) {
      completedCount++;
    } else if (deliveredQuantity > 0) {
      partialCount++;
    } else {
      pendingCount++;
    }
  });
  
  // Calcular porcentaje de completitud
  const completionPercentage = totalProducts > 0 
    ? Math.round(((completedCount + (partialCount * 0.5)) / totalProducts) * 100) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold">Resumen de Entrega</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Progreso de entrega:</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 p-3 rounded-md">
            <FiCheckCircle className="mx-auto text-green-500 mb-1" />
            <div className="text-xl font-semibold text-green-700">{completedCount}</div>
            <div className="text-xs text-green-600">Completos</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md">
            <FiAlertTriangle className="mx-auto text-yellow-500 mb-1" />
            <div className="text-xl font-semibold text-yellow-700">{partialCount}</div>
            <div className="text-xs text-yellow-600">Parciales</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <FiPackage className="mx-auto text-gray-500 mb-1" />
            <div className="text-xl font-semibold text-gray-700">{pendingCount}</div>
            <div className="text-xs text-gray-600">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummary;