import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFilter, FiPieChart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import OrdersList from '../../components/admin/orders/OrdersList';
import OrdersFilter from '../../components/admin/orders/OrdersFilter';

// Función auxiliar para formatear fecha
const formatDateForInput = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  let month = '' + (d.getUTCMonth() + 1);
  let day = '' + d.getUTCDate();
  const year = d.getUTCFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// Función auxiliar para formatear fecha para mostrar
const formatDateDisplay = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

export default function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date()));
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, dateFilter, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getAllOrders();
      if (response.success) {
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        setError(response.message || 'Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter + 'T00:00:00Z');
      result = result.filter(order => {
        const orderDate = new Date(order.fecha);
        return orderDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0];
      });
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.estado === statusFilter);
    }
    
    setFilteredOrders(result);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      solicitado: 'bg-purple-100 text-purple-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    const statusLabels = {
      solicitado: 'Solicitado',
      pendiente: 'Pendiente',
      en_proceso: 'En proceso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return statusLabels[status] || status;
  };

  // Actualizar la navegación al consolidado
  const handleNavigateToConsolidated = () => {
    const formattedDate = dateFilter;
    navigate(`/admin/production/consolidated`, { 
      state: { selectedDate: formattedDate } 
    });
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
      <div className="bg-white rounded-lg shadow-md mb-4">
        <div className="p-3 sm:p-4 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <FiShoppingCart className="mr-2" />
            Pedidos
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNavigateToConsolidated}
              className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors"
              title="Consolidado de producción"
            >
              <FiPieChart className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Filtrar"
            >
              <FiFilter />
            </button>
          </div>
        </div>
        
        <OrdersFilter 
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showFilters={showFilters}
        />
        
        <OrdersList 
          orders={filteredOrders}
          isLoading={isLoading}
          error={error}
          formatDate={formatDateDisplay}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
        />
      </div>
    </div>
  );
}