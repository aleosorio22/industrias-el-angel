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

const conversionService = {
  getProductConversions: async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/conversions/product/${productId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createConversion: async (conversionData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/conversions`,
        conversionData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateConversion: async (id, conversionData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/conversions/${id}`,
        conversionData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteConversion: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/conversions/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default conversionService;