import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFilter } from 'react-icons/fi';
import OrderService from '../../services/OrderService';
import OrdersList from '../../components/admin/orders/OrdersList';
import OrdersFilter from '../../components/admin/orders/OrdersFilter';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date())); // Fecha actual por defecto
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, dateFilter, statusFilter]);

  // Función para formatear fecha para el input type="date"
  function formatDateForInput(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

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
      // Extraer componentes de la fecha del filtro
      const [filterYear, filterMonth, filterDay] = dateFilter.split('-').map(Number);
      
      result = result.filter(order => {
        // Extraer la fecha del pedido y convertirla a fecha local
        const orderDate = new Date(order.fecha);
        
        // Obtener componentes de la fecha del pedido en hora local
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1; // getMonth() devuelve 0-11
        const orderDay = orderDate.getDate();
        
        // Comparar componentes de fecha directamente
        return orderYear === filterYear && 
               orderMonth === filterMonth && 
               orderDay === filterDay;
      });
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(order => order.estado === statusFilter);
    }
    
    setFilteredOrders(result);
  };

  // Formatear fecha para mostrar
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
      <div className="bg-white rounded-lg shadow-md mb-4">
        <div className="p-3 sm:p-4 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <FiShoppingCart className="mr-2" />
            Pedidos
          </h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Filtrar"
          >
            <FiFilter />
          </button>
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
    </div>
  );
}