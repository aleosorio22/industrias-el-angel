import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiAlertCircle, FiRefreshCw, FiCalendar, FiMapPin, FiFileText, FiTruck, FiCheck, FiSave } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import DeliveryService from "../../services/DeliveryService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrderStatusBadge from "../../components/user/orders/OrderStatusBadge";
import ProductDeliveryItem from "../../components/delivery/ProductDeliveryItem";
import DeliverySummary from "../../components/delivery/DeliverySummary";
import { formatDate } from '../../utils/dateUtils';

export default function DeliveryOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [savingDelivery, setSavingDelivery] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener detalles del pedido
      const orderResponse = await OrderService.getOrderById(id);
      
      if (!orderResponse.success) {
        setError("No se pudo cargar el detalle del pedido");
        return;
      }
      
      setOrder(orderResponse.data);
      
      // Obtener entregas existentes
      const deliveriesResponse = await DeliveryService.getDeliveriesByOrderId(id);
      
      if (deliveriesResponse.success) {
        setDeliveries(deliveriesResponse.data);
      }
    } catch (err) {
      console.error("Error al cargar detalle del pedido:", err);
      setError(err.message || "Error al cargar el detalle del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDelivery = async (productDelivery) => {
    try {
      setSavingDelivery(true);
      setError(null);
      
      // Buscar el detalle del producto considerando TANTO producto_id COMO presentacion_id
      const productDetail = order.detalles.find(
        detail => detail.producto_id === productDelivery.producto_id && 
                detail.presentacion_id === productDelivery.presentacion_id
      );
      
      if (!productDetail) {
        throw new Error('No se encontró el detalle del producto con la presentación especificada');
      }
      
      const deliveryData = {
        pedido_id: id,
        producto_id: productDelivery.producto_id,
        presentacion_id: productDelivery.presentacion_id, // Usar el que viene del componente
        cantidad_entregada: productDelivery.cantidad_entregada,
        comentario: productDelivery.comentario
      };
      
      const response = await DeliveryService.registerDelivery(deliveryData);
      
      if (response.success) {
        // Actualizar la lista de entregas
        const updatedDeliveries = [...deliveries];
        const existingIndex = updatedDeliveries.findIndex(
          d => d.producto_id === productDelivery.producto_id && 
               d.presentacion_id === productDelivery.presentacion_id
        );
        
        if (existingIndex >= 0) {
          updatedDeliveries[existingIndex] = {
            ...updatedDeliveries[existingIndex],
            cantidad_entregada: productDelivery.cantidad_entregada,
            comentario: productDelivery.comentario
          };
        } else {
          updatedDeliveries.push({
            pedido_id: Number(id),
            producto_id: productDelivery.producto_id,
            presentacion_id: productDelivery.presentacion_id,
            cantidad_entregada: productDelivery.cantidad_entregada,
            comentario: productDelivery.comentario,
            fecha_entrega: new Date().toISOString()
          });
        }
        
        setDeliveries(updatedDeliveries);
        setActionSuccess("Entrega actualizada correctamente");
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      } else {
        setError(response.message || "Error al actualizar la entrega");
      }
    } catch (err) {
      console.error("Error al actualizar entrega:", err);
      setError(err.message || "Error al actualizar la entrega");
    } finally {
      setSavingDelivery(false);
    }
  };

  const handleMarkAsReady = async () => {
    try {
      setActionLoading(true);
      setActionSuccess(null);
      
      const response = await DeliveryService.markOrderAsReady(id);
      
      if (response.success) {
        setActionSuccess("Pedido marcado como 'Listo para entregar' exitosamente");
        // Actualizar el estado del pedido en la interfaz
        setOrder(prev => ({...prev, estado: 'listo para entregar a ruta'}));
      } else {
        setError(response.message || "Error al actualizar el estado del pedido");
      }
    } catch (err) {
      console.error("Error al marcar pedido como listo:", err);
      setError(err.message || "Error al actualizar el estado del pedido");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsInRoute = async () => {
    try {
      setActionLoading(true);
      setActionSuccess(null);
      
      const response = await DeliveryService.markOrderAsInRoute(id);
      
      if (response.success) {
        setActionSuccess("Pedido marcado como 'En Ruta' exitosamente");
        // Actualizar el estado del pedido en la interfaz
        setOrder(prev => ({...prev, estado: 'en ruta'}));
      } else {
        setError(response.message || "Error al actualizar el estado del pedido");
      }
    } catch (err) {
      console.error("Error al marcar pedido como en ruta:", err);
      setError(err.message || "Error al actualizar el estado del pedido");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      setActionLoading(true);
      setActionSuccess(null);
      
      const response = await DeliveryService.markOrderAsDelivered(id);
      
      if (response.success) {
        setActionSuccess("Pedido marcado como 'Entregado' exitosamente");
        // Actualizar el estado del pedido en la interfaz
        setOrder(prev => ({...prev, estado: 'entregado'}));
      } else {
        setError(response.message || "Error al actualizar el estado del pedido");
      }
    } catch (err) {
      console.error("Error al marcar pedido como entregado:", err);
      setError(err.message || "Error al actualizar el estado del pedido");
    } finally {
      setActionLoading(false);
    }
  };

  // Verificar si todos los productos tienen al menos una entrega registrada
  const allProductsHaveDelivery = order?.detalles?.every(product => 
    deliveries.some(d => d.producto_id === product.producto_id)
  ) || false;

  // Determinar qué botones de acción mostrar según el estado actual
  const showReadyButton = order?.estado === 'solicitado' || order?.estado === 'en_proceso';
  const showInRouteButton = order?.estado === 'listo para entregar a ruta';
  const showDeliveredButton = order?.estado === 'en ruta';
  
  // Verificar si las acciones están deshabilitadas
  const actionsDisabled = actionLoading || savingDelivery;
  const editingDisabled = order?.estado === 'entregado' || savingDelivery;

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
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
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
            {actionSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                {actionSuccess}
              </div>
            )}
            
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
            
            {/* Resumen de entrega */}
            {order.detalles && order.detalles.length > 0 && (
              <DeliverySummary 
                orderDetails={order} 
                deliveryData={deliveries} 
              />
            )}
            
            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold">Productos</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {order.detalles && order.detalles.length > 0 ? (
                  order.detalles.map((product) => {
                    // Buscar la entrega especifica para este producto y presentacion

                    const productDelivery = deliveries.find(
                      d => d.producto_id === product.producto_id && 
                           d.presentacion_id === product.presentacion_id
                    );
                    
                    return (
                      <ProductDeliveryItem
                        key={`${product.producto_id}-${product.presentacion_id}`} // Clave única que incluye presentación
                        product={product}
                        deliveryData={productDelivery}
                        onUpdateDelivery={handleUpdateDelivery}
                        disabled={actionLoading || ['entregado'].includes(order.estado)}
                      />
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No hay productos en este pedido
                  </div>
                )}
              </div>
            </div>
            
            {/* Acciones de entrega */}
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold">Acciones de entrega</h2>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {showReadyButton && (
                    <button
                      onClick={handleMarkAsReady}
                      disabled={actionsDisabled || !allProductsHaveDelivery}
                      className={`px-4 py-2 rounded-md flex items-center justify-center ${
                        actionsDisabled || !allProductsHaveDelivery
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      title={!allProductsHaveDelivery ? "Registre la entrega de todos los productos primero" : ""}
                    >
                      <FiSave className="mr-2" />
                      Marcar como Listo para Entregar
                    </button>
                  )}
                  
                  {showInRouteButton && (
                    <button
                      onClick={handleMarkAsInRoute}
                      disabled={actionsDisabled}
                      className={`px-4 py-2 rounded-md flex items-center justify-center ${
                        actionsDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <FiTruck className="mr-2" />
                      Marcar como En Ruta
                    </button>
                  )}
                  
                  {showDeliveredButton && (
                    <button
                      onClick={handleMarkAsDelivered}
                      disabled={actionsDisabled}
                      className={`px-4 py-2 rounded-md flex items-center justify-center ${
                        actionsDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <FiCheck className="mr-2" />
                      Marcar como Entregado
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Botón para volver a la lista de pedidos */}
            <div className="mt-6 flex justify-center">
              <Link
                to="/delivery/orders"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Volver a pedidos
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
              to="/delivery/orders"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Volver a pedidos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}