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

const unitService = {
  getAllUnits: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/units`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getUnitById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/units/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createUnit: async (unitData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/units`,
        unitData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateUnit: async (id, unitData) => {
    try {
      const { nombre, simbolo, descripcion } = unitData;
      const response = await axios.put(
        `${API_BASE_URL}/units/${id}`,
        { nombre, simbolo, descripcion },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteUnit: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/units/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreUnit: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/units/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default unitService;