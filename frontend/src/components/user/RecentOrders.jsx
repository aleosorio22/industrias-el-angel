import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';
import OrderCard from './orders/OrderCard';

const RecentOrders = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pedidos recientes</h2>
          <Link to="/user/orders" className="text-green-500 text-sm">Ver todos</Link>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FiBarChart2 className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">
            No hay pedidos recientes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pedidos recientes</h2>
        <Link to="/user/orders" className="text-green-500 text-sm">Ver todos</Link>
      </div>
      
      <div className="space-y-3">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;