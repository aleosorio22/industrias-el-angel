import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser, FiMapPin, FiPackage, FiClipboard, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import DeliveryService from "../../services/DeliveryService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { formatDate } from "../../utils/dateUtils";

export default function DeliveredOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderAndDeliveryDetails();
  }, [id]);

  const fetchOrderAndDeliveryDetails = async () => {
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
      } else {
        console.error("Error al cargar entregas:", deliveriesResponse.message);
      }
    } catch (err) {
      console.error("Error al cargar detalle del pedido:", err);
      setError(err.message || "Error al cargar el detalle del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener color de badge según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'en ruta':
        return 'bg-blue-100 text-blue-800';
      case 'listo para entregar a ruta':
        return 'bg-purple-100 text-purple-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatear estado para mostrar
  const formatStatus = (status) => {
    switch (status) {
      case 'entregado':
        return 'Entregado';
      case 'en ruta':
        return 'En ruta';
      case 'listo para entregar a ruta':
        return 'Listo para entregar';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount || 0);
  };

  // Calcular el total de lo pedido
  const calculateOrderTotal = () => {
    if (!order || !order.detalles) return 0;
    
    return order.detalles.reduce((total, item) => {
      return total + (parseInt(item.cantidad) * parseFloat(item.precio_unitario || 0));
    }, 0);
  };

  // Calcular el total de lo entregado
  const calculateDeliveredTotal = () => {
    if (!order || !order.detalles || !deliveries.length) return 0;
    
    return order.detalles.reduce((total, item) => {
      const delivery = deliveries.find(d => 
        d.producto_id === item.producto_id && 
        d.presentacion_id === item.presentacion_id
      );
      
      const deliveredQuantity = delivery ? parseInt(delivery.cantidad_entregada) : 0;
      return total + (deliveredQuantity * parseFloat(item.precio_unitario || 0));
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No se encontró el pedido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-gray-200">
          <Link to="/admin/accounts-receivable" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <FiArrowLeft className="mr-2" />
            Volver a cuentas por cobrar
          </Link>
          
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold">Detalle de Entrega - Pedido #{order.id}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.estado)}`}>
              {formatStatus(order.estado)}
            </span>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium mb-4">Información del pedido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>Fecha: {formatDate(order.fecha)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FiUser className="mr-2" />
                <span>Cliente: {order.cliente_nombre || 'No especificado'}</span>
              </div>
              
              {order.sucursal_nombre && (
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>Sucursal: {order.sucursal_nombre}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-2" />
                <span>Total Pedido: {formatCurrency(calculateOrderTotal())}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-2" />
                <span>Total Entregado: {formatCurrency(calculateDeliveredTotal())}</span>
              </div>
              
              {order.observaciones && (
                <div className="flex items-start text-gray-600">
                  <FiClipboard className="mr-2 mt-1" />
                  <span>Observaciones: {order.observaciones}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Productos y Entregas</h2>
          
          {order.detalles && order.detalles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unitario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Pedida
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Entregada
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal Pedido
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal Entregado
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.detalles.map((item, index) => {
                    const delivery = deliveries.find(d => 
                      d.producto_id === item.producto_id && 
                      d.presentacion_id === item.presentacion_id
                    );
                    
                    const deliveredQuantity = delivery ? delivery.cantidad_entregada : 0;
                    // Comparar como números enteros
                    const isDifferent = parseInt(item.cantidad) !== parseInt(deliveredQuantity);
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.producto_nombre}
                              </div>
                              {item.presentacion_nombre && (
                                <div className="text-sm text-gray-500">
                                  {item.presentacion_nombre}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.precio_unitario)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {parseInt(item.cantidad)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm ${isDifferent ? "font-medium text-orange-600" : "text-gray-500"}`}>
                              {parseInt(deliveredQuantity)}
                            </span>
                            {isDifferent && (
                              <FiAlertCircle className="ml-2 text-orange-500" title="Cantidad diferente a la pedida" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(parseInt(item.cantidad) * parseFloat(item.precio_unitario || 0))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${isDifferent ? "font-medium text-orange-600" : "text-gray-500"}`}>
                            {formatCurrency(parseInt(deliveredQuantity) * parseFloat(item.precio_unitario || 0))}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(calculateOrderTotal())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(calculateDeliveredTotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay productos en este pedido
            </div>
          )}
          
          {deliveries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Observaciones de entrega</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                {deliveries.map((delivery, index) => {
                  if (!delivery.comentario) return null;
                  
                  const item = order.detalles.find(d => 
                    d.producto_id === delivery.producto_id && 
                    d.presentacion_id === delivery.presentacion_id
                  );
                  
                  return (
                    <div key={index} className="mb-2 last:mb-0">
                      <p className="text-sm">
                        <span className="font-medium">{item?.producto_nombre || 'Producto'}: </span>
                        {delivery.comentario}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}