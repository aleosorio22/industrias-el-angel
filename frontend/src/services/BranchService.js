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

const branchService = {
  getAllBranches: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getBranchById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getBranchesByClientId: async (clientId, includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/cliente/${clientId}?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getMyBranches: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/mis-sucursales/perfil`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createBranch: async (branchData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/branches`,
        branchData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateBranch: async (id, branchData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/branches/${id}`,
        branchData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteBranch: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/branches/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreBranch: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/branches/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default branchService;