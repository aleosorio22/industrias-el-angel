import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiFilter, FiRefreshCw, FiAlertCircle, FiUser, FiMapPin, FiPackage, FiChevronRight } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import OrderStatusBadge from "../../components/user/orders/OrderStatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/dateUtils";

export default function DeliveryOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedDate, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OrderService.getOrdersByDate(selectedDate, statusFilter);
      
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || "Error al cargar los pedidos");
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/delivery/orders/${orderId}`);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'solicitado':
        return 'bg-blue-100 text-blue-800';
      case 'en_proceso':
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'listo para entregar a ruta':
        return 'bg-purple-100 text-purple-800';
      case 'en ruta':
        return 'bg-indigo-100 text-indigo-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Pedidos para entrega</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiCalendar className="inline mr-1" />
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline mr-1" />
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="solicitado">Solicitado</option>
              <option value="en_proceso">En proceso</option>
              <option value="listo para entregar a ruta">Listo para entregar</option>
              <option value="en ruta">En ruta</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchOrders}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" />
              Actualizar
            </button>
          </div>
        </div>
      </div>
      
      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Lista de pedidos en formato de tarjetas */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-100">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="block p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewOrderDetails(order.id)}
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
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No hay pedidos para la fecha y estado seleccionados</p>
        </div>
      )}
    </div>
  );
}