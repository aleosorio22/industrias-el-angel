import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiCalendar, FiUser, FiPackage, FiMapPin } from 'react-icons/fi';
import { formatDate } from '../../../utils/dateUtils';

const OrdersList = ({ orders, isLoading, error, getStatusColor, onViewDetails }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se encontraron pedidos
      </div>
    );
  }

  // Función para formatear el estado para mostrar
  const formatStatus = (status) => {
    const statusLabels = {
      solicitado: 'Solicitado',
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      cancelado: 'Cancelado',
      entregado: 'Entregado'
    };
    return statusLabels[status] || status;
  };

  return (
    <div className="divide-y divide-gray-100 bg-white rounded-lg shadow-sm">
      {orders.map(order => (
        <Link 
          key={order.id} 
          to={`/admin/orders/${order.id}`}
          className="block p-3 sm:p-4 hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            if (onViewDetails) {
              e.preventDefault();
              onViewDetails(order.id);
            }
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm sm:text-base">Pedido #{order.id}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.estado)}`}>
              {formatStatus(order.estado)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <FiCalendar className="mr-1 flex-shrink-0" size={14} />
              <span className="truncate">{formatDate(order.fecha)}</span>
            </div>
            
            {/* Mostrar información del cliente */}
            {order.cliente_nombre && (
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <FiUser className="mr-1 flex-shrink-0" size={14} />
                <span className="truncate">{order.cliente_nombre}</span>
              </div>
            )}
            
            {/* Mostrar información de la sucursal si existe */}
            {order.sucursal_nombre && (
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <FiMapPin className="mr-1 flex-shrink-0" size={14} />
                <span className="truncate">{order.sucursal_nombre}</span>
              </div>
            )}
            
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <FiPackage className="mr-1 flex-shrink-0" size={14} />
              <span className="truncate">
                {order.total_productos ? `${order.total_productos} productos` : 'Ver detalle'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <FiChevronRight className="text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersList;