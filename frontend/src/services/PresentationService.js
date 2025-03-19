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

const presentationService = {
  getAllPresentations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presentations`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getPresentationById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presentations/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createPresentation: async (presentationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/presentations`,
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
      const { nombre, descripcion } = presentationData;
      const response = await axios.put(
        `${API_BASE_URL}/presentations/${id}`,
        { nombre, descripcion },
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
        `${API_BASE_URL}/presentations/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restorePresentation: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/presentations/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default presentationService;