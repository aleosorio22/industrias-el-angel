import { useState, useEffect } from "react";
import { FiPackage, FiFilter } from "react-icons/fi";
import { toast } from "react-hot-toast";
import OrderService from "../../services/OrderService";
import OrderCard from "./OrderCard";

export default function ClientOrderHistory({ clientId, onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [clientId]);

  useEffect(() => {
    filterOrders();
  }, [orders, dateRange]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await OrderService.getOrdersByClientId(clientId);
      
      // Verificar la estructura de los datos
      const ordersArray = Array.isArray(data) ? data : data.data || [];
      
      setOrders(ordersArray);
      filterOrders(ordersArray);
    } catch (error) {
      console.error('Error completo:', error); // Agregar este log
      setError(error.message || 'Error al cargar los pedidos');
      toast.error('Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = (ordersToFilter = orders) => {
    let filtered = [...ordersToFilter];

    if (!dateRange.startDate && !dateRange.endDate) {
      // Filtro por defecto: última semana hasta 3 días después
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const threeDaysAhead = new Date();
      threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.fecha_pedido || order.fecha);
        return orderDate >= oneWeekAgo && orderDate <= threeDaysAhead;
      });
    } else {
      // Filtro por rango de fechas seleccionado
      if (dateRange.startDate) {
        const startDate = new Date(dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.fecha_pedido || order.fecha);
          return orderDate >= startDate;
        });
      }
      if (dateRange.endDate) {
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.fecha_pedido || order.fecha);
          return orderDate <= endDate;
        });
      }
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'en_proceso': 'bg-blue-100 text-blue-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-l-primary rounded-full mx-auto"></div>
          <p className="mt-2 text-text-light">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text">Historial de Pedidos</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <FiFilter size={18} />
          <span>Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicial
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha final
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <FiPackage className="mx-auto h-12 w-12 text-text-light/50" />
          <p className="mt-2 text-text-light">No hay pedidos en el rango de fechas seleccionado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}