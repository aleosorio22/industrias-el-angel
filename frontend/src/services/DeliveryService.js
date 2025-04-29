import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const DeliveryService = {
  // Registrar o actualizar productos entregados parcialmente
  registerDelivery: async (deliveryData) => {
    try {
      // Asegurarse de que presentacion_id esté incluido en los datos
      if (!deliveryData.presentacion_id) {
        throw new Error('Se requiere el ID de presentación para registrar la entrega');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/entregas`,
        deliveryData,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error registering delivery:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al registrar la entrega'
      };
    }
  },

  // Obtener las entregas de un pedido específico
  getDeliveriesByOrderId: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/entregas/pedido/${orderId}`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener las entregas del pedido',
        data: [] // Return empty array to prevent undefined errors
      };
    }
  },

  // Obtener pedidos con sus entregas
  getOrdersWithDeliveries: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/entregas/mis-pedidos-con-entregas`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching orders with deliveries:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener los pedidos con entregas',
        data: [] // Return empty array to prevent undefined errors
      };
    }
  },

  // Cambiar estado del pedido a "listo para entregar a ruta"
  markOrderAsReady: async (orderId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/entregas/listo/${orderId}`,
        {},
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error marking order as ready:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar el pedido como listo para entregar'
      };
    }
  },

  // Cambiar estado del pedido a "en ruta"
  markOrderAsInRoute: async (orderId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/entregas/enruta/${orderId}`,
        {},
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error marking order as in route:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar el pedido como en ruta'
      };
    }
  },

  // Cambiar estado del pedido a "entregado"
  markOrderAsDelivered: async (orderId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/entregas/entregado/${orderId}`,
        {},
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar el pedido como entregado'
      };
    }
  },

  // Registrar múltiples entregas de productos en un solo pedido
  registerBulkDeliveries: async (orderId, deliveries) => {
    try {
      // Crear un array de promesas para cada entrega
      const deliveryPromises = deliveries.map(delivery => 
        DeliveryService.registerDelivery({
          pedido_id: orderId,
          producto_id: delivery.producto_id,
          cantidad_entregada: delivery.cantidad_entregada,
          comentario: delivery.comentario
        })
      );
      
      // Ejecutar todas las promesas en paralelo
      const results = await Promise.all(deliveryPromises);
      
      // Verificar si todas las entregas fueron exitosas
      const allSuccessful = results.every(result => result.success);
      
      return {
        success: allSuccessful,
        data: results,
        message: allSuccessful 
          ? 'Todas las entregas fueron registradas exitosamente' 
          : 'Algunas entregas no pudieron ser registradas'
      };
    } catch (error) {
      console.error('Error registering bulk deliveries:', error);
      return {
        success: false,
        message: 'Error al registrar las entregas en lote'
      };
    }
  },

  // Comparar pedido original con entregas para mostrar diferencias
  compareOrderWithDeliveries: async (orderId) => {
    try {
      // Obtener detalles del pedido
      const orderResponse = await axios.get(
        `${API_BASE_URL}/orders/${orderId}`,
        getAuthHeaders()
      );
      
      // Obtener entregas del pedido
      const deliveriesResponse = await axios.get(
        `${API_BASE_URL}/entregas/pedido/${orderId}`,
        getAuthHeaders()
      );
      
      if (!orderResponse.data.success || !deliveriesResponse.data.success) {
        throw new Error('Error al obtener datos para comparación');
      }
      
      const orderDetails = orderResponse.data.data;
      const deliveries = deliveriesResponse.data.data;
      
      // Crear un mapa de productos pedidos por producto_id
      const orderedProducts = {};
      orderDetails.detalles.forEach(detail => {
        orderedProducts[detail.producto_id] = {
          producto_id: detail.producto_id,
          nombre: detail.producto_nombre,
          cantidad_pedida: detail.cantidad,
          presentacion: detail.presentacion_nombre,
          precio_unitario: detail.precio_unitario
        };
      });
      
      // Crear un mapa de productos entregados por producto_id
      const deliveredProducts = {};
      deliveries.forEach(delivery => {
        deliveredProducts[delivery.producto_id] = {
          producto_id: delivery.producto_id,
          nombre: delivery.producto_nombre,
          cantidad_entregada: delivery.cantidad_entregada,
          fecha_entrega: delivery.fecha_entrega,
          comentario: delivery.comentario
        };
      });
      
      // Combinar los datos para mostrar diferencias
      const comparisonResults = Object.keys(orderedProducts).map(productoId => {
        const ordered = orderedProducts[productoId];
        const delivered = deliveredProducts[productoId] || null;
        
        return {
          ...ordered,
          cantidad_entregada: delivered ? delivered.cantidad_entregada : 0,
          fecha_entrega: delivered ? delivered.fecha_entrega : null,
          comentario: delivered ? delivered.comentario : null,
          diferencia: delivered 
            ? ordered.cantidad_pedida - delivered.cantidad_entregada 
            : ordered.cantidad_pedida,
          estado_entrega: delivered 
            ? (delivered.cantidad_entregada >= ordered.cantidad_pedida ? 'completo' : 'parcial') 
            : 'pendiente'
        };
      });
      
      return {
        success: true,
        data: {
          pedido: orderDetails,
          comparacion: comparisonResults
        }
      };
    } catch (error) {
      console.error('Error comparing order with deliveries:', error);
      return {
        success: false,
        message: error.message || 'Error al comparar el pedido con las entregas',
        data: { pedido: null, comparacion: [] } // Return empty data to prevent undefined errors
      };
    }
  }
};

export default DeliveryService;