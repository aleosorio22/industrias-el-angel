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

const templateService = {
  getTemplates: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plantillas`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      throw error.response ? error.response.data : error;
    }
  },

  getTemplateById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plantillas/${id}`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener plantilla ${id}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  createTemplate: async (templateData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/plantillas`,
        templateData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      throw error.response ? error.response.data : error;
    }
  },

  updateTemplate: async (id, templateData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/plantillas/${id}`,
        templateData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar plantilla ${id}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  deleteTemplate: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/plantillas/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar plantilla ${id}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  useTemplate: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/plantillas/${id}/usar`,
        {},
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error al usar plantilla ${id}:`, error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default templateService;