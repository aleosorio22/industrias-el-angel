import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiChevronRight } from 'react-icons/fi';
import OrderStatusBadge from './OrderStatusBadge';
import { formatDate } from '../../../utils/dateUtils';

const OrderCard = ({ order }) => {
  return (
    <Link 
      to={`/user/orders/${order.id}`}
      className="block bg-white rounded-lg shadow mb-3"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-gray-800">Pedido #{order.id}</div>
          <OrderStatusBadge status={order.estado} />
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FiCalendar className="mr-1" size={14} />
          <span>{formatDate(order.fecha)}</span>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <div className="flex items-center text-gray-600">
            <FiPackage className="mr-2" size={16} />
            <span className="text-sm">{order.total_productos || 1} productos</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;