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

const clientService = {
  getAllClients: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/clients?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/clients/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getMyClientData: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/clients/mis-datos/perfil`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/clients`,
        clientData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/clients/${id}`,
        clientData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/clients/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreClient: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/clients/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default clientService;