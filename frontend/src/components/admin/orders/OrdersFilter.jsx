import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const OrdersFilter = ({ dateFilter, setDateFilter, statusFilter, setStatusFilter, showFilters }) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiCalendar className="text-gray-400" />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      {showFilters && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por estado
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Todos los estados</option>
            <option value="solicitado">Solicitado</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default OrdersFilter;