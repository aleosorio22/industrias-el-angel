import React, { useState, useEffect } from 'react';
import { FiPieChart, FiArrowDownCircle, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import OrdersList from '../../components/admin/orders/OrdersList';
import { toast } from 'react-hot-toast';

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

export default function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date()));
  const [statusFilter, setStatusFilter] = useState('all');

  // Modificamos para que se ejecute cuando cambie la fecha o el estado
  useEffect(() => {
    fetchOrdersByDate();
  }, [dateFilter, statusFilter]);

  // Reemplazamos fetchOrders por fetchOrdersByDate
  const fetchOrdersByDate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usamos el método getOrdersByDate del servicio
      const response = await OrderService.getOrdersByDate(dateFilter, statusFilter);
      
      if (response.success) {
        // Ya no necesitamos filtrar aquí, el backend lo hace por nosotros
        setOrders(response.data);
      } else {
        setError(response.message || 'Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError(err.message || 'Error al cargar los pedidos');
      toast.error('Error al cargar los pedidos: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      solicitado: 'bg-purple-100 text-purple-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      entregado: 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };
  
  // Manejador para el cambio de fecha
  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  // Función para navegar al consolidado pasando la fecha seleccionada
  const navigateToConsolidated = () => {
    navigate('/admin/production/consolidated', {
      state: { selectedDate: dateFilter }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">Gestión de Pedidos</h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-3 sm:space-y-0 sm:space-x-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="w-full sm:w-auto">
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                Fecha
              </label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={handleDateChange}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                Estado
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="solicitado">Solicitado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <button 
                onClick={alert.bind(null, 'Funcionalidad en desarrollo: Ticket 20/06/2025')}
                className="w-full sm:w-auto flex justify-center items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
              >
                <FiDownload className="mr-2" />
                Descargar Pedidos
              </button>
            </div>
          </div>
          <button
            onClick={navigateToConsolidated}
            className="w-full sm:w-auto flex justify-center items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            <FiPieChart className="mr-2" />
            Consolidado
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      ) : (
        <OrdersList 
          orders={orders} 
          isLoading={isLoading} 
          error={error}
          getStatusColor={getStatusColor}
          onViewDetails={(id) => navigate(`/admin/orders/${id}`)}
        />
      )}
    </div>
  );
}