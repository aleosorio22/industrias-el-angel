import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiCalendar, FiUser, FiPackage, FiMapPin } from 'react-icons/fi';

const OrdersList = ({ orders, isLoading, error, formatDate, getStatusColor, formatStatus }) => {
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

  return (
    <div className="divide-y divide-gray-100">
      {orders.map(order => (
        <Link 
          key={order.id} 
          to={`/admin/orders/${order.id}`}
          className="block p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">Pedido #{order.id}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.estado)}`}>
              {formatStatus(order.estado)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <FiCalendar className="mr-1" size={14} />
            {formatDate(order.fecha)}
          </div>
          
          {/* Mostrar información del cliente */}
          {order.cliente_nombre && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FiUser className="mr-1" size={14} />
              {order.cliente_nombre}
            </div>
          )}
          
          {/* Mostrar información de la sucursal si existe */}
          {order.sucursal_nombre && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FiMapPin className="mr-1" size={14} />
              {order.sucursal_nombre}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <FiPackage className="mr-1" size={14} />
              {/* Mostrar total_productos si existe, de lo contrario mostrar un valor predeterminado */}
              {order.total_productos ? `${order.total_productos} productos` : 'Ver detalle'}
            </div>
            <FiChevronRight className="text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersList;