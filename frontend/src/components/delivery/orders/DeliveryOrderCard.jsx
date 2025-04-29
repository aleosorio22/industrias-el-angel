import React from 'react';
import { FiUser, FiMapPin, FiPackage, FiCalendar, FiChevronRight } from 'react-icons/fi';

const DeliveryOrderCard = ({ order, onSelect }) => {
  // Función para obtener el color de fondo según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'listo para entregar a ruta':
        return 'bg-blue-100 text-blue-800';
      case 'en ruta':
        return 'bg-yellow-100 text-yellow-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect && onSelect(order)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FiCalendar className="mr-1" size={14} />
              <span>{formatDate(order.fecha)}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
            {order.estado}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="flex items-start">
            <FiUser className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="text-sm font-medium">{order.cliente_nombre}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FiMapPin className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Sucursal</p>
              <p className="text-sm font-medium">{order.sucursal_nombre}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mb-3">
          <FiPackage className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Productos</p>
            <p className="text-sm font-medium">{order.total_productos || '?'} productos</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="text-primary hover:text-primary-dark flex items-center text-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation to parent
              onSelect && onSelect(order);
            }}
          >
            Ver detalles <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderCard;