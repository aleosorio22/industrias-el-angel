import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiAlertCircle, FiRefreshCw, FiCalendar, FiMapPin, FiFileText, FiCheck, FiX } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import DeliveryService from "../../services/DeliveryService"; // Añadimos el servicio de entregas
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrderStatusBadge from "../../components/user/orders/OrderStatusBadge";
import { formatDate } from '../../utils/dateUtils';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]); // Estado para almacenar las entregas
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener detalles del pedido
      const response = await OrderService.getOrderById(id);

      if (response.success) {
        setOrder(response.data);
        
        // Obtener entregas existentes
        const deliveriesResponse = await DeliveryService.getDeliveriesByOrderId(id);
        
        if (deliveriesResponse.success) {
          setDeliveries(deliveriesResponse.data);
        }
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

  // Función para formatear números sin decimales innecesarios
  const formatQuantity = (quantity) => {
    return Number.isInteger(Number(quantity)) ? 
      parseInt(quantity).toString() : 
      Number(quantity).toFixed(2);
  };
  
  // Función para obtener el estado de entrega de un producto
  const getDeliveryStatus = (detalle) => {
    const delivery = deliveries.find(
      d => d.producto_id === detalle.producto_id && 
           d.presentacion_id === detalle.presentacion_id
    );
    
    const deliveredQuantity = delivery?.cantidad_entregada || 0;
    
    if (deliveredQuantity >= detalle.cantidad) {
      return { status: 'complete', label: 'Completo', className: 'bg-green-100 text-green-800' };
    } else if (deliveredQuantity > 0) {
      return { status: 'partial', label: 'Parcial', className: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'pending', label: 'Pendiente', className: 'bg-gray-100 text-gray-800' };
    }
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
              
              {/*En la sección de renderizado de productos:*/}
              <div className="divide-y divide-gray-100">
                {order.detalles && order.detalles.map((detalle) => {
                  const deliveryStatus = getDeliveryStatus(detalle);
                  const delivery = deliveries.find(
                    d => d.producto_id === detalle.producto_id && 
                         d.presentacion_id === detalle.presentacion_id
                  );
                  const deliveredQuantity = delivery?.cantidad_entregada || 0;
                  const isOrderDelivered = order.estado === 'entregado';
                  
                  return (
                    <div key={`${detalle.producto_id}-${detalle.presentacion_id}`} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{detalle.producto_nombre}</h3>
                          <p className="text-sm text-gray-500">Código: {detalle.producto_codigo}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${deliveryStatus.className}`}>
                            {deliveryStatus.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <span className="text-sm text-gray-600 mb-1 sm:mb-0">Cantidad solicitada:</span>
                          <span className="text-sm font-medium">{formatQuantity(detalle.cantidad)} {detalle.presentacion_nombre}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                          <span className="text-sm text-gray-600 mb-1 sm:mb-0">
                            {isOrderDelivered ? 'Cantidad entregada:' : 'Cantidad a entregar:'}
                          </span>
                          <span className="text-sm font-medium">
                            {formatQuantity(deliveredQuantity)} {detalle.presentacion_nombre}
                          </span>
                        </div>
                        
                        {deliveryStatus.status === 'partial' && (
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-1">
                            <span className="text-sm text-gray-600 mb-1 sm:mb-0">Diferencia:</span>
                            <span className="text-sm font-medium text-yellow-600">
                              {formatQuantity(detalle.cantidad - deliveredQuantity)} {detalle.presentacion_nombre}
                            </span>
                          </div>
                        )}
                        
                        {delivery?.comentario && (
                          <div className="mt-2 text-sm text-gray-600 italic border-t border-gray-200 pt-2">
                            "{delivery.comentario}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Resumen del pedido */}
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total productos:</span>
                  <span className="font-medium">{order.detalles?.length || 0}</span>
                </div>
                
                {/* Resumen de entregas */}
                {deliveries.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-green-50 p-2 rounded-md">
                      <FiCheck className="mx-auto text-green-500 mb-1" />
                      <div className="text-xl sm:text-sm font-semibold text-green-700">
                        {order.detalles?.filter(d => {
                          const delivery = deliveries.find(
                            del => del.producto_id === d.producto_id && 
                                  del.presentacion_id === d.presentacion_id
                          );
                          return delivery?.cantidad_entregada >= d.cantidad;
                        }).length || 0}
                      </div>
                      <div className="text-xs text-green-600">Completos</div>
                    </div>
                    
                    <div className="bg-yellow-50 p-2 rounded-md">
                      <FiAlertCircle className="mx-auto text-yellow-500 mb-1" />
                      <div className="text-xl sm:text-sm font-semibold text-yellow-700">
                        {order.detalles?.filter(d => {
                          const delivery = deliveries.find(
                            del => del.producto_id === d.producto_id && 
                                  del.presentacion_id === d.presentacion_id
                          );
                          const qty = delivery?.cantidad_entregada || 0;
                          return qty > 0 && qty < d.cantidad;
                        }).length || 0}
                      </div>
                      <div className="text-xs text-yellow-600">Parciales</div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                      <FiPackage className="mx-auto text-gray-500 mb-1" />
                      <div className="text-xl sm:text-sm font-semibold text-gray-700">
                        {order.detalles?.filter(d => {
                          const delivery = deliveries.find(
                            del => del.producto_id === d.producto_id && 
                                  del.presentacion_id === d.presentacion_id
                          );
                          return !delivery || delivery.cantidad_entregada === 0;
                        }).length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Pendientes</div>
                    </div>
                  </div>
                )}
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