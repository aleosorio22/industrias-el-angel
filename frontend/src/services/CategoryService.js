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

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        categoryData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      // Solo enviamos nombre y descripción al backend
      const { nombre, descripcion } = categoryData;
      const response = await axios.put(
        `${API_BASE_URL}/categories/${id}`,
        { nombre, descripcion },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/categories/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreCategory: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/categories/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default categoryService

