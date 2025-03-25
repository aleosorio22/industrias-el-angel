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

const presentationProductService = {
  getProductPresentations: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product-presentations/product/${productId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createPresentation: async (presentationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-presentations`,
        presentationData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updatePresentation: async (id, presentationData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/product-presentations/${id}`,
        presentationData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deletePresentation: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/product-presentations/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default presentationProductService;