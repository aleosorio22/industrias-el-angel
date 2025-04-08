import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiAlertCircle, FiRefreshCw, FiCalendar, FiMapPin, FiFileText } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrderStatusBadge from "../../components/user/orders/OrderStatusBadge";
import { formatDate } from '../../utils/dateUtils';  // Fixed import path

// Remove the local formatDate function since we're importing it
export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await OrderService.getOrderById(id);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError("No se pudo cargar el detalle del pedido");
      }
    } catch (err) {
      console.error("Error al cargar detalle del pedido:", err);
      setError(err.message || "Error al cargar el detalle del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-white p-4 flex items-center shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 text-gray-600"
          aria-label="Volver"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Detalle del Pedido</h1>
      </header>

      <main className="container mx-auto px-4 py-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchOrderDetails} 
              className="text-red-700 hover:bg-red-100 p-1 rounded-full"
              title="Reintentar"
            >
              <FiRefreshCw />
            </button>
          </div>
        ) : order ? (
          <>
            {/* Encabezado del pedido */}
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Pedido #{order.id}</h2>
                  <OrderStatusBadge status={order.estado} />
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FiCalendar className="mr-2" />
                  <span>{formatDate(order.fecha)}</span>
                </div>
              </div>
              
              {/* Información del pedido */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
                    <p className="text-gray-800">{order.cliente_nombre}</p>
                  </div>
                  
                  {order.sucursal_id && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Sucursal</h3>
                      <div className="flex items-center">
                        <FiMapPin className="text-gray-400 mr-1" />
                        <p className="text-gray-800">{order.sucursal_nombre}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.observaciones && (
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Observaciones</h3>
                      <div className="flex items-start">
                        <FiFileText className="text-gray-400 mr-1 mt-1" />
                        <p className="text-gray-800">{order.observaciones}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold">Productos</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {order.detalles && order.detalles.map((detalle) => (
                  <div key={detalle.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{detalle.producto_nombre}</h3>
                        <p className="text-sm text-gray-500">Código: {detalle.producto_codigo}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{detalle.cantidad}</span>
                        <p className="text-sm text-gray-500">{detalle.presentacion_nombre}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cantidad por presentación:</span>
                        <span className="font-medium">{detalle.cantidad_por_presentacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total unidades:</span>
                        <span className="font-medium">{detalle.cantidad * detalle.cantidad_por_presentacion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resumen del pedido */}
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total productos:</span>
                  <span className="font-medium">{order.detalles?.length || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Botón para volver a la lista de pedidos */}
            <div className="mt-6 flex justify-center">
              <Link
                to="/user/orders"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Volver a mis pedidos
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Pedido no encontrado</h3>
            <p className="text-gray-500 mb-6">
              El pedido que estás buscando no existe o no tienes acceso a él
            </p>
            <Link
              to="/user/orders"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Volver a mis pedidos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}