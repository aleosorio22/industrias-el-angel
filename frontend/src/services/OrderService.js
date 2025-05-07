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

const OrderService = {
  getMyOrders: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/mis-pedidos`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar los pedidos'
      };
    }
  },
  getAllOrders: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getOrdersByClientId: async (clientId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/cliente/${clientId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        orderData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear el pedido"
      };
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/orders/${id}/status`,
        { estado: status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getProductionConsolidated: async (date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/production-consolidated/${date}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error getting production consolidated:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener el consolidado de producción"
      };
    }
  },

  // Asegúrate de que el método updateProductionQuantity esté correctamente implementado
  updateProductionQuantity: async (date, data) => {
    try {
      console.log('Enviando datos al servidor:', data);
      console.log('URL:', `${API_BASE_URL}/orders/production-consolidated/${date}`);
      
      const response = await axios.patch(
        `${API_BASE_URL}/orders/production-consolidated/${date}`,
        data,
        getAuthHeaders()
      );
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating production quantity:', error);
      console.error('Detalles del error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar la cantidad'
      };
    }
  },
  // Registrar entrega de producto
  registerDelivery: async (deliveryData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/entregas`,
        deliveryData,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error registering delivery:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar la entrega'
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
        data: response.data
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
        data: response.data
      };
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar el pedido como entregado'
      };
    }
  },
  getOrdersByDate: async (date, status = 'all') => {
    try {
        console.log('Solicitando pedidos para fecha:', date, 'estado:', status);
        
        // Validar formato de fecha
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            console.error('Formato de fecha inválido:', date);
            return {
                success: false,
                message: 'Formato de fecha inválido. Use YYYY-MM-DD'
            };
        }
        
        const url = `${API_BASE_URL}/orders/by-date/${date}${status !== 'all' ? `?status=${status}` : ''}`;
        console.log('URL de solicitud:', url);
        
        const response = await axios.get(url, getAuthHeaders());
        
        console.log('Respuesta del servidor:', response.status, response.data);
        
        return {
            success: true,
            data: response.data.data || []
        };
    } catch (error) {
        console.error('Error completo al obtener pedidos por fecha:', error);
        
        // Mostrar detalles completos del error
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.status, error.response.data);
        }
        
        return {
            success: false,
            message: error.response?.data?.message || 'Error al cargar los pedidos por fecha'
        };
    }
  },
  
  getPendingPaymentOrders: async (clientId = null, page = 1, pageSize = 10) => {
    try {
      let url = `${API_BASE_URL}/orders/pendientes-pago`;
      
      // Agregar parámetros de consulta si existen
      const params = new URLSearchParams();
      if (clientId) params.append('clienteId', clientId);
      
      // Añadir parámetros a la URL si hay alguno
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Consultando URL:', url); // Para depuración
      
      const response = await axios.get(url, getAuthHeaders());
      
      if (!response.data || !response.data.data) {
        return {
          success: true,
          data: { orders: [], total: 0 }
        };
      }
      
      // Obtener todos los pedidos primero
      const allOrders = response.data.data;
      
      // Calcular paginación en el cliente
      const total = allOrders.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedOrders = allOrders.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          orders: paginatedOrders,
          total: total
        }
      };
    } catch (error) {
      console.error('Error al obtener pedidos pendientes de pago:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar los pedidos pendientes de pago'
      };
    }
  },
  
};

export default OrderService;
