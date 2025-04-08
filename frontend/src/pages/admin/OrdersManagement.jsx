import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFilter, FiPieChart } from 'react-icons/fi';
import OrderService from '../../services/OrderService';
import OrdersList from '../../components/admin/orders/OrdersList';
import OrdersFilter from '../../components/admin/orders/OrdersFilter';
import ProductionConsolidated from '../../components/admin/orders/ProductionConsolidated';
import { formatDate } from '../../utils/dateUtils';  // Agregar esta importación

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date())); // Fecha actual por defecto
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [consolidatedData, setConsolidatedData] = useState(null);
  const [isLoadingConsolidated, setIsLoadingConsolidated] = useState(false);
  const [consolidatedError, setConsolidatedError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, dateFilter, statusFilter]);

  // Función para formatear fecha para el input type="date"
  function formatDateForInput(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);  // Asegurarnos de usar UTC
    let month = '' + (d.getUTCMonth() + 1);
    let day = '' + d.getUTCDate();
    const year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getAllOrders();
      if (response.success) {
        // Ordenar pedidos por fecha (más recientes primero)
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
    
    // Filtrar por fecha
    if (dateFilter) {
      const filterDate = new Date(dateFilter + 'T00:00:00Z');
      
      result = result.filter(order => {
        const orderDate = new Date(order.fecha);
        return orderDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0];
      });
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(order => order.estado === statusFilter);
    }
    
    setFilteredOrders(result);
  };

  // Eliminar la función formatDate local ya que usaremos la importada
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color de badge según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'solicitado':
        return 'bg-purple-100 text-purple-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatear estado para mostrar
  const formatStatus = (status) => {
    switch (status) {
      case 'solicitado':
        return 'Solicitado';
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En proceso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleGetConsolidated = async () => {
    try {
      setIsLoadingConsolidated(true);
      setConsolidatedError(null);
      const response = await OrderService.getProductionConsolidated(dateFilter);
      if (response.success) {
        setConsolidatedData(response.data);
        setShowConsolidated(true);
      } else {
        setConsolidatedError(response.message);
      }
    } catch (err) {
      setConsolidatedError(err.message || 'Error al obtener el consolidado');
    } finally {
      setIsLoadingConsolidated(false);
    }
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
              onClick={handleGetConsolidated}
              className="p-2 rounded-full hover:bg-green-50 text-green-600"
              aria-label="Consolidado de producción"
            >
              <FiPieChart />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Filtrar"
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
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
        />
      </div>

      {showConsolidated && (
        <ProductionConsolidated
          data={consolidatedData}
          onClose={() => setShowConsolidated(false)}
          isLoading={isLoadingConsolidated}
          error={consolidatedError}
        />
      )}
    </div>
  );
}