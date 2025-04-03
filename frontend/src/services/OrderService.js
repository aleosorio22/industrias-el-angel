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
  }
};

export default OrderService;