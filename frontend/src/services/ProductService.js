import axios from 'axios';

const API_BASE_URL = 'http://localhost:3500/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const productService = {
  getAllProducts: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener productos"
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        productData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${id}`,
        productData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/products/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreProduct: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/products/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default productService;
